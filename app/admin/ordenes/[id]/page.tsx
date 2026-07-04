import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { OrderDetailClient } from "./OrderDetailClient"

export const dynamic = "force-dynamic"

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const orderRaw = await prisma.order.findUnique({ where: { id } })

  if (!orderRaw) notFound()

  const order = {
    ...orderRaw,
    createdAt: orderRaw.createdAt.toISOString(),
    updatedAt: orderRaw.updatedAt.toISOString(),
  }

  return <OrderDetailClient order={order} />
}
