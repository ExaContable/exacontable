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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-650">
            <Package className="h-3.5 w-3.5" />
            Catálogo de Productos
          </div>
          <h2 className="text-xl font-heading font-bold text-zinc-905 mt-1">
            Planes y Precios
          </h2>
          <p className="text-xs text-zinc-550">
            {plans.length} plan{plans.length !== 1 && "es"} en total
          </p>
        </div>
        <div className="flex items-center gap-3">
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

      {/* Desktop Table */}
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
            {filteredPlans.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-16 text-center text-xs text-zinc-500 font-medium"
                >
                  No hay planes en esta categoría. Crea uno nuevo.
                </TableCell>
              </TableRow>
            ) : (
              filteredPlans.map((plan) => {
                let badgeColor = "bg-neutral-500/10 text-neutral-450 border-neutral-500/20"
                if (plan.category === "sistema-contable") {
                  badgeColor = "bg-blue-50 text-blue-600 border-blue-200"
                } else if (plan.category === "facturacion-electronica") {
                  badgeColor = "bg-purple-50 text-purple-600 border-purple-200"
                } else if (plan.category === "servicios") {
                  badgeColor = "bg-red-55 text-red-650 border-red-200"
                }

                return (
                  <TableRow key={plan.id} className="border-zinc-200 hover:bg-zinc-50/50">
                    <TableCell>
                      <div>
                        <p className="font-bold text-zinc-900 text-xs">{plan.name}</p>
                        <p className="text-[10px] text-zinc-450 font-mono mt-0.5">{plan.slug}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`${badgeColor} text-[10px] px-2 py-0.5 font-bold`}
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
                              className="text-zinc-450 hover:text-zinc-900 hover:bg-zinc-100 h-8 w-8 rounded-lg"
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
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile list */}
      <div className="sm:hidden space-y-2">
        {filteredPlans.length === 0 ? (
          <p className="py-8 text-center text-xs text-zinc-500 font-medium">
            No hay planes en esta categoría. Crea uno nuevo.
          </p>
        ) : (
          filteredPlans.map((plan) => {
            let badgeColor = "bg-neutral-500/10 text-neutral-450 border-neutral-500/20"
            if (plan.category === "sistema-contable") {
              badgeColor = "bg-blue-50 text-blue-600 border-blue-200"
            } else if (plan.category === "facturacion-electronica") {
              badgeColor = "bg-purple-50 text-purple-600 border-purple-200"
            } else if (plan.category === "servicios") {
              badgeColor = "bg-red-55 text-red-650 border-red-200"
            }

            return (
              <div
                key={plan.id}
                className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm shadow-zinc-100/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-zinc-900 truncate">
                      {plan.name}
                    </p>
                    <p className="text-[10px] text-zinc-450 font-mono truncate mt-0.5">
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
                    className={`${badgeColor} text-[9px] px-1.5 py-0 font-bold`}
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
                <p className="text-xs font-mono font-bold text-zinc-900 mt-2">
                  ${plan.price.toFixed(2)}
                  <span className="text-[10px] text-zinc-500 font-sans font-normal ml-1">
                    {periodLabels[plan.period] || ""}
                  </span>
                </p>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
