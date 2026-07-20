import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function toStoreProduct(plan: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: string;
  period: string;
  features: string;
}) {
  const features = JSON.parse(plan.features || "[]");
  const priceStr = plan.price.toFixed(2);
  const priceMinorUnits = Math.round(plan.price * 100);

  return {
    id: plan.id,
    name: plan.name,
    slug: plan.slug,
    description: plan.description,
    price: priceStr,
    price_html: `<span class="price"><span class="exacontable-Price-amount amount"><bdi>$${priceStr}</bdi></span></span>`,
    prices: {
      price: String(priceMinorUnits),
      regular_price: String(priceMinorUnits),
      sale_price: String(priceMinorUnits),
      currency_code: "USD",
      currency_symbol: "$",
      currency_minor_unit: 2,
      currency_decimal_separator: ".",
      currency_thousand_separator: ",",
      currency_prefix: "$",
      currency_suffix: "",
    },
    categories: [{ id: plan.category, name: plan.category, slug: plan.category }],
    features,
    period: plan.period,
    images: [],
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const id = searchParams.get("id");

    if (slug) {
      const plan = await prisma.plan.findUnique({ where: { slug } });
      if (!plan) {
        return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
      }
      return NextResponse.json(toStoreProduct(plan));
    }

    if (id) {
      const plan = await prisma.plan.findUnique({ where: { id } });
      if (!plan) {
        return NextResponse.json({ error: "Plan no encontrado" }, { status: 404 });
      }
      return NextResponse.json(toStoreProduct(plan));
    }

    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });

    const products = plans.map((plan) => toStoreProduct(plan));

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json({ error: "Error al cargar planes" }, { status: 500 });
  }
}
