"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { StatsCard } from "@/components/admin/StatsCard"
import {
  Package,
  ShoppingBag,
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Loader2,
  Calendar,
  MessageSquare,
  Sliders,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
  createdAt: string
}

interface Stats {
  totalPlans: number
  activePlans: number
  totalOrders: number
  pendingOrders: number
  totalRevenue: number
  paymentMethods: number
  recentOrders: Order[]
}

const statusLabels: Record<string, { label: string; color: string }> = {
  "on-hold": { label: "En espera", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  pending: { label: "Pendiente", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  processing: { label: "Procesando", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  completed: { label: "Completado", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  failed: { label: "Fallido", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  cancelled: { label: "Cancelado", color: "bg-neutral-500/10 text-neutral-600 border-neutral-500/20" },
}

export function DashboardClient({ stats }: { stats: Stats }) {
  const router = useRouter()
  const [syncing, setSyncing] = useState(false)

  async function handleSyncPlans() {
    setSyncing(true)
    try {
      const res = await fetch("/api/admin/plans/sync", { method: "POST" })
      if (res.ok) {
        const data = await res.json()
        toast.success(`Planes sincronizados: ${data.imported} creados, ${data.updated} actualizados`)
        router.refresh()
      } else {
        toast.error("Error al sincronizar planes")
      }
    } catch {
      toast.error("Error de conexión al sincronizar")
    } finally {
      setSyncing(false)
    }
  }

  const currentDate = new Date().toLocaleDateString("es-EC", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-6 text-zinc-900">
      {/* Banner de Bienvenida */}
      <div className="relative overflow-hidden rounded-2xl border border-red-100 bg-gradient-to-r from-red-50/70 via-white to-white p-4 sm:p-6 shadow-sm shadow-red-100/20">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 h-60 w-60 rounded-full bg-red-600/5 blur-[80px]" />
        <div className="absolute bottom-0 left-1/3 -mb-20 h-48 w-48 rounded-full bg-orange-500/5 blur-[60px]" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-red-600">
              <Sparkles className="h-3 w-3 animate-pulse" />
              Administración EXA Contable
            </div>
            <h2 className="text-lg sm:text-2xl font-bold font-heading text-zinc-950">
              ¡Bienvenido al Panel de Control!
            </h2>
            <p className="text-xs sm:text-sm text-zinc-500 leading-relaxed max-w-xl">
              Gestiona planes, valida comprobantes de pago de clientes y supervisa la facturación electrónica SRI desde un solo lugar.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2.5 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs text-zinc-500 shrink-0 self-start shadow-sm shadow-zinc-100/35">
            <Calendar className="h-4 w-4 text-red-600" />
            <span className="capitalize">{currentDate}</span>
          </div>
        </div>
      </div>

      {/* Grid de Estadísticas */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Planes Activos"
          value={stats.activePlans}
          icon={Package}
          description={`${stats.totalPlans} planes en total`}
        />
        <StatsCard
          title="Órdenes Totales"
          value={stats.totalOrders}
          icon={ShoppingBag}
          description={`${stats.pendingOrders} requiriendo atención`}
        />
        <StatsCard
          title="Ingresos"
          value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          description="De órdenes completadas"
          className="col-span-2 sm:col-span-1"
        />
        <StatsCard
          title="Órdenes Pendientes"
          value={stats.pendingOrders}
          icon={Clock}
          description="En espera / Procesando"
        />
        <StatsCard
          title="Métodos de Pago"
          value={stats.paymentMethods}
          icon={CreditCard}
          description="Gateways configurados"
        />
        <StatsCard
          title="Completadas"
          value={stats.totalOrders - stats.pendingOrders}
          icon={CheckCircle}
          description="Transacciones exitosas"
        />
      </div>

      {/* Grid Secundario: Órdenes Recientes y Acciones Rápidas */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Órdenes Recientes */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm shadow-zinc-100/50 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-950 font-heading">
                Órdenes Recientes
              </h3>
              <p className="text-[10px] sm:text-xs text-zinc-500">
                Últimas compras de planes realizadas en el sistema
              </p>
            </div>
            <Link href="/admin/ordenes">
              <Button variant="ghost" size="sm" className="text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 text-xs gap-1.5 rounded-lg">
                Ver todas
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {/* Desktop table */}
          <div className="hidden sm:block rounded-lg border border-zinc-200 bg-zinc-50/20 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-200 hover:bg-transparent bg-zinc-50">
                  <TableHead className="text-zinc-500 text-xs font-bold">Cliente</TableHead>
                  <TableHead className="text-zinc-500 text-xs font-bold">Plan</TableHead>
                  <TableHead className="text-zinc-500 text-xs font-bold">Total</TableHead>
                  <TableHead className="text-zinc-500 text-xs font-bold">Estado</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="py-10 text-center text-xs text-zinc-500 font-medium"
                    >
                      No hay órdenes registradas aún
                    </TableCell>
                  </TableRow>
                ) : (
                  stats.recentOrders.map((order) => {
                    const statusConfig = statusLabels[order.status] || {
                      label: order.status,
                      color: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
                    }
                    return (
                      <TableRow key={order.id} className="border-zinc-200 hover:bg-zinc-50/50">
                        <TableCell>
                          <div>
                            <p className="font-bold text-zinc-900 text-xs">
                              {order.customerName}
                            </p>
                            <p className="text-[10px] text-zinc-500 truncate max-w-[150px]">
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
                        <TableCell>
                          <Link href={`/admin/ordenes/${order.id}`}>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg">
                              <ChevronRight className="h-4 w-4" />
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
            {stats.recentOrders.length === 0 ? (
              <p className="py-8 text-center text-xs text-zinc-500 font-medium">
                No hay órdenes registradas aún
              </p>
            ) : (
              stats.recentOrders.map((order) => {
                const statusConfig = statusLabels[order.status] || {
                  label: order.status,
                  color: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
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
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-400 shrink-0 ml-2" />
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5 shadow-sm shadow-zinc-100/50 space-y-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-zinc-950 font-heading">
              Acciones Rápidas
            </h3>
            <p className="text-[10px] sm:text-xs text-zinc-500">
              Accesos directos y utilidades del sistema
            </p>
          </div>

          <div className="grid gap-2">
            <Button
              onClick={handleSyncPlans}
              disabled={syncing}
              className="w-full justify-start text-xs border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 rounded-lg shadow-sm"
              variant="outline"
            >
              {syncing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin text-red-600" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4 text-red-600" />
              )}
              Sincronizar planes
            </Button>

            <Link href="/admin/whatsapp">
              <Button
                className="w-full justify-start text-xs border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 rounded-lg shadow-sm"
                variant="outline"
              >
                <MessageSquare className="mr-2 h-4 w-4 text-emerald-600" />
                Conexión WhatsApp
              </Button>
            </Link>

            <Link href="/admin/metodos-pago">
              <Button
                className="w-full justify-start text-xs border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 rounded-lg shadow-sm"
                variant="outline"
              >
                <CreditCard className="mr-2 h-4 w-4 text-blue-600" />
                Métodos de Pago
              </Button>
            </Link>

            <Link href="/admin/configuracion">
              <Button
                className="w-full justify-start text-xs border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950 rounded-lg shadow-sm"
                variant="outline"
              >
                <Sliders className="mr-2 h-4 w-4 text-purple-600" />
                Configuración
              </Button>
            </Link>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50/30 p-3 border-dashed">
            <p className="text-[10px] font-bold tracking-wider text-red-700 uppercase">
              Nota del SRI
            </p>
            <p className="text-[11px] text-zinc-500 leading-relaxed mt-1">
              Las firmas electrónicas y tokenización del SRI deben actualizarse de forma recurrente. Asegura la vigencia de los certificados.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
