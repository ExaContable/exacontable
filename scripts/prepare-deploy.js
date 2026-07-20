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

  // 6. Create deploy-specific package.json with postinstall for native modules
  const rootPkg = JSON.parse(fs.readFileSync(path.resolve(ROOT, "package.json"), "utf8"));
  const deployPkg = {
    name: rootPkg.name,
    version: rootPkg.version,
    private: true,
    scripts: {
      start: "node server.js",
      "postinstall":
        "prisma generate && npm rebuild better-sqlite3 --build-from-source || true",
    },
    dependencies: rootPkg.dependencies,
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
      fs.copyFileSync(prismaConfig, path.resolve(deployPrisma, "prisma.config.ts"));
    }

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

  // 9. Create deployment instructions file
  const instructions = `# ExaContable - Instrucciones de Despliegue en cPanel

## Requisitos
- Node.js 18+ (configurar en cPanel > Node.js Selector)
- SQLite (incluido, no necesita configuración externa)

## Pasos

### 1. Subir archivos
Sube TODO el contenido de esta carpeta a tu directorio de hosting en cPanel.
Puedes usar File Manager o FTP.

### 2. Instalar dependencias
En cPanel > Terminal (o SSH), navega a tu directorio y ejecuta:
\`\`\`bash
npm install
\`\`\`
Esto instalará las dependencias y ejecutará prisma generate + rebuild de better-sqlite3.

### 3. Configurar variables de entorno
Edita el archivo \`.env\` con tus valores reales:
- JWT_SECRET: genera con \`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"\`
- ADMIN_PASSWORD_HASH: genera con \`node -e "console.log(require('bcryptjs').hashSync('tu_password', 10))"\`
- SMTP_*: configuración de tu proveedor de correo
- WHATSAPP_TO: número de WhatsApp destino

### 4. Configurar Node.js en cPanel
En cPanel > Setup Node.js App:
- Application mode: Production
- Node.js version: 18+ 
- Application root: (tu directorio)
- Application startup file: server.js

### 5. Iniciar la aplicación
Haz click en "Start" en el Node.js Selector de cPanel.

### 6. Configurar dominio
Si usas un dominio, configura el Proxy Pass en cPanel para que
redirija al puerto de Node.js (ver paso 4).

## Base de datos
La base de datos SQLite se crea automáticamente en \`prisma/exacontable.db\`.
Para migrar la base de datos después de actualizaciones:
\`\`\`bash
npx prisma migrate deploy
\`\`\`

## Archivos importantes
- server.js: punto de entrada de la aplicación
- .env: variables de entorno (NO subir a repositorios)
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
  console.log(`   2. En cPanel > Terminal, ejecuta: npm install`);
  console.log(`   3. Edita el archivo .env con tus credenciales reales`);
  console.log(`   4. En cPanel > Node.js Selector, configura:`);
  console.log(`      - Application mode: Production`);
  console.log(`      - Node.js version: 18+`);
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
