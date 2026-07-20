"use client";

import Link from "next/link";
import { X, Minus, Plus, ShoppingBag, Trash2, CreditCard, Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { LazyMotion, m, domAnimation, AnimatePresence } from "framer-motion";

import { usePathname } from "next/navigation";

export function CartDrawer() {
  const pathname = usePathname();
  const { cart, isOpen, setOpen, loading, removeItem, updateItem } = useCart();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const formatPrice = (cents: string, prefix = "$") => {
    const num = parseInt(cents);
    if (isNaN(num)) return `${prefix}0.00`;
    return `${prefix}${(num / 100).toFixed(2)}`;
  };

  const getPlanType = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("compra total")) return "Pago Único";
    if (n.includes("anual")) return "Plan Anual";
    if (n.includes("mensual")) return "Plan Mensual";
    return "Plan";
  };

  const itemVariants = {
    initial: { opacity: 0, x: 24, scale: 0.95 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit: { opacity: 0, x: -24, scale: 0.95, transition: { duration: 0.15 } },
  };

  return (
    <LazyMotion features={domAnimation}>
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md gap-0 p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-border/50">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2.5 text-lg font-heading">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <ShoppingBag className="h-4 w-4 text-primary" />
              </div>
              Carrito
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {!cart || cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/40">
              <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Tu carrito está vacío</p>
            <p className="text-xs text-muted-foreground/50 -mt-1">Explora nuestros planes y elige el tuyo</p>
            <Link href="/#planes" onClick={() => setOpen(false)} className="mt-2">
              <Button variant="outline" size="sm" className="rounded-full gap-1.5">
                <ShoppingBag className="h-3.5 w-3.5" />
                Ver planes
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 px-5 py-4">
              <AnimatePresence mode="popLayout">
                {cart.items.map((item) => (
                  <m.div
                    key={item.key}
                    layout
                    variants={itemVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="group relative flex gap-3 rounded-xl border border-border/50 bg-card/40 p-3.5 mb-3 transition-all duration-200 hover:border-border hover:bg-card/70 hover:shadow-sm"
                  >
                    {item.images?.[0]?.src && (
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-border/30 bg-muted/20">
                        <img
                          src={item.images[0].src}
                          alt={item.images[0].alt || item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold tracking-widest text-primary uppercase">
                        {getPlanType(item.name)}
                      </span>
                      <p className="text-sm font-semibold text-foreground truncate font-heading mt-0.5">
                        {item.name.replace(/^EXA\s*/i, "")}
                      </p>
                      <p className="text-sm font-bold text-foreground mt-1">
                        {formatPrice(item.totals.line_total)}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-0.5 rounded-lg border border-border/50 bg-background/60 p-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-transparent"
                            disabled={loading}
                            onClick={() => updateItem(item.key, Math.max(0, item.quantity - 1))}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-6 text-center text-xs font-bold tabular-nums text-foreground">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-transparent"
                            disabled={loading}
                            onClick={() => updateItem(item.key, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        {item.quantity > 1 && (
                          <span className="text-[10px] text-muted-foreground/60">
                            {formatPrice(item.prices.price)} c/u
                          </span>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 h-6 w-6 text-muted-foreground/30 hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      onClick={() => removeItem(item.key)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </m.div>
                ))}
              </AnimatePresence>
            </ScrollArea>

            <div className="border-t border-border/50 bg-muted/5 px-5 py-4 space-y-3.5">
              <div className="space-y-1.5">
                {cart.items.map((item) => (
                  <div key={item.key} className="flex justify-between text-xs text-muted-foreground">
                    <span className="truncate max-w-[180px]">
                      {item.name.replace(/^EXA\s*/i, "")}
                      <span className="text-muted-foreground/50"> x{item.quantity}</span>
                    </span>
                    <span className="font-semibold text-foreground tabular-nums">
                      {formatPrice(item.totals.line_total)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator className="border-border/30" />

              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground font-heading">Total</span>
                <span className="text-xl font-extrabold text-foreground font-heading tabular-nums">
                  {formatPrice(cart.totals.total_price, cart.totals.currency_prefix)}
                </span>
              </div>

              <div className="rounded-lg border border-border/40 bg-background/50 p-3 space-y-1.5">
                <p className="text-[10px] font-bold tracking-widest text-muted-foreground/70 uppercase">
                  Métodos de pago
                </p>
                <div className="space-y-1">
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Building2 className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                    Transferencia Bancaria (Banco Pichincha)
                  </p>
                  <p className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CreditCard className="h-3.5 w-3.5 text-primary/60 shrink-0" />
                    Tarjetas de Crédito / Débito (Payphone)
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Link href="/checkout" onClick={() => setOpen(false)}>
                  <Button className="w-full font-bold rounded-full shadow-sm" size="lg">
                    Proceder al pago
                  </Button>
                </Link>
                <Link href="/#planes" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full rounded-full gap-1.5 text-muted-foreground">
                    <ArrowLeft className="h-4 w-4" />
                    Seguir comprando
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
    </LazyMotion>
  );
}
