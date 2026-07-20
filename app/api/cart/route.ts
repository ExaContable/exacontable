import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCartData } from "@/lib/cart-utils";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get("exa_cart")?.value;
    const cartItemsRaw = cartCookie ? JSON.parse(cartCookie) : [];

    const cart = await getCartData(cartItemsRaw);

    const response = NextResponse.json(cart);
    return response;
  } catch (error) {
    console.error("Error fetching local cart:", error);
    return NextResponse.json({
      items: [],
      totals: {
        total_price: "0",
        total_tax: "0",
        currency_code: "USD",
        currency_symbol: "$",
        currency_minor_unit: 2,
        currency_prefix: "$",
        currency_suffix: "",
      },
      items_count: 0,
    });
  }
}
