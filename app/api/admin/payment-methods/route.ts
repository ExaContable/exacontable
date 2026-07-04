import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const methods = await prisma.paymentMethod.findMany({
      orderBy: { name: "asc" },
    })
    return NextResponse.json(methods)
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return NextResponse.json(
      { error: "Error al obtener métodos de pago" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, code, description, isActive, isSandbox, config, commission } =
      body

    if (!name || !code) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    const existing = await prisma.paymentMethod.findUnique({ where: { code } })
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un método con ese código" },
        { status: 409 }
      )
    }

    const method = await prisma.paymentMethod.create({
      data: {
        name,
        code,
        description,
        isActive: isActive ?? true,
        isSandbox: isSandbox ?? true,
        config: config ? JSON.stringify(config) : null,
        commission: commission ? parseFloat(commission) : null,
      },
    })

    return NextResponse.json(method, { status: 201 })
  } catch (error) {
    console.error("Error creating payment method:", error)
    return NextResponse.json(
      { error: "Error al crear método de pago" },
      { status: 500 }
    )
  }
}
