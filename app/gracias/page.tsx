"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowLeft, MessageCircle, FileText, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useEffect } from "react";
import { LazyMotion, m, domAnimation } from "framer-motion";

function GraciasContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const orderNumber = searchParams.get("order_number") || orderId;
  const setCart = useCartStore((s) => s.setCart);
  const setCartToken = useCartStore((s) => s.setCartToken);

  useEffect(() => {
    setCart(null, null);
    setCartToken(null);
    document.cookie = "wc_cart_token=; path=/; max-age=0";
  }, [setCart, setCartToken]);

  return (
    <LazyMotion features={domAnimation}>
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-28 overflow-hidden bg-gradient-to-b from-zinc-50 to-white">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-red-500/5 rounded-full blur-[120px] -z-10" />

      <m.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto w-full max-w-xl"
      >
        <div className="rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur-sm p-6 sm:p-10 text-center shadow-[0_24px_80px_-15px_rgba(0,0,0,0.08)] transition-all duration-300">
          <m.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 border border-emerald-200 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          >
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading text-zinc-900">
              ¡Gracias por tu compra!
            </h1>

            <p className="mt-3 text-sm sm:text-base text-zinc-500">
              Tu pedido{" "}
              <span className="font-extrabold text-zinc-900 font-heading">#{orderNumber}</span>{" "}
              ha sido creado exitosamente en nuestra plataforma.
            </p>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="my-6 p-4 sm:p-5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-left space-y-3"
          >
            <p className="text-sm font-bold text-zinc-900">¿Qué sigue ahora?</p>

            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <Mail className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">Recibirás un correo de confirmación</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  En unos minutos llegarán los detalles de tu pedido y las credenciales del sistema a tu correo electrónico.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">Sube tu comprobante de pago</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Si seleccionaste transferencia bancaria, recuerda subir el comprobante para activar tu cuenta de inmediato.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <MessageCircle className="h-3.5 w-3.5" />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-900">¿Tienes dudas? Escríbenos</p>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Nuestro equipo de soporte está listo para ayudarte vía WhatsApp.
                </p>
              </div>
            </div>
          </m.div>

          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
          >
            <Link href={`/mis-pedidos/${orderId}`} className="w-full sm:w-auto">
              <Button variant="outline" className="w-full gap-2 font-bold border-zinc-300 text-zinc-700 hover:bg-zinc-50 rounded-xl">
                <FileText className="h-4 w-4" />
                Subir comprobante
              </Button>
            </Link>
            <a
              href="https://wa.me/593978835575"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <Button className="w-full gap-2 font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20">
                <MessageCircle className="h-4 w-4" />
                Soporte por WhatsApp
              </Button>
            </a>
            <Link href="/#planes" className="w-full sm:w-auto">
              <Button className="w-full gap-2 font-bold bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg shadow-red-500/20">
                <ArrowLeft className="h-4 w-4" />
                Volver al inicio
              </Button>
            </Link>
          </m.div>
        </div>
      </m.div>
    </div>
    </LazyMotion>
  );
}

export default function GraciasPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center pt-16">
          <p className="text-zinc-500">Cargando...</p>
        </div>
      }
    >
      <GraciasContent />
    </Suspense>
  );
}
