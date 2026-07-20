import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-dev-secret-change-in-production"
)

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@exacontable.com"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || ""

export async function verifyPassword(password: string): Promise<boolean> {
  return password === ADMIN_PASSWORD
}

export async function createSession(): Promise<string> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)
  return token
}

export async function getSession(): Promise<{ role: string } | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("admin_session")?.value
    if (!token) return null
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { role: string }
  } catch {
    return null
  }
}

export async function requireAdmin(): Promise<boolean> {
  const session = await getSession()
  return session?.role === "admin"
}

export function isAdminEmail(email: string): boolean {
  return email === ADMIN_EMAIL
}
