"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, HelpCircle, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const faqs = [
  {
    question: "¿Qué es EXA Sistema Contable?",
    answer:
      "EXA es un sistema contable y financiero integral diseñado para empresas ecuatorianas. Ofrece módulos de facturación electrónica SRI, control de inventario, compras y ventas, reportes financieros, y más. Más de 500 empresas en Ecuador lo utilizan. Funciona 24/7 en la nube, sin instalaciones.",
  },
  {
    question: "¿Cómo funciona la facturación electrónica con SRI?",
    answer:
      "EXA está integrado con el SRI para emitir y recibir facturas electrónicas, comprobantes de retención, notas de crédito, notas de débito y guías de remisión. El proceso es automático: generas el comprobante, EXA lo firma electrónicamente y lo envía al SRI, obteniendo la autorización en segundos.",
  },
  {
    question: "¿Qué planes tienen disponibles?",
    answer:
      "Contamos con planes mensuales y anuales: Sistema Contable (Emprendedor, Ejecutivo, Corporativo), Planes Contador, Facturación Electrónica independiente (Básico, Ideal, Ilimitado) y opción de Compra Total. El plan anual incluye 20% de descuento. Todos los planes incluyen soporte técnico local y actualizaciones SRI automáticas.",
  },
  {
    question: "¿Ofrecen prueba gratuita?",
    answer:
      "Sí, ofrecemos un período de prueba gratuito para que puedas conocer todas las funcionalidades de EXA sin compromiso. Durante la prueba tendrás acceso completo al sistema y soporte técnico para resolver cualquier duda. Al finalizar, puedes elegir el plan que mejor se adapte a tu negocio.",
  },
  {
    question: "¿Cómo migro mis datos a EXA?",
    answer:
      "Nuestro equipo de soporte te guía en todo el proceso de migración. Podemos importar tus datos desde Excel, archivos CSV o desde tu sistema anterior. Además, te capacitamos para que tú y tu equipo puedan usar EXA desde el primer día sin complicaciones.",
  },
  {
    question: "¿Es seguro almacenar mis datos en la nube?",
    answer:
      "Totalmente. EXA utiliza servidores con encriptación SSL de grado bancario, respaldos automáticos diarios, autenticación de dos factores y cumple con los estándares ISO 27001 de seguridad de la información. Tus datos financieros están protegidos y solo tu personal autorizado puede acceder.",
  },
  {
    question: "¿Qué requisitos técnicos necesito para usar EXA?",
    answer:
      "Solo necesitas un dispositivo con acceso a internet (computador, tablet o smartphone) y un navegador web actualizado (Chrome, Firefox, Edge o Safari). No requieres instalar ningún software ni mantener servidores. EXA funciona 100% en la nube.",
  },
  {
    question: "¿Ofrecen soporte técnico?",
    answer:
      "Sí, todos nuestros planes incluyen soporte técnico personalizado. Contamos con un equipo de expertos disponible en horario comercial vía teléfono, email y WhatsApp. También tenemos una base de conocimientos con guías y tutoriales para que puedas resolver dudas rápidamente.",
  },
  {
    question: "¿Puedo acceder desde cualquier dispositivo?",
    answer:
      "Sí, EXA es una plataforma 100% web responsive. Puedes acceder desde cualquier computador, tablet o smartphone con conexión a internet. Esto te permite gestionar tu negocio desde la oficina, tu casa o mientras viajas, sin perder ninguna funcionalidad.",
  },
  {
    question: "¿EXA se actualiza con los cambios del SRI?",
    answer:
      "Sí, EXA se actualiza automáticamente cuando el SRI modifica formatos, plazos o normativas. Sin costos adicionales ni intervención manual. Nosotros nos encargamos de que siempre cumplas con la legislación fiscal ecuatoriana vigente. Más de 7 años manteniendo al día a nuestras empresas clientes.",
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.4 },
  }),
};

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section id="faq" className="scroll-mt-20 pt-40 pb-36 relative overflow-hidden bg-background">
      

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            <HelpCircle className="h-4 w-4" />
            FAQ
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl font-heading text-foreground">
            Preguntas Frecuentes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Resolvemos las dudas más comunes sobre EXA Sistema Contable.
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-4">
          {(() => {
            const mid = Math.ceil(faqs.length / 2);
            return [faqs.slice(0, mid), faqs.slice(mid)].map((col, colIndex) => (
              <div key={colIndex} className="space-y-3">
                {col.map((faq, i) => {
                  const globalIndex = colIndex === 0 ? i : mid + i;
                  return (
                    <motion.div
                      key={globalIndex}
                      custom={globalIndex}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="group rounded-2xl border border-zinc-100 bg-white shadow-md transition-all duration-300 hover:border-primary/20 hover:shadow-lg relative overflow-hidden"
                    >
                      {openIndex === globalIndex && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-2xl" />
                      )}
                      <button
                        onClick={() => toggle(globalIndex)}
                        aria-expanded={openIndex === globalIndex}
                        aria-controls={`faq-answer-${globalIndex}`}
                        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left focus-visible:outline-2 focus-visible:outline-ring"
                      >
                        <span className="text-base font-bold text-slate-900 font-heading pr-2">
                          {faq.question}
                        </span>
                        <motion.div
                          animate={{ rotate: openIndex === globalIndex ? 45 : 0, backgroundColor: openIndex === globalIndex ? "var(--primary)" : "transparent", color: openIndex === globalIndex ? "white" : "var(--primary)" }}
                          transition={{ duration: 0.25 }}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20"
                        >
                          <Plus className="h-4 w-4" />
                        </motion.div>
                      </button>
                      <AnimatePresence initial={false}>
                        {openIndex === globalIndex && (
                          <motion.div
                            key={`faq-answer-${globalIndex}`}
                            id={`faq-answer-${globalIndex}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-zinc-100 px-6 pb-5 pt-4">
                              <p className="text-sm leading-relaxed text-slate-600">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            ));
          })()}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="mb-4 text-sm text-muted-foreground">
            ¿No encuentras lo que buscas?
          </p>
          <Link href="/#contacto">
            <Button
              variant="outline"
              size="lg"
              className="group gap-2 rounded-full border-border"
            >
              <MessageCircle className="h-4 w-4" />
              Contacta con nosotros
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
