"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, ArrowDownLeft } from "lucide-react";

const footerLinks = {
  navegacion: [
    { href: "/", label: "Inicio" },
    { href: "/#caracteristicas", label: "Características" },
    { href: "/#funcionamiento", label: "Cómo funciona" },
    { href: "/#testimonios", label: "Testimonios" },
    { href: "/#planes", label: "Planes" },
    { href: "/#contacto", label: "Contacto" },
  ],
  legales: [
    { href: "/terminos", label: "Terminos y Condiciones" },
    { href: "/privacidad", label: "Politica de Privacidad" },
    { href: "/cookies", label: "Cookies" },
  ],
  cuenta: [
    { href: "https://admin.exacontable.com/mi-cuenta/", label: "Iniciar Sesion" },
    { href: "https://admin.exacontable.com/mi-cuenta/", label: "Registrarse" },
    { href: "https://exa.ofsercont.com/", label: "Portal Cliente" },
  ],
};

const socialLinks = [
  { icon: Mail, label: "Email", href: "mailto:info@exacontable.com" },
  { icon: Phone, label: "Telefono", href: "tel:+593978835575" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full">
      <div className="via-primary/50 h-px w-full bg-gradient-to-r from-transparent to-transparent energy-flow" />

      <div className="relative w-full bg-zinc-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-6 lg:col-span-2">
              <Image
                src="/logo-blanco.png"
                alt="EXA Contable"
                width={140}
                height={42}
                className="h-10 w-auto"
              />
              <p className="max-w-md text-sm text-white/60">
                Sistema contable y financiero para empresas de Ecuador. Más de 7
                años de experiencia en el mercado ecuatoriano.
              </p>
              <div className="flex items-center gap-2">
                {socialLinks.map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-white/60 transition-all duration-500 focus-visible:outline-2 focus-visible:outline-white hover:scale-110 hover:-rotate-12 hover:border-primary hover:bg-primary hover:text-white hover:shadow-1"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-8 lg:col-span-3">
              <div>
                <h3 className="mb-4 border-l-2 border-primary pl-3 text-sm font-semibold tracking-wider uppercase text-white">
                  Navegacion
                </h3>
                <ul className="space-y-3">
                  {footerLinks.navegacion.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group text-white/60 inline-flex items-center gap-2 underline-offset-8 transition-all duration-500 focus-visible:outline-2 focus-visible:outline-white hover:pl-4 hover:text-white hover:underline"
                      >
                        <ArrowDownLeft className="rotate-[225deg] text-primary opacity-0 transition-all duration-500 group-hover:opacity-100" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-4 border-l-2 border-primary pl-3 text-sm font-semibold tracking-wider uppercase text-white">
                  Legales
                </h3>
                <ul className="space-y-3">
                  {footerLinks.legales.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group text-white/60 inline-flex items-center gap-2 underline-offset-8 transition-all duration-500 focus-visible:outline-2 focus-visible:outline-white hover:pl-4 hover:text-white hover:underline"
                      >
                        <ArrowDownLeft className="rotate-[225deg] text-primary opacity-0 transition-all duration-500 group-hover:opacity-100" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
            <p className="text-xs text-white/40 md:text-sm">
              Exa Sistema Contable &copy; {currentYear} &ndash; Todos los
              derechos Reservados
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.cuenta.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                   className="text-xs text-white/40 transition-colors focus-visible:outline-2 focus-visible:outline-white hover:text-white md:text-sm"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <span className="from-primary/20 absolute inset-x-0 bottom-0 -z-10 h-1/3 w-full bg-gradient-to-t" />
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
