import { prisma } from "@/lib/prisma"
import { OrdersClient } from "./OrdersClient"

export const dynamic = "force-dynamic"

export default async function OrdersPage() {
  const [ordersRaw, total] = await Promise.all([
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    }),
    prisma.order.count(),
  ])

  const orders = ordersRaw.map((o) => ({
    ...o,
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }))

  return (
    <OrdersClient
      initialOrders={orders}
      initialTotal={total}
    />
  )
}
