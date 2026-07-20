import { initWhatsApp, sendWhatsAppMessage, isConnected } from "./whatsapp-client";
import { prisma } from "./prisma";

async function getToPhone(): Promise<string> {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key: "whatsapp_number" },
    });
    if (config?.value) {
      return config.value.trim();
    }
  } catch (error) {
    console.error("Error reading whatsapp_number from config DB:", error);
  }
  return (process.env.WHATSAPP_TO || "").trim();
}

interface OrderNotification {
  order_id: string | number;
  order_number?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  items: { name: string; quantity: number; price: string }[];
  total: string;
  payment_method: string;
  billing_address: string;
  ruc?: string;
  cedula?: string;
  usuario?: string;
}

function formatMessage(data: OrderNotification): string {
  const items = data.items
    .map((i) => `• ${i.name} x${i.quantity} - $${i.price}`)
    .join("\n");

  return [
    "🛒 *NUEVA ORDEN - EXA CONTABLE*",
    "",
    `📋 *Orden ${data.order_number || `#${data.order_id}`}*`,
    `👤 *Cliente:* ${data.customer_name}`,
    `📧 *Email:* ${data.customer_email}`,
    `📞 *Teléfono:* ${data.customer_phone}`,
    data.ruc ? `📄 *RUC:* ${data.ruc}` : "",
    data.cedula ? `📄 *Cédula:* ${data.cedula}` : "",
    data.usuario ? `🔑 *Usuario:* ${data.usuario}` : "",
    "",
    "*PLANES:*",
    items,
    "",
    `💰 *Total:* $${data.total}`,
    `💳 *Método de pago:* ${data.payment_method}`,
    `📍 *Dirección:* ${data.billing_address}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function sendOrderNotification(data: OrderNotification) {
  const TO_PHONE = await getToPhone();
  if (!TO_PHONE) {
    console.log("WhatsApp notification skipped: WHATSAPP_TO or whatsapp_number not set");
    return;
  }

  await initWhatsApp();

  if (!isConnected()) {
    console.log("WhatsApp notification skipped: not connected, scan QR first");
    return;
  }

  try {
    await sendWhatsAppMessage(TO_PHONE, formatMessage(data));
    console.log("WhatsApp notification sent for order " + (data.order_number || "#" + data.order_id));
  } catch (error) {
    console.error("WhatsApp notification failed:", error);
  }
}

export async function sendReceiptNotification(data: {
  order_id: string | number;
  order_number?: string;
  customer_name: string;
  customer_email: string;
}) {
  const TO_PHONE = await getToPhone();
  if (!TO_PHONE) return;

  await initWhatsApp();
  if (!isConnected()) return;

  const message = [
    "📎 *COMPROBANTE SUBIDO - EXA CONTABLE*",
    "",
    `📋 *Orden ${data.order_number || `#${data.order_id}`}*`,
    `👤 *Cliente:* ${data.customer_name}`,
    `📧 *Email:* ${data.customer_email}`,
    "",
    "🔍 *Requiere verificación del pago*",
    `👉 Ver pedido: ${process.env.NEXT_PUBLIC_SITE_URL || ""}/mis-pedidos/${data.order_id}`,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await sendWhatsAppMessage(TO_PHONE, message);
    console.log("WhatsApp receipt notification sent for order " + (data.order_number || "#" + data.order_id));
  } catch (error) {
    console.error("WhatsApp receipt notification failed:", error);
  }
}
