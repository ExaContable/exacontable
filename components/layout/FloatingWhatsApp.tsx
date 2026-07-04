"use client";

import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import { usePathname } from "next/navigation";

const WHATSAPP_NUMBER = "593978835575";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export function FloatingWhatsApp() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-3"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="mb-2 w-72 overflow-hidden rounded-2xl border border-border/50 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)]"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-4 text-white">
                <p className="text-sm font-bold font-heading">¡Hablemos!</p>
                <p className="text-xs text-emerald-100 mt-0.5">
                  Resuelve tus dudas con nuestro equipo
                </p>
              </div>
              <div className="p-3 space-y-1">
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-emerald-50 group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">WhatsApp</p>
                    <p className="text-xs text-zinc-500">Atención al cliente</p>
                  </div>
                </a>
                <a
                  href={`${WHATSAPP_URL}?text=Hola%20EXA%20Contable%2C%20quisiera%20informaci%C3%B3n%20sobre%20los%20planes%20y%20precios.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-emerald-50 group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Información de Planes</p>
                    <p className="text-xs text-zinc-500">Consulta precios y características</p>
                  </div>
                </a>
                <a
                  href={`${WHATSAPP_URL}?text=Hola%20EXA%20Contable%2C%20necesito%20soporte%20t%C3%A9cnico.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-emerald-50 group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-900">Soporte Técnico</p>
                    <p className="text-xs text-zinc-500">Ayuda con el sistema</p>
                  </div>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="relative h-14 w-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_8px_32px_rgba(16,185,129,0.35)] hover:scale-105 active:scale-95 transition-all duration-300 border border-emerald-400/30"
          aria-label={isOpen ? "Cerrar chat" : "Abrir chat de soporte"}
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MessageCircle className="h-6 w-6" />
          )}
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}
