const Database = require('better-sqlite3');
const db = new Database('dev.db');

try {
  // Update EXA EMPRESARIAL - COMPRA TOTAL
  const empresarialFeatures = [
    "1 Empresa",
    "Usuarios y Contadores Ilimitados",
    "Todos los Módulos del Sistema incluidos",
    "Primer año Facturación SRI Ilimitada",
    "Soporte Técnico Personalizado",
    "Actualizaciones",
    "3 Meses de Capacitación"
  ];
  db.prepare("UPDATE Plan SET features = ?, description = 'EXA Sistema Contable para 1 Empresa, con pago único.' WHERE slug = 'exa-empresarial-compra-total'").run(JSON.stringify(empresarialFeatures));

  // Update EXA CORPORATIVO - COMPRA TOTAL
  const corporativoFeatures = [
    "3 Empresas",
    "Usuarios y Contadores Ilimitados",
    "Todos los Módulos del Sistema incluidos",
    "Primer año Facturación SRI Ilimitada",
    "Soporte Técnico Personalizado",
    "Actualizaciones",
    "3 Meses de Capacitación"
  ];
  db.prepare("UPDATE Plan SET features = ?, description = 'EXA Sistema Contable para 3 Empresas, con pago único.' WHERE slug = 'exa-corporativo-compra-total'").run(JSON.stringify(corporativoFeatures));

  console.log('Successfully shortened Compra Total plan features in DB!');
} catch (e) {
  console.error('Error updating DB:', e.message);
} finally {
  db.close();
}
