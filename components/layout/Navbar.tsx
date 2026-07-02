"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Menu, X, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
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

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { itemCount, toggleOpen } = useCart();

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
          : "top-0 w-full border-b border-transparent bg-background/30 backdrop-blur-sm"
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between transition-all duration-500",
          isScrolled
            ? "h-14 px-6 max-w-5xl"
            : "h-16 px-4 sm:px-6 lg:px-8 max-w-7xl"
        )}
      >
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }}>
          <Link href="/" className="flex items-center gap-2" aria-label="Ir al inicio">
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
          <motion.ul variants={containerVariants} className="flex items-center gap-1">
            {navLinks.map((link) => (
              <motion.li key={link.href} variants={itemVariants}>
                <Link
                  href={link.href}
                  onMouseEnter={() => setHoveredItem(link.href)}
                  onMouseLeave={() => setHoveredItem(null)}
                  aria-current={link.href === "/" ? "page" : undefined}
                  className="relative rounded-full px-4 py-2 text-sm font-bold font-heading text-muted-foreground transition-colors hover:text-foreground"
                >
                  {hoveredItem === link.href && (
                    <motion.span
                      layoutId="navbar-hover"
                      className="absolute inset-0 rounded-full bg-muted"
                      transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              </motion.li>
            ))}
            <motion.li variants={itemVariants}>
              <Button
                variant="ghost"
                size="icon"
                className="relative ml-2"
                onClick={toggleOpen}
                aria-label={`Carrito de compras${itemCount > 0 ? `, ${itemCount} producto(s)` : ""}`}
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-[10px] text-primary-foreground shadow-1">
                    {itemCount > 9 ? "9+" : itemCount}
                  </Badge>
                )}
              </Button>
            </motion.li>
            <motion.li variants={itemVariants} className="flex items-center gap-1.5 ml-2 border-l border-border pl-3">
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
                href="https://wa.me/593978835575"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp de EXA Contable"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background/50 text-muted-foreground hover:bg-emerald-600 hover:text-white hover:border-emerald-600 hover:scale-105 transition-all duration-300"
              >
                <WhatsAppIcon className="h-4 w-4" />
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
            className="relative"
            onClick={toggleOpen}
            aria-label={`Carrito de compras${itemCount > 0 ? `, ${itemCount} producto(s)` : ""}`}
          >
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <Badge className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary p-0 text-[10px] text-primary-foreground shadow-1">
                {itemCount > 9 ? "9+" : itemCount}
              </Badge>
            )}
          </Button>
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
              isScrolled ? "top-20" : "top-16 left-0 right-0 rounded-none border-l-0 border-r-0"
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
                    className="block rounded-lg px-4 py-3 text-lg font-bold font-heading text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
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
                  href="https://wa.me/593978835575"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setMobileOpen(false)}
                  aria-label="WhatsApp de EXA Contable"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-muted/40 text-muted-foreground hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all"
                >
                  <WhatsAppIcon className="h-5 w-5" />
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
