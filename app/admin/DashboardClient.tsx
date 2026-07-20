"use client"

import { StatsCard } from "@/components/admin/StatsCard"
import {
  Package,
  ShoppingBag,
  DollarSign,
  CreditCard,
  Clock,
  CheckCircle,
  ArrowRight,
  Calendar,
  MessageSquare,
  Sliders,
  ExternalLink,
  TrendingUp,
  PieChartIcon,
  Activity,
  Sun,
  Moon,
  CloudSun,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, Pie, PieChart, Cell } from "recharts"
import type { ChartConfig } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

interface Order {
  id: string
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
  statusBreakdown: Record<string, number>
  revenueByMonth: { month: string; revenue: number }[]
}

const statusLabels: Record<string, { label: string; color: string }> = {
  "on-hold": { label: "En espera", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  pending: { label: "Pendiente", color: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  processing: { label: "Procesando", color: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  completed: { label: "Completado", color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
  failed: { label: "Fallido", color: "bg-red-500/10 text-red-600 border-red-500/20" },
  cancelled: { label: "Cancelado", color: "bg-neutral-500/10 text-neutral-600 border-neutral-500/20" },
}

const statusDot: Record<string, string> = {
  "on-hold": "bg-amber-500",
  pending: "bg-amber-500",
  processing: "bg-blue-500",
  completed: "bg-emerald-500",
  failed: "bg-red-500",
  cancelled: "bg-neutral-400",
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return { text: "Buenos días", icon: Sun }
  if (hour < 18) return { text: "Buenas tardes", icon: CloudSun }
  return { text: "Buenas noches", icon: Moon }
}

const revenueConfig = {
  revenue: {
    label: "Ingresos",
    color: "oklch(0.50 0.18 25)",
  },
} satisfies ChartConfig

const STATUS_COLORS = [
  "oklch(0.65 0.15 85)",
  "oklch(0.55 0.12 250)",
  "oklch(0.55 0.15 160)",
  "oklch(0.85 0.02 0)",
  "oklch(0.55 0.18 25)",
]

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  "on-hold": "En espera",
  processing: "Procesando",
  completed: "Completado",
  failed: "Fallido",
  cancelled: "Cancelado",
}

export function DashboardClient({ stats }: { stats: Stats }) {
  const greeting = getGreeting()
  const GreetingIcon = greeting.icon

  const currentDate = new Date().toLocaleDateString("es-EC", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "America/Guayaquil",
  })

  const completedOrders = stats.totalOrders - stats.pendingOrders
  const completedPct = stats.totalOrders > 0 ? Math.round((completedOrders / stats.totalOrders) * 100) : 0

  const statusData = Object.entries(stats.statusBreakdown)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      value: count,
      status,
    }))

  const statusConfig = statusData.reduce((acc, item, i) => {
    acc[item.name] = { label: item.name, color: STATUS_COLORS[i % STATUS_COLORS.length] }
    return acc
  }, {} as ChartConfig)

  const hasRevenue = stats.revenueByMonth.some((m) => m.revenue > 0)

  return (
    <div className="space-y-5 sm:space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-primary/5 via-background to-background shadow-xs">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.03)_50%,transparent_75%)] bg-[length:24px_24px]" />
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[oklch(0.65_0.15_75/8%)] blur-[80px]" />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-primary">
                <GreetingIcon className="h-3 w-3" />
                {greeting.text}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60">
                <Calendar className="h-3 w-3" />
                {currentDate}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-heading">
              Panel de Control
            </h2>
            <p className="text-sm text-muted-foreground/80 max-w-xl leading-relaxed">
              Gestiona planes, valida comprobantes de pago y supervisa la facturación electrónica SRI desde un solo lugar.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <div className="rounded-lg border border-border/40 bg-card px-3 py-2 shadow-xs">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                <span className="font-semibold text-heading">{completedPct}%</span>
                <span>completadas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Planes Activos"
          value={stats.activePlans}
          icon={Package}
          description={`${stats.totalPlans} planes registrados`}
          accentColor="red"
        />
        <StatsCard
          title="Órdenes Totales"
          value={stats.totalOrders}
          icon={ShoppingBag}
          description={`${stats.pendingOrders} requieren atención`}
          accentColor="blue"
        />
        <StatsCard
          title="Ingresos"
          value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          description="De órdenes completadas"
          accentColor="gold"
        />
        <StatsCard
          title="Órdenes Pendientes"
          value={stats.pendingOrders}
          icon={Clock}
          description="En espera o procesando"
          accentColor="amber"
        />
        <StatsCard
          title="Métodos de Pago"
          value={stats.paymentMethods}
          icon={CreditCard}
          description="Gateways activos"
          accentColor="purple"
        />
        <StatsCard
          title="Completadas"
          value={completedOrders}
          icon={CheckCircle}
          description={`${completedPct}% del total`}
          accentColor="emerald"
        />
      </div>

      {/* Charts + Orders Grid */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Revenue Area Chart */}
        <div className="rounded-xl border border-border/40 bg-card shadow-xs p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-heading text-heading">
                Ingresos Mensuales
              </h3>
              <p className="text-xs text-muted-foreground/70">
                Últimos 6 meses
              </p>
            </div>
            <div className="rounded-lg bg-primary/5 p-2">
              <TrendingUp className="h-4 w-4 text-primary" />
            </div>
          </div>

          {hasRevenue ? (
            <div className="h-64">
              <ChartContainer config={revenueConfig} className="aspect-auto h-full w-full" initialDimension={{ width: 400, height: 220 }}>
                <AreaChart data={stats.revenueByMonth} margin={{ top: 5, right: 12, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.50 0.18 25)" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="oklch(0.50 0.18 25)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.08 0.01 40 / 6%)" vertical={false} />
                  <XAxis
                    dataKey="month"
                    tick={{ fontSize: 11, fill: "oklch(0.48 0.01 40)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip
                    cursor={{ stroke: "oklch(0.08 0.01 40 / 8%)", strokeWidth: 1 }}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.50 0.18 25)"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                    dot={{ fill: "oklch(0.50 0.18 25)", strokeWidth: 0, r: 3 }}
                    activeDot={{ fill: "oklch(0.50 0.18 25)", strokeWidth: 2, stroke: "white", r: 5 }}
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          ) : (
            <div className="h-56 sm:h-64 flex items-center justify-center">
              <div className="text-center space-y-2">
                <TrendingUp className="h-8 w-8 text-muted-foreground/20 mx-auto" />
                <p className="text-sm text-muted-foreground/50">Sin datos de ingresos aún</p>
              </div>
            </div>
          )}
        </div>

        {/* Status Donut Chart */}
        <div className="rounded-xl border border-border/40 bg-card shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-heading text-heading">
                Estado de Órdenes
              </h3>
              <p className="text-xs text-muted-foreground/70">
                Distribución actual
              </p>
            </div>
            <div className="rounded-lg bg-primary/5 p-2">
              <PieChartIcon className="h-4 w-4 text-primary" />
            </div>
          </div>

          {statusData.length > 0 ? (
            <div className="h-64">
              <ChartContainer config={statusConfig} className="aspect-auto h-full w-full" initialDimension={{ width: 220, height: 220 }}>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    strokeWidth={2}
                    stroke="oklch(0.995 0.002 60)"
                  >
                    {statusData.map((entry, i) => (
                      <Cell
                        key={entry.name}
                        fill={STATUS_COLORS[i % STATUS_COLORS.length]}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center space-y-2">
                <PieChartIcon className="h-8 w-8 text-muted-foreground/20 mx-auto" />
                <p className="text-sm text-muted-foreground/50">Sin órdenes registradas</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-1.5">
            {statusData.map((item, i) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[i % STATUS_COLORS.length] }}
                />
                <span className="text-muted-foreground truncate">{item.name}</span>
                <span className="ml-auto font-semibold text-heading tabular-nums">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="rounded-xl border border-border/40 bg-card shadow-xs p-5 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold font-heading text-heading">
                Órdenes Recientes
              </h3>
              <p className="text-xs text-muted-foreground/70">
                Últimas compras registradas en el sistema
              </p>
            </div>
            <Link href="/admin/ordenes">
              <Button variant="outline" size="sm" className="text-xs gap-1.5 rounded-lg">
                Ver todas
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          {stats.recentOrders.length === 0 ? (
            <div className="flex items-center justify-center py-10">
              <div className="text-center space-y-2">
                <ShoppingBag className="h-8 w-8 text-muted-foreground/20 mx-auto" />
                <p className="text-sm text-muted-foreground/50">No hay órdenes registradas aún</p>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/40 hover:bg-transparent">
                      <TableHead className="text-muted-foreground text-xs font-semibold">Cliente</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Plan</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Total</TableHead>
                      <TableHead className="text-muted-foreground text-xs font-semibold">Estado</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.recentOrders.map((order) => {
                      const statusConfig = statusLabels[order.status] || {
                        label: order.status,
                        color: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
                      }
                      return (
                        <TableRow key={order.id} className="border-border/40 hover:bg-muted/30 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2.5">
                              <Avatar size="sm">
                                <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                                  {getInitials(order.customerName)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-heading text-xs">
                                  {order.customerName}
                                </p>
                                <p className="text-[11px] text-muted-foreground/70 truncate max-w-[140px]">
                                  {order.customerEmail}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs text-muted-foreground font-medium">
                            {order.planName}
                          </TableCell>
                          <TableCell className="text-xs text-heading font-mono font-semibold tabular-nums">
                            ${order.total.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "text-[10px] px-2 py-0.5 font-semibold gap-1.5 border",
                              statusConfig.color
                            )}>
                              <span className={cn(
                                "h-1.5 w-1.5 rounded-full shrink-0",
                                statusDot[order.status] || "bg-neutral-400"
                              )} />
                              {statusConfig.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Link href={`/admin/ordenes/${order.id}`}>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/40 hover:text-heading hover:bg-muted/50 rounded-lg">
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile cards */}
              <div className="sm:hidden space-y-2">
                {stats.recentOrders.map((order) => {
                  const statusConfig = statusLabels[order.status] || {
                    label: order.status,
                    color: "bg-neutral-500/10 text-neutral-500 border-neutral-500/20",
                  }
                  return (
                    <Link
                      key={order.id}
                      href={`/admin/ordenes/${order.id}`}
                      className="flex items-center justify-between rounded-lg border border-border/40 bg-card p-3 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1">
                        <Avatar size="sm">
                          <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-bold">
                            {getInitials(order.customerName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-heading truncate">
                            {order.customerName}
                          </p>
                          <p className="text-xs text-muted-foreground/70 truncate">
                            {order.planName}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-mono font-semibold text-heading tabular-nums">
                              ${order.total.toFixed(2)}
                            </span>
                            <Badge variant="outline" className={cn(
                              "text-[9px] px-1.5 py-0 font-semibold gap-1 border",
                              statusConfig.color
                            )}>
                              <span className={cn(
                                "h-1 w-1 rounded-full shrink-0",
                                statusDot[order.status] || "bg-neutral-400"
                              )} />
                              {statusConfig.label}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/30 shrink-0 ml-2" />
                    </Link>
                  )
                })}
              </div>
            </>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="rounded-xl border border-border/40 bg-card shadow-xs p-5 space-y-4">
          <div>
            <h3 className="text-sm font-bold font-heading text-heading">
              Acciones Rápidas
            </h3>
            <p className="text-xs text-muted-foreground/70">
              Accesos directos del sistema
            </p>
          </div>

          <div className="space-y-2">
            <Link href="/admin/whatsapp">
              <div className="group flex items-center gap-3 rounded-lg border border-border/40 bg-background p-3 transition-all duration-200 hover:border-emerald-200/60 hover:bg-emerald-50/40 hover:shadow-xs cursor-pointer">
                <div className="rounded-lg bg-emerald-50 p-2 transition-colors group-hover:bg-emerald-100/60">
                  <MessageSquare className="h-4 w-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-heading">WhatsApp</p>
                  <p className="text-[10px] text-muted-foreground/70 truncate">Conectar o verificar estado</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-emerald-500 transition-colors shrink-0" />
              </div>
            </Link>

            <Link href="/admin/metodos-pago">
              <div className="group flex items-center gap-3 rounded-lg border border-border/40 bg-background p-3 transition-all duration-200 hover:border-blue-200/60 hover:bg-blue-50/40 hover:shadow-xs cursor-pointer">
                <div className="rounded-lg bg-blue-50 p-2 transition-colors group-hover:bg-blue-100/60">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-heading">Métodos de Pago</p>
                  <p className="text-[10px] text-muted-foreground/70 truncate">{stats.paymentMethods} gateways activos</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-blue-500 transition-colors shrink-0" />
              </div>
            </Link>

            <Link href="/admin/configuracion">
              <div className="group flex items-center gap-3 rounded-lg border border-border/40 bg-background p-3 transition-all duration-200 hover:border-zinc-300/60 hover:bg-zinc-50/60 hover:shadow-xs cursor-pointer">
                <div className="rounded-lg bg-zinc-50 p-2 transition-colors group-hover:bg-zinc-100/60">
                  <Sliders className="h-4 w-4 text-zinc-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-heading">Configuración</p>
                  <p className="text-[10px] text-muted-foreground/70 truncate">SEO, contacto, redes</p>
                </div>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-zinc-500 transition-colors shrink-0" />
              </div>
            </Link>
          </div>

          <div className="rounded-lg border border-dashed border-primary/20 bg-primary/[0.03] p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Activity className="h-3.5 w-3.5 text-primary/60" />
              <p className="text-[11px] font-semibold tracking-wider text-primary/80 uppercase">
                Recordatorio SRI
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground/70 leading-relaxed">
              Las firmas electrónicas y tokenización del SRI deben actualizarse periódicamente. Verifica la vigencia de tus certificados.
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] text-muted-foreground/50">Recomendación del sistema</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
