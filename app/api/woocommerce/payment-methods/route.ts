import { NextResponse } from "next/server";
import { wooRest } from "@/lib/woocommerce-rest";

export async function GET() {
  try {
    // Obtener todas las pasarelas de pago de WooCommerce
    const { data } = await wooRest.get("payment_gateways");
    
    // Filtrar sólo las que están activas (enabled === true)
    const activeGateways = data
      .filter((gateway: { enabled: boolean }) => gateway.enabled)
      .map((gateway: { id: string; title: string; description: string }) => ({
        id: gateway.id,
        title: gateway.title,
        description: gateway.description,
      }));

    return NextResponse.json(activeGateways);
  } catch (error) {
    console.error("Error fetching payment gateways:", error);
    // Si falla, devolvemos un fallback por defecto para no romper el flujo
    return NextResponse.json([
      {
        id: "bacs",
        title: "Transferencia Bancaria Directa",
        description: "Banco Pichincha - Realiza tu transferencia y sube tu comprobante de pago.",
      },
      {
        id: "payphonebox",
        title: "Payphone",
        description: "Paga de forma segura con tu tarjeta de crédito o débito a través de Payphone.",
      },
    ]);
  }
}
