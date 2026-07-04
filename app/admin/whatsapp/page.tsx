import { QRScanner } from "@/components/admin/QRScanner"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MessageSquare } from "lucide-react"

export default function WhatsAppPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 text-zinc-900">
      <Card className="border-zinc-200 bg-white shadow-sm shadow-zinc-100/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-emerald-50 p-2">
              <MessageSquare className="h-5 w-5 text-emerald-650" />
            </div>
            <div>
              <CardTitle className="text-lg text-zinc-950 font-heading font-bold">
                Conexión WhatsApp
              </CardTitle>
              <CardDescription className="text-zinc-550 text-xs mt-0.5">
                Conecta tu WhatsApp para recibir notificaciones de pedidos en tiempo real
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <QRScanner />
        </CardContent>
      </Card>

      <Card className="border-zinc-200 bg-white shadow-sm shadow-zinc-100/50">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-zinc-950">
            Información del Servicio
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3.5 text-xs text-zinc-650 leading-relaxed">
          <p>
            El número configurado para recibir notificaciones es:{" "}
            <span className="text-zinc-900 font-mono font-bold bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
              +{process.env.NEXT_PUBLIC_WHATSAPP_TO || process.env.WHATSAPP_TO || "No configurado"}
            </span>
          </p>
          <p>
            Las notificaciones se envían automáticamente cuando se crea una
            nueva orden o se sube un comprobante de pago.
          </p>
          <p className="text-[11px] text-zinc-500 italic bg-zinc-50/50 p-2.5 rounded-lg border border-zinc-150">
            * El código QR se actualiza automáticamente cada 3 segundos.
            Escanea con la función de "Dispositivos vinculados" de WhatsApp.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
