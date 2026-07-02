"use client";

import Link from "next/link";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
export function CartDrawer() {
  const { cart, isOpen, setOpen, loading, removeItem, updateItem } = useCart();

  const formatPrice = (cents: string, prefix = "$") => {
    const num = parseInt(cents);
    if (isNaN(num)) return `${prefix}0.00`;
    return `${prefix}${(num / 100).toFixed(2)}`;
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Carrito de compras
          </SheetTitle>
        </SheetHeader>

        {!cart || cart.items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <ShoppingBag className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
            <Link href="/#planes" onClick={() => setOpen(false)}>
            <Button variant="outline">Ver planes</Button>
          </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-4 py-4">
              {cart.items.map((item) => (
                <div key={item.key} className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(item.prices.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      disabled={loading}
                      onClick={() => updateItem(item.key, Math.max(0, item.quantity - 1))}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      disabled={loading}
                      onClick={() => updateItem(item.key, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground"
                    onClick={() => removeItem(item.key)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-lg font-bold">
                  {formatPrice(cart.totals.total_price, cart.totals.currency_prefix)}
                </span>
              </div>

              <div className="rounded-lg border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">Métodos de pago autorizados en Ecuador:</p>
                <p className="flex items-center gap-1.5 mt-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Transferencia Bancaria (Banco Pichincha)
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                  Tarjetas de Crédito / Débito (Payphone)
                </p>
              </div>

              <Link href="/checkout" onClick={() => setOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/95 text-primary-foreground font-semibold" size="lg">
                  Proceder al pago
                </Button>
              </Link>
              <Link href="/#planes" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full">Seguir comprando</Button>
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
