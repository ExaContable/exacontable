import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    const billingFields: Record<string, string> = {
      usuario: order.usuario || "",
      clave: order.clave || "",
      genero: order.genero || "",
      ruc: order.ruc || "",
      cedula: order.cedula || "",
      address_1: order.address || "",
      city: order.city || "",
      state: order.state || "",
      postcode: order.postcode || "",
    };

    return NextResponse.json({
      id: order.id,
      status: order.status,
      payment_method: order.paymentMethod === "Transferencia Bancaria" ? "bacs" : "payphone",
      payment_method_title: order.paymentMethod || "Transferencia Bancaria",
      date_created: order.createdAt.toISOString(),
      total: order.total.toFixed(2),
      currency: "USD",
      billing: {
        first_name: order.customerName.split(" ")[0] || "",
        last_name: order.customerName.split(" ").slice(1).join(" ") || "",
        email: order.customerEmail,
        phone: order.customerPhone,
      },
      line_items: [
        {
          name: order.planName,
          quantity: 1,
          price: order.total,
        }
      ],
      receipt_url: order.receiptUrl,
      billing_fields: billingFields,
      date_paid: order.paymentStatus === "paid" ? order.updatedAt.toISOString() : null,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Error al obtener el pedido" }, { status: 500 });
  }
}
