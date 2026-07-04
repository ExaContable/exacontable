import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const wpUrl = process.env.WORDPRESS_URL || "https://exacontable.com"

export async function POST() {
  try {
    const res = await fetch(
      `${wpUrl}/wp-json/wc/v3/orders?per_page=100&status=any`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.WOOCOMMERCE_KEY}:${process.env.WOOCOMMERCE_SECRET}`
          ).toString("base64")}`,
        },
      }
    )

    if (!res.ok) {
      return NextResponse.json(
        { error: `WooCommerce API error: ${res.status}` },
        { status: 500 }
      )
    }

    const wooOrders = await res.json()
    let imported = 0
    let updated = 0

    for (const woo of wooOrders) {
      const orderData = {
        wooCommerceId: woo.id,
        customerName: `${woo.billing.first_name} ${woo.billing.last_name}`.trim(),
        customerEmail: woo.billing.email,
        customerPhone: woo.billing.phone || "",
        planName: woo.line_items?.[0]?.name || "Producto",
        total: parseFloat(woo.total) || 0,
        status: woo.status,
        paymentMethod: woo.payment_method_title || "",
        paymentStatus: "pending",
      }

      const existing = await prisma.order.findUnique({
        where: { wooCommerceId: woo.id },
      })

      if (existing) {
        await prisma.order.update({
          where: { wooCommerceId: woo.id },
          data: orderData,
        })
        updated++
      } else {
        await prisma.order.create({ data: orderData })
        imported++
      }
    }

    return NextResponse.json({ success: true, imported, updated })
  } catch (error) {
    console.error("Error syncing orders:", error)
    return NextResponse.json(
      { error: "Error al sincronizar órdenes" },
      { status: 500 }
    )
  }
}
