"use client";

import Link from "next/link";
import { FileText, ShoppingCart, Package, BarChart3, Shield, Clock, Eye, Zap, HeadphonesIcon, ArrowRight, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";

const features = [
  {
    icon: FileText,
    title: "Facturacion Electronica",
    description:
      "Emite y gestiona tus facturas electronicas de forma segura y eficiente, cumpliendo con la normativa SRI vigente en Ecuador.",
    badge: "SRI",
  },
  {
    icon: ShoppingCart,
    title: "Compras y Ventas",
    description:
      "Gestiona órdenes de compra, cuentas por cobrar y pagar con un sistema que automatiza cada etapa del ciclo comercial.",
    badge: "Automatizado",
  },
  {
    icon: Package,
    title: "Control de Inventario",
    description:
      "Monitorea tu stock con alertas de inventario mínimo, kardex electrónico y gestión multi-bodega en tiempo real.",
    badge: "Tiempo real",
  },
  {
    icon: BarChart3,
    title: "Reportes Financieros",
    description:
      "Accede a más de 15 KPIs en tiempo real: balances, estados de resultados, flujo de caja y reportes exportables.",
    badge: "Dashboard",
  },
  {
    icon: Eye,
    title: "Visión Integral del Negocio",
    description:
      "Visualiza más de 15 indicadores clave en tiempo real, exporta informes a PDF y Excel, y toma decisiones con data actualizada al instante.",
    badge: "15+ KPIs",
  },
  {
    icon: Shield,
    title: "Seguridad y Confiabilidad",
    description:
      "Respaldos automáticos diarios, encriptación SSL de grado bancario, autenticación 2FA y cumplimiento ISO 27001.",
    badge: "99.9% uptime",
  },
  {
    icon: Clock,
    title: "Soporte Técnico",
    description:
      "Ingenieros y contadores en Ecuador te atienden por teléfono, WhatsApp y email. Respuesta en menos de 2 horas.",
    badge: "Respuesta rápida",
  },
  {
    icon: Zap,
    title: "Ahorro de Tiempo y Dinero",
    description:
      "Reduce hasta un 40% en costos operativos mensuales, ahorra 15+ horas semanales y automatiza facturación e inventario en segundos.",
    badge: "40% ahorro",
  },
  {
    icon: HeadphonesIcon,
    title: "Implementación y Soporte",
    description:
      "Atención personalizada por ingenieros y contadores en Ecuador, con horario extendido vía WhatsApp y acompañamiento en la carga inicial de datos.",
    badge: "Respuesta < 2h",
  },
];

const PER_PAGE = 3;
const totalPages = Math.ceil(features.length / PER_PAGE);

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

export function FeaturesSection() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  const goTo = useCallback((i: number) => {
    setDirection(i > page ? 1 : -1);
    setPage(i);
  }, [page]);

  const next = useCallback(() => {
    setDirection(1);
    setPage((prev) => (prev + 1) % totalPages);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  const start = page * PER_PAGE;
  const visibleFeatures = features.slice(start, start + PER_PAGE);

  return (
    <section id="caracteristicas" className="scroll-mt-20 pt-40 pb-36 relative overflow-hidden bg-[#8B1E21]">
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-white uppercase">
            <Sparkles className="h-3.5 w-3.5" />
            Funcionalidades
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl font-heading text-white">
            Módulos Especializados
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/70 max-w-xl mx-auto leading-relaxed">
            Todo lo que necesitas para gestionar la facturación e inventario de tu negocio en un solo sistema integrado y fácil de usar.
          </p>
        </motion.div>

        <div className="relative mt-16">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 overflow-hidden rounded-full z-20">
            <motion.div
              key={`progress-${page}`}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 5, ease: "linear" }}
              className="h-full bg-primary rounded-full"
            />
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: "easeInOut" }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-6"
            >
              {visibleFeatures.map((feature, i) => (
                <div
                  key={feature.title}
                  tabIndex={0}
                  role="article"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      const nextSection = document.querySelector("#planes");
                      if (nextSection) (nextSection as HTMLElement).scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-md transition-all duration-500 focus-visible:outline-2 focus-visible:outline-ring hover:-translate-y-2 hover:shadow-xl hover:border-primary/20 hover:shadow-primary/5"
                >
                  <div className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
                  </div>

                  <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/[0.04] to-transparent border-b border-zinc-100">
                    <div className="absolute inset-0 opacity-[0.03]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(220,76,30,0.3),transparent_70%)]" />
                    </div>
                    <feature.icon className="h-16 w-16 text-primary/15 transition-all duration-500 group-hover:scale-110 group-hover:text-primary/25" />
                  </div>

                  <div className="absolute top-3 left-3 text-[11px] font-bold text-primary/20 select-none">
                    {String(start + i + 1).padStart(2, "0")}
                  </div>
                  <div className="relative p-6">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="rounded-full bg-primary/10 p-3 h-11 w-11 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-110">
                        <feature.icon className="h-5 w-5 shrink-0" />
                      </div>
                      <span className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[9px] font-bold tracking-wide text-primary uppercase">
                        {feature.badge}
                      </span>
                    </div>

                    <h3 className="mb-2 text-lg font-bold text-slate-900 font-heading transition-colors group-hover:text-primary">
                      {feature.title}
                    </h3>

                    <p className="text-sm leading-relaxed text-slate-600">
                      {feature.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1 text-xs font-bold text-primary transition-all duration-300">
                      Conocer más <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md text-slate-700 hover:bg-white hover:text-primary hover:shadow-lg transition-all border border-zinc-200 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-6 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-md text-slate-700 hover:bg-white hover:text-primary hover:shadow-lg transition-all border border-zinc-200 focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="flex justify-center gap-2.5 mt-10">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir a página ${i + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i === page
                    ? "w-8 bg-primary"
                    : "w-2.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link href="/#planes">
            <Button
              size="lg"
              className="group gap-2 rounded-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold px-6 shadow-[0_8px_32px_rgba(220,76,30,0.2)]"
            >
              Ver planes disponibles
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
