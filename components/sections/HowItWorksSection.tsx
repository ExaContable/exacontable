"use client";

import { UserCheck, Upload, Play, TrendingUp, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

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

export function HowItWorksSection() {
  return (
    <section id="funcionamiento" className="scroll-mt-20 relative py-24 overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
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
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((step, i) => (
            <motion.div
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
