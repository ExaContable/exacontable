import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendOrderStatusEmail } from "@/lib/email"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      )
    }
    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json(
      { error: "Error al obtener orden" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await prisma.order.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Orden no encontrada" },
        { status: 404 }
      )
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        ...(body.status !== undefined && { status: body.status }),
        ...(body.paymentStatus !== undefined && {
          paymentStatus: body.paymentStatus,
        }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
    })

    // If status changed, send an email to the user
    if (body.status !== undefined && body.status !== existing.status) {
      try {
        await sendOrderStatusEmail({
          id: order.id,
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          planName: order.planName,
          total: order.total,
          paymentMethod: order.paymentMethod,
          status: order.status,
          usuario: order.usuario,
        });
      } catch (mailErr) {
        console.error("Failed to send order status email:", mailErr);
      }
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: "Error al actualizar orden" },
      { status: 500 }
    )
  }
}
