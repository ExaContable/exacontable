import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const plans = [
  { id: "fact-basico-1", name: "Básico I", slug: "basico-1", description: "Plan de Facturación Electrónica Básico I", price: 15, category: "facturacion-electronica", period: "anual", features: ["Facturas", "Comprobantes de retención", "Notas de crédito", "Guías de remisión", "100 documentos anuales", "Soporte técnico personalizado", "Actualizaciones"], sortOrder: 10 },
  { id: "fact-basico-2", name: "Básico II", slug: "basico-2", description: "Plan de Facturación Electrónica Básico II", price: 50, category: "facturacion-electronica", period: "anual", features: ["Facturas", "Comprobantes de retención", "Notas de crédito", "Guías de remisión", "600 documentos anuales", "Soporte técnico personalizado", "Actualizaciones"], sortOrder: 20 },
  { id: "fact-ideal", name: "Ideal", slug: "ideal", description: "Plan de Facturación Electrónica Ideal", price: 70, category: "facturacion-electronica", period: "anual", features: ["Facturas", "Comprobantes de retención", "Notas de crédito", "Guías de remisión", "1200 documentos anuales", "Soporte técnico personalizado", "Actualizaciones"], sortOrder: 30 },
  { id: "fact-ilimitado", name: "Ilimitado", slug: "ilimitado", description: "Plan de Facturación Electrónica Ilimitado", price: 100, category: "facturacion-electronica", period: "anual", features: ["Facturas", "Comprobantes de retención", "Notas de crédito", "Guías de remisión", "Documentos ilimitados", "Soporte técnico personalizado", "Actualizaciones"], sortOrder: 40 },
  { id: "sys-emprendedor-mensual", name: "Exa Emprendedor", slug: "exa-emprendedor-mensual", description: "Sistema Contable Exa Emprendedor (Mensual)", price: 18.5, category: "sistema-contable", period: "mensual", features: ["1 Usuario", "Módulos contables completos", "100 documentos electrónicos al mes", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 50 },
  { id: "sys-starter-mensual", name: "Exa Starter", slug: "exa-starter-mensual", description: "Sistema Contable Exa Starter (Mensual)", price: 25, category: "sistema-contable", period: "mensual", features: ["1 Usuario", "Módulos contables completos", "100 documentos electrónicos al mes", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 60 },
  { id: "sys-ejecutivo-mensual", name: "Exa Ejecutivo", slug: "exa-ejecutivo-mensual", description: "Sistema Contable Exa Ejecutivo (Mensual)", price: 35, category: "sistema-contable", period: "mensual", features: ["2 Usuarios - 1 Contador", "Módulos contables completos", "200 documentos electrónicos al mes", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 70 },
  { id: "sys-empresarial-mensual", name: "Exa Empresarial", slug: "exa-empresarial-mensual", description: "Sistema Contable Exa Empresarial (Mensual)", price: 55, category: "sistema-contable", period: "mensual", features: ["3 Usuarios - 1 Contador", "Módulos contables completos", "Facturación electrónica ilimitada", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 80 },
  { id: "sys-emprendedor-anual", name: "Exa Emprendedor", slug: "exa-emprendedor-anual", description: "Sistema Contable Exa Emprendedor (Anual)", price: 176, category: "sistema-contable", period: "anual", features: ["1 Usuario", "Módulos contables completos", "1200 documentos electrónicos al año", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 90 },
  { id: "sys-starter-anual", name: "Exa Starter", slug: "exa-starter-anual", description: "Sistema Contable Exa Starter (Anual)", price: 275, category: "sistema-contable", period: "anual", features: ["1 Usuario", "Módulos contables completos", "1200 documentos electrónicos al año", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 100 },
  { id: "sys-ejecutivo-anual", name: "Exa Ejecutivo", slug: "exa-ejecutivo-anual", description: "Sistema Contable Exa Ejecutivo (Anual)", price: 378, category: "sistema-contable", period: "anual", features: ["2 Usuarios - 1 Contador", "Módulos contables completos", "2400 documentos electrónicos al año", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 110 },
  { id: "sys-empresarial-anual", name: "Exa Empresarial", slug: "exa-empresarial-anual", description: "Sistema Contable Exa Empresarial (Anual)", price: 594, category: "sistema-contable", period: "anual", features: ["3 Usuarios - 1 Contador", "Módulos contables completos", "Facturación electrónica ilimitada", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 120 },
  { id: "sys-empresarial-compra-total", name: "Exa Empresarial", slug: "exa-empresarial-compra-total", description: "Sistema Contable para 1 empresa, con pago único.", price: 1780, category: "sistema-contable", period: "compra-total", features: ["1 Empresa", "Usuarios y contadores ilimitados", "Todos los módulos incluidos", "Primer año de facturación ilimitado", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 130 },
  { id: "sys-corporativo-compra-total", name: "Exa Corporativo", slug: "exa-corporativo-compra-total", description: "Sistema Contable para 3 empresas, con pago único.", price: 2780, category: "sistema-contable", period: "compra-total", features: ["3 Empresas", "Usuarios y contadores ilimitados", "Todos los módulos incluidos", "Primer año de facturación ilimitado", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 140 },
] as const;

const paymentMethods = [
  { id: "bacs-id", name: "Transferencia Bancaria", code: "bacs", description: "Realiza tu transferencia bancaria directamente a nuestra cuenta.", isActive: true, isSandbox: false, config: { bank_name: "Banco Pichincha", account_name: "EXA CONTABLE" }, commission: 0 },
  { id: "payphone-id", name: "Payphone", code: "payphonebox", description: "Paga con tarjeta de crédito o débito usando Payphone.", isActive: true, isSandbox: true, config: { clientId: "configure-in-admin", token: "configure-in-admin" }, commission: 0 },
] as const;

async function main() {
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { slug: plan.slug },
      update: { ...plan, features: JSON.stringify(plan.features), isActive: true },
      create: { ...plan, features: JSON.stringify(plan.features), isActive: true },
    });
  }

  for (const method of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { code: method.code },
      update: { ...method, config: JSON.stringify(method.config) },
      create: { ...method, config: JSON.stringify(method.config) },
    });
  }

  console.log(`Seed complete: ${plans.length} plans, ${paymentMethods.length} payment methods.`);
}

main()
  .finally(() => prisma.$disconnect())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
