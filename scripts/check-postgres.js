const { Pool } = require("pg");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  // Check tables
  const { rows: tables } = await pool.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' ORDER BY table_name
  `);
  console.log("=== TABLAS EN LA BD ===");
  console.log(tables.map(t => `  - ${t.table_name}`).join("\n"));

  // Check each table
  for (const t of tables) {
    const { rows: data } = await pool.query(`SELECT * FROM "${t.table_name}" LIMIT 5`);
    console.log(`\n=== ${t.table_name} (${data.length} filas) ===`);
    if (data.length > 0) {
      console.log(JSON.stringify(data, null, 2));
    } else {
      console.log("  (vacía)");
    }
  }

  await pool.end();
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
