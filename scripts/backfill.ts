import { PrismaClient } from "../lib/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"

const adapter = new PrismaBetterSqlite3({ url: "file:./prisma/dev.db" })
const prisma = new PrismaClient({ adapter })

async function main() {
  const orders = await prisma.order.findMany({ orderBy: { createdAt: "asc" } })
  for (let i = 0; i < orders.length; i++) {
    await prisma.order.update({
      where: { id: orders[i].id },
      data: { orderNumber: i + 1 },
    })
  }
  console.log(`Backfilled ${orders.length} orders`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
