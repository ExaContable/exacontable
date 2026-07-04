import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const method = await prisma.paymentMethod.findUnique({ where: { id } })
    if (!method) {
      return NextResponse.json(
        { error: "Método de pago no encontrado" },
        { status: 404 }
      )
    }
    return NextResponse.json(method)
  } catch (error) {
    console.error("Error fetching payment method:", error)
    return NextResponse.json(
      { error: "Error al obtener método de pago" },
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

    const existing = await prisma.paymentMethod.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Método de pago no encontrado" },
        { status: 404 }
      )
    }

    const method = await prisma.paymentMethod.update({
      where: { id },
      data: {
        ...(body.name !== undefined && { name: body.name }),
        ...(body.code !== undefined && { code: body.code }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.isSandbox !== undefined && { isSandbox: body.isSandbox }),
        ...(body.config !== undefined && {
          config: typeof body.config === "string" ? body.config : JSON.stringify(body.config),
        }),
        ...(body.commission !== undefined && {
          commission: body.commission ? parseFloat(body.commission) : null,
        }),
        ...(body.lastValidatedAt !== undefined && {
          lastValidatedAt: body.lastValidatedAt ? new Date(body.lastValidatedAt) : null,
        }),
      },
    })

    return NextResponse.json(method)
  } catch (error) {
    console.error("Error updating payment method:", error)
    return NextResponse.json(
      { error: "Error al actualizar método de pago" },
      { status: 500 }
    )
  }
}
