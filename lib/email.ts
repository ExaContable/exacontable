import nodemailer from "nodemailer";

// Retrieve email configurations from environment variables
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const SMTP_FROM = process.env.SMTP_FROM || '"EXA Contable" <noreply@exacontable.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@exacontable.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://exacontable.com";

// Create reusable transporter object using SMTP transport or console log fallback
function getTransporter() {
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP settings are not fully configured in env variables. Emails will be logged to the console.");
    return null;
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465, // true for 465, false for other ports
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

const statusLabels: Record<string, string> = {
  "on-hold": "En espera de pago",
  pending: "Pendiente de pago",
  processing: "Procesando comprobante",
  completed: "Completado y verificado",
  failed: "Fallido",
  cancelled: "Cancelado",
};

interface EmailOrder {
  id: string;
  orderNumber?: number;
  customerName: string;
  customerEmail: string;
  planName: string;
  total: number;
  paymentMethod: string | null;
  status: string;
  usuario?: string | null;
}

function formatOrderNumber(order: EmailOrder): string {
  return order.orderNumber ? `EXA-${String(order.orderNumber).padStart(4, "0")}` : `#${order.id.slice(0, 8)}`;
}

export async function sendOrderEmail(order: EmailOrder) {
  const transporter = getTransporter();
  const orderNumberStr = formatOrderNumber(order);
  const orderUrl = `${SITE_URL}/mis-pedidos/${order.id}`;

  const isBacs = order.paymentMethod?.toLowerCase().includes("transferencia") || order.paymentMethod?.toLowerCase().includes("bacs");

  const bankInstructionsHTML = isBacs
    ? `
    <div style="background-color: #fcf8f2; border-left: 4px solid #dc4c1e; padding: 15px; margin: 20px 0; border-radius: 4px;">
      <h3 style="margin-top: 0; color: #dc4c1e; font-size: 16px;">Instrucciones para Transferencia Bancaria</h3>
      <p style="margin: 5px 0; font-size: 14px;">Por favor, realiza la transferencia por el total indicado a cualquiera de las siguientes cuentas:</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 13px;">
        <tr>
          <td style="padding: 5px 0; font-weight: bold; width: 100px;">Banco:</td>
          <td style="padding: 5px 0;">Banco Pichincha</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-weight: bold;">Titular:</td>
          <td style="padding: 5px 0;">EXA CONTABLE S.A.S.</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-weight: bold;">Tipo de Cuenta:</td>
          <td style="padding: 5px 0;">Corriente</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; font-weight: bold;">Número:</td>
          <td style="padding: 5px 0;">0000000000 (Consultar soporte)</td>
        </tr>
      </table>
      <p style="margin-top: 10px; margin-bottom: 0; font-size: 13px; font-style: italic;">
        Una vez realizado el depósito, sube tu comprobante en la página de tu pedido: <a href="${orderUrl}" style="color: #dc4c1e; font-weight: bold; text-decoration: none;">Subir Comprobante</a>
      </p>
    </div>
    `
    : "";

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Confirmación de Pedido - EXA Contable</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f9; color: #333333; margin: 0; padding: 0; -webkit-font-smoothing: antialiased;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f9; padding: 20px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr style="background-color: #121214; color: #ffffff;">
              <td style="padding: 30px 40px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold; tracking-tight: -0.02em;">EXA SISTEMA CONTABLE</h1>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em;">Confirmación de Pedido</p>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 40px;">
                <h2 style="margin-top: 0; font-size: 20px; color: #121214;">¡Gracias por tu compra, ${order.customerName}!</h2>
                <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
                  Tu orden ha sido recibida y está siendo procesada de forma local en nuestro sistema. A continuación se detallan los datos de tu pedido:
                </p>

                <!-- Order Details Card -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin: 25px 0; padding: 20px;">
                  <tr>
                    <td style="padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #121214;">Pedido ID:</td>
                    <td style="padding-bottom: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-family: monospace; font-size: 14px; color: #4b5563;">${orderNumberStr}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #121214;">Plan Adquirido:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #4b5563;">${order.planName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #121214;">Método de Pago:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #4b5563;">${order.paymentMethod || "No especificado"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #121214;">Estado actual:</td>
                    <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #d97706;">${statusLabels[order.status] || order.status}</td>
                  </tr>
                  <tr>
                    <td style="padding-top: 10px; font-weight: bold; font-size: 16px; color: #121214;">Total:</td>
                    <td style="padding-top: 10px; text-align: right; font-weight: bold; font-size: 18px; color: #dc4c1e;">$${order.total.toFixed(2)}</td>
                  </tr>
                </table>

                ${bankInstructionsHTML}

                <!-- Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${orderUrl}" style="background-color: #dc4c1e; color: #ffffff; text-decoration: none; padding: 12px 30px; font-weight: bold; border-radius: 30px; display: inline-block; box-shadow: 0 4px 6px rgba(220, 76, 30, 0.15);">
                    Ver Detalle del Pedido
                  </a>
                </div>

                <p style="font-size: 13px; line-height: 1.5; color: #6b7280; text-align: center; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                  Si tienes alguna pregunta, no dudes en contactar con nuestro equipo de soporte vía WhatsApp al +593 97 883 5575.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const textContent = `
  ¡Gracias por tu compra, ${order.customerName}!
  
  Tu orden ha sido recibida de forma local.
  Detalles de tu pedido:
  - Pedido ID: ${orderNumberStr}
  - Plan: ${order.planName}
  - Método de Pago: ${order.paymentMethod}
  - Estado: ${statusLabels[order.status] || order.status}
  - Total: $${order.total.toFixed(2)}
  
  Puedes ver y gestionar tu pedido en: ${orderUrl}
  `;

  // Send to user
  if (transporter) {
    try {
      await transporter.sendMail({
        from: SMTP_FROM,
        to: order.customerEmail,
        subject: `Confirmación de Pedido ${orderNumberStr} - EXA Contable`,
        text: textContent,
        html: htmlContent,
      });

      // Send a copy to Admin
      await transporter.sendMail({
        from: SMTP_FROM,
        to: ADMIN_EMAIL,
        subject: `[ADMIN] Nueva Orden de Compra ${orderNumberStr}`,
        text: `Se ha creado una nueva orden en el sistema.\n\nCliente: ${order.customerName}\nEmail: ${order.customerEmail}\nPlan: ${order.planName}\nTotal: $${order.total.toFixed(2)}\n\nVer pedido: ${SITE_URL}/admin/ordenes/${order.id}`,
      });
      console.log(`Email notifications sent for order ${order.id}`);
    } catch (mailErr) {
      console.error("Failed to send order email:", mailErr);
    }
  } else {
    console.log("=== MOCK EMAIL (Order Created) ===");
    console.log(`To: ${order.customerEmail}`);
    console.log(`Subject: Confirmación de Pedido ${orderNumberStr}`);
    console.log(textContent);
    console.log("==================================");
  }
}

export async function sendOrderStatusEmail(order: EmailOrder) {
  const transporter = getTransporter();
  const orderNumberStr = formatOrderNumber(order);
  const orderUrl = `${SITE_URL}/mis-pedidos/${order.id}`;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Actualización de Pedido - EXA Contable</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f9; color: #333333; margin: 0; padding: 0;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f7f7f9; padding: 20px;">
      <tr>
        <td align="center">
          <table width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
            <!-- Header -->
            <tr style="background-color: #121214; color: #ffffff;">
              <td style="padding: 30px 40px; text-align: center;">
                <h1 style="margin: 0; font-size: 24px; font-weight: bold;">EXA SISTEMA CONTABLE</h1>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em;">Actualización de Estado</p>
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 40px;">
                <h2 style="margin-top: 0; font-size: 20px; color: #121214;">Hola, ${order.customerName}</h2>
                <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
                  Queremos informarte que el estado de tu pedido ha sido actualizado en nuestro sistema:
                </p>

                <!-- Status Card -->
                <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 25px 0; border: 1px solid #e5e7eb;">
                  <span style="font-size: 12px; text-transform: uppercase; color: #6b7280; font-weight: bold; letter-spacing: 0.05em; display: block; margin-bottom: 5px;">Nuevo Estado</span>
                  <span style="font-size: 22px; font-weight: bold; color: #dc4c1e;">${statusLabels[order.status] || order.status}</span>
                </div>

                <p style="font-size: 15px; line-height: 1.6; color: #4b5563;">
                  Detalles del Pedido:
                </p>
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="font-size: 14px; line-height: 2; margin-bottom: 25px; color: #4b5563;">
                  <tr>
                    <td style="font-weight: bold; width: 150px;">Pedido ID:</td>
                    <td style="font-family: monospace;">${orderNumberStr}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold;">Plan Adquirido:</td>
                    <td>${order.planName}</td>
                  </tr>
                  <tr>
                    <td style="font-weight: bold;">Total:</td>
                    <td style="font-weight: bold; color: #dc4c1e;">$${order.total.toFixed(2)}</td>
                  </tr>
                </table>

                <!-- Specific details for completed order -->
                ${order.status === "completed" ? `
                <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; color: #065f46;">
                  <h4 style="margin: 0 0 5px 0; font-size: 15px;">¡Tu cuenta ya está activa!</h4>
                  <p style="margin: 0; font-size: 13px; line-height: 1.5;">
                    Nuestro equipo técnico ha verificado tu pago y tu acceso ha sido configurado en nuestro servidor cloud. Ya puedes ingresar al sistema utilizando tus credenciales.
                  </p>
                </div>
                ` : ""}

                <!-- Button -->
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${orderUrl}" style="background-color: #121214; color: #ffffff; text-decoration: none; padding: 12px 30px; font-weight: bold; border-radius: 30px; display: inline-block;">
                    Ver Pedido
                  </a>
                </div>

                <p style="font-size: 13px; line-height: 1.5; color: #6b7280; text-align: center; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
                  Si consideras que hay un error, puedes escribir a nuestro equipo de soporte.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

  const textContent = `
  Hola ${order.customerName},
  El estado de tu pedido ${orderNumberStr} ha cambiado a: ${statusLabels[order.status] || order.status}.
  
  Detalles del pedido:
  - Plan: ${order.planName}
  - Total: $${order.total.toFixed(2)}
  
  Ver pedido: ${orderUrl}
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: SMTP_FROM,
        to: order.customerEmail,
        subject: `Actualización de Estado - Pedido ${orderNumberStr}`,
        text: textContent,
        html: htmlContent,
      });
      console.log(`Status update email sent to ${order.customerEmail}`);
    } catch (mailErr) {
      console.error("Failed to send status update email:", mailErr);
    }
  } else {
    console.log("=== MOCK EMAIL (Status Updated) ===");
    console.log(`To: ${order.customerEmail}`);
    console.log(`Subject: Actualización de Estado - Pedido ${orderNumberStr}`);
    console.log(textContent);
    console.log("====================================");
  }
}

