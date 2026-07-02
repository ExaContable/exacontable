import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

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

    const wpUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || "https://admin.exacontable.com";
    await fetch(`${wpUrl}/wp-json/wc/v3/orders/${orderId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          `${process.env.WOOCOMMERCE_KEY}:${process.env.WOOCOMMERCE_SECRET}`
        ).toString("base64")}`,
      },
      body: JSON.stringify({
        meta_data: [
          {
            key: "_billing_receipt_url",
            value: receiptUrl,
          },
        ],
      }),
    });

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
