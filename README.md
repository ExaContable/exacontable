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

En cPanel > **Setup Node.js App**, pulsa **Ejecutar NPM Install**. El artefacto
standalone incluye las dependencias JavaScript y cPanel solo instala para Linux
los modulos nativos `better-sqlite3` y `sharp`. Durante la instalacion,
`better-sqlite3` se recompila automaticamente para la version de Linux de
CloudLinux. No hace falta usar Terminal.

### 4. Configurar variables de entorno

En **Setup Node.js App > Environment variables**, pulsa **Añadir variable** y
registra los valores indicados en `.env.example`. No hace falta crear ni editar
un archivo `.env` desde Terminal.

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

La base de datos SQLite y sus tablas se crean o actualizan automaticamente al
iniciar. No hace falta ejecutar Prisma manualmente.

### Actualizaciones

Para actualizar el despliegue:

1. Ejecuta `npm run deploy` en local
2. Sube los nuevos archivos al servidor (sobreescribe)
3. Pulsa **Ejecutar NPM Install** en Setup Node.js App
4. Reinicia la app desde cPanel

### Solucion de problemas

**La app no inicia:**
- Verifica que `server.js` este en la raiz del directorio
- Revisa los logs en cPanel > Node.js Selector > "Logs"
- Asegurate de que Node.js 22 LTS o 24 este seleccionado

**El boton "Ejecutar NPM Install" muestra `Error`:**
- Verifica que hayas subido la version mas reciente de la carpeta `deploy`.
- Comprueba que `package.json` solo declare `better-sqlite3` y `sharp`.
- Si aun falla, solicita al proveedor soporte para modulos nativos de Node.js.

**Error de better-sqlite3:**
- Ejecuta `npm rebuild better-sqlite3 --build-from-source` en el servidor

**Error de base de datos:**
- Verifica que `DATABASE_URL` sea `file:./prisma/exacontable.db` y reinicia la aplicacion.

**Puerto en uso:**
- En cPanel, verifica que el puerto configurado este libre o cambia el valor de `PORT` en `.env`

## Licencia

Propietario - ExaContable
