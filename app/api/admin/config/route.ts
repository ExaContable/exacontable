import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const configs = await prisma.siteConfig.findMany()
    const map: Record<string, string> = {}
    for (const c of configs) {
      map[c.key] = c.value
    }
    return NextResponse.json(map)
  } catch (error) {
    console.error("Error fetching config:", error)
    return NextResponse.json(
      { error: "Error al obtener configuración" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()

    for (const [key, value] of Object.entries(body)) {
      if (typeof value !== "string") continue
      await prisma.siteConfig.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating config:", error)
    return NextResponse.json(
      { error: "Error al actualizar configuración" },
      { status: 500 }
    )
  }
}
