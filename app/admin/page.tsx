import { prisma } from "@/lib/prisma"
import { DashboardClient } from "./DashboardClient"

async function getStats() {
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

  const [
    totalPlans,
    activePlans,
    totalOrders,
    pendingOrders,
    totalRevenue,
    paymentMethods,
    recentOrdersRaw,
    ordersByStatusRaw,
    completedOrdersChart,
  ] = await Promise.all([
    prisma.plan.count(),
    prisma.plan.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.count({
      where: {
        status: { in: ["pending", "on-hold", "processing"] },
      },
    }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "completed" },
    }),
    prisma.paymentMethod.count({ where: { isActive: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.order.groupBy({
      by: ["status"],
      _count: true,
    }),
    prisma.order.findMany({
      where: {
        status: "completed",
        createdAt: { gte: sixMonthsAgo },
      },
      select: { total: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    }),
  ])

  const statusBreakdown: Record<string, number> = {}
  ordersByStatusRaw.forEach((s) => {
    statusBreakdown[s.status] = s._count
  })

  const revenueByMonth: { month: string; revenue: number }[] = []
  const monthMap = new Map<string, number>()

  for (const order of completedOrdersChart) {
    const d = new Date(order.createdAt)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    monthMap.set(key, (monthMap.get(key) || 0) + Number(order.total))
  }

  const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    revenueByMonth.push({
      month: monthNames[d.getMonth()],
      revenue: monthMap.get(key) || 0,
    })
  }

  const recentOrders = recentOrdersRaw.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }))

  return {
    totalPlans,
    activePlans,
    totalOrders,
    pendingOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    paymentMethods,
    recentOrders,
    statusBreakdown,
    revenueByMonth,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return <DashboardClient stats={stats} />
}
