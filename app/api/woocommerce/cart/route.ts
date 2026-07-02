import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const cartToken = request.headers.get("cart-token") || "";

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://admin.exacontable.com";
    const headers: Record<string, string> = {};
    if (cartToken) headers["Cart-Token"] = cartToken;

    const res = await fetch(`${wpUrl}/wp-json/wc/store/v1/cart`, {
      headers,
    });

    if (!res.ok) {
      return NextResponse.json({ items: [] });
    }

    const nonce = res.headers.get("X-WC-Store-API-Nonce") || res.headers.get("Nonce") || "";
    if (nonce) console.log("GET /cart: nonce obtained");

    const cart = await res.json();

    const response = NextResponse.json(cart);
    if (nonce) response.headers.set("X-WC-Store-API-Nonce", nonce);
    return response;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json({ items: [] });
  }
}
