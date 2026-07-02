import type { PlanMeta } from "@/types";

export const planMetaMap: Record<string, PlanMeta> = {
  "plan-sistema-contable": {
    tipoDocumento: "ruc",
    requiereUsuario: true,
    requiereClave: true,
    requiereGenero: true,
    requiereDireccion: true,
  },
  "plan-contador": {
    tipoDocumento: "cedula",
    requiereUsuario: true,
    requiereClave: true,
    requiereGenero: true,
    requiereDireccion: false,
  },
  "facturacion-electronica": {
    tipoDocumento: "ambos",
    requiereUsuario: true,
    requiereClave: true,
    requiereGenero: false,
    requiereDireccion: false,
  },
  servicios: {
    tipoDocumento: "ambos",
    requiereUsuario: false,
    requiereClave: false,
    requiereGenero: false,
    requiereDireccion: false,
  },
};

export function getPlanMeta(categorySlug: string): PlanMeta {
  return (
    planMetaMap[categorySlug] || {
      tipoDocumento: "ambos",
      requiereUsuario: false,
      requiereClave: false,
      requiereGenero: false,
      requiereDireccion: false,
    }
  );
}

export function getPlanMetaFromCategories(
  categories: { slug: string }[]
): PlanMeta {
  const primarySlug =
    categories.find((c) => planMetaMap[c.slug])?.slug || "servicios";
  return getPlanMeta(primarySlug);
}
