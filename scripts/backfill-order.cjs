const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, '..', 'dev.db'));
const rows = db.prepare('SELECT id, createdAt FROM "Order" ORDER BY createdAt ASC').all();
const stmt = db.prepare('UPDATE "Order" SET orderNumber = ? WHERE id = ?');
const txn = db.transaction(() => {
  for (let i = 0; i < rows.length; i++) {
    stmt.run(i + 1, rows[i].id);
  }
});
txn();
console.log('Backfilled ' + rows.length + ' orders');
db.close();
