const Database = require('better-sqlite3');
const db = new Database('dev.db');

try {
  // Clear existing if any
  db.prepare("DELETE FROM PaymentMethod").run();

  const insertStmt = db.prepare(`
    INSERT INTO PaymentMethod (id, name, code, description, isActive, isSandbox, config, commission, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);

  insertStmt.run(
    'bacs-id', 
    'Transferencia Bancaria', 
    'bacs', 
    'Realiza tu transferencia bancaria directamente a nuestra cuenta del Banco Pichincha.', 
    1, 
    0, 
    JSON.stringify({
      bank_name: "Banco Pichincha",
      account_name: "EXA CONTABLE",
      account_number: "1234567890",
      account_type: "corriente"
    }), 
    0.0
  );

  insertStmt.run(
    'payphone-id', 
    'Payphone', 
    'payphonebox', 
    'Paga con tarjeta de crédito o débito de forma segura usando Payphone.', 
    1, 
    1, 
    JSON.stringify({
      clientId: "test-client-id",
      token: "test-token"
    }), 
    0.0
  );

  console.log('Seeded payment methods successfully!');
} catch (e) {
  console.error('Error seeding payment methods:', e.message);
} finally {
  db.close();
}
