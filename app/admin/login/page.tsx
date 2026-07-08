"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff, Loader2, LogIn, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

const containerVariants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.08 * i, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
  }),
}

export default function LoginPage() {
  const router = useRouter()
  const emailRef = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [rememberEmail, setRememberEmail] = useState(false)
  const [emailError, setEmailError] = useState("")

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        if (data.authenticated) {
          router.replace("/admin")
          return
        }
      } catch {
      } finally {
        setCheckingSession(false)
      }
    }
    checkSession()
  }, [router])

  useEffect(() => {
    const saved = localStorage.getItem("admin_login_email")
    if (saved) {
      setEmail(saved)
      setRememberEmail(true)
    }
  }, [])

  useEffect(() => {
    if (!checkingSession) {
      emailRef.current?.focus()
    }
  }, [checkingSession])

  function validateEmail(value: string) {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError("Correo electrónico no válido")
      return false
    }
    setEmailError("")
    return true
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!validateEmail(email)) {
      toast.error("Correo electrónico no válido", {
        description: "Por favor ingresa un correo válido",
      })
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        const msg = data.error || "Error al iniciar sesión"
        setError(msg)
        toast.error("Credenciales inválidas", {
          description: "Verifica tu correo y contraseña e intenta de nuevo",
        })
        return
      }

      if (rememberEmail) {
        localStorage.setItem("admin_login_email", email)
      } else {
        localStorage.removeItem("admin_login_email")
      }

      toast.success("Bienvenido", {
        description: "Inicio de sesión exitoso",
      })
      router.push("/admin")
    } catch {
      setError("Error de conexión")
      toast.error("Error de conexión", {
        description: "No se pudo conectar con el servidor",
      })
    } finally {
      setLoading(false)
    }
  }

  function handleEmailChange(value: string) {
    setEmail(value)
    if (emailError) validateEmail(value)
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-neutral-950 to-neutral-950" />
        <div className="relative flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-red-500" />
          <p className="text-sm text-neutral-500">Verificando sesión...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-neutral-950 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-900/20 via-neutral-950 to-neutral-950" />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-red-800/10 via-transparent to-transparent"
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative w-full max-w-md"
      >
        <Card className="border-neutral-800/80 bg-neutral-900/70 backdrop-blur-2xl shadow-2xl shadow-red-900/10">
          <CardHeader className="items-center space-y-5 pb-6 text-center pt-8">
            <motion.div
              custom={0}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <Image
                src="/logo-blanco.png"
                alt="EXA Contable"
                width={160}
                height={48}
                className="h-10 w-auto"
                priority
              />
            </motion.div>
            <motion.div
              custom={1}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <CardTitle className="text-xl text-white">
                Panel de Administración
              </CardTitle>
              <CardDescription className="text-neutral-500 mt-1.5">
                Ingresa tus credenciales para acceder
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex items-center gap-2.5 overflow-hidden rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 self-start" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                custom={2}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                <Label htmlFor="email" className="text-sm font-medium text-neutral-300">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Input
                    ref={emailRef}
                    id="email"
                    type="email"
                    placeholder="admin@exacontable.com"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => validateEmail(email)}
                    required
                    aria-invalid={!!emailError}
                    className={cn(
                      "h-11 border-neutral-700/80 bg-neutral-800/80 pl-10 text-white",
                      "placeholder:text-neutral-600",
                      "transition-all duration-200",
                      "focus:border-red-500/60 focus:ring-2 focus:ring-red-500/15",
                      emailError && "border-red-500/60 focus:border-red-500 focus:ring-red-500/20"
                    )}
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                    <LogIn className="h-4 w-4" />
                  </div>
                </div>
                {emailError && (
                  <p className="text-xs text-red-400 mt-1">{emailError}</p>
                )}
              </motion.div>

              <motion.div
                custom={3}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2"
              >
                <Label htmlFor="password" className="text-sm font-medium text-neutral-300">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className={cn(
                      "h-11 border-neutral-700/80 bg-neutral-800/80 pl-10 pr-10 text-white",
                      "placeholder:text-neutral-600",
                      "transition-all duration-200",
                      "focus:border-red-500/60 focus:ring-2 focus:ring-red-500/15"
                    )}
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-500">
                    <div className="h-4 w-4 flex items-center justify-center">
                      <span className="block h-3.5 w-3.5 rounded-full border-2 border-current" />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </motion.div>

              <motion.div
                custom={4}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div
                    role="checkbox"
                    aria-checked={rememberEmail}
                    tabIndex={0}
                    onClick={() => setRememberEmail(!rememberEmail)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        setRememberEmail(!rememberEmail)
                      }
                    }}
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded",
                      "border transition-all duration-200",
                      rememberEmail
                        ? "border-red-500 bg-red-600"
                        : "border-neutral-700 bg-neutral-800 group-hover:border-neutral-600"
                    )}
                  >
                    {rememberEmail && <Check className="h-3 w-3 text-white stroke-[3]" />}
                  </div>
                  <span className="text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors select-none">
                    Recordar correo
                  </span>
                </label>
              </motion.div>

              <motion.div
                custom={5}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
              >
                <Button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    "relative w-full h-12 overflow-hidden",
                    "bg-red-600 text-white",
                    "shadow-[0_4px_20px_rgba(220,76,30,0.2)]",
                    "hover:bg-red-500 hover:shadow-[0_6px_28px_rgba(220,76,30,0.35)]",
                    "active:scale-[0.98]",
                    "disabled:opacity-60 disabled:active:scale-100",
                    "transition-all duration-200",
                    "text-base font-semibold"
                  )}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2.5">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Ingresando...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2.5">
                      <LogIn className="h-4 w-4" />
                      Iniciar Sesión
                    </span>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.8, duration: 0.5 } }}
          className="mt-6 text-center text-xs text-neutral-700"
        >
          &copy; {new Date().getFullYear()} EXA Contable &mdash; Todos los derechos reservados
        </motion.p>
      </motion.div>
    </div>
  )
}
