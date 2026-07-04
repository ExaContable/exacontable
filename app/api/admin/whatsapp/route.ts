import { NextResponse } from "next/server"
import { initWhatsApp, isConnected, getQR, disconnectWhatsApp } from "@/lib/whatsapp-client"
import { prisma } from "@/lib/prisma"
import * as fs from "fs"
import * as path from "path"

const AUTH_DIR = path.join(process.cwd(), "whatsapp-auth")

export async function GET() {
  await initWhatsApp()
  const connected = isConnected()
  const { qr, qrBase64 } = getQR()

  let phone = ""
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key: "whatsapp_number" },
    })
    phone = config?.value || ""
  } catch (error) {
    console.error("Error loading phone config:", error)
  }

  return NextResponse.json({
    connected,
    qr: qr || null,
    qrBase64: qrBase64 || null,
    hasSession: fs.existsSync(path.join(AUTH_DIR, "creds.json")),
    phone: phone || process.env.WHATSAPP_TO || "",
  })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, phone } = body

    if (action === "reconnect") {
      await disconnectWhatsApp()
      if (fs.existsSync(AUTH_DIR)) {
        fs.rmSync(AUTH_DIR, { recursive: true, force: true })
      }
      // Re-initialize WhatsApp connection socket
      await initWhatsApp()
      return NextResponse.json({ success: true })
    }

    if (action === "disconnect") {
      await disconnectWhatsApp()
      if (fs.existsSync(AUTH_DIR)) {
        fs.rmSync(AUTH_DIR, { recursive: true, force: true })
      }
      return NextResponse.json({ success: true })
    }

    if (action === "update_phone") {
      if (!phone) {
        return NextResponse.json({ error: "Falta el número de teléfono" }, { status: 400 })
      }
      
      const cleanPhone = phone.replace(/\D/g, "") // Keep digits only
      
      await prisma.siteConfig.upsert({
        where: { key: "whatsapp_number" },
        update: { value: cleanPhone },
        create: { key: "whatsapp_number", value: cleanPhone },
      })
      
      return NextResponse.json({ success: true, phone: cleanPhone })
    }

    return NextResponse.json({ error: "Acción no válida" }, { status: 400 })
  } catch (error) {
    console.error("Error en acción WhatsApp:", error)
    return NextResponse.json(
      { error: "Error al procesar acción" },
      { status: 500 }
    )
  }
}
