"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, Shield, HeadphonesIcon, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function CTASection() {
  return (
    <section className="relative border-t border-white/10 bg-[#8B1E21] py-24 overflow-hidden">

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            Prueba gratuita por 15 días
          </div>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl font-heading text-white">
            Empieza hoy a transformar
            <br />
            tu negocio
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-white/70">
            Únete a +500 empresas ecuatorianas que ya optimizan su gestión financiera con EXA. No necesitas tarjeta de crédito para empezar.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="https://wa.me/593978835575?text=Hola%2C%20quisiera%20solicitar%20una%20demo%20de%20EXA%20Sistema%20Contable.%20Quedo%20atento%20a%20su%20respuesta."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="group gap-2 rounded-full bg-white hover:bg-gray-100 text-[#8B1E21] font-semibold px-8 shadow-[0_8px_32px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.25)] transition-all duration-300"
              >
                Solicita una demo
                <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
              </Button>
            </a>

          </div>

          <div className="mt-10 flex items-center justify-center gap-6 text-xs text-white/50 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-white" />
              Sin tarjeta de crédito
            </span>
            <span className="flex items-center gap-1.5">
              <HeadphonesIcon className="h-3.5 w-3.5 text-white" />
              Soporte incluido
            </span>
            <span className="flex items-center gap-1.5">
              <XCircle className="h-3.5 w-3.5 text-white" />
              Cancela cuando quieras
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
