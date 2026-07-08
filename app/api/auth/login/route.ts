import { NextResponse } from "next/server"
import { isAdminEmail, verifyPassword, createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      )
    }

    if (!isAdminEmail(email)) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    const valid = await verifyPassword(password)
    if (!valid) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      )
    }

    const token = await createSession()

    const response = NextResponse.json({ success: true })
    response.cookies.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    })

    return response
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    )
  }
}
