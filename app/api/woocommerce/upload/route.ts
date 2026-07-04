import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { sendReceiptNotification } from "@/lib/whatsapp";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const orderId = formData.get("order_id") as string | null;

    if (!file || !orderId) {
      return NextResponse.json(
        { error: "Archivo y order_id requeridos" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "receipts", orderId);
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `receipt-${Date.now()}.${ext}`;
    const filepath = path.join(uploadDir, filename);
    await writeFile(filepath, buffer);

    const receiptUrl = `/uploads/receipts/${orderId}/${filename}`;

    // Update local order
    const order = await prisma.order.update({
      where: { id: orderId },
      data: {
        receiptUrl,
        status: "processing", // Move to processing (waiting for admin verification)
      },
    });

    // Send WhatsApp notification to Support
    try {
      await sendReceiptNotification({
        order_id: order.id,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
      });
    } catch (waErr) {
      console.error("Failed to send WhatsApp receipt notification:", waErr);
    }

    return NextResponse.json({
      success: true,
      receipt_url: receiptUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Error al subir el archivo" },
      { status: 500 }
    );
  }
}
