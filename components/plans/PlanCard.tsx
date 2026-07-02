"use client";

import { Check, ShoppingCart, Zap, Rocket, Crown, Infinity, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import type { StoreProduct } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { toast } from "sonner";

const iconMap: Record<string, typeof Rocket> = {
  starter: Rocket,
  emprendedor: Zap,
  ejecutivo: Rocket,
  empresarial: Crown,
  corporativo: Crown,
  basico: Rocket,
  ideal: Infinity,
  ilimitado: Infinity,
  junior: Rocket,
  profesional: Rocket,
  asesor: Rocket,
  consultor: Rocket,
};

function PlanIcon({ slug, className }: { slug: string; className?: string }) {
  const key = Object.keys(iconMap).find((k) => slug.includes(k));
  const Icon = key ? iconMap[key] : Rocket;
  return <Icon className={className} />;
}

function getPopular(slug: string): boolean {
  return slug.includes("emprendedor") || slug.includes("ideal");
}

function getCategoryBadge(categories: { slug: string }[]): string {
  if (categories.some((c) => c.slug === "plan-sistema-contable")) return "Sistema Contable";
  if (categories.some((c) => c.slug === "plan-contador")) return "Plan Contador";
  if (categories.some((c) => c.slug === "facturacion-electronica")) return "Fact. Electronica";
  return "";
}

function parseFeatures(name: string, description: string, slug: string): string[] {
  const features: string[] = [];

  if (description) {
    const liMatch = description.match(/<li[^>]*>(.*?)<\/li>/gi);
    if (liMatch) {
      liMatch.forEach((li) => {
        const text = li.replace(/<[^>]+>/g, "").trim();
        if (text) features.push(text);
      });
    }
  }

  if (features.length < 3) {
    const nameLower = name.toLowerCase();
    const slugLower = slug.toLowerCase();

    // Caso A: Facturación Electrónica (Básico, Ideal, Ilimitado)
    if (slugLower.includes("facturacion") || nameLower.includes("firma") || nameLower.includes("básico") || nameLower.includes("ideal") || nameLower.includes("ilimitado")) {
      if (nameLower.includes("básico") || nameLower.includes("basico") || slugLower.includes("basico")) {
        return [
          "Facturación Electrónica Ilimitada",
          "Facturas, Notas de Crédito, Retenciones",
          "Envío directo al SRI y al Cliente",
          "1 Establecimiento y Punto de Emisión",
          "Carga de firma electrónica (.p12)",
          "Soporte técnico por chat y correo",
          "Actualizaciones de leyes del SRI gratis"
        ];
      }
      if (nameLower.includes("ideal") || slugLower.includes("ideal")) {
        return [
          "Todo lo del Plan Básico",
          "Liquidaciones de Compra y Guías de Remisión",
          "Hasta 3 Establecimientos / Puntos de Emisión",
          "Carga masiva de Clientes y Productos (Excel)",
          "Reporte consolidado de Ventas XML y PDF",
          "Acceso para 2 usuarios independientes",
          "Soporte técnico preferente por WhatsApp"
        ];
      }
      if (nameLower.includes("ilimitado") || slugLower.includes("ilimitado")) {
        return [
          "Todo lo del Plan Ideal",
          "Firma Electrónica Integrada en Nube",
          "Establecimientos y Puntos de Emisión Ilimitados",
          "Usuarios y accesos simultáneos ilimitados",
          "Capacitación inicial personalizada 1 a 1",
          "Reportes avanzados de ventas y retenciones",
          "Soporte prioritario 24/7 vía telefónica y chat"
        ];
      }
    }

    // Caso B: Planes Sistema Contable / General
    if (nameLower.includes("starter") || nameLower.includes("emprendedor") || nameLower.includes("junior") || slugLower.includes("starter") || slugLower.includes("emprendedor")) {
      return [
        "Facturación Electrónica 100% Ilimitada",
        "Registro y Control de Compras y Gastos",
        "Control de Inventario básico de Productos",
        "Módulo de Clientes y Cuentas por Cobrar",
        "1 Usuario Administrador",
        "Dashboard con KPIs en tiempo real",
        "Soporte técnico por correo y chat"
      ];
    }
    if (nameLower.includes("ejecutivo") || nameLower.includes("profesional") || nameLower.includes("ideal") || slugLower.includes("ejecutivo") || slugLower.includes("profesional")) {
      return [
        "Todo lo del Plan Emprendedor",
        "Control de Inventario avanzado (Multi-bodega + Kardex)",
        "Generación automática de Anexos Transaccionales (ATS)",
        "Reportes Financieros (Pérdidas y Ganancias, Balance)",
        "Conciliación Bancaria automática",
        "Hasta 3 Usuarios con roles y accesos",
        "Soporte técnico prioritario por WhatsApp"
      ];
    }
    if (nameLower.includes("empresarial") || nameLower.includes("corporativo") || nameLower.includes("ilimitado") || slugLower.includes("empresarial") || slugLower.includes("corporativo")) {
      return [
        "Todo lo del Plan Ejecutivo",
        "Contabilidad General automatizada y Asientos",
        "Facturación multi-establecimiento ilimitada",
        "Gestión y Control de Centros de Costos",
        "API abierta de integración con otros sistemas",
        "Usuarios y accesos simultáneos ilimitados",
        "Soporte 24/7 con asesoría contable experta"
      ];
    }

    // Por defecto si no coincide
    return [
      "Facturación Electrónica SRI Ilimitada",
      "Control de Ventas, Compras e Inventarios",
      "Reportes Financieros en Tiempo Real",
      "Acceso Multi-usuario en la Nube",
      "Actualizaciones automáticas ante cambios de Ley",
      "Soporte Técnico de Alta Calidad"
    ];
  }

  return features.slice(0, 8);
}

interface PlanCardProps {
  product: StoreProduct;
  index?: number;
}

export function PlanCard({ product, index = 0 }: PlanCardProps) {
  const { addItem, loading } = useCart();
  const isPopular = getPopular(product.slug);
  const features = parseFeatures(product.name, product.description, product.slug);
  const categoryBadge = getCategoryBadge(product.categories);

  const priceMinorUnits = parseInt(product.prices.price);
  const divisor = Math.pow(10, product.prices.currency_minor_unit || 2);
  const price = priceMinorUnits / divisor;

  const isCompraTotal = product.slug.includes("compra-total");
  const periodLabel = isCompraTotal
    ? "Pago Unico"
    : product.name.toLowerCase().includes("mensual")
    ? "/Mes"
    : "/Anual";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "relative flex flex-col rounded-2xl border bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-xl",
        isPopular
          ? "border-primary/50 shadow-[0_8px_30px_rgba(220,76,30,0.1)] hover:border-primary hover:shadow-[0_12px_40px_rgba(220,76,30,0.15)]"
          : "border-zinc-200 hover:border-primary/20",
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <Badge className="bg-primary text-primary-foreground shadow-[0_0_15px_rgba(160,37,37,0.4)] whitespace-nowrap gap-1 px-3 py-1">
            <Star className="h-3 w-3 fill-primary-foreground" />
            Más Popular
          </Badge>
        </div>
      )}

      <div className={`pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 ${isPopular ? "bg-[radial-gradient(ellipse_at_top,rgba(220,76,30,0.03),transparent_70%)]" : ""} ${isPopular ? "opacity-100" : ""}`} />

      <div className="relative mb-4">
        {categoryBadge && (
          <span className="mb-3 inline-block text-[10px] font-bold tracking-wider text-slate-500 uppercase">
            {categoryBadge}
          </span>
        )}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/70 text-white shadow-lg shadow-primary/20">
            <PlanIcon slug={product.slug} className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">
            {product.name.replace(/^EXA\s*/i, "")}
          </h3>
        </div>
      </div>

      <div className="relative mb-6 flex items-baseline gap-1">
        <NumberFlow
          value={price}
          format={{ style: "currency", currency: "USD", trailingZeroDisplay: "stripIfInteger" }}
          className="text-3xl font-extrabold text-slate-900 font-heading"
        />
        <span className="text-sm text-slate-500">{periodLabel}</span>
      </div>

      <ul className="relative mb-8 flex-1 space-y-2.5">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="relative">
        <Button
          className={cn(
            "w-full gap-2 transition-all duration-300 rounded-full font-bold",
            isPopular
              ? "bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/20"
              : "border-zinc-200 hover:border-primary/20 text-slate-800 hover:bg-slate-50 bg-white",
          )}
          variant={isPopular ? "default" : "outline"}
          size="lg"
          disabled={loading}
          onClick={async () => {
            try {
              await addItem(product.id);
              toast.success(`${product.name} agregado al carrito`);
            } catch {
              toast.error("Error al agregar al carrito");
            }
          }}
        >
          <ShoppingCart className="h-4 w-4" />
          Comprar Plan
        </Button>
      </div>
    </motion.div>
  );
}
