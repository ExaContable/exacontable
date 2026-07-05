const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const plans = [
  { id: "fact-basico-1", name: "Básico I", slug: "basico-1", description: "Plan de Facturación Electrónica Básico I", price: 15.00, category: "facturacion-electronica", period: "anual", features: ["Facturas", "Comprobantes de retención", "Notas de crédito", "Guías de remisión", "100 documentos anuales", "Soporte técnico personalizado", "Actualizaciones"], sortOrder: 10 },
  { id: "fact-basico-2", name: "Básico II", slug: "basico-2", description: "Plan de Facturación Electrónica Básico II", price: 50.00, category: "facturacion-electronica", period: "anual", features: ["Facturas", "Comprobantes de retención", "Notas de crédito", "Guías de remisión", "600 documentos anuales", "Soporte técnico personalizado", "Actualizaciones"], sortOrder: 20 },
  { id: "fact-ideal", name: "Ideal", slug: "ideal", description: "Plan de Facturación Electrónica Ideal", price: 70.00, category: "facturacion-electronica", period: "anual", features: ["Facturas", "Comprobantes de retención", "Notas de crédito", "Guías de remisión", "1200 documentos anuales", "Soporte técnico personalizado", "Actualizaciones"], sortOrder: 30 },
  { id: "fact-ilimitado", name: "Ilimitado", slug: "ilimitado", description: "Plan de Facturación Electrónica Ilimitado", price: 100.00, category: "facturacion-electronica", period: "anual", features: ["Facturas", "Comprobantes de retención", "Notas de crédito", "Guías de remisión", "Documentos ilimitados", "Soporte técnico personalizado", "Actualizaciones"], sortOrder: 40 },
  { id: "sys-emprendedor-mensual", name: "Exa Emprendedor", slug: "exa-emprendedor-mensual", description: "Sistema Contable Exa Emprendedor (Mensual)", price: 18.50, category: "sistema-contable", period: "mensual", features: ["1 Usuario", "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina, Contabilidad", "Facturación electrónica: 100 documentos al mes", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 50 },
  { id: "sys-starter-mensual", name: "Exa Starter", slug: "exa-starter-mensual", description: "Sistema Contable Exa Starter (Mensual)", price: 25.00, category: "sistema-contable", period: "mensual", features: ["1 Usuario", "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina, Contabilidad", "Facturación electrónica: 100 documentos al mes", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 60 },
  { id: "sys-ejecutivo-mensual", name: "Exa Ejecutivo", slug: "exa-ejecutivo-mensual", description: "Sistema Contable Exa Ejecutivo (Mensual)", price: 35.00, category: "sistema-contable", period: "mensual", features: ["2 Usuarios - 1 Contador", "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina (5 Empl.), Contabilidad", "Facturación electrónica: 200 documentos al mes", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 70 },
  { id: "sys-empresarial-mensual", name: "Exa Empresarial", slug: "exa-empresarial-mensual", description: "Sistema Contable Exa Empresarial (Mensual)", price: 55.00, category: "sistema-contable", period: "mensual", features: ["3 Usuarios - 1 Contador", "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina (100 Empl.), Contabilidad", "Facturación electrónica ilimitada", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 80 },
  { id: "sys-emprendedor-anual", name: "Exa Emprendedor", slug: "exa-emprendedor-anual", description: "Sistema Contable Exa Emprendedor (Anual)", price: 176.00, category: "sistema-contable", period: "anual", features: ["1 Usuario", "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina, Contabilidad", "Facturación electrónica: 1200 documentos al año", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 90 },
  { id: "sys-starter-anual", name: "Exa Starter", slug: "exa-starter-anual", description: "Sistema Contable Exa Starter (Anual)", price: 275.00, category: "sistema-contable", period: "anual", features: ["1 Usuario", "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina, Contabilidad", "Facturación electrónica: 1200 documentos al año", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 100 },
  { id: "sys-ejecutivo-anual", name: "Exa Ejecutivo", slug: "exa-ejecutivo-anual", description: "Sistema Contable Exa Ejecutivo (Anual)", price: 378.00, category: "sistema-contable", period: "anual", features: ["2 Usuarios - 1 Contador", "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina (5 Empl.), Contabilidad", "Facturación electrónica: 2400 documentos al año", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 110 },
  { id: "sys-empresarial-anual", name: "Exa Empresarial", slug: "exa-empresarial-anual", description: "Sistema Contable Exa Empresarial (Anual)", price: 594.00, category: "sistema-contable", period: "anual", features: ["3 Usuarios - 1 Contador", "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Costo de venta, Nómina (100 Empl.), Contabilidad", "Facturación electrónica ilimitada", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 120 },
  { id: "sys-empresarial-compra-total", name: "Exa Empresarial", slug: "exa-empresarial-compra-total", description: "Exa Sistema Contable para 1 Empresa, con pago único.", price: 1780.00, category: "sistema-contable", period: "compra-total", features: ["1 Empresa", "Usuarios y Contadores Ilimitados", "Todos los Módulos del Sistema incluidos", "Primer año de facturación electrónica ilimitado", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 130 },
  { id: "sys-corporativo-compra-total", name: "Exa Corporativo", slug: "exa-corporativo-compra-total", description: "Exa Sistema Contable para 3 Empresas, con pago único.", price: 2780.00, category: "sistema-contable", period: "compra-total", features: ["3 Empresas", "Usuarios y Contadores Ilimitados", "Todos los Módulos del Sistema incluidos", "Primer año de facturación electrónica ilimitado", "Soporte técnico personalizado", "Actualizaciones", "3 meses de capacitación"], sortOrder: 140 },
];

const paymentMethods = [
  {
    id: "bacs-id",
    name: "Transferencia Bancaria",
    code: "bacs",
    description: "Realiza tu transferencia bancaria directamente a nuestra cuenta del Banco Pichincha.",
    isActive: true,
    isSandbox: false,
    config: { bank_name: "Banco Pichincha", account_name: "EXA CONTABLE", account_number: "1234567890", account_type: "corriente" },
    commission: 0.0,
  },
  {
    id: "payphone-id",
    name: "Payphone",
    code: "payphonebox",
    description: "Paga con tarjeta de crédito o débito de forma segura usando Payphone.",
    isActive: true,
    isSandbox: true,
    config: { clientId: "test-client-id", token: "test-token" },
    commission: 0.0,
  },
];

async function main() {
  const now = new Date().toISOString();

  // Seed Plans
  await pool.query('DELETE FROM "Plan"');
  for (const p of plans) {
    await pool.query(
      `INSERT INTO "Plan" (id, name, slug, description, price, category, period, features, "isActive", "sortOrder", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [p.id, p.name, p.slug, p.description, p.price, p.category, p.period, JSON.stringify(p.features), true, p.sortOrder, now, now]
    );
  }
  console.log(`✓ Insertados ${plans.length} planes correctamente`);

  // Seed Payment Methods
  await pool.query('DELETE FROM "PaymentMethod"');
  for (const m of paymentMethods) {
    await pool.query(
      `INSERT INTO "PaymentMethod" (id, name, code, description, "isActive", "isSandbox", config, commission, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [m.id, m.name, m.code, m.description, m.isActive, m.isSandbox, JSON.stringify(m.config), m.commission, now, now]
    );
  }
  console.log(`✓ Insertados ${paymentMethods.length} métodos de pago correctamente`);

  await pool.end();
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
