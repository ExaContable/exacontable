import { NextResponse } from "next/server";
import { initWhatsApp, isConnected, getQR } from "@/lib/whatsapp-client";

export async function GET() {
  await initWhatsApp();

  const connected = isConnected();
  const { qr, qrBase64 } = getQR();

  return NextResponse.json({
    connected,
    qr: qr || null,
    qrBase64: qrBase64 || null,
  });
}
