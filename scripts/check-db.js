const Database = require('better-sqlite3');
const db = new Database('dev.db');

try {
  const plans = db.prepare('SELECT * FROM Plan').all();
  console.log('--- PLANS ---');
  console.log(plans);

  const paymentMethods = db.prepare('SELECT * FROM PaymentMethod').all();
  console.log('--- PAYMENT METHODS ---');
  console.log(paymentMethods);

  const orders = db.prepare('SELECT * FROM "Order"').all();
  console.log('--- ORDERS ---');
  console.log(orders);
} catch (error) {
  console.error('Error querying database:', error);
} finally {
  db.close();
}
