"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useEffect } from "react";

function GraciasContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const setCart = useCartStore((s) => s.setCart);
  const setCartToken = useCartStore((s) => s.setCartToken);

  useEffect(() => {
    setCart(null, null);
    setCartToken(null);
    document.cookie = "wc_cart_token=; path=/; max-age=0";
  }, [setCart, setCartToken]);

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-28 overflow-hidden bg-background">
      {/* Patrón de cuadrícula */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="relative mx-auto w-full max-w-xl rounded-2xl border border-border bg-card/45 backdrop-blur-sm p-8 sm:p-10 text-center shadow-[0_24px_80px_-15px_rgba(0,0,0,0.8)] hover:border-primary/20 transition-all duration-300">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <CheckCircle className="h-8 w-8" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight font-heading">
          ¡Gracias por tu compra!
        </h1>

        <p className="mt-4 text-base text-muted-foreground">
          Tu pedido <span className="font-extrabold text-foreground font-heading">#{orderId}</span> ha sido creado exitosamente en nuestra plataforma.
        </p>

        <div className="my-6 p-4 rounded-xl border border-border bg-background/50 text-left text-xs text-muted-foreground space-y-2">
          <p className="font-bold text-foreground">¿Qué sigue ahora?</p>
          <p className="flex items-start gap-1.5 leading-normal">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            Recibirás un correo electrónico de confirmación con los detalles y credenciales del sistema.
          </p>
          <p className="flex items-start gap-1.5 leading-normal">
            <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
            Si seleccionaste transferencia, recuerda subir el comprobante de pago en el enlace de abajo para activar tu cuenta de inmediato.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={`/mis-pedidos/${orderId}`} className="w-full sm:w-auto">
            <Button variant="outline" className="w-full gap-2 font-bold">
              Subir comprobante / Estado
            </Button>
          </Link>
          <Link href="/#planes" className="w-full sm:w-auto">
            <Button className="w-full gap-2 font-bold">
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function GraciasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center pt-16">
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      }
    >
      <GraciasContent />
    </Suspense>
  );
}
