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
    const key = body.key;
    const quantity = body.quantity;

    if (!key || quantity === undefined) {
      return NextResponse.json({ error: "Item key and quantity required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const cartCookie = cookieStore.get("exa_cart")?.value;
    let cartItems: any[] = cartCookie ? JSON.parse(cartCookie) : [];

    cartItems = cartItems.map((item) => {
      if (String(item.id) === String(key)) {
        return { ...item, quantity: Math.max(1, quantity) };
      }
      return item;
    });

    cookieStore.set("exa_cart", JSON.stringify(cartItems), {
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    const cart = await getCartData(cartItems);
    return NextResponse.json(cart);
  } catch (error) {
    console.error("Error updating item in local cart:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
