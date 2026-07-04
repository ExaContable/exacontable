"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Smartphone, RefreshCw, LogOut, CheckCircle2, XCircle, Phone, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface WhatsAppStatus {
  connected: boolean
  qr: string | null
  qrBase64: string | null
  hasSession: boolean
  phone: string
}

export function QRScanner() {
  const [status, setStatus] = useState<WhatsAppStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [phoneInput, setPhoneInput] = useState("")
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [savingPhone, setSavingPhone] = useState(false)

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/whatsapp")
      const data = await res.json()
      setStatus(data)
      if (data.phone && !isEditingPhone) {
        setPhoneInput(data.phone)
      }
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [isEditingPhone])

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 3000)
    return () => clearInterval(interval)
  }, [fetchStatus])

  async function handleReconnect() {
    setActionLoading(true)
    try {
      const res = await fetch("/api/admin/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reconnect" }),
      })
      if (res.ok) {
        toast.success("Reiniciando conexión WhatsApp. Espere el nuevo código QR.")
      } else {
        toast.error("Error al reiniciar la conexión")
      }
      await fetchStatus()
    } catch {
      toast.error("Error de conexión")
    } finally {
      setActionLoading(false)
    }
  }

  async function handleDisconnect() {
    if (!confirm("¿Cerrar sesión de WhatsApp? No se enviarán notificaciones hasta reconectar.")) return
    setActionLoading(true)
    try {
      const res = await fetch("/api/admin/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "disconnect" }),
      })
      if (res.ok) {
        toast.success("Sesión cerrada correctamente")
      } else {
        toast.error("Error al cerrar sesión")
      }
      await fetchStatus()
    } catch {
      toast.error("Error de conexión")
    } finally {
      setActionLoading(false)
    }
  }

  async function handleSavePhone() {
    if (!phoneInput) {
      toast.error("El número de teléfono no puede estar vacío")
      return
    }
    
    setSavingPhone(true)
    try {
      const res = await fetch("/api/admin/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_phone", phone: phoneInput }),
      })
      if (res.ok) {
        toast.success("Número de teléfono guardado exitosamente")
        setIsEditingPhone(false)
        await fetchStatus()
      } else {
        const err = await res.json()
        toast.error(err.error || "Error al guardar el teléfono")
      }
    } catch {
      toast.error("Error de conexión")
    } finally {
      setSavingPhone(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20 bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Phone configuration input */}
      <div className="rounded-xl border border-zinc-200 bg-zinc-50/20 p-4 space-y-3.5 shadow-sm">
        <Label className="text-xs font-bold text-zinc-700 flex items-center gap-2">
          <Phone className="h-3.5 w-3.5 text-red-650" />
          Número Receptor de Notificaciones
        </Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-400">+</span>
            <Input
              type="text"
              value={phoneInput}
              onChange={(e) => {
                setIsEditingPhone(true)
                setPhoneInput(e.target.value.replace(/\D/g, "")) // digits only
              }}
              placeholder="Ej: 593978835575"
              className="pl-7 border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 text-xs focus:border-red-500"
            />
          </div>
          <Button
            onClick={handleSavePhone}
            disabled={savingPhone}
            className="bg-zinc-950 text-white hover:bg-zinc-900 hover:text-white px-4 text-xs font-semibold rounded-lg shrink-0"
          >
            {savingPhone ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5 mr-1.5" />
            )}
            Guardar
          </Button>
        </div>
        <p className="text-[10px] text-zinc-500 leading-normal">
          Usa formato internacional sin el signo + (ej: <span className="font-semibold text-zinc-700">593978835575</span> para Ecuador).
        </p>
      </div>

      <div className="flex items-center justify-between border-b border-zinc-150 pb-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-2.5 w-2.5 rounded-full",
              status?.connected ? "bg-emerald-500 animate-pulse" : "bg-zinc-400"
            )}
          />
          <span className="text-xs font-bold text-zinc-800">
            {status?.connected ? "WhatsApp Conectado" : "WhatsApp Desconectado"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReconnect}
            disabled={actionLoading}
            className="border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 text-xs rounded-lg shadow-sm"
          >
            {actionLoading ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-3.5 w-3.5 text-zinc-550" />
            )}
            Reconectar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDisconnect}
            disabled={actionLoading}
            className="text-red-650 hover:text-red-750 hover:bg-red-50 text-xs rounded-lg font-semibold"
          >
            <LogOut className="mr-2 h-3.5 w-3.5" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {status?.connected ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50/30 py-12">
          <CheckCircle2 className="mb-4 h-12 w-12 text-emerald-600" />
          <p className="text-base font-bold text-zinc-950">
            Servicio Activo
          </p>
          <p className="mt-1 text-xs text-zinc-600">
            Las notificaciones se están enviando correctamente
          </p>
        </div>
      ) : status?.qrBase64 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-250 bg-zinc-50/20 py-8 shadow-inner">
          <div className="mb-4 flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/70 px-4 py-1.5 text-xs text-amber-800 font-bold shadow-sm">
            <Smartphone className="h-4 w-4 text-amber-700" />
            Escanea el código QR con tu WhatsApp
          </div>
          <div className="rounded-xl bg-white p-4 shadow-md border border-zinc-150">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={status.qrBase64}
              alt="WhatsApp QR Code"
              className="h-60 w-60"
            />
          </div>
          <p className="mt-4 text-[10px] text-zinc-500 font-medium leading-relaxed max-w-sm text-center">
            Abre WhatsApp &gt; Dispositivos vinculados &gt; Vincular un dispositivo
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50/35 py-12">
          <XCircle className="mb-4 h-12 w-12 text-zinc-400" />
          <p className="text-sm font-bold text-zinc-950">
            No hay sesión activa
          </p>
          <p className="mt-1 text-xs text-zinc-550">
            Haz clic en "Reconectar" para generar un nuevo código QR
          </p>
        </div>
      )}
    </div>
  )
}
