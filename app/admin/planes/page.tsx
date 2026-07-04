import { prisma } from "@/lib/prisma"
import { PlansClient } from "./PlansClient"

export const dynamic = "force-dynamic"

export default async function PlansPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { sortOrder: "asc" },
  })

  const serialized = plans.map((p) => ({
    ...p,
    features: JSON.parse(p.features),
  }))

  return <PlansClient plans={serialized} />
}
