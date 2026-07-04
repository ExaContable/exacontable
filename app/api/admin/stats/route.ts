import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const [
      totalPlans,
      activePlans,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      activeMethods,
    ] = await Promise.all([
      prisma.plan.count(),
      prisma.plan.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.count({ where: { status: "completed" } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "completed" },
      }),
      prisma.paymentMethod.count({ where: { isActive: true } }),
    ])

    return NextResponse.json({
      totalPlans,
      activePlans,
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      activeMethods,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json(
      { error: "Error al obtener estadísticas" },
      { status: 500 }
    )
  }
}
