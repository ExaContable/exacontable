"use client"

import { Suspense, useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Loader2,
  Plus,
  Trash2,
  Package,
  DollarSign,
  Tag,
  ListChecks,
  Eye,
  Check,
  GripVertical,
  Info,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { LazyMotion, m, domAnimation, AnimatePresence } from "framer-motion"

const categories = [
  { value: "sistema-contable", label: "Sistema Contable" },
  { value: "facturacion-electronica", label: "Facturación Electrónica" },
  { value: "servicios", label: "Servicios" },
]

const periods = [
  { value: "mensual", label: "Mensual" },
  { value: "anual", label: "Anual" },
  { value: "compra-total", label: "Compra Total" },
]

const periodLabels: Record<string, string> = {
  mensual: "/ mes",
  anual: "/ año",
  "compra-total": " único",
}

const categoryBadge: Record<string, string> = {
  "sistema-contable": "bg-blue-50 text-blue-600 border-blue-200",
  "facturacion-electronica": "bg-purple-50 text-purple-600 border-purple-200",
  "servicios": "bg-red-55 text-red-650 border-red-200",
}

export default function NuevoPlanPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    }>
      <NuevoPlanPage />
    </Suspense>
  )
}

function NuevoPlanPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get("id")
  const isEditing = !!editId

  const [loading, setLoading] = useState(false)
  const [loadingEdit, setLoadingEdit] = useState(isEditing)
  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [period, setPeriod] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [features, setFeatures] = useState<string[]>([""])

  useEffect(() => {
    if (editId) {
      fetch(`/api/admin/plans/${editId}`)
        .then((res) => res.json())
        .then((plan) => {
          setName(plan.name)
          setSlug(plan.slug)
          setDescription(plan.description || "")
          setPrice(String(plan.price))
          setCategory(plan.category)
          setPeriod(plan.period)
          setIsActive(plan.isActive)
          setFeatures(
            typeof plan.features === "string"
              ? JSON.parse(plan.features)
              : plan.features || [""]
          )
        })
        .finally(() => setLoadingEdit(false))
    }
  }, [editId])

  function generateSlug(name: string) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  }

  function handleNameChange(value: string) {
    setName(value)
    if (!isEditing) {
      setSlug(generateSlug(value))
    }
  }

  function addFeature() {
    setFeatures([...features, ""])
  }

  function removeFeature(index: number) {
    setFeatures(features.filter((_, i) => i !== index))
  }

  function updateFeature(index: number, value: string) {
    const updated = [...features]
    updated[index] = value
    setFeatures(updated)
  }

  const validFeatures = useMemo(() => features.filter((f) => f.trim()), [features])
  const hasFeatures = validFeatures.length > 0
  const isComplete = name && slug && price && category && period && hasFeatures

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const body = {
      name,
      slug,
      description,
      price: parseFloat(price),
      category,
      period,
      isActive,
      features: validFeatures,
    }

    try {
      let res: Response
      if (isEditing) {
        res = await fetch(`/api/admin/plans/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      } else {
        res = await fetch("/api/admin/plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
      }

      if (!res.ok) {
        const data = await res.json()
        toast.error(data.error || "Error al guardar el plan")
        return
      }

      toast.success(isEditing ? "Plan actualizado" : "Plan creado")
      router.push("/admin/planes")
      router.refresh()
    } catch {
      toast.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  function moveFeature(from: number, to: number) {
    if (to < 0 || to >= features.length) return
    const updated = [...features]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)
    setFeatures(updated)
  }

  if (loadingEdit) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          <p className="text-sm text-zinc-500 font-medium">Cargando plan...</p>
        </div>
      </div>
    )
  }

  return (
    <LazyMotion features={domAnimation}>
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/planes"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-400 hover:text-zinc-900 hover:border-zinc-300 transition-all shadow-sm"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-650">
              <Package className="h-3.5 w-3.5" />
              {isEditing ? "Editar Plan" : "Nuevo Plan"}
            </div>
            <h2 className="text-xl font-heading font-bold text-zinc-900 mt-0.5">
              {isEditing ? `Editando: ${name || "Sin nombre"}` : "Crear un nuevo plan"}
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              {isEditing
                ? "Modifica los campos y guarda los cambios."
                : "Completa la información para agregar un plan al catálogo."
              }
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Section: Información Básica */}
            <Card className="border-zinc-200 bg-white shadow-sm shadow-zinc-100/50 overflow-hidden">
              <div className="border-b border-zinc-100 bg-zinc-50/80 px-5 py-3.5 flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50">
                  <Info className="h-3.5 w-3.5 text-red-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-700">Información Básica</span>
                  <p className="text-[10px] text-zinc-400">Nombre, slug y descripción del plan</p>
                </div>
              </div>
              <CardContent className="p-5 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs font-bold text-zinc-700">
                      Nombre del Plan <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                      placeholder="Plan Básico"
                      className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500/20 transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="slug" className="text-xs font-bold text-zinc-700">
                      Slug <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      required
                      placeholder="plan-basico"
                      className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500/20 transition-colors font-mono"
                    />
                    {!isEditing && name && (
                      <p className="text-[10px] text-zinc-400 mt-1">
                        Generado automáticamente desde el nombre
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description" className="text-xs font-bold text-zinc-700">
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe brevemente lo que incluye este plan..."
                    className="border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500/20 transition-colors resize-none"
                  />
                  <p className="text-[10px] text-zinc-400 text-right">
                    {description.length} caracteres
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Section: Precio y Configuración */}
            <Card className="border-zinc-200 bg-white shadow-sm shadow-zinc-100/50 overflow-hidden mt-6">
              <div className="border-b border-zinc-100 bg-zinc-50/80 px-5 py-3.5 flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
                  <DollarSign className="h-3.5 w-3.5 text-amber-600" />
                </div>
                <div>
                  <span className="text-xs font-bold text-zinc-700">Precio y Configuración</span>
                  <p className="text-[10px] text-zinc-400">Valor, categoría, período y estado</p>
                </div>
              </div>
              <CardContent className="p-5 space-y-5">
                <div className="grid gap-5 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="price" className="text-xs font-bold text-zinc-700">
                      Precio ($) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-zinc-400 font-medium">$</span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        placeholder="29.99"
                        className="h-9 pl-7 border-zinc-200 bg-white text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500/20 transition-colors"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="category" className="text-xs font-bold text-zinc-700">
                      Categoría <span className="text-red-500">*</span>
                    </Label>
                    <Select value={category} onValueChange={(value) => value && setCategory(value)} required>
                      <SelectTrigger className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 focus:border-red-500 focus:ring-red-500/20">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-200 bg-white text-zinc-700">
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="period" className="text-xs font-bold text-zinc-700">
                      Período <span className="text-red-500">*</span>
                    </Label>
                    <Select value={period} onValueChange={(value) => value && setPeriod(value)} required>
                      <SelectTrigger className="h-9 border-zinc-200 bg-white text-sm text-zinc-900 focus:border-red-500 focus:ring-red-500/20">
                        <SelectValue placeholder="Seleccionar" />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-200 bg-white text-zinc-700">
                        {periods.map((per) => (
                          <SelectItem key={per.value} value={per.value}>
                            {per.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-zinc-100 bg-zinc-50/50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      id="isActive"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                      className="data-[state=checked]:bg-red-600"
                    />
                    <div>
                      <Label htmlFor="isActive" className="text-xs font-bold text-zinc-700 cursor-pointer">
                        Plan activo
                      </Label>
                      <p className="text-[10px] text-zinc-400">
                        {isActive ? "Visible para los clientes en la página" : "Oculto del catálogo público"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      isActive
                        ? "bg-emerald-50 text-emerald-600 border-emerald-250 text-[10px] font-bold"
                        : "bg-zinc-100 text-zinc-500 border-zinc-200 text-[10px] font-bold"
                    }
                    variant="outline"
                  >
                    {isActive ? "Visible" : "Oculto"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Section: Características */}
            <Card className="border-zinc-200 bg-white shadow-sm shadow-zinc-100/50 overflow-hidden mt-6">
              <div className="border-b border-zinc-100 bg-zinc-50/80 px-5 py-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50">
                    <ListChecks className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-zinc-700">Características</span>
                    <p className="text-[10px] text-zinc-400">
                      {validFeatures.length} característica{validFeatures.length !== 1 && "s"} agregada{validFeatures.length !== 1 && "s"}
                    </p>
                  </div>
                </div>
                {hasFeatures && (
                  <Badge variant="outline" className="text-[10px] font-bold border-zinc-200 text-zinc-600 bg-white">
                    {validFeatures.length} / 8
                  </Badge>
                )}
              </div>
              <CardContent className="p-5 space-y-3">
                {features.length === 0 || (features.length === 1 && !features[0]) ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-50 border border-dashed border-zinc-200">
                      <ListChecks className="h-5 w-5 text-zinc-300" />
                    </div>
                    <p className="text-xs font-medium text-zinc-500">Sin características</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5 max-w-[200px]">
                      Agrega las características que incluye este plan
                    </p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {features.map((feature, index) => (
                      <m.div
                        key={`feature-${index}`}
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center gap-2 group"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0 rounded-lg border border-zinc-200 bg-white px-3 py-2 transition-all group-hover:border-zinc-300 group-hover:shadow-sm">
                          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          <input
                            value={feature}
                            onChange={(e) => updateFeature(index, e.target.value)}
                            placeholder={`Ej: ${index === 0 ? "1 Usuario incluido" : index === 1 ? "Facturación Ilimitada" : "Soporte 24/7"}`}
                            className="flex-1 bg-transparent text-sm text-zinc-900 outline-none placeholder:text-zinc-400 min-w-0"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (index > 0) moveFeature(index, index - 1)
                            }}
                            disabled={index === 0}
                            className="p-0.5 text-zinc-300 hover:text-zinc-500 disabled:opacity-0 disabled:cursor-default transition-colors"
                          >
                            <GripVertical className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        {features.length > 1 && (
                          <m.button
                            type="button"
                            onClick={() => removeFeature(index)}
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-transparent text-zinc-300 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </m.button>
                        )}
                      </m.div>
                    ))}
                  </AnimatePresence>
                )}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addFeature}
                  disabled={validFeatures.length >= 8}
                  className="w-full border-dashed border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 hover:bg-zinc-50 text-xs font-semibold py-2 h-auto transition-all"
                >
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  {validFeatures.length >= 8 ? "Máximo 8 características" : "Agregar Característica"}
                </Button>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-4 mt-6 border-t border-zinc-100">
              <Link href="/admin/planes">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 text-xs font-semibold"
                >
                  Cancelar
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={loading || !isComplete}
                className="bg-red-600 text-white hover:bg-red-500 shadow-sm shadow-red-200/50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold px-6 py-2.5 h-auto transition-all"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : isEditing ? (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Actualizar Plan
                  </>
                ) : (
                  <>
                    <Package className="mr-2 h-4 w-4" />
                    Crear Plan
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500">
              <Eye className="h-3.5 w-3.5" />
              Vista Previa
            </div>
            <div className="rounded-xl border border-zinc-200 bg-white shadow-sm shadow-zinc-100/50 overflow-hidden transition-all duration-300">
              <div className="relative flex flex-col p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600 text-white shadow-sm">
                    <Package className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 font-heading">
                    {name || "Nombre del Plan"}
                  </h3>
                </div>

                <div className="mb-4 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-zinc-900 font-mono">
                    {price ? `$${parseFloat(price).toFixed(2)}` : "$0.00"}
                  </span>
                  <span className="text-xs text-zinc-500">
                    {periodLabels[period] || ""}
                  </span>
                </div>

                {description && (
                  <p className="text-xs text-zinc-500 mb-4 leading-relaxed line-clamp-2">
                    {description}
                  </p>
                )}

                {hasFeatures ? (
                  <div className="space-y-2">
                    {validFeatures.slice(0, 6).map((f, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        <span className="text-xs text-zinc-600 leading-tight">{f}</span>
                      </div>
                    ))}
                    {validFeatures.length > 6 && (
                      <p className="text-[10px] text-zinc-400 font-medium pl-5.5">
                        +{validFeatures.length - 6} características más
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-zinc-200 p-4 text-center">
                    <p className="text-[10px] text-zinc-400">
                      Las características aparecerán aquí
                    </p>
                  </div>
                )}

                <div className="mt-5">
                  <div className="w-full rounded-lg bg-red-600 py-2.5 text-center text-xs font-bold text-white shadow-sm">
                    {period === "compra-total" ? "Comprar Plan" : "Contratar Plan"}
                  </div>
                </div>
              </div>

              {/* Badge summary at bottom */}
              <div className="border-t border-zinc-100 bg-zinc-50/80 px-4 py-2.5 flex items-center gap-2 flex-wrap">
                {category && (
                  <Badge variant="outline" className={`${categoryBadge[category] || "bg-zinc-100 text-zinc-600 border-zinc-200"} text-[9px] px-1.5 py-0 font-bold`}>
                    {categories.find(c => c.value === category)?.label || category}
                  </Badge>
                )}
                {period && (
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-bold bg-white border-zinc-200 text-zinc-600">
                    {periods.find(p => p.value === period)?.label || period}
                  </Badge>
                )}
                <Badge
                  className={
                    isActive
                      ? "bg-emerald-50 text-emerald-600 border-emerald-250 text-[9px] font-bold"
                      : "bg-zinc-100 text-zinc-500 border-zinc-200 text-[9px] font-bold"
                  }
                  variant="outline"
                >
                  {isActive ? "Activo" : "Inactivo"}
                </Badge>
                {validFeatures.length > 0 && (
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-bold bg-white border-zinc-200 text-zinc-500">
                    {validFeatures.length} características
                  </Badge>
                )}
              </div>
            </div>

            <div className="rounded-lg border border-dashed border-zinc-200 bg-zinc-50/50 p-4">
              <div className="flex items-start gap-2.5">
                <Info className="h-4 w-4 shrink-0 text-zinc-400 mt-0.5" />
                <div className="text-[10px] text-zinc-500 leading-relaxed">
                  <p className="font-medium text-zinc-600 mb-1">¿Cómo se verá?</p>
                  <p>Este panel muestra una vista previa en tiempo real de cómo se verá el plan en la página principal. Los cambios se reflejan automáticamente.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </LazyMotion>
  )
}
