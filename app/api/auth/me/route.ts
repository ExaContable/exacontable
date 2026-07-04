import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
)

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || ""
    const cookies = Object.fromEntries(
      cookieHeader.split("; ").filter(Boolean).map((c) => {
        const [key, ...val] = c.split("=")
        return [key, val.join("=")]
      })
    )
    const token = cookies["admin_session"]

    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 401 })
    }

    await jwtVerify(token, JWT_SECRET)
    return NextResponse.json({ authenticated: true })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}
