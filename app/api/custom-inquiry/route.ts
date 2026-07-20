import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendInquiryEmail } from "@/lib/email";

async function generateOrderNumber(): Promise<number> {
  const lastOrder = await prisma.order.findFirst({
    orderBy: { orderNumber: "desc" },
    select: { orderNumber: true },
  });
  return (lastOrder?.orderNumber ?? 0) + 1;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, details } = body;

    if (!name || !email || !phone || !details) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    const orderNumber = await generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        planId: "custom-plan",
        planName: "Plan Personalizado (Cotización)",
        total: 0.00,
        status: "cotizacion",
        paymentMethod: "Cotización por WhatsApp",
        paymentStatus: "pending",
        notes: details,
      },
    });

    // Send email to admin about custom plan inquiry
    try {
      await sendInquiryEmail({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        details: details,
      });
    } catch (mailErr) {
      console.error("Failed to send admin inquiry notification email:", mailErr);
    }

    return NextResponse.json({
      success: true,
      order_id: order.id,
    });
  } catch (error) {
    console.error("Error creating custom inquiry:", error);
    return NextResponse.json(
      { error: "Error al registrar la cotización" },
      { status: 500 }
    );
  }
}
