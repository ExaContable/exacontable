import { prisma } from "@/lib/prisma"
import { PaymentMethodsClient } from "./PaymentMethodsClient"

export const dynamic = "force-dynamic"

export default async function PaymentMethodsPage() {
  const methods = (await prisma.paymentMethod.findMany({
    orderBy: { name: "asc" },
  })).map((m) => ({
    ...m,
    lastValidatedAt: m.lastValidatedAt?.toISOString() ?? null,
    createdAt: m.createdAt.toISOString(),
    updatedAt: m.updatedAt.toISOString(),
  }))

  return <PaymentMethodsClient methods={methods} />
}
