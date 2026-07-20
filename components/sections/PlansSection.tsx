"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { PlanToggle } from "@/components/plans/PlanToggle";
import { PlanCard } from "@/components/plans/PlanCard";
import { CustomPlanBuilder } from "@/components/plans/CustomPlanBuilder";
import { useProducts } from "@/hooks/use-products";
import type { StoreProduct } from "@/types";
import type { BillingPeriod } from "@/types";
import { LazyMotion, m, domAnimation, AnimatePresence } from "framer-motion";
import { RefreshCw, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DbPlan {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: string;
  period: string;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

function filterByPeriod(
  products: StoreProduct[],
  period: BillingPeriod,
  periodMap: Record<string, string>
): StoreProduct[] {
  return products.filter((p) => {
    const dbPeriod = periodMap[p.slug] || periodMap[p.name];
    if (dbPeriod) return dbPeriod === period;

    const name = p.name.toLowerCase();
    const slug = p.slug.toLowerCase();
    switch (period) {
      case "mensual":
        return name.includes("mensual") && !slug.includes("compra-total");
      case "anual":
        return name.includes("anual") || (name.includes("basico") || name.includes("ideal") || name.includes("ilimitado"));
      case "compra-total":
        return slug.includes("compra-total");
      default:
        return true;
    }
  });
}

function SkeletonCard() {
  return (
    <div className="relative flex flex-col rounded-lg border border-border bg-card p-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent -translate-x-full animate-pulse" />
      <div className="mb-4">
        <div className="mb-2 h-3 w-24 animate-pulse rounded bg-muted" />
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>
      <div className="mb-6">
        <div className="h-8 w-28 animate-pulse rounded bg-muted" />
      </div>
      <div className="mb-8 flex-1 space-y-2.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
      <div className="h-11 w-full animate-pulse rounded-lg bg-muted" />
    </div>
  );
}

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 60 : -60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -60 : 60 }),
};

