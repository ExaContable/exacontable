import { prisma } from "@/lib/prisma"
import { ConfigClient } from "./ConfigClient"

export const dynamic = "force-dynamic"

export default async function ConfigPage() {
  const configs = await prisma.siteConfig.findMany()
  const config: Record<string, string> = {}
  for (const c of configs) {
    config[c.key] = c.value
  }

  return <ConfigClient initialConfig={config} />
}
