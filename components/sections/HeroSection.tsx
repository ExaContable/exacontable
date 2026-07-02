"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const gradients = [
  "radial-gradient(ellipse 80% 60% at 0% -20%, color-mix(in oklab, var(--primary) 40%, transparent) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 100% 0%, color-mix(in oklab, var(--primary) 25%, transparent) 0%, transparent 70%), linear-gradient(180deg, var(--background) 0%, color-mix(in oklab, var(--background) 93%, white 7%) 50%, var(--background) 100%)",
  "radial-gradient(ellipse 80% 60% at 30% -20%, color-mix(in oklab, var(--primary) 50%, transparent) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 70% 10%, color-mix(in oklab, var(--primary) 30%, transparent) 0%, transparent 70%), linear-gradient(180deg, var(--background) 0%, color-mix(in oklab, var(--background) 93%, white 7%) 50%, var(--background) 100%)",
  "radial-gradient(ellipse 80% 60% at 60% -10%, color-mix(in oklab, var(--primary) 35%, transparent) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 30% 5%, color-mix(in oklab, var(--primary) 28%, transparent) 0%, transparent 70%), linear-gradient(180deg, var(--background) 0%, color-mix(in oklab, var(--background) 93%, white 7%) 50%, var(--background) 100%)",
  "radial-gradient(ellipse 80% 60% at 100% -20%, color-mix(in oklab, var(--primary) 40%, transparent) 0%, transparent 70%), radial-gradient(ellipse 60% 50% at 0% 0%, color-mix(in oklab, var(--primary) 25%, transparent) 0%, transparent 70%), linear-gradient(180deg, var(--background) 0%, color-mix(in oklab, var(--background) 93%, white 7%) 50%, var(--background) 100%)",
];

const bottomGlows = [
  "radial-gradient(ellipse 50% 40% at 50% 100%, color-mix(in oklab, var(--primary) 15%, transparent) 0%, transparent 70%)",
  "radial-gradient(ellipse 50% 40% at 40% 100%, color-mix(in oklab, var(--primary) 20%, transparent) 0%, transparent 70%)",
  "radial-gradient(ellipse 50% 40% at 60% 100%, color-mix(in oklab, var(--primary) 15%, transparent) 0%, transparent 70%)",
  "radial-gradient(ellipse 50% 40% at 50% 100%, color-mix(in oklab, var(--primary) 15%, transparent) 0%, transparent 70%)",
];

function GradientLayers() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-background" />
      {gradients.map((g, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{ background: g }}
          initial={{ opacity: i === 0 ? 1 : 0 }}
          animate={{ opacity: [i === 0 ? 1 : 0, i === 0 ? 0 : 1, i === 0 ? 0 : 1, i === 0 ? 1 : 0] }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.75, 1],
          }}
        />
      ))}
      {bottomGlows.map((g, i) => (
        <motion.div
          key={`glow-${i}`}
          className="absolute inset-0"
          style={{ background: g }}
          initial={{ opacity: i === 0 ? 1 : 0 }}
          animate={{ opacity: [i === 0 ? 1 : 0, i === 0 ? 0 : 1, i === 0 ? 0 : 1, i === 0 ? 1 : 0] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.25, 0.75, 1],
          }}
        />
      ))}
    </div>
  );
}

const fadeUpVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.23, 0.86, 0.39, 0.96] as [number, number, number, number] },
  }),
};

function DecorativeElements() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute -left-32 top-1/4 h-64 w-64 rounded-full border border-primary/10" />
      <div className="absolute -right-20 top-1/3 h-48 w-48 rounded-full border border-primary/15" />
      <div className="absolute left-1/3 top-[60%] h-32 w-32 rounded-full bg-primary/5 blur-2xl" />
      <svg className="absolute left-[5%] top-[15%] h-8 w-8 text-primary/10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
      <svg className="absolute right-[8%] top-[70%] h-6 w-6 text-primary/15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden pt-16">
      <GradientLayers />
      <DecorativeElements />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-40 bg-gradient-to-b from-background via-background/70 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl flex-col items-center justify-center px-4 pt-24 pb-16 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-primary" />
            Software contable todo-en-uno
          </motion.div>

          <motion.div custom={1} variants={fadeUpVariants} initial="hidden" animate="visible">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.15] text-balance">
              <span className="bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
                Transforma la Gestión Financiera
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                de tu Empresa
              </span>
            </h1>
          </motion.div>

          <motion.div custom={2} variants={fadeUpVariants} initial="hidden" animate="visible">
            <p className="mb-10 text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl max-w-2xl mx-auto">
              Facturación SRI, control de stock, compras, ventas
              y reportes financieros desde un solo lugar. 100% online, sin
              instalaciones.
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4 sm:flex-row sm:justify-center w-full mb-16"
          >
            <Link href="/#planes" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group gap-2 rounded-full bg-primary text-base text-primary-foreground shadow-[0_0_24px_-4px_color-mix(in_oklab,var(--primary)_50%,transparent)] hover:bg-primary/90 hover:shadow-[0_0_32px_-2px_color-mix(in_oklab,var(--primary)_60%,transparent)] w-full"
              >
                Ver planes y precios
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/#caracteristicas" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="group gap-2 rounded-full border-border text-base text-foreground hover:bg-muted w-full"
              >
                <Play className="h-4 w-4" />
                Ver funcionalidades
              </Button>
            </Link>
          </motion.div>
        </div>

          <motion.div
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full max-w-5xl mx-auto"
          >
            <div className="absolute -inset-10 rounded-[3rem] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent blur-3xl opacity-75 -z-10" />
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-2xl border border-border bg-gradient-to-b from-card/80 to-background/50 p-2 shadow-[0_24px_80px_-15px_rgba(0,0,0,0.8)] shadow-primary/5 backdrop-blur-sm">
            {/* Barra superior estilo navegador */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border/40 bg-background/40 rounded-t-xl">
              <span className="w-2.5 h-2.5 rounded-full bg-destructive/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="ml-4 px-3 py-0.5 text-[10px] text-muted-foreground/60 bg-background/60 rounded-md border border-border/20 max-w-[200px] truncate">
                app.exacontable.com
              </span>
            </div>
            <div className="overflow-hidden rounded-b-xl relative">
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent z-10 pointer-events-none" />
              <Image
                src="/hero-dashboard.png"
                alt="EXA Contable Dashboard"
                width={1200}
                height={800}
                className="h-auto w-full object-cover"
                priority
              />
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.2, duration: 0.5, ease: "backOut" }}
              className="absolute -bottom-4 -right-4 z-20 hidden sm:flex items-center gap-3 rounded-2xl border border-primary/20 bg-card/95 backdrop-blur-md px-5 py-3 shadow-lg shadow-primary/10"
            >
              <div className="flex -space-x-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary/20 text-[9px] font-bold text-primary">J</div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary/20 text-[9px] font-bold text-primary">M</div>
                <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary/15 text-[9px] font-bold text-primary">+</div>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-foreground">+500 empresas</p>
                <p className="text-[10px] text-muted-foreground">ya confían en EXA</p>
              </div>
            </motion.div>
          </motion.div>
          </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        >
          <span className="text-[10px] font-semibold tracking-widest text-muted-foreground/50 uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="h-6 w-[1px] bg-gradient-to-b from-primary/40 to-transparent"
          />
        </motion.div>
      </div>

      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t" />
    </section>
  );
}
