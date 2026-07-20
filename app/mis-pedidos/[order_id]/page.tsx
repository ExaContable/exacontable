"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  ArrowLeft,
  AlertCircle,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface BankAccount {
  bank_name: string;
  account_name: string;
  account_number: string;
  account_ruc: string;
}

interface OrderData {
  id: number;
  order_number: string;
  status: string;
  payment_method: string;
  payment_method_title: string;
  date_created: string;
  total: string;
  currency: string;
  billing: {
    first_name: string;
    last_name: string;
    email: string;
  };
  line_items: { name: string; quantity: number; price: number }[];
  receipt_url: string | null;
  billing_fields: Record<string, string>;
  bank_accounts: BankAccount[];
  date_paid: string | null;
}

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  "on-hold": { label: "Pendiente de pago", icon: Clock, color: "text-amber-500" },
  pending: { label: "Pendiente", icon: Clock, color: "text-amber-500" },
  processing: { label: "Procesando pago", icon: AlertCircle, color: "text-blue-500" },
  completed: { label: "Pago verificado", icon: CheckCircle, color: "text-green-500" },
  cancelled: { label: "Cancelado", icon: XCircle, color: "text-red-500" },
  refunded: { label: "Reembolsado", icon: XCircle, color: "text-red-500" },
  failed: { label: "Fallido", icon: XCircle, color: "text-red-500" },
};



