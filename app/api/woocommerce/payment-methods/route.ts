import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { isActive: true },
    });

    const activeGateways = paymentMethods.map((method) => {
      let accounts = undefined;
      if (method.code === "bacs" && method.config) {
        try {
          const configObj = JSON.parse(method.config);
          if (configObj.bank_name || configObj.account_number) {
            accounts = [
              {
                account_name: configObj.account_name || "EXA CONTABLE",
                account_number: configObj.account_number || "",
                bank_name: configObj.bank_name || "Banco Pichincha",
              },
            ];
          }
        } catch (e) {
          console.warn("Failed to parse bacs config:", e);
        }
      }

      return {
        id: method.code,
        title: method.name,
        description: method.description || "",
        ...(accounts && { accounts }),
      };
    });

    return NextResponse.json(activeGateways);
  } catch (error) {
    console.error("Error fetching local payment gateways:", error);
    // Hardcoded fallback in case database query fails
    return NextResponse.json([
      {
        id: "bacs",
        title: "Transferencia Bancaria Directa",
        description: "Realiza tu transferencia bancaria y sube tu comprobante de pago.",
        accounts: [
          {
            account_name: "EXA CONTABLE S.A.S.",
            account_number: "1234567890",
            bank_name: "Banco Pichincha",
          },
        ],
      },
      {
        id: "payphonebox",
        title: "PayPhone",
        description: "Paga de forma segura con tu tarjeta de crédito o débito a través de PayPhone.",
      },
    ]);
  }
}
