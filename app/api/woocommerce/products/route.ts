import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const wpUrl = process.env.WORDPRESS_URL || "https://exacontable.com";

    const singleId = searchParams.get("id");

    let storeUrl: string;
    if (singleId) {
      storeUrl = `${wpUrl}/wp-json/wc/store/v1/products/${singleId}`;
    } else {
      storeUrl = `${wpUrl}/wp-json/wc/store/v1/products`;
    }

    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      if (key !== "id") params.set(key, value);
    });
    const url = params.toString() ? `${storeUrl}?${params}` : storeUrl;

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Store API error:", res.status, text);
      return NextResponse.json(
        { error: `Store API error: ${res.status}` },
        { status: res.status },
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 },
    );
  }
}
