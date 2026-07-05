"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  RefreshCw,
  Loader2,
  Eye,
  Search,
  ShoppingBag,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Order {
  id: string
  wooCommerceId: number | null
  customerName: string
  customerEmail: string
  customerPhone: string | null
  planName: string
  total: number
  status: string
  paymentMethod: string | null
  paymentStatus: string
  notes: string | null
  createdAt: string
}

const statusLabels: Record<string, { label: string; color: string }> = {
  "on-hold": { label: "En espera", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  pending: { label: "Pendiente", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  processing: { label: "Procesando", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  completed: { label: "Completado", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  failed: { label: "Fallido", color: "bg-red-500/10 text-red-400 border-red-500/20" },
  cancelled: { label: "Cancelado", color: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20" },
  cotizacion: { label: "Cotización", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
}

export function OrdersClient({
  initialOrders,
  initialTotal,
}: {
  initialOrders: Order[]
  initialTotal: number
}) {
  const router = useRouter()
  const [orders, setOrders] = useState(initialOrders)
  const [total, setTotal] = useState(initialTotal)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [syncing, setSyncing] = useState(false)

  async function handleSync() {
    setSyncing(true)
    try {
      const res = await fetch("/api/admin/orders/sync", { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        toast.success(
          `Sincronizado: ${data.imported} nuevas, ${data.updated} actualizadas`
        )
        router.refresh()
      } else {
        toast.error("Error al sincronizar las órdenes")
      }
    } catch {
      toast.error("Error de conexión al sincronizar")
    } finally {
      setSyncing(false)
    }
  }

  const filtered = orders.filter((order) => {
    if (statusFilter && statusFilter !== "all" && order.status !== statusFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        order.customerName.toLowerCase().includes(q) ||
        order.customerEmail.toLowerCase().includes(q) ||
        order.planName.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-6 text-zinc-905">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-650">
            <ShoppingBag className="h-3.5 w-3.5" />
            Ventas y Pedidos
          </div>
          <h2 className="text-xl font-heading font-bold text-zinc-950 mt-1">
            Órdenes de Compra
          </h2>
          <p className="text-xs text-zinc-550">
            Mostrando {filtered.length} de {total} órdenes registradas
          </p>
        </div>
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {/* Sincronización WooCommerce deshabilitada */}
        </div>
      </div>

      {/* Controls / Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white border border-zinc-200 p-4 rounded-xl shadow-sm shadow-zinc-100/30">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            placeholder="Buscar por cliente o plan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-zinc-200 bg-white pl-10 text-zinc-905 placeholder:text-zinc-400 text-xs focus:border-red-500 focus:ring-red-500/10"
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value || "")}>
            <SelectTrigger className="border-zinc-200 bg-white text-zinc-900 text-xs">
              <SelectValue placeholder="Todos los estados" />
            </SelectTrigger>
            <SelectContent className="border-zinc-200 bg-white text-zinc-700">
              <SelectItem value="all" className="text-xs">Todos</SelectItem>
              <SelectItem value="on-hold" className="text-xs">En espera</SelectItem>
              <SelectItem value="pending" className="text-xs">Pendiente</SelectItem>
              <SelectItem value="processing" className="text-xs">Procesando</SelectItem>
              <SelectItem value="completed" className="text-xs">Completado</SelectItem>
              <SelectItem value="failed" className="text-xs">Fallido</SelectItem>
              <SelectItem value="cancelled" className="text-xs">Cancelado</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden sm:block rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm shadow-zinc-100/50">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-200 hover:bg-transparent bg-zinc-50">
              <TableHead className="text-zinc-500 text-xs font-bold">Cliente</TableHead>
              <TableHead className="text-zinc-500 text-xs font-bold">Plan Adquirido</TableHead>
              <TableHead className="text-zinc-500 text-xs font-bold">Total</TableHead>
              <TableHead className="text-zinc-500 text-xs font-bold">Estado</TableHead>
              <TableHead className="text-zinc-500 text-xs font-bold">Método Pago</TableHead>
              <TableHead className="text-zinc-500 text-xs font-bold">Fecha</TableHead>
              <TableHead className="w-16 text-zinc-500 text-xs font-bold text-center pr-4">Detalle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-16 text-center text-xs text-zinc-500 font-medium"
                >
                  No se encontraron órdenes registradas.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((order) => {
                const statusConfig = statusLabels[order.status] || {
                  label: order.status,
                  color: "bg-neutral-500/10 text-neutral-450 border-neutral-500/20",
                }
                return (
                  <TableRow key={order.id} className="border-zinc-200 hover:bg-zinc-50/50">
                    <TableCell>
                      <div>
                        <p className="font-bold text-zinc-900 text-xs">
                          {order.customerName}
                        </p>
                        <p className="text-[10px] text-zinc-450 font-mono">
                          {order.customerEmail}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-zinc-700 font-medium">
                      {order.planName}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-900 font-mono font-bold">
                      ${order.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${statusConfig.color} text-[10px] px-2 py-0.5 font-bold`}>
                        {statusConfig.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-zinc-700">
                      {order.paymentMethod || "-"}
                    </TableCell>
                    <TableCell className="text-xs text-zinc-500">
                      {new Date(order.createdAt).toLocaleDateString("es-EC", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-center pr-4">
                      <Link href={`/admin/ordenes/${order.id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 h-8 w-8 rounded-lg"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile list */}
      <div className="sm:hidden space-y-2">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-xs text-zinc-500 font-medium">
            No se encontraron órdenes registradas.
          </p>
        ) : (
          filtered.map((order) => {
            const statusConfig = statusLabels[order.status] || {
              label: order.status,
              color: "bg-neutral-500/10 text-neutral-450 border-neutral-500/20",
            }
            return (
              <Link
                key={order.id}
                href={`/admin/ordenes/${order.id}`}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white p-3 hover:bg-zinc-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-zinc-900 truncate">
                    {order.customerName}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">
                    {order.planName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-mono font-bold text-zinc-900">
                      ${order.total.toFixed(2)}
                    </span>
                    <Badge variant="outline" className={`${statusConfig.color} text-[9px] px-1.5 py-0 font-bold`}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-zinc-400">
                      {order.paymentMethod || "-"}
                    </span>
                    <span className="text-[10px] text-zinc-300">•</span>
                    <span className="text-[10px] text-zinc-400">
                      {new Date(order.createdAt).toLocaleDateString("es-EC", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-400 shrink-0 ml-2" />
              </Link>
            )
          })
        )}
      </div>
    </div>
  )
}
