import { NextResponse } from "next/server";
import { createOrder, createCustomer } from "@/lib/woocommerce-rest";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { checkoutData, cartToken } = body;

    if (!checkoutData) {
      return NextResponse.json(
        { error: "Datos de checkout requeridos" },
        { status: 400 }
      );
    }

    const { billing, meta_data } = checkoutData;

    let customerId: number | undefined;

    try {
      const existingCustomers = await fetch(
        `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wc/v3/customers?email=${billing.email}`,
        {
          headers: {
            Authorization: `Basic ${Buffer.from(
              `${process.env.WOOCOMMERCE_KEY}:${process.env.WOOCOMMERCE_SECRET}`
            ).toString("base64")}`,
          },
        }
      );
      const customers = await existingCustomers.json();

      if (customers && customers.length > 0) {
        customerId = customers[0].id;
      } else {
        const newCustomer = await createCustomer({
          email: billing.email,
          first_name: billing.first_name,
          last_name: billing.last_name,
          username: body.username || billing.email,
          billing,
          meta_data: meta_data || [],
        });
        customerId = newCustomer.id;
      }
    } catch (err) {
      console.error("Error creating/finding customer:", err);
    }

    const orderPayload: Record<string, unknown> = {
      payment_method: checkoutData.payment_method || "bacs",
      payment_method_title:
        checkoutData.payment_method === "bacs"
          ? "Banco Pichincha"
          : "Payphone Payment Box",
      billing,
      meta_data: meta_data || [],
      customer_id: customerId || 0,
      set_paid: false,
      status: "on-hold",
    };

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://admin.exacontable.com";
    const cartRes = await fetch(`${wpUrl}/wp-json/wc/store/v1/cart`, {
      headers: cartToken ? { "Cart-Token": cartToken } : {},
    });

    if (!cartRes.ok) {
      return NextResponse.json(
        { error: "Error al obtener el carrito" },
        { status: 400 }
      );
    }

    const cart = await cartRes.json();

    if (!cart.items || cart.items.length === 0) {
      return NextResponse.json(
        { error: "El carrito esta vacio" },
        { status: 400 }
      );
    }

    const lineItems = cart.items.map(
      (item: { id: number; quantity: number; name: string; prices: { price: string } }) => ({
        product_id: item.id,
        quantity: item.quantity,
        name: item.name,
        price: parseInt(item.prices.price) / 100,
      })
    );

    const totals = cart.totals;
    orderPayload.line_items = lineItems;
    orderPayload.total = (parseInt(totals.total_price) / 100).toFixed(2);

    const order = await createOrder(orderPayload);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_key: order.order_key,
      payment_url: order.payment_url,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al procesar el checkout",
      },
      { status: 500 }
    );
  }
}
