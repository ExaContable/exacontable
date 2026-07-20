import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCartData } from "@/lib/cart-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const key = body.key;

    if (!key) {
      return NextResponse.json({ error: "Item key required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const cartCookie = cookieStore.get("exa_cart")?.value;
    let cartItems: { id: string; quantity: number }[] = cartCookie ? JSON.parse(cartCookie) : [];

    cartItems = cartItems.filter((item) => String(item.id) !== String(key));

    cookieStore.set("exa_cart", JSON.stringify(cartItems), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    const cart = await getCartData(cartItems);
    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error removing item from local cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
