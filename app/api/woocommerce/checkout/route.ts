import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sendOrderNotification } from "@/lib/whatsapp";
import { sendOrderEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { checkoutData } = body;

    if (!checkoutData) {
      return NextResponse.json(
        { error: "Datos de checkout requeridos" },
        { status: 400 }
      );
    }

    const { billing, meta_data, payment_method } = checkoutData;

    // Read local cart cookie
    const cookieStore = await cookies();
    const cartCookie = cookieStore.get("exa_cart")?.value;
    const cartItemsRaw = cartCookie ? JSON.parse(cartCookie) : [];

    if (cartItemsRaw.length === 0) {
      return NextResponse.json(
        { error: "El carrito está vacío" },
        { status: 400 }
      );
    }

    // Get product details from local DB
    const firstCartItem = cartItemsRaw[0];
    const plan = await prisma.plan.findUnique({
      where: { id: String(firstCartItem.id) },
    });

    if (!plan) {
      return NextResponse.json(
        { error: "El plan seleccionado no existe en el catálogo" },
        { status: 400 }
      );
    }

    const total = plan.price * firstCartItem.quantity;

    // Parse metadata
    const metaMap = (meta_data as { key: string; value: string }[] || []).reduce(
      (acc: Record<string, string>, m: { key: string; value: string }) => {
        acc[m.key] = m.value;
        return acc;
      },
      {}
    );

    const ruc = metaMap.billing_ruc || null;
    const cedula = metaMap.billing_cedula || null;
    const usuario = metaMap.billing_usuario || null;
    const clave = metaMap.billing_clave || null;
    const genero = metaMap.billing_genero || null;

    const paymentMethodName = payment_method === "bacs" ? "Transferencia Bancaria" : "Payphone";

    // Create Order locally
    const order = await prisma.order.create({
      data: {
        customerName: `${billing.first_name} ${billing.last_name}`.trim(),
        customerEmail: billing.email,
        customerPhone: billing.phone || "",
        planId: plan.id,
        planName: plan.name,
        total: total,
        status: "on-hold", // "on-hold" is standard for pending payment bank transfer
        paymentMethod: paymentMethodName,
        paymentStatus: "pending",
        receiptUrl: null,
        notes: "",
        
        // Save the new details fields
        ruc,
        cedula,
        usuario,
        clave,
        genero,
        address: billing.address_1,
        city: billing.city,
        state: billing.state,
        postcode: billing.postcode,
      },
    });

    // Clear local cart cookie
    cookieStore.delete("exa_cart");

    // Send WhatsApp notification to Admin/Support
    try {
      await sendOrderNotification({
        order_id: order.id,
        customer_name: `${billing.first_name} ${billing.last_name}`,
        customer_email: billing.email,
        customer_phone: billing.phone || "",
        items: [
          {
            name: plan.name,
            quantity: firstCartItem.quantity,
            price: plan.price.toFixed(2),
          },
        ],
        total: total.toFixed(2),
        payment_method: paymentMethodName,
        billing_address: `${billing.address_1}, ${billing.city}, ${billing.state}`,
        ruc: ruc || undefined,
        cedula: cedula || undefined,
        usuario: usuario || undefined,
      });
    } catch (waErr) {
      console.error("Failed to send WhatsApp notification:", waErr);
    }

    // Send Email notification to User and Admin copy
    try {
      await sendOrderEmail({
        id: order.id,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        planName: order.planName,
        total: order.total,
        paymentMethod: order.paymentMethod,
        status: order.status,
        usuario: order.usuario,
      });
    } catch (mailErr) {
      console.error("Failed to send email notification:", mailErr);
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
      order_key: `key_${order.id.slice(0, 8)}`,
      payment_url: `/mis-pedidos/${order.id}`,
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
