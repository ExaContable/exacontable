"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Loader2, Building2, CreditCard } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Order {
  id: string
  orderNumber: number
  customerName: string
  customerEmail: string
  customerPhone: string | null
  planName: string
  total: number
  status: string
  paymentMethod: string | null
  paymentStatus: string
  receiptUrl: string | null
  notes: string | null
  createdAt: string
  updatedAt: string

  ruc?: string | null
  cedula?: string | null
  usuario?: string | null
  clave?: string | null
  genero?: string | null
  address?: string | null
  city?: string | null
  state?: string | null
  postcode?: string | null
}

const statusOptions = [
  { value: "on-hold", label: "Pendiente de pago" },
  { value: "pending", label: "Pendiente" },
  { value: "processing", label: "Procesando" },
  { value: "completed", label: "Completado" },
  { value: "failed", label: "Fallido" },
  { value: "cancelled", label: "Cancelado" },
  { value: "cotizacion", label: "Cotización / Personalizado" },
]

const paymentStatusOptions = [
  { value: "pending", label: "Pendiente" },
  { value: "paid", label: "Pagado" },
  { value: "failed", label: "Fallido" },
  { value: "refunded", label: "Reembolsado" },
]

export function OrderDetailClient({ order: initial }: { order: Order }) {
  const router = useRouter()
  const [order, setOrder] = useState(initial)
  const [status, setStatus] = useState(initial.status)
  const [paymentStatus, setPaymentStatus] = useState(initial.paymentStatus)
  const [notes, setNotes] = useState(initial.notes || "")
  const [saving, setSaving] = useState(false)

  const orderIdStr = `EXA-${String(order.orderNumber).padStart(4, "0")}`

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus, notes }),
      })
      if (res.ok) {
        const updated = await res.json()
        setOrder(updated)
        toast.success("Orden actualizada")
        router.refresh()
      } else {
        toast.error("Error al actualizar")
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Link
          href="/admin/ordenes"
          className="text-zinc-500 hover:text-zinc-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-xl font-heading font-bold text-zinc-950">
          Orden {orderIdStr}
        </h2>
        <Badge variant="outline" className="border-red-200 bg-red-50 text-red-650 font-mono text-[10px]">
          {orderIdStr}
        </Badge>
        <Badge variant="outline" className="border-zinc-200 text-zinc-500 bg-zinc-50 text-[10px]">
          ID: {order.id.slice(0, 8)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-zinc-200 bg-white shadow-sm shadow-zinc-100/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-zinc-950">
              Información del Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs text-zinc-500">Nombre</Label>
              <p className="text-zinc-900 font-medium text-sm">{order.customerName}</p>
            </div>
            <div>
              <Label className="text-xs text-zinc-500">Email</Label>
              <p className="text-zinc-900 font-medium text-sm">{order.customerEmail}</p>
            </div>
            <div>
              <Label className="text-xs text-zinc-500">Teléfono</Label>
              <p className="text-zinc-900 font-medium text-sm">{order.customerPhone || "-"}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 bg-white shadow-sm shadow-zinc-100/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-zinc-950">
              Detalle de la Orden
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label className="text-xs text-zinc-500">Plan</Label>
              <p className="text-zinc-900 font-medium text-sm">{order.planName}</p>
            </div>
            <div>
              <Label className="text-xs text-zinc-500">Total</Label>
              <p className="text-2xl font-bold text-zinc-950">
                ${order.total.toFixed(2)}
              </p>
            </div>
            <div>
              <Label className="text-xs text-zinc-500">Método de Pago</Label>
              <p className="text-zinc-900 font-medium text-sm flex items-center gap-1.5 mt-0.5">
                {order.paymentMethod === "Transferencia Bancaria" ? (
                  <Building2 className="h-4 w-4 text-zinc-500" />
                ) : (
                  <CreditCard className="h-4 w-4 text-zinc-500" />
                )}
                {order.paymentMethod || "-"}
              </p>
            </div>
            {order.receiptUrl && (
              <div>
                <Label className="text-xs text-zinc-500">Comprobante de Pago</Label>
                <p className="mt-1">
                  <a
                    href={order.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-red-650 hover:text-red-700 underline flex items-center gap-1.5"
                  >
                    Ver comprobante de pago
                  </a>
                </p>
              </div>
            )}
            <div>
              <Label className="text-xs text-zinc-500">Fecha</Label>
              <p className="text-zinc-900 font-medium text-sm">
                {new Date(order.createdAt).toLocaleDateString("es-EC", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "America/Guayaquil",
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {(order.ruc || order.cedula || order.usuario || order.address) && (
        <Card className="border-zinc-200 bg-white shadow-sm shadow-zinc-100/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-zinc-950">
              Datos de Facturación y Acceso al Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-3 text-sm">
            <div>
              <Label className="text-xs text-zinc-500 font-bold text-zinc-700">Identificación (RUC / Cédula)</Label>
              <p className="text-zinc-900 font-bold mt-1 text-xs">
                {order.ruc ? `RUC: ${order.ruc}` : order.cedula ? `Cédula: ${order.cedula}` : "No especificado"}
              </p>
            </div>
            <div>
              <Label className="text-xs text-zinc-500 font-bold text-zinc-700">Dirección Registrada</Label>
              <p className="text-zinc-905 font-medium mt-1 text-xs">
                {order.address || "-"} <br/>
                {order.city ? `${order.city}, ` : ""}{order.state || ""}{order.postcode ? ` (${order.postcode})` : ""}
              </p>
            </div>
            <div>
              <Label className="text-xs text-zinc-500 font-bold text-zinc-700">Credenciales del Usuario</Label>
              <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-lg mt-1 space-y-1 font-mono text-xs text-zinc-800">
                <p><span className="font-bold text-zinc-550">Usuario:</span> {order.usuario || "-"}</p>
                <p><span className="font-bold text-zinc-550">Clave:</span> {order.clave || "-"}</p>
                {order.genero && <p><span className="font-bold text-zinc-550">Género:</span> {order.genero}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="border-zinc-200 bg-white shadow-sm shadow-zinc-100/50">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-zinc-950">
            Seguimiento de la Orden
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-zinc-700 font-semibold text-xs">Estado de la Orden</Label>
              <Select value={status} onValueChange={(value) => value && setStatus(value)}>
                <SelectTrigger className="border-zinc-200 bg-white text-zinc-900 focus:border-red-500 focus:ring-red-500/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-200 bg-white text-zinc-700">
                  {statusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-700 font-semibold text-xs">
                Estado del Pago
              </Label>
              <Select value={paymentStatus} onValueChange={(value) => value && setPaymentStatus(value)}>
                <SelectTrigger className="border-zinc-200 bg-white text-zinc-900 focus:border-red-500 focus:ring-red-500/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-zinc-200 bg-white text-zinc-700">
                  {paymentStatusOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-xs">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-700 font-semibold text-xs">Notas Internas</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Agrega notas sobre el seguimiento de esta orden..."
              className="border-zinc-200 bg-white text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500/10"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-red-600 text-white hover:bg-red-500 rounded-lg shadow-sm shadow-red-50/20 px-6 text-xs font-semibold"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Cambios
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
