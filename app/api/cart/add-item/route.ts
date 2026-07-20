import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCartData } from "@/lib/cart-utils";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const productId = body.id;
    const quantity = body.quantity ?? 1;

    if (!productId) {
      return NextResponse.json({ error: "Product ID required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const cartCookie = cookieStore.get("exa_cart")?.value;
    let cartItems: { id: string; quantity: number }[] = cartCookie ? JSON.parse(cartCookie) : [];

    cartItems = [{ id: String(productId), quantity: 1 }];

    cookieStore.set("exa_cart", JSON.stringify(cartItems), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    const cart = await getCartData(cartItems);

    return NextResponse.json({
      cart,
      cartToken: "local_cart",
    });
  } catch (error) {
    console.error("Error adding to local cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
