"use client";

import { Check, ShoppingCart, Zap, Rocket, Crown, Infinity } from "lucide-react";
import { Button } from "@/components/ui/button";
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

function getHardcodedFeatures(name: string, slug: string): string[] {
  const n = name.toLowerCase();
  const s = slug.toLowerCase();

  // 1. Compra Total
  if (s.includes("compra-total") || n.includes("compra total")) {
    if (n.includes("corporativo") || s.includes("corporativo")) {
      return [
        "3 Empresas",
        "Usuarios y Contadores Ilimitados",
        "Todos los Módulos del Sistema incluidos",
        "Primer año Facturación SRI Ilimitada",
        "Soporte Técnico Personalizado",
        "Actualizaciones",
        "3 Meses de Capacitaciones",
      ];
    }
    return [
      "1 Empresa",
      "Usuarios y Contadores Ilimitados",
      "Todos los Módulos del Sistema incluidos",
      "Primer año Facturación SRI Ilimitada",
      "Soporte Técnico Personalizado",
      "Actualizaciones",
      "3 Meses de Capacitación",
    ];
  }

  // 2. Facturación Electrónica (Anual)
  if (s.includes("basico") || s.includes("ideal") || s.includes("ilimitado") || n.includes("básico") || n.includes("ideal") || n.includes("ilimitado")) {
    if (n.includes("básico i") || n.includes("basico i") || s.includes("basico-i")) {
      return [
        "Facturas",
        "Comprobantes de retención",
        "Notas de crédito",
        "Guías de remisión",
        "100 Documentos anuales",
        "Soporte Técnico Personalizado",
        "Actualizaciones",
      ];
    }
    if (n.includes("básico ii") || n.includes("basico ii") || s.includes("basico-ii")) {
      return [
        "Facturas",
        "Comprobantes de retención",
        "Notas de crédito",
        "Guías de remisión",
        "600 Documentos anuales",
        "Soporte Técnico Personalizado",
        "Actualizaciones",
      ];
    }
    if (n.includes("ideal") && !n.includes("compra")) {
      return [
        "Facturas",
        "Comprobantes de retención",
        "Notas de crédito",
        "Guías de remisión",
        "1200 Documentos anuales",
        "Soporte Técnico Personalizado",
        "Actualizaciones",
      ];
    }
    if (n.includes("ilimitado")) {
      return [
        "Facturas",
        "Comprobantes de retención",
        "Notas de crédito",
        "Guías de remisión",
        "Documentos Ilimitados",
        "Soporte Técnico Personalizado",
        "Actualizaciones",
      ];
    }
  }

  // 3. Sistema Integral
  const isMensual = n.includes("mensual") || s.includes("mensual");
  const isAnual = n.includes("anual") || s.includes("anual");

  if (n.includes("emprendedor") || n.includes("starter") || s.includes("emprendedor") || s.includes("starter")) {
    if (isMensual) {
      return [
        "1 Usuario",
        "Módulos: Inventario, Ventas y Compras, Facturación electrónica, Tributación, Cuentas por Cobrar, Cuentas por Pagar, Contabilidad, Costo de venta, Bancos y Nómina",
        "Facturación electrónica: 100 Documentos al mes",
        "Soporte Técnico Personalizado",
        "Actualizaciones",
        "3 Meses de capacitación",
      ];
    }
    return [
      "1 Usuario",
      "Módulos: Inventario, Ventas y Compras, Facturación electrónica, Tributación, Cuentas por Cobrar, Cuentas por Pagar, Contabilidad, Costo de venta, Bancos, Nómina",
      "Facturación electrónica: 1200 Documentos al año",
      "Soporte Técnico Personalizado",
      "Actualizaciones",
      "3 Meses de capacitación",
    ];
  }

  if (n.includes("ejecutivo") || s.includes("ejecutivo")) {
    if (isMensual) {
      return [
        "2 Usuarios - 1 Contador",
        "Módulos: Inventario, Ventas y Compras, Facturación electrónica, Tributación, Cuentas por Cobrar, Cuentas por Pagar, Contabilidad, Costo de venta, Bancos",
        "Nómina (5 Empleados)",
        "Facturación electrónica: 200 Documentos al mes",
        "Soporte Técnico Personalizado",
        "Actualizaciones",
        "3 Meses de capacitación",
      ];
    }
    return [
      "2 Usuarios - 1 Contador",
      "Módulos: Inventario, Ventas y Compras, Facturación electrónica, Tributación, Cuentas por Cobrar, Cuentas por Pagar, Contabilidad, Costo de venta, Bancos",
      "Nómina (5 Empleados)",
      "Facturación electrónica: 2400 Documentos al año",
      "Soporte Técnico Personalizado",
      "Actualizaciones",
      "3 Meses de capacitación",
    ];
  }

  if (n.includes("empresarial") || s.includes("empresarial")) {
    if (isMensual) {
      return [
        "3 Usuarios - 1 Contador",
        "Módulos: Inventario, Ventas y Compras, Facturación electrónica, Tributación, Cuentas por Cobrar, Cuentas por Pagar, Contabilidad, Costo de venta, Bancos",
        "Nómina (100 Empleados)",
        "Facturación electrónica ilimitada",
        "Soporte Técnico Personalizado",
        "Actualizaciones",
        "3 Meses de capacitación",
      ];
    }
    return [
      "3 Usuarios - 1 Contador",
      "Módulos: Inventario, Ventas y Compras, Facturación electrónica, Tributación, Cuentas por Cobrar, Cuentas por Pagar, Contabilidad, Costo de venta, Bancos",
      "Nómina (100 Empleados)",
      "Facturación electrónica: Ilimitado",
      "Soporte Técnico Personalizado",
      "Actualizaciones",
      "3 Meses de capacitación",
    ];
  }

  return [
    "Facturación Electrónica SRI Ilimitada",
    "Control de Ventas, Compras e Inventarios",
    "Reportes Financieros en Tiempo Real",
    "Acceso Multi-usuario en la Nube",
    "Actualizaciones automáticas ante cambios de Ley",
    "Soporte Técnico de Alta Calidad",
  ];
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

  if (features.length >= 3) return features.slice(0, 8);

  return getHardcodedFeatures(name, slug);
}

interface PlanCardProps {
  product: StoreProduct;
  index?: number;
}

export function PlanCard({ product, index = 0 }: PlanCardProps) {
  const { addItem, loading } = useCart();
  const features = parseFeatures(product.name, product.description, product.slug);
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
      className="relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1.5 shadow-md hover:shadow-xl hover:border-primary/20"
    >

      <div className="relative mb-4">
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
            className="w-full gap-2 transition-all duration-300 rounded-full font-bold bg-primary hover:bg-primary/95 text-white shadow-md shadow-primary/20"
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
