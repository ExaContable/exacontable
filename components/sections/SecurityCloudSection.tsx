"use client";

import { Cloud, Lock, ShieldCheck, Database, RefreshCcw } from "lucide-react";
import { LazyMotion, m, domAnimation } from "framer-motion";

export function SecurityCloudSection() {
  return (
    <LazyMotion features={domAnimation}>
    <section
      id="seguridad"
      className="relative py-24 overflow-hidden bg-[#8B1E21]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <m.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative flex justify-center lg:justify-start order-2 lg:order-1"
          >
            <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
              <div className="group p-6 rounded-2xl border border-white/10 bg-white  backdrop-blur-sm space-y-4 hover:border-white/20 transition-all duration-500 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-500">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="font-bold ">Encriptación SSL</h3>
                <p className="text-xs leading-relaxed">
                  Toda tu información financiera se transmite de forma
                  encriptada bajo protocolos de seguridad SSL de grado bancario.
                </p>
              </div>

              <div className="group p-6 rounded-2xl border border-white/10 bg-white backdrop-blur-sm space-y-4 hover:border-white/20 transition-all duration-500 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-500">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="font-bold ">Copias Diarias</h3>
                <p className="text-xs leading-relaxed">
                  Realizamos respaldos automáticos cada día para que nunca
                  pierdas datos de inventario, ventas ni facturación.
                </p>
              </div>

              <div className="group p-6 rounded-2xl border border-white/10 bg-white backdrop-blur-sm space-y-4 hover:border-white/20 transition-all duration-500 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-500">
                  <Cloud className="h-5 w-5" />
                </div>
                <h3 className="font-bold ">100% Nube</h3>
                <p className="text-xs leading-relaxed">
                  Accede a tu contabilidad desde cualquier computador o celular
                  con conexión a internet. Sin instalar programas.
                </p>
              </div>

              <div className="group p-6 rounded-2xl border border-white/10 bg-white backdrop-blur-sm space-y-4 hover:border-white/20 transition-all duration-500 hover:shadow-lg hover:shadow-black/10 hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/15 transition-all duration-500">
                  <RefreshCcw className="h-5 w-5" />
                </div>
                <h3 className="font-bold">Actualizado</h3>
                <p className="text-xs leading-relaxed">
                  Actualizaciones fiscales inmediatas y automáticas cada vez que
                  cambien los reglamentos contables en el país.
                </p>
              </div>
            </div>
          </m.div>

          <m.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6 order-1 lg:order-2"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-white uppercase">
              Infraestructura y Seguridad
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl font-heading leading-tight text-white">
              Datos Protegidos <br />
              Disponibles 24/7
            </h2>
            <p className="text-base sm:text-lg text-white/70 leading-relaxed">
              Tu información financiera viaja con encriptación SSL de grado
              bancario, respaldos diarios automatizados y autenticación de dos
              factores. Cumplimos con estándares ISO 27001 para que duermas
              tranquilo.
            </p>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl max-w-md">
              <ShieldCheck className="h-8 w-8 text-emerald-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-white">
                  Cumplimiento RGPD & ISO
                </p>
                <p className="text-xs text-white/60 mt-0.5">
                  Estándares internacionales de seguridad informática aplicados
                  a tu contabilidad.
                </p>
              </div>
            </div>
          </m.div>
        </div>
      </div>
    </section>
    </LazyMotion>
  );
}
