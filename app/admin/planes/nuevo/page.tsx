"use client"

import { Suspense, useState, useEffect } from "react"
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, Plus, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const validFeatures = features.filter((f) => f.trim())

    try {
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

  if (loadingEdit) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-neutral-400" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/planes"
          className="text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h2 className="text-xl font-heading font-bold text-white">
          {isEditing ? "Editar Plan" : "Nuevo Plan"}
        </h2>
      </div>

      <Card className="border-neutral-800 bg-neutral-900/50">
        <CardHeader>
          <CardTitle className="text-lg text-white">
            Información del Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-neutral-300">
                  Nombre
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  required
                  placeholder="Plan Básico"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug" className="text-neutral-300">
                  Slug
                </Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  placeholder="plan-basico"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-neutral-300">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Descripción del plan..."
                className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus:border-red-500 focus:ring-red-500/20"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-neutral-300">
                  Precio ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  placeholder="29.99"
                  className="border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus:border-red-500 focus:ring-red-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-neutral-300">
                  Categoría
                </Label>
                <Select value={category} onValueChange={(value) => value && setCategory(value)} required>
                  <SelectTrigger className="border-neutral-700 bg-neutral-800 text-white focus:border-red-500 focus:ring-red-500/20">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-700 bg-neutral-900 text-neutral-200">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="period" className="text-neutral-300">
                  Período
                </Label>
                <Select value={period} onValueChange={(value) => value && setPeriod(value)} required>
                  <SelectTrigger className="border-neutral-700 bg-neutral-800 text-white focus:border-red-500 focus:ring-red-500/20">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="border-neutral-700 bg-neutral-900 text-neutral-200">
                    {periods.map((per) => (
                      <SelectItem key={per.value} value={per.value}>
                        {per.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-neutral-300">Características</Label>
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`Característica ${index + 1}`}
                    className="flex-1 border-neutral-700 bg-neutral-800 text-white placeholder:text-neutral-500 focus:border-red-500 focus:ring-red-500/20"
                  />
                  {features.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => removeFeature(index)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-600/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="border-neutral-700 text-neutral-300 hover:text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Agregar Característica
              </Button>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="isActive" className="text-neutral-300">
                Plan activo
              </Label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white hover:bg-red-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : isEditing ? (
                  "Actualizar Plan"
                ) : (
                  "Crear Plan"
                )}
              </Button>
              <Link href="/admin/planes">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-neutral-400 hover:text-white"
                >
                  Cancelar
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
