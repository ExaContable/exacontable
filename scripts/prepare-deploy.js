const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const DEPLOY_DIR = path.resolve(ROOT, "deploy");
const STANDALONE_DIR = path.resolve(ROOT, ".next", "standalone");

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stats = fs.statSync(src);
  if (stats.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function main() {
  console.log("Preparando deploy para cPanel...\n");

  if (!fs.existsSync(STANDALONE_DIR)) {
    console.error("Error: No se encontró .next/standalone/.");
    console.error("Ejecuta 'npm run build' primero.");
    process.exit(1);
  }

  // Remove existing deploy directory
  if (fs.existsSync(DEPLOY_DIR)) {
    fs.rmSync(DEPLOY_DIR, { recursive: true });
  }

  fs.mkdirSync(DEPLOY_DIR, { recursive: true });

  // 1. Copy standalone output (includes server.js, .next, node_modules)
  console.log("Copiando build standalone...");
  copyRecursive(STANDALONE_DIR, DEPLOY_DIR);

  // 2. Copy server.js (overrides standalone's default if exists)
  const rootServerJs = path.resolve(ROOT, "server.js");
  if (fs.existsSync(rootServerJs)) {
    fs.copyFileSync(rootServerJs, path.resolve(DEPLOY_DIR, "server.js"));
    console.log("✓ server.js");
  }

  // 3. Copy public/ directory
  const publicDir = path.resolve(ROOT, "public");
  if (fs.existsSync(publicDir)) {
    copyRecursive(publicDir, path.resolve(DEPLOY_DIR, "public"));
    console.log("✓ public/");
  }

  // 4. Copy .env.production if it exists, otherwise copy .env.production.example
  const envProd = path.resolve(ROOT, ".env.production");
  const envExample = path.resolve(ROOT, ".env.production.example");
  if (fs.existsSync(envProd)) {
    fs.copyFileSync(envProd, path.resolve(DEPLOY_DIR, ".env"));
    console.log("✓ .env (desde .env.production)");
  } else if (fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, path.resolve(DEPLOY_DIR, ".env"));
    console.log("✓ .env (desde .env.production.example)");
  }

  // 5. Copy .htaccess
  const htaccess = path.resolve(ROOT, ".htaccess");
  if (fs.existsSync(htaccess)) {
    fs.copyFileSync(htaccess, path.resolve(DEPLOY_DIR, ".htaccess"));
    console.log("✓ .htaccess");
  }

  // 6. Copy package.json (for reference)
  fs.copyFileSync(path.resolve(ROOT, "package.json"), path.resolve(DEPLOY_DIR, "package.json"));
  console.log("✓ package.json");

  // 7. Copy prisma schema and migrations if they exist (for SQLite)
  const prismaSchema = path.resolve(ROOT, "prisma", "schema.prisma");
  if (fs.existsSync(prismaSchema)) {
    const deployPrisma = path.resolve(DEPLOY_DIR, "prisma");
    fs.mkdirSync(deployPrisma, { recursive: true });
    fs.copyFileSync(prismaSchema, path.resolve(deployPrisma, "schema.prisma"));

    const migrations = path.resolve(ROOT, "prisma", "migrations");
    if (fs.existsSync(migrations)) {
      copyRecursive(migrations, path.resolve(deployPrisma, "migrations"));
    }
    console.log("✓ prisma/");
  }

  // 8. Copy WhatsApp auth directory if it exists
  const waAuth = path.resolve(ROOT, "whatsapp-auth");
  if (fs.existsSync(waAuth)) {
    copyRecursive(waAuth, path.resolve(DEPLOY_DIR, "whatsapp-auth"));
    console.log("✓ whatsapp-auth/");
  }

  // Calculate size
  const size = getDirSize(DEPLOY_DIR);
  const sizeMB = (size / 1024 / 1024).toFixed(2);

  console.log(`\n✅ Deploy preparado en: ${DEPLOY_DIR}`);
  console.log(`   Tamaño total: ${sizeMB} MB`);
  console.log(`   Contenido:`);
  for (const entry of fs.readdirSync(DEPLOY_DIR)) {
    const entryPath = path.resolve(DEPLOY_DIR, entry);
    const entrySize = fs.statSync(entryPath).isDirectory()
      ? `(${(getDirSize(entryPath) / 1024 / 1024).toFixed(2)} MB)`
      : `(${(fs.statSync(entryPath).size / 1024).toFixed(1)} KB)`;
    console.log(`     ${entry}/ ${entrySize}`);
  }
  console.log(`\n📦 Instrucciones:`);
  console.log(`   1. Sube la carpeta 'deploy/' a tu hosting cPanel`);
  console.log(`   2. En cPanel > Node.js Selector, configura:`);
  console.log(`      - Ruta: (la carpeta donde subiste los archivos)`);
  console.log(`      - Archivo de inicio: server.js`);
  console.log(`      - Variables de entorno: las de tu .env`);
  console.log(`   3. Inicia la aplicación desde cPanel`);
}

function getDirSize(dir) {
  let size = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      size += getDirSize(fullPath);
    } else if (entry.isFile()) {
      size += fs.statSync(fullPath).size;
    }
  }
  return size;
}

main();
