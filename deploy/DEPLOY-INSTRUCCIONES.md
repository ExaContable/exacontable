# ExaContable - Instrucciones de Despliegue en cPanel

## Requisitos
- Node.js 22 LTS o Node.js 24 (configurar en cPanel > Node.js Selector)
- SQLite (incluido, no necesita configuración externa)

## Pasos

### 1. Subir archivos
Sube TODO el contenido de esta carpeta a tu directorio de hosting en cPanel.
Puedes usar File Manager o FTP.

### 2. Instalar dependencias
En cPanel > Terminal (o SSH), navega a tu directorio y ejecuta:
```bash
npm ci --omit=dev
```
Esto instalará las dependencias y ejecutará prisma generate + rebuild de better-sqlite3.

### 3. Configurar variables de entorno
Configura estas variables directamente en cPanel. Tambien puedes copiar
`.env.example` a `.env` en el servidor y reemplazar sus valores:
- JWT_SECRET: genera con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- ADMIN_PASSWORD_HASH: genera con `node -e "console.log(require('bcryptjs').hashSync('tu_password', 10))"`
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
La base de datos SQLite se crea automáticamente en `prisma/exacontable.db`.
Para migrar la base de datos después de actualizaciones:
```bash
npx prisma migrate deploy
```

## Archivos importantes
- server.js: punto de entrada de la aplicación
- .env: variables de entorno (NO subir a repositorios)
- prisma/: esquema y migraciones de la base de datos
- public/: archivos estáticos
