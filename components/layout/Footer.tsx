"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, ArrowUpRight } from "lucide-react";

const footerLinks = {
  navegacion: [
    { href: "/", label: "Inicio" },
    { href: "/#caracteristicas", label: "Características" },
    { href: "/#funcionamiento", label: "Cómo funciona" },
    { href: "/#planes", label: "Planes" },
    { href: "/#contacto", label: "Contacto" },
  ],
  legales: [
    { href: "/terminos", label: "Términos y Condiciones" },
    { href: "/privacidad", label: "Política de Privacidad" },
    { href: "/cookies", label: "Cookies" },
    { href: "https://admin.exacontable.com/mi-cuenta/", label: "Iniciar Sesión", external: true },
    { href: "https://exa.ofsercont.com/", label: "Portal Cliente", external: true },
  ],
};

import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="w-full">
      <div className="via-primary/40 h-px w-full bg-gradient-to-r from-transparent to-transparent energy-flow" />

      <div className="relative w-full bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="space-y-4">
              <Image
                src="/logo-blanco.png"
                alt="EXA Contable"
                width={180}
                height={54}
                className="h-12 w-auto"
              />
              <p className="text-sm text-white/50 leading-relaxed max-w-xs">
                Sistema contable y financiero para empresas ecuatorianas. Más de 15 años automatizando procesos contables.
              </p>
              <div className="space-y-1.5 text-sm text-white/40">
                <a href="mailto:info@exacontable.com" className="flex items-center gap-2 transition-colors hover:text-white">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  info@exacontable.com
                </a>
                <a href="tel:+593978835575" className="flex items-center gap-2 transition-colors hover:text-white">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  +593 97 883 5575
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-4 border-l-2 border-primary pl-3 text-xs font-bold tracking-wider uppercase text-white">
                Navegación
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.navegacion.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-white/50 transition-all duration-300 hover:text-white"
                    >
                      <ArrowUpRight className="h-3 w-3 text-primary opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 border-l-2 border-primary pl-3 text-xs font-bold tracking-wider uppercase text-white">
                Legales
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.legales.map((link) => (
                  <li key={link.href}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-1 text-sm text-white/50 transition-all duration-300 hover:text-white"
                      >
                        <ArrowUpRight className="h-3 w-3 text-primary opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
                        <span>{link.label}</span>
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-white/50 transition-all duration-300 hover:text-white"
                      >
                        <ArrowUpRight className="h-3 w-3 text-primary opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0" />
                        <span>{link.label}</span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-white/30">
              Exa Sistema Contable &copy; {currentYear} &mdash; Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/exacontable"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 transition-colors hover:text-white"
              >
                Instagram
              </a>
              <a
                href="https://wa.me/593978835575"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 transition-colors hover:text-white"
              >
                WhatsApp
              </a>
              <a
                href="https://facebook.com/exacontable"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-white/30 transition-colors hover:text-white"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <span className="from-primary/15 absolute inset-x-0 bottom-0 -z-10 h-1/3 w-full bg-gradient-to-t" />
      </div>

      <style jsx>{`
        .energy-flow {
          animation: energy-flow 4s linear infinite;
          background-size: 200% 100%;
        }
        @keyframes energy-flow {
          0% { background-position: -100% 0; }
          100% { background-position: 100% 0; }
        }
      `}</style>
    </footer>
  );
}
