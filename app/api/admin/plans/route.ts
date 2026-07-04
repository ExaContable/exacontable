import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const plans = await prisma.plan.findMany({
      orderBy: { sortOrder: "asc" },
    })
    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching plans:", error)
    return NextResponse.json(
      { error: "Error al obtener planes" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, slug, description, price, category, period, features, isActive, sortOrder } =
      body

    if (!name || !slug || price === undefined || !category || !period) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      )
    }

    const existing = await prisma.plan.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        { error: "Ya existe un plan con ese slug" },
        { status: 409 }
      )
    }

    const plan = await prisma.plan.create({
      data: {
        name,
        slug,
        description,
        price: parseFloat(price),
        category,
        period,
        features: JSON.stringify(features || []),
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
      },
    })

    return NextResponse.json(plan, { status: 201 })
  } catch (error) {
    console.error("Error creating plan:", error)
    return NextResponse.json(
      { error: "Error al crear plan" },
      { status: 500 }
    )
  }
}
