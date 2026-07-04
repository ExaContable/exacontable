"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/#caracteristicas", label: "Características" },
  { href: "/#funcionamiento", label: "Cómo funciona" },
  { href: "/#testimonios", label: "Testimonios" },
  { href: "/#planes", label: "Planes" },
  { href: "/#contacto", label: "Contacto" },
];

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { opacity: 1, y: 0 },
};

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [mobileOpen]);

  return (
    <motion.header
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "fixed left-0 right-0 z-50 transition-all duration-500 ease-in-out",
        isScrolled
          ? "top-4 mx-auto w-[calc(100%-2rem)] max-w-5xl rounded-full border border-border bg-background/85 shadow-lg backdrop-blur-xl"
          : "top-0 w-full border-b border-transparent bg-background/30 backdrop-blur-sm",
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between transition-all duration-500",
          isScrolled
            ? "h-14 px-6 max-w-5xl"
            : "h-16 px-4 sm:px-6 lg:px-8 max-w-7xl",
        )}
      >
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Link
            href="/"
            className="flex items-center gap-2"
            aria-label="Ir al inicio"
          >
            <Image
              src="/logo-exa.png"
              alt="EXA Contable"
              width={120}
              height={36}
              className="h-8 w-auto"
              priority
            />
          </Link>
        </motion.div>

        <nav aria-label="Menu de navegacion" className="hidden md:block">
          <motion.ul
            variants={containerVariants}
            className="flex items-center gap-1"
          >
            {navLinks.map((link) => (
              <motion.li key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  onMouseEnter={() => setHoveredItem(link.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  aria-current={link.href === "/" ? "page" : undefined}
                  className="relative rounded-full px-4 py-2 text-sm font-bold font-heading text-red-800 transition-colors hover:text-foreground"
                >
                  {hoveredItem === link.href && (
                    <motion.span
                      layoutId="navbar-hover"
                      className="absolute inset-0 rounded-full bg-muted"
                      transition={{
                        type: "spring",
                        duration: 0.4,
                        bounce: 0.1,
                      }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </motion.li>
            ))}

            <motion.li
              variants={itemVariants}
              className="flex items-center gap-1.5 ml-2 border-l border-border pl-3"
            >
              <a
                href="https://instagram.com/exacontable"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de EXA Contable"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 transition-all duration-300"
              >
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a
                href="mailto:info@exacontable.com"
                aria-label="Correo de EXA Contable"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary hover:scale-105 transition-all duration-300"
              >
                <Mail className="h-4 w-4" />
              </a>
            </motion.li>
          </motion.ul>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Cerrar menu" : "Abrir menu"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "fixed left-4 right-4 z-50 rounded-2xl border border-border bg-background/95 shadow-xl backdrop-blur-xl md:hidden",
              isScrolled
                ? "top-20"
                : "top-16 left-0 right-0 rounded-none border-l-0 border-r-0",
            )}
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navegacion"
          >
            <nav className="space-y-1 px-4 py-6">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-lg px-4 py-3 text-lg font-bold font-heading text-red-800 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex items-center justify-center gap-4 pt-6 border-t border-border mt-4">
                <a
                  href="https://instagram.com/exacontable"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Instagram de EXA Contable"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <InstagramIcon className="h-5 w-5" />
                </a>
                <a
                  href="mailto:info@exacontable.com"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Correo de EXA Contable"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
