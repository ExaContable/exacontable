import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function mapPlanToStoreProduct(plan: any): any {
  // Parse features JSON string to array
  const features = typeof plan.features === "string" 
    ? JSON.parse(plan.features) 
    : (plan.features || []);
  
  // Format features as <li> items in description so PlanCard parses them dynamically
  const descriptionWithLi = plan.description || "";
  const ulFeatures = `<ul>${features.map((f: string) => `<li>${f}</li>`).join("")}</ul>\n${descriptionWithLi}`;
  
  const priceInCents = Math.round(plan.price * 100).toString();

  let categoryId = 1;
  if (plan.category === "sistema-contable") categoryId = 1;
  if (plan.category === "facturacion-electronica") categoryId = 2;
  if (plan.category === "servicios") categoryId = 3;

  return {
    id: plan.id,
    name: plan.name,
    slug: plan.slug,
    type: "simple",
    description: ulFeatures,
    prices: {
      price: priceInCents,
      regular_price: priceInCents,
      sale_price: priceInCents,
      currency_code: "USD",
      currency_symbol: "$",
      currency_minor_unit: 2,
      currency_decimal_separator: ".",
      currency_thousand_separator: ",",
      currency_prefix: "$",
      currency_suffix: "",
    },
    price_html: `<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&#36;</span>${plan.price.toFixed(2)}</bdi></span>`,
    images: [],
    categories: [
      {
        id: categoryId,
        name: plan.category === "sistema-contable"
          ? "Sistema Contable"
          : plan.category === "facturacion-electronica"
          ? "Facturación Electrónica"
          : "Servicios",
        slug: plan.category,
      },
    ],
    add_to_cart: {
      text: "Comprar",
      url: "",
      minimum: 1,
      maximum: 1,
    },
    is_purchasable: true,
    is_in_stock: true,
    // Add period metadata to help frontend filterByPeriod function
    period: plan.period,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const singleId = searchParams.get("id");

    if (singleId) {
      // Find single plan by ID or by Slug
      let plan = await prisma.plan.findUnique({
        where: { id: singleId },
      });

      if (!plan) {
        plan = await prisma.plan.findUnique({
          where: { slug: singleId },
        });
      }

      if (!plan) {
        return NextResponse.json(
          { error: "Producto no encontrado" },
          { status: 404 }
        );
      }

      return NextResponse.json(mapPlanToStoreProduct(plan));
    }

    // Fetch all active plans sorted from lowest price to highest
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });

    const mapped = plans.map(mapPlanToStoreProduct);
    return NextResponse.json(mapped);
  } catch (error) {
    console.error("Error fetching products from DB:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}
