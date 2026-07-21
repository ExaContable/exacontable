const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

function databasePathFromUrl(databaseUrl) {
  const value = databaseUrl || "file:./prisma/exacontable.db";
  if (!value.startsWith("file:")) return null;

  const filePath = value.slice("file:".length).split("?")[0];
  return path.resolve(process.cwd(), filePath);
}

function addMissingColumns(db, table, columns) {
  const existing = new Set(
    db.prepare(`PRAGMA table_info("${table}")`).all().map((column) => column.name)
  );

  for (const [name, definition] of Object.entries(columns)) {
    if (!existing.has(name)) {
      db.exec(`ALTER TABLE "${table}" ADD COLUMN "${name}" ${definition}`);
    }
  }
}

function initializeProductionDatabase() {
  const databasePath = databasePathFromUrl(process.env.DATABASE_URL);
  if (!databasePath) return;

  fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  const db = new Database(databasePath);

  try {
    db.pragma("journal_mode = WAL");
    db.exec(`
      CREATE TABLE IF NOT EXISTS "Plan" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL,
        "description" TEXT,
        "price" REAL NOT NULL,
        "category" TEXT NOT NULL,
        "period" TEXT NOT NULL,
        "features" TEXT NOT NULL DEFAULT '[]',
        "isActive" INTEGER NOT NULL DEFAULT 1,
        "sortOrder" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "Plan_slug_key" ON "Plan"("slug");

      CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "orderNumber" INTEGER NOT NULL DEFAULT 0,
        "customerName" TEXT NOT NULL,
        "customerEmail" TEXT NOT NULL,
        "customerPhone" TEXT,
        "planId" TEXT,
        "planName" TEXT NOT NULL,
        "total" REAL NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'pending',
        "paymentMethod" TEXT,
        "paymentStatus" TEXT NOT NULL DEFAULT 'pending',
        "receiptUrl" TEXT,
        "notes" TEXT,
        "ruc" TEXT,
        "cedula" TEXT,
        "usuario" TEXT,
        "clave" TEXT,
        "genero" TEXT,
        "address" TEXT,
        "city" TEXT,
        "state" TEXT,
        "postcode" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderNumber_key" ON "Order"("orderNumber");

      CREATE TABLE IF NOT EXISTS "PaymentMethod" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "code" TEXT NOT NULL,
        "description" TEXT,
        "isActive" INTEGER NOT NULL DEFAULT 1,
        "isSandbox" INTEGER NOT NULL DEFAULT 1,
        "config" TEXT,
        "commission" REAL,
        "lastValidatedAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "PaymentMethod_code_key" ON "PaymentMethod"("code");

      CREATE TABLE IF NOT EXISTS "SiteConfig" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL,
        "value" TEXT NOT NULL
      );
      CREATE UNIQUE INDEX IF NOT EXISTS "SiteConfig_key_key" ON "SiteConfig"("key");
    `);

    addMissingColumns(db, "Order", {
      orderNumber: "INTEGER NOT NULL DEFAULT 0",
      receiptUrl: "TEXT",
      ruc: "TEXT",
      cedula: "TEXT",
      usuario: "TEXT",
      clave: "TEXT",
      genero: "TEXT",
      address: "TEXT",
      city: "TEXT",
      state: "TEXT",
      postcode: "TEXT",
    });
    db.exec('UPDATE "Order" SET "orderNumber" = rowid WHERE "orderNumber" = 0');
    db.exec('CREATE UNIQUE INDEX IF NOT EXISTS "Order_orderNumber_key" ON "Order"("orderNumber")');
    console.log(`[database] SQLite ready at ${databasePath}`);
  } finally {
    db.close();
  }
}

module.exports = { initializeProductionDatabase };
