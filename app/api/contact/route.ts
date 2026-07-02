import { NextResponse } from "next/server";

const validSubjects = ["general", "soporte", "comercial", "facturacion", "otro"];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    const errors: string[] = [];
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      errors.push("Nombre requerido (mín. 2 caracteres)");
    }
    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Correo electrónico inválido");
    }
    if (!subject || !validSubjects.includes(subject)) {
      errors.push("Asunto inválido");
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      errors.push("El mensaje debe tener al menos 10 caracteres");
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: "Datos inválidos", details: errors }, { status: 400 });
    }

    console.log(
      JSON.stringify({
        type: "contact_form",
        timestamp: new Date().toISOString(),
        data: { name: name.trim(), email: email.trim(), phone: phone?.trim() || null, subject, message: message.trim() },
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json({ error: "Error al procesar el mensaje" }, { status: 500 });
  }
}
