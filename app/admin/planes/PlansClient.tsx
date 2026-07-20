"use client"

import { useState, useMemo } from "react"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  Loader2,
  Package,
  LayoutGrid,
  List,
  Check,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

const categoryLabels: Record<string, string> = {
  "sistema-contable": "Sistema Contable",
  "facturacion-electronica": "Facturación Electrónica",
  "servicios": "Servicios",
}

const categoryTabs = [
  { value: "todas", label: "Todas" },
  { value: "sistema-contable", label: "Sistema Contable" },
  { value: "facturacion-electronica", label: "Facturación Electrónica" },
  { value: "servicios", label: "Servicios" },
]

const periodLabels: Record<string, string> = {
  mensual: "/ mes",
  anual: "/ año",
  "compra-total": " único",
}

const categoryBadgeColors: Record<string, string> = {
  "sistema-contable": "bg-blue-50 text-blue-600 border-blue-200",
  "facturacion-electronica": "bg-purple-50 text-purple-600 border-purple-200",
  "servicios": "bg-red-55 text-red-650 border-red-200",
}

const periodBadgeColors: Record<string, string> = {
  mensual: "bg-amber-50 text-amber-600 border-amber-200",
  anual: "bg-sky-50 text-sky-600 border-sky-200",
  "compra-total": "bg-violet-50 text-violet-600 border-violet-200",
}

interface Plan {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  category: string
  period: string
  features: string[]
  isActive: boolean
  sortOrder: number
}

