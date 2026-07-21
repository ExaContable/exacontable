# ExaContable

Plataforma web para la venta y gestion de planes de contabilidad en linea. Incluye catalogo de planes, carrito de compras, checkout, panel de administracion y integracion con WhatsApp.

## Stack Tecnologico

- **Framework:** Next.js 16 (App Router, standalone output)
- **Base de datos:** SQLite con Prisma ORM
- **UI:** Tailwind CSS 4, shadcn/ui, Framer Motion
- **Estado:** Zustand (carrito con persistencia localStorage)
- **Auth:** JWT con jose + bcryptjs
- **Email:** Nodemailer (SMTP)
- **WhatsApp:** Baileys (conexion directa)

## Requisitos

- Node.js 22 LTS o Node.js 24
- npm 9+

## Desarrollo Local

```bash
# Instalar dependencias
npm ci

# Configurar variables de entorno
cp .env.production.example .env

# Generar cliente de Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run dev
```

La app estara disponible en http://localhost:3000

## Variables de Entorno

Las variables necesarias estan definidas en `.env.production.example`:

| Variable | Descripcion |
|---|---|
| `DATABASE_URL` | Ruta a la base de datos SQLite |
| `JWT_SECRET` | Secreto para firmar tokens JWT |
| `ADMIN_EMAIL` | Email del administrador |
| `ADMIN_PASSWORD_HASH` | Hash bcrypt de la contrasena admin |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Configuracion SMTP para correos |
| `WHATSAPP_TO` | Numero de WhatsApp destino |
| `NEXT_PUBLIC_SITE_URL` | URL del sitio |

Genera un JWT_SECRET con:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Genera un hash de contrasena con:

```bash
node -e "console.log(require('bcryptjs').hashSync('tu contrasena', 10))"
```

## Estructura del Proyecto

```
exacontable/
├── app/
│   ├── admin/              # Panel de administracion
│   ├── api/                # API routes (cart, checkout, orders, etc.)
│   ├── checkout/           # Pagina de checkout
│   ├── gracias/            # Pagina de agradecimiento
│   └── mis-pedidos/        # Consulta de pedidos
├── components/
│   ├── admin/              # Componentes del admin
│   ├── layout/             # Navbar, cart, WhatsApp
│   ├── plans/              # Cards y builder de planes
│   ├── sections/           # Secciones de la landing page
│   └── ui/                 # Componentes base (shadcn)
├── hooks/                  # Custom hooks (use-cart, use-products)
├── lib/                    # Utilidades (auth, email, store, whatsapp)
├── prisma/                 # Schema y migraciones
├── public/                 # Assets estaticos
└── scripts/                # Scripts de utilidad
```

## Comandos

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de produccion
npm start            # Iniciar en produccion
npm run lint         # Ejecutar linter
npm run deploy       # Build + preparar carpeta deploy/
```

---

## Despliegue en cPanel

### 1. Preparar el build

Desde tu maquina local:

```bash
npm run deploy
```

Esto genera la carpeta `deploy/` con el build standalone de Next.js, dependencias, base de datos y archivos estaticos.

### 2. Subir archivos a cPanel

Sube TODO el contenido de la carpeta `deploy/` a tu hosting usando:

- **File Manager** de cPanel (Subir archivos), o
- **FTP/SFTP** con un cliente como FileZilla

Si tu sitio esta en un subdirectorio (ej: `public_html/exacontable`), sube ahi.

### 3. Instalar dependencias en el servidor

En cPanel > **Terminal** (o via SSH):

```bash
cd ~/public_html/exacontable   # ajusta la ruta
npm ci --omit=dev
```

Esto instala desde el lockfile las dependencias nativas (`better-sqlite3` y `sharp`) compiladas para Linux y ejecuta `prisma generate`. No subas la carpeta `node_modules` creada en Windows.

### 4. Configurar variables de entorno

Edita el archivo `.env` en el servidor con tus credenciales reales. Puedes usar File Manager o el terminal:

```bash
nano .env
```

Asegurate de tener valores reales para:
- `JWT_SECRET`
- `ADMIN_PASSWORD_HASH`
- `SMTP_*`
- `WHATSAPP_TO`

### 5. Configurar Node.js en cPanel

En cPanel busca **"Setup Node.js App"** o **"Node.js Selector"**:

| Campo | Valor |
|---|---|
| Application mode | Production |
| Node.js version | 22 LTS (recomendado) o 24 |
| Application root | `public_html/exacontable` (o tu ruta) |
| Application startup file | `server.js` |

### 6. Iniciar la aplicacion

Haz click en **"Start"** en el Node.js Selector.

La app estara disponible en tu dominio. Si cPanel asigna un puerto (ej: 3000), el proxy reverso ya deberia redirigir al dominio.

### 7. Base de datos

La base de datos SQLite se crea automaticamente en `prisma/exacontable.db` al iniciar.

Para migrar despues de actualizaciones:

```bash
npx prisma migrate deploy
```

### Actualizaciones

Para actualizar el despliegue:

1. Ejecuta `npm run deploy` en local
2. Sube los nuevos archivos al servidor (sobreescribe)
3. Ejecuta `npm ci --omit=dev` en el servidor
4. Reinicia la app desde cPanel

### Solucion de problemas

**La app no inicia:**
- Verifica que `server.js` este en la raiz del directorio
- Revisa los logs en cPanel > Node.js Selector > "Logs"
- Asegurate de que Node.js 22 LTS o 24 este seleccionado

**El boton "Run NPM Install" solo muestra `Error`:**
- Abre cPanel > Terminal, activa el entorno virtual que muestra "Setup Node.js App" y ejecuta `npm ci --omit=dev` dentro del Application root. El terminal muestra el error real.
- Verifica que `package-lock.json`, `prisma.config.ts` y `prisma/schema.prisma` esten en el servidor.
- Si el hosting no permite compilar modulos nativos, solicita al proveedor soporte para `better-sqlite3` o usa PostgreSQL en produccion.

**Error de better-sqlite3:**
- Ejecuta `npm rebuild better-sqlite3 --build-from-source` en el servidor

**Error de Prisma:**
- Ejecuta `npx prisma generate` y `npx prisma migrate deploy`

**Puerto en uso:**
- En cPanel, verifica que el puerto configurado este libre o cambia el valor de `PORT` en `.env`

## Licencia

Propietario - ExaContable