export default function MisPedidosPage() {
  const params = useParams();
  const orderId = params.order_id as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (!res.ok) throw new Error("Error al obtener el pedido");
        const data = await res.json();
        if (!cancelled) {
          setOrder(data);
          if (data.receipt_url) setUploaded(true);
        }
      } catch {
        if (!cancelled) {
          setError("No pudimos encontrar tu pedido. Verifica el numero e intenta de nuevo.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrder();
    return () => { cancelled = true; };
  }, [orderId]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const file = (form.elements.namedItem("file") as HTMLInputElement).files?.[0];
    if (!file) {
      toast.error("Selecciona un archivo");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("order_id", orderId);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al subir el archivo");

      toast.success("Comprobante subido exitosamente");
      setUploaded(true);
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch {
        // silent
      }
    } catch {
      toast.error("Error al subir el comprobante");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center pt-16">
        <p className="text-muted-foreground">Cargando pedido...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-4 pt-16">
        <XCircle className="h-16 w-16 text-red-400" />
        <h1 className="text-2xl font-bold">Pedido no encontrado</h1>
        <p className="max-w-md text-center text-muted-foreground">{error}</p>
        <Link href="/">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Button>
        </Link>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status] || {
    label: order.status,
    icon: AlertCircle,
    color: "text-gray-500",
  };
  const StatusIcon = statusInfo.icon;
  const isBacs = order.payment_method === "bacs";
  const isPaid = order.status === "completed" || order.status === "processing" || !!order.date_paid;

  return (
    <div className="relative min-h-screen py-28 overflow-hidden bg-background">
      {/* Patrón de cuadrícula */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/60">
          <div className="flex items-center gap-3">
            <Package className="h-7 w-7 text-primary" />
            <h1 className="text-3xl font-extrabold tracking-tight font-heading">Pedido #{order.order_number}</h1>
          </div>
          <div className="flex items-center gap-2 bg-card/60 border border-border px-4 py-2 rounded-full backdrop-blur-sm shadow-sm">
            <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
            <span className={`text-sm font-bold font-heading ${statusInfo.color}`}>{statusInfo.label}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3 items-start">
          {/* Columna Izquierda: Información de Pago y Transferencia */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Status card */}
            <div className="rounded-2xl border border-border bg-card/45 backdrop-blur-sm p-6 space-y-4">
              <h2 className="text-lg font-bold text-foreground font-heading">Información del Pedido</h2>
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Fecha de creación</p>
                  <p className="font-semibold text-foreground mt-0.5">
                    {new Date(order.date_created).toLocaleDateString("es-EC", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "America/Guayaquil",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Método de pago seleccionado</p>
                  <p className="font-semibold text-foreground mt-0.5">{order.payment_method_title}</p>
                </div>
              </div>
            </div>

            {/* BACS details & Upload */}
            {isBacs && !isPaid && (
              <div className="rounded-2xl border border-primary/20 bg-primary/[0.02] p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground font-heading">Realiza tu transferencia bancaria</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tu plan está reservado. Envía la transferencia a cualquiera de estas cuentas ecuatorianas oficiales:
                  </p>
                </div>

                {order.bank_accounts.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {order.bank_accounts.map((account, i) => (
                      <div key={i} className="rounded-xl border border-border bg-card/40 backdrop-blur-sm p-5 space-y-2.5">
                        <p className="font-bold text-primary text-base font-heading">{account.bank_name}</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p><span className="font-medium text-foreground">Titular:</span> {account.account_name}</p>
                          <p className="text-sm font-extrabold tracking-wider text-foreground mt-1.5">{account.account_number}</p>
                          {account.account_ruc && <p><span className="font-medium text-foreground">RUC/Cédula:</span> {account.account_ruc}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="border-t border-border/40 pt-6">
                  {!uploaded ? (
                    <form onSubmit={handleUpload} className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-bold text-foreground font-heading">
                          Sube tu comprobante de pago
                        </label>
                        <div className="relative rounded-xl border border-dashed border-border bg-card/30 p-6 flex flex-col items-center justify-center text-center hover:bg-card/50 transition-colors">
                          <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                          <input
                            type="file"
                            name="file"
                            accept="image/*,.pdf"
                            className="block w-full text-xs text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-primary-foreground hover:file:bg-primary/95 cursor-pointer file:cursor-pointer"
                            required
                          />
                          <p className="mt-2 text-[10px] text-muted-foreground">JPG, PNG, PDF (Máx. 5MB)</p>
                        </div>
                      </div>
                      <Button type="submit" disabled={uploading} className="w-full sm:w-auto gap-2 font-bold px-6">
                        <Upload className="h-4 w-4" />
                        {uploading ? "Subiendo..." : "Subir comprobante"}
                      </Button>
                    </form>
                  ) : (
                    <div className="rounded-xl bg-emerald-500/5 border border-emerald-500/20 p-5 space-y-2">
                      <div className="flex items-center gap-2 text-emerald-500">
                        <CheckCircle className="h-5 w-5" />
                        <p className="font-bold font-heading">Comprobante subido exitosamente</p>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Hemos recibido tu comprobante de pago. Nuestro equipo administrativo validará la transferencia a la brevedad para activar los accesos a tu sistema contable.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Acciones */}
            <div className="flex flex-col gap-3 sm:flex-row pt-4">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full gap-2 font-bold">
                  <ArrowLeft className="h-4 w-4" />
                  Volver al inicio
                </Button>
              </Link>
              {uploaded && (
                <Link href={`/gracias?order_id=${order.id}&order_number=${order.order_number}`} className="flex-1">
                  <Button className="w-full gap-2 font-bold">
                    <CheckCircle className="h-4 w-4" />
                    Ver Confirmación
                  </Button>
                </Link>
              )}
            </div>

          </div>

          {/* Columna Derecha: Detalle de Productos y Facturación */}
          <div className="space-y-6">
            
            {/* Products summary */}
            <div className="rounded-2xl border border-border bg-card/65 backdrop-blur-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-foreground font-heading border-b border-border/60 pb-2">Resumen de Productos</h3>
              <div className="space-y-3">
                {order.line_items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground leading-normal">
                      {item.name} <span className="font-bold text-foreground">x{item.quantity}</span>
                    </span>
                    <span className="font-bold text-foreground">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="font-bold text-sm text-foreground">Total Pedido</span>
                <span className="text-xl font-extrabold text-foreground font-heading">
                  ${parseFloat(order.total).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Billing details */}
            <div className="rounded-2xl border border-border bg-card/45 backdrop-blur-sm p-6 space-y-3">
              <h3 className="text-base font-bold text-foreground font-heading border-b border-border/60 pb-2">Detalles de Facturación</h3>
              <div className="space-y-2 text-xs">
                <p><span className="text-muted-foreground font-medium">Cliente:</span> {order.billing.first_name} {order.billing.last_name}</p>
                <p><span className="text-muted-foreground font-medium">Email:</span> {order.billing.email}</p>
                {order.billing_fields?.billing_ruc && (
                  <p><span className="text-muted-foreground font-medium">RUC:</span> {order.billing_fields.billing_ruc}</p>
                )}
                {order.billing_fields?.billing_cedula && (
                  <p><span className="text-muted-foreground font-medium">Cédula:</span> {order.billing_fields.billing_cedula}</p>
                )}
                {order.billing_fields?.billing_usuario && (
                  <p><span className="text-muted-foreground font-medium">Usuario EXA:</span> {order.billing_fields.billing_usuario}</p>
                )}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
