import { prisma } from "@/lib/prisma"
import { DashboardClient } from "./DashboardClient"

async function getStats() {
  const [
    totalPlans,
    activePlans,
    totalOrders,
    pendingOrders,
    totalRevenue,
    paymentMethods,
    recentOrdersRaw,
  ] = await Promise.all([
    prisma.plan.count(),
    prisma.plan.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.order.count({ 
      where: { 
        status: { in: ["pending", "on-hold", "processing"] } 
      } 
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
  ])

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
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return <DashboardClient stats={stats} />
}
