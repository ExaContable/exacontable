import { NextResponse } from "next/server";
import { getOrder } from "@/lib/woocommerce-rest";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = parseInt(id);
    if (isNaN(orderId)) {
      return NextResponse.json({ error: "ID de pedido invalido" }, { status: 400 });
    }

    const order = await getOrder(orderId);

    const receiptMeta = order.meta_data?.find(
      (m: { key: string }) => m.key === "_billing_receipt_url"
    );
    const receiptUrl = receiptMeta?.value || null;

    const billingFields: Record<string, string> = {};
    if (order.meta_data) {
      for (const meta of order.meta_data) {
        if (meta.key.startsWith("billing_")) {
          billingFields[meta.key.replace("billing_", "")] = meta.value;
        }
      }
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      payment_method: order.payment_method,
      payment_method_title: order.payment_method_title,
      date_created: order.date_created,
      total: order.total,
      currency: order.currency,
      billing: order.billing,
      line_items: order.line_items?.map((item: { name: string; quantity: number; price: number }) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      receipt_url: receiptUrl,
      billing_fields: billingFields,
      date_paid: order.date_paid,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Error al obtener el pedido" }, { status: 500 });
  }
}
