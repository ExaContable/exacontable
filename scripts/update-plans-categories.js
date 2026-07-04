const Database = require('better-sqlite3');
const db = new Database('dev.db');

try {
  // 1. Update Facturación Electrónica plans
  const facturacionSlugs = ['ilimitado', 'ideal', 'basico-2', 'basico-1'];
  for (const slug of facturacionSlugs) {
    db.prepare("UPDATE Plan SET category = 'facturacion-electronica', period = 'anual' WHERE slug = ?").run(slug);
  }

  // 2. Update Servicios plans
  const serviciosSlugs = ['apertura-anual-de-empresa'];
  for (const slug of serviciosSlugs) {
    db.prepare("UPDATE Plan SET category = 'servicios', period = 'compra-total' WHERE slug = ?").run(slug);
  }

  // 3. Update Sistema Contable plans
  // If category is planes-mensuales -> set category to 'sistema-contable', period to 'mensual'
  db.prepare("UPDATE Plan SET category = 'sistema-contable', period = 'mensual' WHERE category = 'planes-mensuales'").run();

  // If category is planes-anuales -> set category to 'sistema-contable', period to 'anual'
  db.prepare("UPDATE Plan SET category = 'sistema-contable', period = 'anual' WHERE category = 'planes-anuales'").run();

  // If category is compra-total -> set category to 'sistema-contable', period to 'compra-total'
  db.prepare("UPDATE Plan SET category = 'sistema-contable', period = 'compra-total' WHERE category = 'compra-total'").run();

  // Also fix any other periods (like 'unico' -> 'compra-total')
  db.prepare("UPDATE Plan SET period = 'compra-total' WHERE period = 'unico'").run();
  
  // Make sure personalizado plan is under sistema-contable and has period = compra-total (or cotizacion)
  db.prepare("UPDATE Plan SET category = 'sistema-contable', period = 'compra-total' WHERE slug = 'personalizado'").run();

  console.log('Successfully updated plan categories and periods in DB!');
} catch (e) {
  console.error('Error updating DB:', e.message);
} finally {
  db.close();
}
