import { NextRequest, NextResponse } from "next/server";

async function fetchNonce(wpUrl: string, cartToken: string): Promise<string> {
  const headers: Record<string, string> = {};
  if (cartToken) headers["Cart-Token"] = cartToken;

  console.log("fetchNonce: fetching cart to get nonce, cartToken:", cartToken);

  const res = await fetch(`${wpUrl}/wp-json/wc/store/v1/cart`, { headers });

  console.log("fetchNonce: cart status:", res.status);
  console.log("fetchNonce: all response headers:", Object.fromEntries(res.headers.entries()));

  const nonce = res.headers.get("X-WC-Store-API-Nonce") || res.headers.get("Nonce") || "";
  console.log("fetchNonce: nonce found:", nonce ? "yes" : "no");

  if (!nonce) {
    console.log("fetchNonce: trying /cart/nonce endpoint");
    try {
      const nonceRes = await fetch(`${wpUrl}/wp-json/wc/store/v1/cart/nonce`, { headers });
      console.log("fetchNonce: nonce endpoint status:", nonceRes.status);
      console.log("fetchNonce: nonce endpoint headers:", Object.fromEntries(nonceRes.headers.entries()));
      const nonceBody = await nonceRes.text();
      console.log("fetchNonce: nonce endpoint body:", nonceBody);
      const nonceFromBody = nonceRes.headers.get("X-WC-Store-API-Nonce") || nonceRes.headers.get("Nonce") || nonceBody || "";
      return nonceFromBody;
    } catch (e) {
      console.error("fetchNonce: nonce endpoint error:", e);
    }
  }

  return nonce;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cartToken = request.headers.get("cart-token") || "";
    let nonce = request.headers.get("x-wc-store-api-nonce") || "";

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://admin.exacontable.com";

    if (!nonce) {
      nonce = await fetchNonce(wpUrl, cartToken);
    }

    console.log("POST add-item: using nonce:", nonce ? "yes (" + nonce.substring(0, 20) + "...)" : "no");
    console.log("POST add-item: using cartToken:", cartToken ? "yes" : "no");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (cartToken) headers["Cart-Token"] = cartToken;
    if (nonce) headers["Nonce"] = nonce;
    headers["X-WC-Store-API-Nonce"] = nonce;

    const res = await fetch(`${wpUrl}/wp-json/wc/store/v1/cart/add-item`, {
      method: "POST",
      headers,
      body: JSON.stringify({ id: body.id, quantity: body.quantity ?? 1 }),
    });

    console.log("POST add-item: WordPress response status:", res.status);
    console.log("POST add-item: WordPress response headers:", Object.fromEntries(res.headers.entries()));

    const newCartToken = res.headers.get("Cart-Token") || cartToken;
    const newNonce = res.headers.get("X-WC-Store-API-Nonce") || res.headers.get("Nonce") || nonce;
    const cart = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: cart.message || "Add to cart failed" }, { status: res.status });
    }

    const response = NextResponse.json({ cart, cartToken: newCartToken, nonce: newNonce });
    if (newCartToken) response.headers.set("Cart-Token", newCartToken);
    if (newNonce) response.headers.set("X-WC-Store-API-Nonce", newNonce);
    return response;
  } catch (error) {
    console.error("Error adding to cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
