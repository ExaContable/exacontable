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

function replaceTracedNativePackage(packagePrefix, canonicalName) {
  const tracedModules = path.resolve(DEPLOY_DIR, ".next", "node_modules");
  if (!fs.existsSync(tracedModules)) return;

  for (const entry of fs.readdirSync(tracedModules)) {
    if (!entry.startsWith(`${packagePrefix}-`)) continue;
    const packageDir = path.resolve(tracedModules, entry);
    fs.rmSync(packageDir, { recursive: true });
    fs.mkdirSync(packageDir, { recursive: true });
    fs.writeFileSync(
      path.resolve(packageDir, "package.json"),
      JSON.stringify({ name: entry, version: "0.0.0", main: "index.js" }, null, 2)
    );
    fs.writeFileSync(
      path.resolve(packageDir, "index.js"),
      `module.exports = require(${JSON.stringify(canonicalName)});\n`
    );
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
  replaceTracedNativePackage("sharp", "sharp");

  // The build may be prepared on Windows while cPanel runs Linux. Never ship
  // native Windows binaries (sharp, better-sqlite3) to the server: npm must
  // install the production dependencies for cPanel's own OS and Node version.
  const bundledNodeModules = path.resolve(DEPLOY_DIR, "node_modules");
  if (fs.existsSync(bundledNodeModules)) {
    const vendorNodeModules = path.resolve(DEPLOY_DIR, "vendor", "node_modules");
    fs.mkdirSync(path.dirname(vendorNodeModules), { recursive: true });
    copyRecursive(bundledNodeModules, vendorNodeModules);
    fs.rmSync(bundledNodeModules, { recursive: true });

    // These packages contain platform-specific binaries. CloudLinux installs
    // their Linux builds in its managed node_modules symlink.
    for (const nativePath of [
      path.resolve(vendorNodeModules, "sharp"),
      path.resolve(vendorNodeModules, "@img"),
      path.resolve(vendorNodeModules, "next", "node_modules", "sharp"),
      path.resolve(vendorNodeModules, "next", "node_modules", "@img"),
    ]) {
      if (fs.existsSync(nativePath)) fs.rmSync(nativePath, { recursive: true });
    }
  }
  const bundledWhatsAppAuth = path.resolve(DEPLOY_DIR, "whatsapp-auth");
  if (fs.existsSync(bundledWhatsAppAuth)) {
    fs.rmSync(bundledWhatsAppAuth, { recursive: true });
  }
  const bundledEnv = path.resolve(DEPLOY_DIR, ".env");
  if (fs.existsSync(bundledEnv)) {
    fs.rmSync(bundledEnv);
  }

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
    // Runtime uploads can contain customer receipts and must never be included
    // in a source-controlled deployment artifact.
    const deployUploads = path.resolve(DEPLOY_DIR, "public", "uploads");
    if (fs.existsSync(deployUploads)) {
      fs.rmSync(deployUploads, { recursive: true });
    }
    console.log("✓ public/");
  }

  // 4. Ship only the environment template. Real production credentials must
  // be configured directly in cPanel and never committed with the artifact.
  const envExample = path.resolve(ROOT, ".env.production.example");
  if (fs.existsSync(envExample)) {
    fs.copyFileSync(envExample, path.resolve(DEPLOY_DIR, ".env.example"));
    console.log("✓ .env.example");
  }

  // 5. Copy .htaccess
  const htaccess = path.resolve(ROOT, ".htaccess");
  if (fs.existsSync(htaccess)) {
    fs.copyFileSync(htaccess, path.resolve(DEPLOY_DIR, ".htaccess"));
    console.log("✓ .htaccess");
  }

  // 6. Create deploy-specific package.json. cPanel installs the native Linux
  // dependencies and Prisma generates its client during npm install.
  const rootPkg = JSON.parse(fs.readFileSync(path.resolve(ROOT, "package.json"), "utf8"));
  const deployPkg = {
    name: rootPkg.name,
    version: rootPkg.version,
    private: true,
    engines: {
      node: ">=22 <25",
    },
    scripts: {
      start: "node server.js",
    },
    dependencies: {
      sharp: rootPkg.dependencies.sharp,
    },
  };
  fs.writeFileSync(
    path.resolve(DEPLOY_DIR, "package.json"),
    JSON.stringify(deployPkg, null, 2)
  );
  console.log("✓ package.json (deploy)");

  // 7. Copy prisma schema and migrations if they exist (for SQLite)
  const prismaSchema = path.resolve(ROOT, "prisma", "schema.prisma");
  if (fs.existsSync(prismaSchema)) {
    const deployPrisma = path.resolve(DEPLOY_DIR, "prisma");
    fs.mkdirSync(deployPrisma, { recursive: true });
    fs.copyFileSync(prismaSchema, path.resolve(deployPrisma, "schema.prisma"));

    const prismaConfig = path.resolve(ROOT, "prisma.config.ts");
    if (fs.existsSync(prismaConfig)) {
      fs.copyFileSync(prismaConfig, path.resolve(DEPLOY_DIR, "prisma.config.ts"));
    }

    const migrations = path.resolve(ROOT, "prisma", "migrations");
    if (fs.existsSync(migrations)) {
      copyRecursive(migrations, path.resolve(deployPrisma, "migrations"));
    }
    console.log("✓ prisma/");
  }

  // WhatsApp session credentials are runtime secrets. They must be created or
  // restored directly on the server, never copied into the deploy artifact.

  // 9. Create deployment instructions file
  const instructions = `# ExaContable - Instrucciones de Despliegue en cPanel

## Requisitos
- Node.js 22 LTS o Node.js 24 (configurar en cPanel > Node.js Selector)
- Prisma Postgres (configurar DATABASE_URL en Setup Node.js App)

## Pasos

### 1. Subir archivos
Sube TODO el contenido de esta carpeta a tu directorio de hosting en cPanel.
Puedes usar File Manager o FTP.

### 2. Instalar dependencias
En cPanel > Setup Node.js App, pulsa **Ejecutar NPM Install**.
El paquete de despliegue solo instala Sharp; PostgreSQL no requiere modulos
nativos ni compiladores en cPanel.

### 3. Configurar variables de entorno
En Setup Node.js App > Environment variables, pulsa **Anadir variable** y usa
\`.env.example\` como referencia:
- JWT_SECRET: genera con \`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"\`
- ADMIN_PASSWORD_HASH: genera con \`node -e "console.log(require('bcryptjs').hashSync('tu_password', 10))"\`
- SMTP_*: configuración de tu proveedor de correo
- WHATSAPP_TO: número de WhatsApp destino

### 4. Configurar Node.js en cPanel
En cPanel > Setup Node.js App:
- Application mode: Production
- Node.js version: 22 LTS (recomendado) o 24
- Application root: (tu directorio)
- Application startup file: server.js

### 5. Iniciar la aplicación
Haz click en "Start" en el Node.js Selector de cPanel.

### 6. Configurar dominio
Si usas un dominio, configura el Proxy Pass en cPanel para que
redirija al puerto de Node.js (ver paso 4).

## Base de datos
La migracion y el seed se aplican previamente a Prisma Postgres. En cPanel solo
debes agregar DATABASE_URL en Environment variables; no hace falta usar Terminal.

## Archivos importantes
- server.js: punto de entrada de la aplicación
- .env.example: referencia para las variables de Setup Node.js App
- prisma/: esquema y migraciones de la base de datos
- public/: archivos estáticos
`;
  fs.writeFileSync(path.resolve(DEPLOY_DIR, "DEPLOY-INSTRUCCIONES.md"), instructions);
  console.log("✓ DEPLOY-INSTRUCCIONES.md");

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
  console.log(`   2. En Setup Node.js App, pulsa: Ejecutar NPM Install`);
  console.log(`   3. Agrega las variables en Setup Node.js App`);
  console.log(`   4. En cPanel > Node.js Selector, configura:`);
  console.log(`      - Application mode: Production`);
  console.log(`      - Node.js version: 22 LTS (recomendado) o 24`);
  console.log(`      - Application root: (tu directorio)`);
  console.log(`      - Application startup file: server.js`);
  console.log(`   5. Inicia la aplicación desde cPanel`);
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
