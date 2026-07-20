"use client";

import { UserCheck, Upload, Play, TrendingUp, ArrowDown, ChevronLeft, ChevronRight } from "lucide-react";
import { LazyMotion, m, domAnimation, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";

const steps = [
  {
    icon: UserCheck,
    title: "Regístrate y Configura",
    description:
      "Crea tu cuenta en minutos. Configura tu empresa, impuestos y usuarios sin conocimientos técnicos.",
  },
  {
    icon: Upload,
    title: "Carga tus Datos",
    description:
      "Importa clientes, proveedores, productos y saldos iniciales desde Excel o tu sistema anterior.",
  },
  {
    icon: Play,
    title: "Opera tu Negocio",
    description:
      "Factura electrónicamente, controla inventarios, gestiona compras y ventas desde un solo lugar.",
  },
  {
    icon: TrendingUp,
    title: "Crece con Datos",
    description:
      "Analiza reportes financieros en tiempo real y toma decisiones informadas para escalar tu empresa.",
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

export function HowItWorksSection() {
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalPages = steps.length;

  const goTo = useCallback((i: number) => {
    setDirection(i > page ? 1 : -1);
    setPage(i);
  }, [page]);

  const next = useCallback(() => {
    setDirection(1);
    setPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prev = useCallback(() => {
    setDirection(-1);
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  const step = steps[page];

  return (
    <LazyMotion features={domAnimation}>
    <section id="funcionamiento" className="scroll-mt-20 relative py-24 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            Cómo funciona
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl font-heading">
            Empieza en 4 pasos simples
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Configura tu sistema contable en menos de una hora y empieza a facturar electrónicamente el mismo día.
          </p>
        </m.div>

        {/* Mobile carousel */}
        <div className="sm:hidden mt-16">
          <div className="relative">
            <AnimatePresence mode="wait" custom={direction}>
              <m.div
                key={page}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <step.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground font-heading">
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground max-w-xs mx-auto">
                  {step.description}
                </p>
              </m.div>
            </AnimatePresence>

            <button
              onClick={prev}
              aria-label="Anterior"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md text-slate-700 hover:text-primary hover:shadow-lg transition-all border border-zinc-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              aria-label="Siguiente"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md text-slate-700 hover:text-primary hover:shadow-lg transition-all border border-zinc-200"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Ir al paso ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === page
                    ? "w-6 bg-primary"
                    : "w-2 bg-primary/30 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop grid */}
        <m.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="hidden sm:grid relative mt-16 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, i) => (
            <m.div
              key={step.title}
              variants={itemVariants}
              className="relative text-center"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <step.icon className="h-7 w-7" />
              </div>
              <div className="absolute top-7 left-[calc(50%+2.5rem)] hidden lg:block">
                {i < steps.length - 1 && (
                  <ArrowDown className="h-5 w-5 -rotate-90 text-primary/30" />
                )}
              </div>
              <h3 className="mb-2 text-lg font-bold text-foreground font-heading">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground max-w-xs mx-auto">
                {step.description}
              </p>
            </m.div>
          ))}
        </m.div>
      </div>
    </section>
    </LazyMotion>
  );
}