export function PlansClient({ plans: initialPlans }: { plans: Plan[] }) {
  const router = useRouter()
  const [plans, setPlans] = useState(initialPlans)
  const [activeTab, setActiveTab] = useState("todas")
  const [deleting, setDeleting] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "grid">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("admin_plans_view")
      if (saved === "grid" || saved === "list") return saved
    }
    return "list"
  })

  function toggleView(mode: "list" | "grid") {
    setViewMode(mode)
    localStorage.setItem("admin_plans_view", mode)
  }

  const filteredPlans = useMemo(
    () =>
      activeTab === "todas"
        ? plans
        : plans.filter((p) => p.category === activeTab),
    [plans, activeTab]
  )

  async function handleDelete(id: string) {
    if (!confirm("¿Estás seguro de eliminar este plan?")) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/admin/plans/${id}`, { method: "DELETE" })
      if (res.ok) {
        setPlans((prev) => prev.filter((p) => p.id !== id))
        toast.success("Plan eliminado")
      } else {
        toast.error("Error al eliminar el plan")
      }
    } catch {
      toast.error("Error de conexión")
    } finally {
      setDeleting(null)
    }
  }

  function getCategoryBadge(category: string) {
    return categoryBadgeColors[category] || "bg-neutral-500/10 text-neutral-450 border-neutral-500/20"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-650">
            <Package className="h-3.5 w-3.5" />
            Catálogo de Productos
          </div>
          <h2 className="text-xl font-heading font-bold text-zinc-900 mt-1">
            Planes y Precios
          </h2>
          <p className="text-xs text-zinc-500">
            {plans.length} plan{plans.length !== 1 && "es"} en total
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center rounded-lg border border-zinc-200 bg-white p-0.5 shadow-sm">
            <button
              onClick={() => toggleView("list")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === "list"
                  ? "bg-zinc-100 text-zinc-900 shadow-xs"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
              title="Vista de lista"
            >
              <List className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Lista</span>
            </button>
            <button
              onClick={() => toggleView("grid")}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === "grid"
                  ? "bg-zinc-100 text-zinc-900 shadow-xs"
                  : "text-zinc-400 hover:text-zinc-600"
              }`}
              title="Vista de cuadrícula"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grid</span>
            </button>
          </div>
          <Link href="/admin/planes/nuevo">
            <Button size="sm" className="bg-red-600 text-white hover:bg-red-500 text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm shadow-red-50/20">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Plan
            </Button>
          </Link>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 border-b border-zinc-200 overflow-x-auto">
        {categoryTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`relative px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? "text-red-650"
                : "text-zinc-500 hover:text-zinc-800"
            }`}
          >
            {tab.label}
            {activeTab === tab.value && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-650 rounded-full" />
            )}
          </button>
        ))}
        <div className="ml-auto text-[10px] text-zinc-400 font-medium px-2">
          {filteredPlans.length} plan{filteredPlans.length !== 1 && "es"}
        </div>
      </div>

      {/* Empty state */}
      {filteredPlans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100">
            <Package className="h-8 w-8 text-zinc-400" />
          </div>
          <h3 className="text-sm font-bold text-zinc-900">No hay planes</h3>
          <p className="mt-1 text-xs text-zinc-500 max-w-xs">
            No hay planes en esta categoría. Crea uno nuevo para empezar.
          </p>
          <Link href="/admin/planes/nuevo" className="mt-4">
            <Button size="sm" className="bg-red-600 text-white hover:bg-red-500 text-xs font-semibold">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Plan
            </Button>
          </Link>
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && filteredPlans.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="group relative rounded-xl border border-zinc-200 bg-white p-5 shadow-sm shadow-zinc-100/50 transition-all hover:shadow-md hover:border-zinc-300"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-zinc-900 truncate">
                    {plan.name}
                  </h3>
                  <p className="text-[10px] text-zinc-400 font-mono truncate">
                    {plan.slug}
                  </p>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/admin/planes/nuevo?id=${plan.id}`)}
                    className="h-7 w-7 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(plan.id)}
                    disabled={deleting === plan.id}
                    className="h-7 w-7 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    {deleting === plan.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                <Badge
                  variant="outline"
                  className={`${getCategoryBadge(plan.category)} text-[9px] px-1.5 py-0 font-bold`}
                >
                  {categoryLabels[plan.category] || plan.category}
                </Badge>
                <Badge
                  variant="outline"
                  className={`${periodBadgeColors[plan.period] || "bg-zinc-50 text-zinc-500 border-zinc-200"} text-[9px] px-1.5 py-0 font-bold`}
                >
                  {periodLabels[plan.period] || plan.period}
                </Badge>
                <Badge
                  className={
                    plan.isActive
                      ? "bg-emerald-50 text-emerald-600 border-emerald-250 text-[9px] font-bold"
                      : "bg-zinc-100 text-zinc-500 border-zinc-200 text-[9px] font-bold"
                  }
                  variant="outline"
                >
                  {plan.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>

              <div className="mb-3">
                <span className="text-xl font-extrabold text-zinc-900 font-mono">
                  ${plan.price.toFixed(2)}
                </span>
                <span className="text-[10px] text-zinc-500 ml-1">
                  {periodLabels[plan.period] || ""}
                </span>
              </div>

              {plan.features && plan.features.length > 0 && (
                <div className="space-y-1">
                  {plan.features.slice(0, 4).map((f, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <Check className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                      <span className="text-[10px] text-zinc-600 leading-tight">{f}</span>
                    </div>
                  ))}
                  {plan.features.length > 4 && (
                    <p className="text-[9px] text-zinc-400 font-medium pl-5">
                      +{plan.features.length - 4} más
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* List View (Desktop Table) */}
      {viewMode === "list" && filteredPlans.length > 0 && (
        <div className="hidden sm:block rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm shadow-zinc-100/50">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-200 hover:bg-transparent bg-zinc-50">
                <TableHead className="text-zinc-500 text-xs font-bold">Nombre del Plan</TableHead>
                <TableHead className="text-zinc-500 text-xs font-bold">Categoría</TableHead>
                <TableHead className="text-zinc-500 text-xs font-bold">Precio</TableHead>
                <TableHead className="text-zinc-500 text-xs font-bold">Estado</TableHead>
                <TableHead className="w-16 text-zinc-500 text-xs font-bold text-right pr-6">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPlans.map((plan) => (
                <TableRow key={plan.id} className="border-zinc-200 hover:bg-zinc-50/50">
                  <TableCell>
                    <div>
                      <p className="font-bold text-zinc-900 text-xs">{plan.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono mt-0.5">{plan.slug}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`${getCategoryBadge(plan.category)} text-[10px] px-2 py-0.5 font-bold`}
                    >
                      {categoryLabels[plan.category] || plan.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-900 text-xs">
                    <span className="font-bold font-mono">${plan.price.toFixed(2)}</span>
                    <span className="text-[10px] text-zinc-500 ml-1">
                      {periodLabels[plan.period] || ""}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        plan.isActive
                          ? "bg-emerald-50 text-emerald-600 border-emerald-250 text-[10px] font-bold"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 text-[10px] font-bold"
                      }
                      variant="outline"
                    >
                      {plan.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 h-8 w-8 rounded-lg"
                          />
                        }
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="border-zinc-200 bg-white text-zinc-700 shadow-md"
                      >
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/admin/planes/nuevo?id=${plan.id}`)
                          }
                          className="hover:bg-zinc-50 hover:text-zinc-950 cursor-pointer text-xs font-medium"
                        >
                          <Pencil className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                          Editar Plan
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDelete(plan.id)}
                          disabled={deleting === plan.id}
                          className="text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer text-xs font-semibold"
                        >
                          <Trash2 className="mr-2 h-3.5 w-3.5" />
                          {deleting === plan.id ? "Eliminando..." : "Eliminar Plan"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Mobile list (always card-based) */}
      {filteredPlans.length > 0 && (
        <div className="sm:hidden space-y-2">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm shadow-zinc-100/50"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-zinc-900 truncate">
                    {plan.name}
                  </p>
                  <p className="text-[10px] text-zinc-400 font-mono truncate mt-0.5">
                    {plan.slug}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => router.push(`/admin/planes/nuevo?id=${plan.id}`)}
                    className="h-8 w-8 text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(plan.id)}
                    disabled={deleting === plan.id}
                    className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    {deleting === plan.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge
                  variant="outline"
                  className={`${getCategoryBadge(plan.category)} text-[9px] px-1.5 py-0 font-bold`}
                >
                  {categoryLabels[plan.category] || plan.category}
                </Badge>
                <Badge
                  className={
                    plan.isActive
                      ? "bg-emerald-50 text-emerald-600 border-emerald-250 text-[9px] font-bold"
                      : "bg-zinc-100 text-zinc-500 border-zinc-200 text-[9px] font-bold"
                  }
                  variant="outline"
                >
                  {plan.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <p className="text-sm font-mono font-bold text-zinc-900 mt-2">
                ${plan.price.toFixed(2)}
                <span className="text-[10px] text-zinc-500 font-sans font-normal ml-1">
                  {periodLabels[plan.period] || ""}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
