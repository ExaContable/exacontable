import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const plan = await prisma.plan.findUnique({ where: { id } })
    if (!plan) {
      return NextResponse.json(
        { error: "Plan no encontrado" },
        { status: 404 }
      )
    }
    return NextResponse.json({
      ...plan,
      features: JSON.parse(plan.features),
    })
  } catch (error) {
    console.error("Error fetching plan:", error)
    return NextResponse.json(
      { error: "Error al obtener plan" },
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
    const { name, slug, description, price, category, period, features, isActive, sortOrder } =
      body

    const existing = await prisma.plan.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Plan no encontrado" },
        { status: 404 }
      )
    }

    if (slug && slug !== existing.slug) {
      const slugExists = await prisma.plan.findUnique({
        where: { slug },
      })
      if (slugExists) {
        return NextResponse.json(
          { error: "Ya existe un plan con ese slug" },
          { status: 409 }
        )
      }
    }

    const plan = await prisma.plan.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(slug !== undefined && { slug }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(category !== undefined && { category }),
        ...(period !== undefined && { period }),
        ...(features !== undefined && { features: JSON.stringify(features) }),
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
      },
    })

    return NextResponse.json({
      ...plan,
      features: JSON.parse(plan.features),
    })
  } catch (error) {
    console.error("Error updating plan:", error)
    return NextResponse.json(
      { error: "Error al actualizar plan" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await prisma.plan.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(
        { error: "Plan no encontrado" },
        { status: 404 }
      )
    }

    await prisma.plan.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting plan:", error)
    return NextResponse.json(
      { error: "Error al eliminar plan" },
      { status: 500 }
    )
  }
}
