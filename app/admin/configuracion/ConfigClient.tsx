"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Save, Loader2, Globe, Mail, Phone, MessageSquare, FileText, Settings2, Share2 } from "lucide-react"
import { toast } from "sonner"

const metadataFields = [
  {
    key: "site_title",
    label: "Título del Sitio",
    type: "text",
    icon: FileText,
    placeholder: "EXA Contable",
  },
  {
    key: "site_description",
    label: "Descripción SEO",
    type: "textarea",
    icon: FileText,
    placeholder: "Descripción del sitio...",
  },
  {
    key: "meta_keywords",
    label: "Meta Keywords SEO",
    type: "text",
    icon: FileText,
    placeholder: "sistema contable, ecuador, facturación electrónica",
  },
]

const contactFields = [
  {
    key: "contact_email",
    label: "Email de Soporte / Ventas",
    type: "email",
    icon: Mail,
    placeholder: "info@exacontable.com",
  },
  {
    key: "contact_phone",
    label: "Teléfono de Contacto",
    type: "text",
    icon: Phone,
    placeholder: "+593 97 883 5575",
  },
  {
    key: "whatsapp_number",
    label: "Número de WhatsApp Bot",
    type: "text",
    icon: MessageSquare,
    placeholder: "593978835575",
  },
]

const socialFields = [
  {
    key: "instagram_url",
    label: "Enlace de Instagram",
    type: "url",
    icon: Globe,
    placeholder: "https://instagram.com/exacontable",
  },
  {
    key: "facebook_url",
    label: "Enlace de Facebook",
    type: "url",
    icon: Globe,
    placeholder: "https://facebook.com/exacontable",
  },
]

export function ConfigClient({
  initialConfig,
}: {
  initialConfig: Record<string, string>
}) {
  const [config, setConfig] = useState(initialConfig)
  const [saving, setSaving] = useState(false)

  function handleChange(key: string, value: string) {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })
      if (res.ok) {
        toast.success("Configuración guardada exitosamente")
      } else {
        toast.error("Error al guardar la configuración")
      }
    } catch {
      toast.error("Error de conexión")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-red-655">
            <Settings2 className="h-3.5 w-3.5" />
            Panel del Sistema
          </div>
          <h2 className="text-xl font-heading font-bold text-zinc-950 mt-1">
            Configuración General
          </h2>
          <p className="text-xs text-zinc-550">
            Personaliza los metadatos SEO, correos y redes de EXA Contable
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Metadatos SEO */}
        <Card className="border-zinc-200 bg-white shadow-sm shadow-zinc-100/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-600" />
              Metadatos y SEO
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Configura los títulos y descripciones del sitio que leen los buscadores.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {metadataFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label className="text-xs text-zinc-700 font-semibold">{field.label}</Label>
                {field.type === "textarea" ? (
                  <Textarea
                    value={config[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className="border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500/10 leading-relaxed"
                  />
                ) : (
                  <Input
                    type={field.type}
                    value={config[field.key] || ""}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500/10 font-sans"
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Canales de Contacto */}
        <Card className="border-zinc-200 bg-white shadow-sm shadow-zinc-100/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <Mail className="h-4 w-4 text-emerald-600" />
              Canales de Comunicación
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Datos para el pie de página, formularios de contacto y alertas automatizadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contactFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label className="text-xs text-zinc-700 font-semibold">{field.label}</Label>
                <Input
                  type={field.type}
                  value={config[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500/10 font-sans"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Redes Sociales */}
        <Card className="border-zinc-200 bg-white shadow-sm shadow-zinc-100/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-zinc-950 flex items-center gap-2">
              <Share2 className="h-4 w-4 text-blue-600" />
              Redes Sociales
            </CardTitle>
            <CardDescription className="text-xs text-zinc-500">
              Modifica los enlaces externos que enlazan con tus comunidades.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialFields.map((field) => (
              <div key={field.key} className="space-y-1.5">
                <Label className="text-xs text-zinc-700 font-semibold">{field.label}</Label>
                <Input
                  type={field.type}
                  value={config[field.key] || ""}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="border-zinc-200 bg-white text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-red-500 focus:ring-red-500/10 font-mono"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-red-600 text-white hover:bg-red-500 px-6 py-2.5 text-xs font-semibold rounded-lg shadow-sm shadow-red-50/20"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando Cambios...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Todo
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