export async function sendInquiryEmail(inquiry: {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  details: string;
}) {
  const transporter = getTransporter();

  const textContent = `
  === NUEVA INQUIRÍA DE PLAN PERSONALIZADO ===
  Cliente: ${inquiry.customerName}
  Email: ${inquiry.customerEmail}
  Teléfono: ${inquiry.customerPhone}
  
  Características elegidas:
  ${inquiry.details}
  `;

  const htmlContent = `
  <h3>Nueva Consulta de Plan Personalizado</h3>
  <p><strong>Cliente:</strong> ${inquiry.customerName}</p>
  <p><strong>Email:</strong> ${inquiry.customerEmail}</p>
  <p><strong>Teléfono:</strong> ${inquiry.customerPhone}</p>
  <h4>Características del Plan Personalizado:</h4>
  <pre style="background: #f4f4f4; padding: 15px; border-radius: 4px; font-family: monospace;">${inquiry.details}</pre>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: SMTP_FROM,
        to: ADMIN_EMAIL,
        subject: `[COTIZADOR] Solicitud de Plan Personalizado - ${inquiry.customerName}`,
        text: textContent,
        html: htmlContent,
      });
      console.log(`Inquiry notification email sent to admin`);
    } catch (mailErr) {
      console.error("Failed to send inquiry email:", mailErr);
    }
  } else {
    console.log("=== MOCK EMAIL (Custom Plan Inquiry) ===");
    console.log(`To: ${ADMIN_EMAIL}`);
    console.log(`Subject: Solicitud de Plan Personalizado - ${inquiry.customerName}`);
    console.log(textContent);
    console.log("=========================================");
  }
}