export function PlansSection() {
  const [activeTab, setActiveTab] = useState<"sistema" | "facturacion" | "servicios">("sistema");
  const [period, setPeriod] = useState<BillingPeriod>("mensual");
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [dbPlans, setDbPlans] = useState<DbPlan[]>([]);
  const { products, loading, error, refetch } = useProducts("per_page=50");

  useEffect(() => {
    setPage(0);
  }, [activeTab, period]);

  useEffect(() => {
    fetch("/api/admin/plans")
      .then((r) => r.json())
      .then((data) => setDbPlans(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  function parseFeaturesFromDb(raw: unknown): string[] {
    if (Array.isArray(raw)) return raw.filter((f): f is string => typeof f === "string")
    if (typeof raw === "string") try { return JSON.parse(raw) } catch { return [] }
    return []
  }

  function detectPeriodFromProduct(product: StoreProduct): string | null {
    const slug = product.slug.toLowerCase()
    if (slug.includes("compra-total")) return "compra-total"
    if (slug.includes("anual") || slug.includes("year")) return "anual"
    if (slug.includes("mensual") || slug.includes("month")) return "mensual"
    const name = product.name.toLowerCase()
    if (name.includes("compra total") || name.includes("pago único")) return "compra-total"
    if (name.includes("anual")) return "anual"
    if (name.includes("mensual")) return "mensual"
    return null
  }

  function findDbPlan(product: StoreProduct): DbPlan | undefined {
    const detectedPeriod = detectPeriodFromProduct(product)

    const exact = dbPlans.find(
      (p) => p.slug === product.slug && (!detectedPeriod || p.period === detectedPeriod)
    )
    if (exact) return { ...exact, features: parseFeaturesFromDb(exact.features) }

    const slugContains = dbPlans.find(
      (p) =>
        (product.slug.includes(p.slug) || p.slug.includes(product.slug)) &&
        (!detectedPeriod || p.period === detectedPeriod)
    )
    if (slugContains) return { ...slugContains, features: parseFeaturesFromDb(slugContains.features) }

    const sameName = dbPlans.find(
      (p) =>
        p.name.toLowerCase() === product.name.toLowerCase().replace(/^EXA\s*/i, "").trim() &&
        (!detectedPeriod || p.period === detectedPeriod)
    )
    if (sameName) return { ...sameName, features: parseFeaturesFromDb(sameName.features) }

    const anyName = dbPlans.find(
      (p) => p.slug === product.slug || p.name === product.name
    )
    if (anyName) return { ...anyName, features: parseFeaturesFromDb(anyName.features) }

    return undefined
  }

  const periodMap = useMemo(() => {
    const map: Record<string, string> = {};
    dbPlans.forEach((p) => { map[p.slug] = p.period; map[p.name] = p.period; });
    return map;
  }, [dbPlans]);

  const filtered = (() => {
    if (activeTab === "sistema") {
      return filterByPeriod(products, period, periodMap)
        .filter((p) => p.categories[0]?.slug === "sistema-contable");
    }
    if (activeTab === "facturacion") {
      return products.filter((p) => p.categories[0]?.slug === "facturacion-electronica");
    }
    return products.filter((p) => p.categories[0]?.slug === "servicios");
  })();

  const grouped = filtered.reduce<Record<string, StoreProduct[]>>((acc, p) => {
    const cat = p.categories[0]?.slug || "otros";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const categoryOrder = activeTab === "sistema"
    ? ["sistema-contable"]
    : activeTab === "facturacion"
    ? ["facturacion-electronica"]
    : ["servicios"];

  const categoryNames: Record<string, string> = {
    "sistema-contable": "Planes Sistema Contable",
    "facturacion-electronica": "Facturación Electrónica",
    servicios: "Servicios",
  };

  const currentPlans = categoryOrder.flatMap((cat) => grouped[cat] || []);
  const totalPages = Math.max(1, Math.ceil(currentPlans.length / 1));

  const clampedPage = Math.min(page, Math.max(0, currentPlans.length - 1));

  const goTo = useCallback((i: number) => {
    setDirection(i > page ? 1 : -1);
    setPage(i);
  }, [page]);

  const next = useCallback(() => {
    setDirection(1);
    setPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const prev = useCallback(() => {
    setDirection(-1);
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  return (
    <LazyMotion features={domAnimation}>
    <section id="planes" className="scroll-mt-20 pt-40 pb-36 relative overflow-hidden bg-background">
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
            Precios
          </span>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl font-heading text-foreground">
            Planes y Precios
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Adquiere uno de nuestros planes y descubre cómo EXA puede ayudarte a mejorar la gestión financiera de tu empresa.
          </p>
        </m.div>

        <div className="mt-12 flex flex-col items-center gap-6">
          {/* Pestañas Principales */}
          <div className="inline-flex rounded-full border border-border bg-card/60 p-1 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("sistema")}
              className={cn(
                "relative rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300",
                activeTab === "sistema"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Sistema Contable y Contador
            </button>
            <button
              onClick={() => setActiveTab("facturacion")}
              className={cn(
                "relative rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300",
                activeTab === "facturacion"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Facturación Electrónica
            </button>
            <button
              onClick={() => setActiveTab("servicios")}
              className={cn(
                "relative rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300",
                activeTab === "servicios"
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Servicios
            </button>
          </div>

          {/* Selector de Periodo */}
          {activeTab === "sistema" && (
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-center"
            >
              <PlanToggle value={period} onChange={setPeriod} />
            </m.div>
          )}
        </div>

        {error && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 flex flex-col items-center gap-4 rounded-lg border border-destructive/30 bg-destructive/5 p-8 text-center"
          >
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div>
              <p className="font-semibold text-destructive">Error al cargar los planes</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={refetch}>
              <RefreshCw className="h-4 w-4" />
              Reintentar
            </Button>
          </m.div>
        )}

        {loading && (
          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && !error && (
          <>
            {Object.keys(grouped).length === 0 ? (
              <m.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-16 text-center"
              >
                <div className="rounded-2xl border border-dashed border-border p-12">
                  <p className="text-muted-foreground">
                    No hay planes disponibles para esta categoría o período.
                  </p>
                </div>
                <CustomPlanBuilder />
              </m.div>
            ) : (
              categoryOrder.map(
                (cat) =>
                  grouped[cat] &&
                  grouped[cat].length > 0 && (
                    <div key={cat} className="mt-12">
                      <div className="mb-6 flex items-center gap-3">
                         <div className="h-px flex-1 bg-border" />
                         <h3 className="text-sm font-bold tracking-wider text-muted-foreground uppercase">
                           {categoryNames[cat] || cat}
                         </h3>
                         <div className="h-px flex-1 bg-border" />
                      </div>
                      {/* Mobile carousel */}
                      <div className="sm:hidden">
                        {currentPlans.length > 0 && (
                          <div className="relative">
                            <AnimatePresence mode="wait" custom={direction}>
                              <m.div
                                key={clampedPage}
                                custom={direction}
                                variants={slideVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                  <PlanCard
                                product={currentPlans[clampedPage]}
                                index={clampedPage}
                                features={findDbPlan(currentPlans[clampedPage])?.features}
                                description={findDbPlan(currentPlans[clampedPage])?.description}
                                period={findDbPlan(currentPlans[clampedPage])?.period}
                              />
                              </m.div>
                            </AnimatePresence>

                            {totalPages > 1 && (
                              <>
                                <button
                                  onClick={prev}
                                  aria-label="Anterior"
                                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md text-slate-700 hover:text-primary hover:shadow-lg transition-all border border-zinc-200"
                                >
                                  <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={next}
                                  aria-label="Siguiente"
                                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md text-slate-700 hover:text-primary hover:shadow-lg transition-all border border-zinc-200"
                                >
                                  <ChevronRight className="h-4 w-4" />
                                </button>
                              </>
                            )}

                            {totalPages > 1 && (
                              <div className="flex justify-center gap-2 mt-6">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                  <button
                                    key={i}
                                    onClick={() => goTo(i)}
                                    aria-label={`Ir a página ${i + 1}`}
                                    className={`h-2 rounded-full transition-all duration-300 ${
                                      i === page
                                        ? "w-6 bg-primary"
                                        : "w-2 bg-primary/30 hover:bg-primary/50"
                                    }`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      {/* Desktop grid */}
                      <div className="hidden sm:grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {grouped[cat].map((product, index) => (
                          <PlanCard
                            key={product.id}
                            product={product}
                            index={index}
                            features={findDbPlan(product)?.features}
                            description={findDbPlan(product)?.description}
                            period={findDbPlan(product)?.period}
                          />
                        ))}
                      </div>
                      <CustomPlanBuilder />
                    </div>
                  )
              )
            )}
          </>
        )}
      </div>
    </section>
    </LazyMotion>
  );
}
