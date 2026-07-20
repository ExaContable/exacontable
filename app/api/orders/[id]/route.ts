import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id },
          ...(isNaN(Number(id)) ? [] : [{ orderNumber: Number(id) }]),
        ],
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
    }

    const isBacs = order.paymentMethod === "Transferencia Bancaria";

    let bankAccounts: {
      bank_name: string;
      account_name: string;
      account_number: string;
      account_ruc: string;
    }[] = [];

    if (isBacs) {
      const paymentMethod = await prisma.paymentMethod.findFirst({
        where: { code: "bacs", isActive: true },
        orderBy: { updatedAt: "desc" },
      });
      if (paymentMethod?.config) {
        try {
          const cfg = JSON.parse(paymentMethod.config);
          if (cfg.bank_name || cfg.account_number) {
            bankAccounts = [
              {
                bank_name: cfg.bank_name || "Banco Pichincha",
                account_name: cfg.account_name || "EXA CONTABLE",
                account_number: cfg.account_number || "",
                account_ruc: cfg.account_ruc || "",
              },
            ];
          }
        } catch {}
      }
    }

    const orderNumberFormatted = `EXA-${String(order.orderNumber).padStart(4, "0")}`;

    const billingFields: Record<string, string> = {
      billing_usuario: order.usuario || "",
      billing_clave: order.clave || "",
      billing_genero: order.genero || "",
      billing_ruc: order.ruc || "",
      billing_cedula: order.cedula || "",
      address_1: order.address || "",
      city: order.city || "",
      state: order.state || "",
      postcode: order.postcode || "",
    };

    return NextResponse.json({
      id: order.id,
      order_number: orderNumberFormatted,
      status: order.status,
      payment_method: isBacs ? "bacs" : "payphone",
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
      bank_accounts: bankAccounts,
      date_paid: order.paymentStatus === "paid" ? order.updatedAt.toISOString() : null,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Error al obtener el pedido" }, { status: 500 });
  }
}
