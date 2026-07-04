import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { fetchProducts, fetchProductCategories } from "@/lib/woocommerce-rest"

export async function POST() {
  try {
    const categories = await fetchProductCategories()

    const allowedSlugs = ["plan-sistema-contable", "plan-contador", "facturacion-electronica", "servicios"]
    const planCategories = categories.filter((cat: any) =>
      allowedSlugs.includes(cat.slug)
    )

    const plansToSync = await Promise.all(
      planCategories.map(async (cat: any) => {
        const products = await fetchProducts({
          category: cat.id,
          per_page: 100,
        })
        return products.map((p: any) => {
          const nameLower = p.name.toLowerCase();
          const slugLower = p.slug.toLowerCase();
          
          let category = "planes-mensuales";
          let period = "mensual";

          if (slugLower.includes("compra-total") || nameLower.includes("compra total") || nameLower.includes("pago único") || nameLower.includes("unico")) {
            category = "compra-total";
            period = "unico";
          } else if (slugLower.includes("anual") || nameLower.includes("anual") || nameLower.includes("basico") || nameLower.includes("ideal") || nameLower.includes("ilimitado")) {
            category = "planes-anuales";
            period = "anual";
          }

          // Split description by lines, trim, and clean up to use as features list
          const descriptionClean = p.description ? p.description.replace(/<[^>]*>/g, "").trim() : "";
          const features = descriptionClean 
            ? descriptionClean.split("\n").map((f: string) => f.replace(/^[-•*+]\s*/, "").trim()).filter(Boolean)
            : [];

          return {
            name: p.name,
            slug: p.slug,
            description: descriptionClean,
            price: parseFloat(p.price) || 0,
            category,
            period,
            features: JSON.stringify(features),
            isActive: p.status === "publish",
            sortOrder: 0,
          }
        })
      })
    )

    const flatPlans = plansToSync.flat()
    let imported = 0
    let updated = 0

    for (const plan of flatPlans) {
      const existing = await prisma.plan.findUnique({
        where: { slug: plan.slug },
      })

      if (existing) {
        await prisma.plan.update({
          where: { slug: plan.slug },
          data: {
            name: plan.name,
            description: plan.description,
            price: plan.price,
            category: plan.category,
            period: plan.period,
            isActive: plan.isActive,
          },
        })
        updated++
      } else {
        await prisma.plan.create({ data: plan })
        imported++
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      updated,
      total: flatPlans.length,
    })
  } catch (error) {
    console.error("Error syncing plans:", error)
    return NextResponse.json(
      { error: "Error al sincronizar planes" },
      { status: 500 }
    )
  }
}
