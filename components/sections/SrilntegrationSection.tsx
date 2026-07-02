"use client";

import { FileText, ArrowRight, ShieldCheck, Zap, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";

export function SrilntegrationSection() {
  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background border-t border-border/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(220,76,30,0.03),transparent_60%)] -z-10" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
              Integración Oficial
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl font-heading leading-tight">
              Facturación Electrónica <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                100% Conectada al SRI
              </span>
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Olvida los procesos manuales. EXA se conecta directo con los servidores del SRI y autoriza tus comprobantes en segundos. Sin esperas, sin errores de digitación, sin doble trabajo.
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-4">
              <div className="p-5 rounded-2xl border border-border bg-card/30 backdrop-blur-sm space-y-3 hover:border-primary/25 hover:shadow-lg transition-all duration-300">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground">Firma Electrónica</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Soporta firmas de archivo (.p12) de las principales entidades certificadoras de Ecuador.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card/30 backdrop-blur-sm space-y-3 hover:border-primary/25 hover:shadow-lg transition-all duration-300">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground">Autorización en Segundos</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Generación, envío, firma y autorización de comprobantes en tiempo real sin demoras.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card/30 backdrop-blur-sm space-y-3 hover:border-primary/25 hover:shadow-lg transition-all duration-300">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground">Todos los Comprobantes</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Facturas, Liquidaciones de compra, Notas de Crédito, Notas de Débito y Guías de Remisión.
                </p>
              </div>

              <div className="p-5 rounded-2xl border border-border bg-card/30 backdrop-blur-sm space-y-3 hover:border-primary/25 hover:shadow-lg transition-all duration-300">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-foreground">Envío Automatizado</h3>
                <p className="text-xs text-muted-foreground leading-normal">
                  Envío automático del PDF y XML autorizado directamente al correo del cliente.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <Link href="/#planes">
                <Button className="group gap-2 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 shadow-[0_8px_32px_rgba(220,76,30,0.2)]">
                  Probar Facturación Gratis
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg aspect-square rounded-2xl border border-border bg-card/30 p-8 backdrop-blur-sm shadow-2xl flex flex-col justify-between overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent -z-10" />
              
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    SRI
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Esquema Offline SRI</h4>
                    <p className="text-[10px] text-muted-foreground">Servicio Web Autorización</p>
                  </div>
                </div>
                <motion.span
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-500 uppercase"
                >
                  En línea
                </motion.span>
              </div>

              <div className="my-8 space-y-4 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-4 bg-background/50 border border-border p-3.5 rounded-xl">
                  <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-foreground">Factura #001-002-123456</p>
                      <span className="text-[9px] text-muted-foreground">Hace un momento</span>
                    </div>
                    <p className="text-[10px] text-emerald-500 font-semibold mt-0.5">Firmado & Autorizado SRI</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-background/30 border border-border/50 p-3.5 rounded-xl opacity-60">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-foreground">Retención #001-001-000452</p>
                      <span className="text-[9px] text-muted-foreground">Hace 15 min</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Pendiente de envío</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border/40 pt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Último estado de transmisión</span>
                <span className="font-bold text-foreground">Éxito 100%</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
