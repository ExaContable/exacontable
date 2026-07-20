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
                account_ruc: configObj.account_ruc || "",
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
    return NextResponse.json([]);
  }
}
