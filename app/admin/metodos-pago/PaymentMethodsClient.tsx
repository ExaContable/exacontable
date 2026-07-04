"use client"

import { useState } from "react"
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
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Settings, ShieldCheck, Plus, CreditCard, HelpCircle } from "lucide-react"
import { toast } from "sonner"

interface PaymentMethod {
  id: string
  name: string
  code: string
  description: string | null
  isActive: boolean
  isSandbox: boolean
  config: string | null
  commission: number | null
  lastValidatedAt: string | null
}

export function PaymentMethodsClient({
  methods: initialMethods,
}: {
  methods: PaymentMethod[]
}) {
  const [methods, setMethods] = useState(initialMethods)
  const [validating, setValidating] = useState<string | null>(null)
  const [editingConfig, setEditingConfig] = useState<PaymentMethod | null>(null)
  const [configForm, setConfigForm] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState("")
  const [newCode, setNewCode] = useState("")
  const [creating, setCreating] = useState(false)

  async function toggleActive(method: PaymentMethod) {
    try {
      const res = await fetch(`/api/admin/payment-methods/${method.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !method.isActive }),
      })
      if (res.ok) {
        setMethods((prev) =>
          prev.map((m) =>
            m.id === method.id ? { ...m, isActive: !m.isActive } : m
          )
        )
        toast.success(`Método ${method.name} ${!method.isActive ? "activado" : "desactivado"}`)
      } else {
        toast.error("Error al actualizar estado")
      }
    } catch {
      toast.error("Error de conexión")
    }
  }

  async function handleValidate(id: string) {
    setValidating(id)
    try {
      const res = await fetch(`/api/admin/payment-methods/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lastValidatedAt: new Date().toISOString(),
        }),
      })
      if (res.ok) {
        setMethods((prev) =>
          prev.map((m) =>
            m.id === id
              ? { ...m, lastValidatedAt: new Date().toISOString() }
              : m
          )
        )
        toast.success("Gateway de pago verificado con éxito")
      } else {
        toast.error("Error al validar el método de pago")
      }
    } catch {
      toast.error("Error de conexión")
    } finally {
      setValidating(null)
    }
  }

  async function saveConfig() {
    if (!editingConfig) return
    try {
      const res = await fetch(
        `/api/admin/payment-methods/${editingConfig.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ config: configForm }),
        }
      )
      if (res.ok) {
        setMethods((prev) =>
          prev.map((m) =>
            m.id === editingConfig.id ? { ...m, config: configForm } : m
          )
        )
        setEditingConfig(null)
        toast.success("Configuración guardada")
      } else {
        toast.error("Error al guardar configuración")
      }
    } catch {
      toast.error("Error de conexión")
    }
  }

  async function handleCreate() {
    if (!newName || !newCode) {
      toast.error("Por favor completa los campos requeridos")
      return
    }
    setCreating(true)
    try {
      const res = await fetch("/api/admin/payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, code: newCode }),
      })
      if (res.ok) {
        const created = await res.json()
        setMethods((prev) => [...prev, created])
        setShowNew(false)
        setNewName("")
        setNewCode("")
        toast.success("Método de pago creado con éxito")
      } else {
        const data = await res.json()
        toast.error(data.error || "Error al crear")
      }
    } catch {
      toast.error("Error de conexión")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-650">
            <CreditCard className="h-3.5 w-3.5" />
            Pasarelas de Pago
          </div>
          <h2 className="text-xl font-heading font-bold text-zinc-950 mt-1">
            Métodos de Pago
          </h2>
          <p className="text-xs text-zinc-550">
            {methods.length} pasarela{methods.length !== 1 && "s"} de pago disponibles
          </p>
        </div>
        <div>
          <Dialog open={showNew} onOpenChange={setShowNew}>
            <DialogTrigger render={<Button size="sm" className="bg-red-600 text-white hover:bg-red-500 text-xs font-semibold px-4 rounded-lg shadow-sm shadow-red-50/20" />}>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Método
            </DialogTrigger>
            <DialogContent className="border-zinc-200 bg-white text-zinc-900 max-w-sm">
              <DialogHeader>
                <DialogTitle className="text-zinc-955 font-heading font-bold">Nuevo Gateway de Pago</DialogTitle>
                <DialogDescription className="text-zinc-500 text-xs">
                  Agrega una pasarela de pago para conectar con el checkout de tu sitio.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-700 font-semibold">Nombre del Método</Label>
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ej: Payphone Box"
                    className="border-zinc-200 bg-white text-zinc-900 text-xs placeholder:text-zinc-400 focus:border-red-500"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-zinc-700 font-semibold">Código Slug</Label>
                  <Input
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Ej: payphonebox"
                    className="border-zinc-200 bg-white text-zinc-900 text-xs placeholder:text-zinc-400 font-mono focus:border-red-500"
                  />
                </div>
                <Button
                  onClick={handleCreate}
                  disabled={creating}
                  className="w-full bg-red-600 text-white hover:bg-red-500 mt-2 text-xs rounded-lg"
                >
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Crear Pasarela"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Grid Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm shadow-zinc-100/50">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-200 hover:bg-transparent bg-zinc-50">
              <TableHead className="text-zinc-500 text-xs font-bold">Pasarela</TableHead>
              <TableHead className="text-zinc-500 text-xs font-bold">Estado</TableHead>
              <TableHead className="text-zinc-500 text-xs font-bold">Entorno</TableHead>
              <TableHead className="text-zinc-500 text-xs font-bold">Comisión</TableHead>
              <TableHead className="text-zinc-500 text-xs font-bold">Última Validación</TableHead>
              <TableHead className="w-24 text-zinc-500 text-xs font-bold text-center pr-4">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-16 text-center text-xs text-zinc-500 font-medium"
                >
                  No hay métodos de pago configurados. Crea uno nuevo para comenzar.
                </TableCell>
              </TableRow>
            ) : (
              methods.map((method) => (
                <TableRow key={method.id} className="border-zinc-200 hover:bg-zinc-50/50">
                  <TableCell>
                    <div>
                      <p className="font-bold text-zinc-900 text-xs">{method.name}</p>
                      <p className="text-[10px] text-zinc-450 font-mono mt-0.5">{method.code}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={method.isActive}
                        onCheckedChange={() => toggleActive(method)}
                        className="data-[state=checked]:bg-red-650"
                      />
                      <Badge
                        className={
                          method.isActive
                            ? "bg-emerald-50 text-emerald-600 border-emerald-250 text-[10px] font-bold"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 text-[10px] font-bold"
                        }
                        variant="outline"
                      >
                        {method.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        method.isSandbox
                          ? "border-amber-200 text-amber-600 bg-amber-50/50 text-[10px] px-2 font-bold"
                          : "border-blue-200 text-blue-600 bg-blue-50/50 text-[10px] px-2 font-bold"
                      }
                    >
                      {method.isSandbox ? "Sandbox" : "Producción"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-900 text-xs font-mono font-bold">
                    {method.commission !== null ? `${method.commission.toFixed(2)}%` : "0.00%"}
                  </TableCell>
                  <TableCell>
                    {method.lastValidatedAt ? (
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs text-zinc-700 font-medium">
                          {new Date(method.lastValidatedAt).toLocaleDateString("es-EC", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-zinc-500 flex items-center gap-1">
                        <HelpCircle className="h-3.5 w-3.5 text-zinc-400" />
                        No validado
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-center pr-4">
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingConfig(method)
                          setConfigForm(method.config || "")
                        }}
                        className="text-zinc-450 hover:text-zinc-900 hover:bg-zinc-100 h-8 w-8 rounded-lg"
                      >
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleValidate(method.id)}
                        disabled={validating === method.id}
                        className="text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 h-8 w-8 rounded-lg"
                      >
                        {validating === method.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ShieldCheck className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Editing Config Dialog */}
      <Dialog
        open={!!editingConfig}
        onOpenChange={(open) => !open && setEditingConfig(null)}
      >
        <DialogContent className="border-zinc-200 bg-white text-zinc-900 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-zinc-950 font-heading font-bold">Configurar {editingConfig?.name}</DialogTitle>
            <DialogDescription className="text-zinc-500 text-xs">
              Introduce las credenciales e integraciones en formato JSON.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-xs text-zinc-700 font-semibold">Configuración JSON</Label>
              <Textarea
                value={configForm}
                onChange={(e) => setConfigForm(e.target.value)}
                rows={7}
                className="border-zinc-200 bg-white text-xs text-zinc-900 font-mono focus:border-red-500 focus:ring-red-500/10 placeholder:text-zinc-400 leading-relaxed resize-none"
                placeholder='{\n  "clientId": "...",\n  "clientSecret": "..."\n}'
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                onClick={() => setEditingConfig(null)}
                className="text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 text-xs"
              >
                Cancelar
              </Button>
              <Button
                onClick={saveConfig}
                className="bg-red-600 text-white hover:bg-red-500 text-xs rounded-lg"
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
