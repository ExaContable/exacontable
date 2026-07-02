"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";

export default function CartPage() {
  const { cart, loading, removeItem, updateItem, itemCount } = useCart();

  const formatPrice = (cents: string, prefix = "$") => {
    const num = parseInt(cents);
    if (isNaN(num)) return `${prefix}0.00`;
    return `${prefix}${(num / 100).toFixed(2)}`;
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 pt-16">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <h1 className="text-2xl font-bold">Tu carrito esta vacio</h1>
        <p className="text-muted-foreground">
          Agrega planes para continuar con la compra
        </p>
        <Link href="/#planes">
          <Button>Ver planes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen py-28 overflow-hidden bg-background">
      {/* Patrón de cuadrícula */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] -z-10" />
      <div className="absolute top-0 left-1/4 w-[400px] h-[300px] bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-extrabold tracking-tight font-heading">Carrito de compras</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          {itemCount} plan(es) seleccionado(s) listo(s) para activación.
        </p>

        <div className="mt-12 grid gap-8 lg:grid-cols-3 items-start">
          {/* Listado de items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.key}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card/45 backdrop-blur-sm p-6 transition-all duration-300 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="flex-1 space-y-1">
                  <span className="text-[10px] font-bold tracking-wider text-primary uppercase">Plan Suscripción</span>
                  <h3 className="text-lg font-bold text-foreground font-heading">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Precio unitario: {formatPrice(item.prices.price)}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {/* Selector de cantidad */}
                  <div className="flex items-center gap-2.5 bg-background/50 rounded-full border border-border p-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      disabled={loading}
                      onClick={() =>
                        updateItem(item.key, Math.max(0, item.quantity - 1))
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm font-bold font-heading">
                      {item.quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      disabled={loading}
                      onClick={() => updateItem(item.key, item.quantity + 1)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>

                  <div className="w-24 text-right">
                    <p className="text-lg font-extrabold text-foreground font-heading">
                      {formatPrice(item.totals.line_total)}
                    </p>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                    onClick={() => removeItem(item.key)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Resumen del pedido */}
          <div className="rounded-2xl border border-border bg-card/65 p-6 space-y-6 backdrop-blur-sm sticky top-28">
            <h3 className="text-lg font-bold text-foreground font-heading border-b border-border/60 pb-3">Resumen de compra</h3>
            
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div key={item.key} className="flex justify-between text-xs text-muted-foreground">
                  <span className="max-w-[200px] truncate">{item.name} x{item.quantity}</span>
                  <span className="font-semibold text-foreground">{formatPrice(item.totals.line_total)}</span>
                </div>
              ))}
            </div>

            <Separator className="border-border/60" />

            <div className="rounded-xl border border-border/60 bg-background/50 p-4 space-y-2 text-xs text-muted-foreground">
              <p className="font-bold text-foreground">Métodos de pago en Ecuador:</p>
              <p className="flex items-center gap-1.5">• Transferencia Bancaria (Banco Pichincha)</p>
              <p className="flex items-center gap-1.5">• Tarjetas de Crédito / Débito (Payphone)</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold">Total a pagar</span>
              <span className="text-2xl font-extrabold text-foreground font-heading">
                {formatPrice(cart.totals.total_price, cart.totals.currency_prefix)}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <Link href="/checkout" className="w-full block">
                <Button size="lg" className="w-full font-bold">
                  Proceder al pago
                </Button>
              </Link>
              <Link href="/#planes" className="w-full block">
                <Button variant="outline" className="w-full gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Seguir comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
