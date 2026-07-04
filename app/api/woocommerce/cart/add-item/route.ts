import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

async function getCartData(cartItemsRaw: any[]) {
  const items = [];
  let totalPrice = 0;

  for (const raw of cartItemsRaw) {
    const plan = await prisma.plan.findUnique({
      where: { id: String(raw.id) },
    });
    if (plan) {
      const itemTotal = plan.price * raw.quantity;
      totalPrice += itemTotal;

      const priceInCents = Math.round(plan.price * 100).toString();
      const lineTotalInCents = Math.round(itemTotal * 100).toString();

      items.push({
        key: plan.id,
        id: plan.id,
        quantity: raw.quantity,
        name: plan.name,
        prices: {
          price: priceInCents,
          regular_price: priceInCents,
          sale_price: priceInCents,
          currency_code: "USD",
          currency_symbol: "$",
          currency_minor_unit: 2,
          currency_decimal_separator: ".",
          currency_thousand_separator: ",",
          currency_prefix: "$",
          currency_suffix: "",
        },
        totals: {
          line_total: lineTotalInCents,
          line_subtotal: lineTotalInCents,
        },
        images: [],
        catalog_visibility: "visible",
        extensions: {},
      });
    }
  }

  const totalInCents = Math.round(totalPrice * 100).toString();

  return {
    items,
    coupons: [],
    totals: {
      total_price: totalInCents,
      total_tax: "0",
      currency_code: "USD",
      currency_symbol: "$",
      currency_minor_unit: 2,
      currency_prefix: "$",
      currency_suffix: "",
    },
    items_count: items.reduce((acc, i) => acc + i.quantity, 0),
    needs_payment: totalPrice > 0,
    needs_shipping: false,
    payment_methods: ["bacs", "payphonebox"],
  };
}

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
    let cartItems: any[] = cartCookie ? JSON.parse(cartCookie) : [];

    // Since plans are usually purchased individually, we replace the cart with the single plan
    // or add it. To be user-friendly, let's allow only one plan in the cart at a time.
    // That prevents users from checkout with conflicting plans (e.g. basic + executive).
    cartItems = [{ id: String(productId), quantity: 1 }];

    cookieStore.set("exa_cart", JSON.stringify(cartItems), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      sameSite: "lax",
    });

    const cart = await getCartData(cartItems);

    const response = NextResponse.json({
      cart,
      cartToken: "local_cart",
      nonce: "local_nonce",
    });
    response.headers.set("Cart-Token", "local_cart");
    response.headers.set("X-WC-Store-API-Nonce", "local_nonce");
    return response;
  } catch (error) {
    console.error("Error adding to local cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
