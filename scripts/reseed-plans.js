const Database = require('better-sqlite3');
const db = new Database('dev.db');

try {
  // Clear the table
  db.prepare('DELETE FROM Plan').run();

  const plans = [
    // 1. Facturación Electrónica (Category: facturacion-electronica, Period: anual)
    {
      id: 'fact-basico-1',
      name: 'Básico I',
      slug: 'basico-1',
      description: 'Plan de Facturación Electrónica Básico I',
      price: 15.00,
      category: 'facturacion-electronica',
      period: 'anual',
      features: JSON.stringify([
        "Facturas",
        "Comprobantes de retención",
        "Notas de crédito",
        "Guías de remisión",
        "100 documentos anuales",
        "Soporte técnico personalizado",
        "Actualizaciones"
      ]),
      isActive: 1,
      sortOrder: 10
    },
    {
      id: 'fact-basico-2',
      name: 'Básico II',
      slug: 'basico-2',
      description: 'Plan de Facturación Electrónica Básico II',
      price: 50.00,
      category: 'facturacion-electronica',
      period: 'anual',
      features: JSON.stringify([
        "Facturas",
        "Comprobantes de retención",
        "Notas de crédito",
        "Guías de remisión",
        "600 documentos anuales",
        "Soporte técnico personalizado",
        "Actualizaciones"
      ]),
      isActive: 1,
      sortOrder: 20
    },
    {
      id: 'fact-ideal',
      name: 'Ideal',
      slug: 'ideal',
      description: 'Plan de Facturación Electrónica Ideal',
      price: 70.00,
      category: 'facturacion-electronica',
      period: 'anual',
      features: JSON.stringify([
        "Facturas",
        "Comprobantes de retención",
        "Notas de crédito",
        "Guías de remisión",
        "1200 documentos anuales",
        "Soporte técnico personalizado",
        "Actualizaciones"
      ]),
      isActive: 1,
      sortOrder: 30
    },
    {
      id: 'fact-ilimitado',
      name: 'Ilimitado',
      slug: 'ilimitado',
      description: 'Plan de Facturación Electrónica Ilimitado',
      price: 100.00,
      category: 'facturacion-electronica',
      period: 'anual',
      features: JSON.stringify([
        "Facturas",
        "Comprobantes de retención",
        "Notas de crédito",
        "Guías de remisión",
        "Documentos ilimitados",
        "Soporte técnico personalizado",
        "Actualizaciones"
      ]),
      isActive: 1,
      sortOrder: 40
    },

    // 2. Membresía Mensual (Category: sistema-contable, Period: mensual)
    {
      id: 'sys-emprendedor-mensual',
      name: 'Exa Emprendedor',
      slug: 'exa-emprendedor-mensual',
      description: 'Sistema Contable Exa Emprendedor (Mensual)',
      price: 18.50,
      category: 'sistema-contable',
      period: 'mensual',
      features: JSON.stringify([
        "1 Usuario",
        "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina, Contabilidad",
        "Facturación electrónica: 100 documentos al mes",
        "Soporte técnico personalizado",
        "Actualizaciones",
        "3 meses de capacitación"
      ]),
      isActive: 1,
      sortOrder: 50
    },
    {
      id: 'sys-starter-mensual',
      name: 'Exa Starter',
      slug: 'exa-starter-mensual',
      description: 'Sistema Contable Exa Starter (Mensual)',
      price: 25.00,
      category: 'sistema-contable',
      period: 'mensual',
      features: JSON.stringify([
        "1 Usuario",
        "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina, Contabilidad",
        "Facturación electrónica: 100 documentos al mes",
        "Soporte técnico personalizado",
        "Actualizaciones",
        "3 meses de capacitación"
      ]),
      isActive: 1,
      sortOrder: 60
    },
    {
      id: 'sys-ejecutivo-mensual',
      name: 'Exa Ejecutivo',
      slug: 'exa-ejecutivo-mensual',
      description: 'Sistema Contable Exa Ejecutivo (Mensual)',
      price: 35.00,
      category: 'sistema-contable',
      period: 'mensual',
      features: JSON.stringify([
        "2 Usuarios - 1 Contador",
        "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina (5 Empl.), Contabilidad",
        "Facturación electrónica: 200 documentos al mes",
        "Soporte técnico personalizado",
        "Actualizaciones",
        "3 meses de capacitación"
      ]),
      isActive: 1,
      sortOrder: 70
    },
    {
      id: 'sys-empresarial-mensual',
      name: 'Exa Empresarial',
      slug: 'exa-empresarial-mensual',
      description: 'Sistema Contable Exa Empresarial (Mensual)',
      price: 55.00,
      category: 'sistema-contable',
      period: 'mensual',
      features: JSON.stringify([
        "3 Usuarios - 1 Contador",
        "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina (100 Empl.), Contabilidad",
        "Facturación electrónica ilimitada",
        "Soporte técnico personalizado",
        "Actualizaciones",
        "3 meses de capacitación"
      ]),
      isActive: 1,
      sortOrder: 80
    },

    // 3. Membresía Anual (Category: sistema-contable, Period: anual)
    {
      id: 'sys-emprendedor-anual',
      name: 'Exa Emprendedor',
      slug: 'exa-emprendedor-anual',
      description: 'Sistema Contable Exa Emprendedor (Anual)',
      price: 176.00,
      category: 'sistema-contable',
      period: 'anual',
      features: JSON.stringify([
        "1 Usuario",
        "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina, Contabilidad",
        "Facturación electrónica: 1200 documentos al año",
        "Soporte técnico personalizado",
        "Actualizaciones",
        "3 meses de capacitación"
      ]),
      isActive: 1,
      sortOrder: 90
    },
    {
      id: 'sys-starter-anual',
      name: 'Exa Starter',
      slug: 'exa-starter-anual',
      description: 'Sistema Contable Exa Starter (Anual)',
      price: 275.00,
      category: 'sistema-contable',
      period: 'anual',
      features: JSON.stringify([
        "1 Usuario",
        "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina, Contabilidad",
        "Facturación electrónica: 1200 documentos al año",
        "Soporte técnico personalizado",
        "Actualizaciones",
        "3 meses de capacitación"
      ]),
      isActive: 1,
      sortOrder: 100
    },
    {
      id: 'sys-ejecutivo-anual',
      name: 'Exa Ejecutivo',
      slug: 'exa-ejecutivo-anual',
      description: 'Sistema Contable Exa Ejecutivo (Anual)',
      price: 378.00,
      category: 'sistema-contable',
      period: 'anual',
      features: JSON.stringify([
        "2 Usuarios - 1 Contador",
        "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Cartera, Bancos, Nómina (5 Empl.), Contabilidad",
        "Facturación electrónica: 2400 documentos al año",
        "Soporte técnico personalizado",
        "Actualizaciones",
        "3 meses de capacitación"
      ]),
      isActive: 1,
      sortOrder: 110
    },
    {
      id: 'sys-empresarial-anual',
      name: 'Exa Empresarial',
      slug: 'exa-empresarial-anual',
      description: 'Sistema Contable Exa Empresarial (Anual)',
      price: 594.00,
      category: 'sistema-contable',
      period: 'anual',
      features: JSON.stringify([
        "3 Usuarios - 1 Contador",
        "Módulos: Inventario, Ventas, Compras, Facturación, Tributación, Contabilidad, Cartera, Bancos, Costo de venta, Nómina (100 Empl.)",
        "Facturación electrónica ilimitada",
        "Soporte técnico personalizado",
        "Actualizaciones",
        "3 meses de capacitación"
      ]),
      isActive: 1,
      sortOrder: 120
    },

    // 4. Compra Total (Category: sistema-contable, Period: compra-total)
    {
      id: 'sys-empresarial-compra-total',
      name: 'Exa Empresarial',
      slug: 'exa-empresarial-compra-total',
      description: 'Exa Sistema Contable para 1 Empresa, con pago único.',
      price: 1780.00,
      category: 'sistema-contable',
      period: 'compra-total',
      features: JSON.stringify([
        "1 Empresa",
        "Usuarios y Contadores Ilimitados",
        "Todos los Módulos del Sistema incluidos",
        "Primer año de facturación electrónica ilimitado",
        "Soporte técnico personalizado",
        "Actualizaciones",
        "3 meses de capacitación"
      ]),
      isActive: 1,
      sortOrder: 130
    },
    {
      id: 'sys-corporativo-compra-total',
      name: 'Exa Corporativo',
      slug: 'exa-corporativo-compra-total',
      description: 'Exa Sistema Contable para 3 Empresas, con pago único.',
      price: 2780.00,
      category: 'sistema-contable',
      period: 'compra-total',
      features: JSON.stringify([
        "3 Empresas",
        "Usuarios y Contadores Ilimitados",
        "Todos los Módulos del Sistema incluidos",
        "Primer año de facturación electrónica ilimitado",
        "Soporte técnico personalizado",
        "Actualizaciones",
        "3 meses de capacitación"
      ]),
      isActive: 1,
      sortOrder: 140
    }
  ];

  const nowStr = new Date().toISOString();
  const stmt = db.prepare(`
    INSERT INTO Plan (id, name, slug, description, price, category, period, features, isActive, sortOrder, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const plan of plans) {
    stmt.run(plan.id, plan.name, plan.slug, plan.description, plan.price, plan.category, plan.period, plan.features, plan.isActive, plan.sortOrder, nowStr, nowStr);
  }

  console.log('Seeded exactly 14 official plans successfully!');
} catch (e) {
  console.error('Error seeding DB:', e.message);
} finally {
  db.close();
}
