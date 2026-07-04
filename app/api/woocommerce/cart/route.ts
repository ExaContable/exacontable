import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get("exa_cart")?.value;
    const cartItemsRaw = cartCookie ? JSON.parse(cartCookie) : [];

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

    const cartResponse = {
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

    const response = NextResponse.json(cartResponse);
    response.headers.set("X-WC-Store-API-Nonce", "local_nonce");
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
      items_count: 0
    });
  }
}
