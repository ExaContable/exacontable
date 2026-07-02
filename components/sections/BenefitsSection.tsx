"use client";

import { Quote, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    quote:
      "EXA transformó la gestión financiera de nuestra empresa. Ahora podemos generar facturas electrónicas, controlar inventarios y ver reportes en tiempo real desde cualquier lugar. El ahorro en tiempo operativo ha sido notable.",
    author: "María García",
    role: "Gerente Financiero",
    company: "Corposalud Cia. Ltda.",
    initials: "MG",
    rating: 5,
  },
  {
    quote:
      "Desde que implementamos EXA, redujimos los errores de facturación en un 90%. La integración directa con el SRI nos ahorra horas de trabajo cada mes. El equipo de soporte siempre responde rápido con soluciones concretas.",
    author: "Carlos Mendoza",
    role: "Contador General",
    company: "Grupo Comercial del Sur",
    initials: "CM",
    rating: 5,
  },
  {
    quote:
      "Buscábamos un software contable que fuera completo pero sencillo de usar. EXA superó nuestras expectativas. La migración de datos fue guiada paso a paso y en una semana ya operábamos al 100% con el sistema.",
    author: "Ana Rodríguez",
    role: "CEO",
    company: "Rodríguez & Asociados",
    initials: "AR",
    rating: 5,
  },
  {
    quote:
      "El módulo de facturación electrónica nos ahorra al menos 10 horas semanales. La integración con el SRI es impecable y el soporte técnico siempre está disponible cuando lo necesitamos.",
    author: "Pedro Castillo",
    role: "Director de Operaciones",
    company: "Distribuidora del Pacífico",
    initials: "PC",
    rating: 5,
  },
  {
    quote:
      "Pasamos de usar Excel y facturación manual a un sistema 100% automatizado. La curva de aprendizaje fue mínima gracias a la capacitación que nos brindó el equipo de EXA.",
    author: "Laura Espinoza",
    role: "Contadora Senior",
    company: "Grupo Inmobiliario del Sur",
    initials: "LE",
    rating: 5,
  },
  {
    quote:
      "Tener todos los reportes financieros en tiempo real nos permite tomar decisiones estratégicas con datos actualizados al instante. EXA nos dio visibilidad total del negocio.",
    author: "Diego Montero",
    role: "Gerente General",
    company: "Montero & Asociados",
    initials: "DM",
    rating: 5,
  },
];

const PER_PAGE = 3;
const totalPages = Math.ceil(testimonials.length / PER_PAGE);

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

export function BenefitsSection() {
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
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [isPaused, next]);

  const start = page * PER_PAGE;
  const visibleTestimonials = testimonials.slice(start, start + PER_PAGE);

  return (
    <section id="testimonios" className="scroll-mt-20 pt-32 pb-32 relative overflow-hidden bg-[#8B1E21]">
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-white uppercase">
            Testimonios
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl font-heading text-white">
            Lo que dicen nuestros clientes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-white/60 max-w-xl mx-auto leading-relaxed">
            Más de 500 empresas ecuatorianas ya confían en EXA para su gestión financiera.
          </p>
        </motion.div>

        <div className="relative mt-16">
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
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {visibleTestimonials.map((t) => (
                <div
                  key={t.author}
                  className="group rounded-2xl border border-border bg-white shadow-md p-6 sm:p-8 transition-all duration-300 hover:shadow-lg hover:border-primary/20"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>

                  <Quote className="mb-4 h-6 w-6 text-primary/15" />

                  <blockquote className="text-sm leading-relaxed text-muted-foreground mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {t.author}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {t.role}, {t.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          <button
            onClick={prev}
            aria-label="Anterior"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 lg:-translate-x-6 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-slate-700 hover:text-primary hover:shadow-lg transition-all border border-border focus-visible:outline-2 focus-visible:outline-ring"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            aria-label="Siguiente"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 lg:translate-x-6 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md text-slate-700 hover:text-primary hover:shadow-lg transition-all border border-border focus-visible:outline-2 focus-visible:outline-ring"
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
                    : "w-2.5 bg-primary/30 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
