import { PrismaClient } from "../lib/generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

const url = process.env.DATABASE_URL
const pool = new Pool({ connectionString: url })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("=== PLANES ===")
  const planes = await prisma.plan.findMany({ orderBy: { sortOrder: "asc" } })
  console.log(`Total: ${planes.length}\n`)
  for (const p of planes) {
    console.log(`  [${p.category}] ${p.name} - $${p.price} (${p.period})`)
    console.log(`    Slug: ${p.slug} | Activo: ${p.isActive} | Orden: ${p.sortOrder}`)
  }

  console.log("\n=== MÉTODOS DE PAGO ===")
  const methods = await prisma.paymentMethod.findMany()
  console.log(`Total: ${methods.length}\n`)
  for (const m of methods) {
    console.log(`  ${m.name} (code: ${m.code})`)
    console.log(`    Activo: ${m.isActive} | Sandbox: ${m.isSandbox} | Comisión: ${m.commission ?? 0}%`)
    if (m.config) {
      console.log(`    Config: ${JSON.stringify(JSON.parse(m.config), null, 2)}`)
    }
  }

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
