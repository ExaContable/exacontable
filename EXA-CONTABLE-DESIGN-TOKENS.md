# EXA Contable — Design Tokens & Brand Elements

## 1. Paleta de Colores

### Colores principales (Light Mode)

| Token | Valor OKLCH | Hex aproximado | Uso |
|-------|-------------|----------------|-----|
| `--primary` | `oklch(0.55 0.18 25)` | `#dc4c1e` | Color principal de marca (rojo-anaranjado) |
| `--primary-foreground` | `oklch(0.99 0 0)` | `#ffffff` | Texto sobre primary |
| `--background` | `oklch(1 0 0)` | `#ffffff` | Fondo de página |
| `--foreground` | `oklch(0.145 0 0)` | `#1a1a1a` | Texto principal |
| `--heading` | `oklch(0.12 0 0)` | `#0f0f0f` | Texto de títulos |
| `--body` | `oklch(0.25 0 0)` | `#333333` | Texto de cuerpo |
| `--secondary` | `oklch(0.96 0 0)` | `#f2f2f2` | Elementos secundarios |
| `--secondary-foreground` | `oklch(0.12 0 0)` | `#0f0f0f` | Texto sobre secondary |
| `--muted` | `oklch(0.96 0 0)` | `#f2f2f2` | Fondos muted |
| `--muted-foreground` | `oklch(0.48 0 0)` | `#6b6b6b` | Texto muted |
| `--accent` | `oklch(0.96 0 0)` | `#f2f2f2` | Fondos accent |
| `--accent-foreground` | `oklch(0.12 0 0)` | `#0f0f0f` | Texto sobre accent |
| `--destructive` | `oklch(0.6 0.18 25)` | `#c4321a` | Acciones destructivas/error |
| `--border` | `oklch(0.1 0 0 / 8%)` | `rgba(10,10,10,0.08)` | Bordes |
| `--input` | `oklch(0.1 0 0 / 10%)` | `rgba(10,10,10,0.10)` | Bordes de inputs |
| `--ring` | `oklch(0.55 0.18 25)` | `#dc4c1e` | Anillos de foco |
| `--success` | — | `#10b981` | Indicadores de éxito (uso inline) |

### Colores de fondo alternativos (hardcoded en componentes)

| Color | Hex | Uso |
|-------|-----|-----|
| Granate oscuro | `#8B1E21` | Secciones destacadas (Features, CTA, Benefits, Security) |

### Charts

| Token | Valor |
|-------|-------|
| `--chart-1` | `oklch(0.87 0 0)` |
| `--chart-2` | `oklch(0.556 0 0)` |
| `--chart-3` | `oklch(0.439 0 0)` |
| `--chart-4` | `oklch(0.371 0 0)` |
| `--chart-5` | `oklch(0.269 0 0)` |

### Sidebar

| Token | Valor |
|-------|-------|
| `--sidebar` | `oklch(0.99 0 0)` |
| `--sidebar-foreground` | `oklch(0.145 0 0)` |
| `--sidebar-primary` | `oklch(0.55 0.18 25)` (mismo que primary) |
| `--sidebar-primary-foreground` | `oklch(0.99 0 0)` |
| `--sidebar-accent` | `oklch(0.96 0 0)` |
| `--sidebar-accent-foreground` | `oklch(0.12 0 0)` |
| `--sidebar-border` | `oklch(0.1 0 0 / 8%)` |
| `--sidebar-ring` | `oklch(0.55 0.18 25)` |

---

## 2. Tipografía

| Token | Fuente | Uso |
|-------|--------|-----|
| `--font-heading` | **Sora** (variable) | Títulos y encabezados |
| `--font-sans` / `--font-body` | **Outfit** (variable) | Texto de cuerpo y general |

Cargadas mediante `next/font` desde Google Fonts.

---

## 3. Bordes Redondeados

| Token | Valor |
|-------|-------|
| `--radius` (base) | `10px` |
| `--radius-xs` | `10px` |
| `--radius-sm` | `6px` |
| `--radius-md` | `8px` |
| `--radius-lg` | `10px` |
| `--radius-xl` | `14px` |
| `--radius-2xl` | `18px` |
| `--radius-3xl` | `22px` |
| `--radius-4xl` | `26px` |

---

## 4. Sombras

| Token | Valor |
|-------|-------|
| `--shadow-1` | `0px 8px 20px 0px color-mix(in oklab, var(--primary) 32%, transparent)` |
| `--shadow-2` | `0px 0px 0px 4px var(--border), 0px 1px 0px 0px var(--border) inset, 0px -1px 0px 0px var(--border) inset` |
| `--shadow-3` | `0px 1px 2px 1px rgba(0, 0, 0, 0.25)` |

Sombra de botón primary: `0 1px 2px rgba(220,76,30,0.18), 0 2px 8px rgba(220,76,30,0.3)`

---

## 5. Spacing

| Token | Valor |
|-------|-------|
| `--spacing-1` | `8px` |
| `--spacing-2` | `11px` |
| `--spacing-3` | `12px` |
| `--spacing-4` | `16px` |
| `--spacing-5` | `20px` |
| `--spacing-6` | `22px` |
| `--spacing-7` | `30px` |
| `--spacing-8` | `40px` |

---

## 6. Elementos de UI

### Botones
- **Primary:** Fondo `--primary` (`#dc4c1e`), texto blanco, sombra primary
- **Outline:** Borde `--border`, fondo transparente
- **Large:** Misma sombra primary amplificada

### Badges / Estados
- **Éxito:** `bg-emerald-500/10 border-emerald-500/30 text-emerald-500`
- **Error:** `border-red-500/20 bg-red-500/10 text-red-400`
- **Alerta (email):** Borde izquierdo `#dc4c1e`, fondo `#fcf8f2`

### Cards
- **Fondo:** `--card` (`oklch(0.99 0 0)`)
- **Texto:** `--card-foreground` (`oklch(0.145 0 0)`)

### Popovers
- **Fondo:** `--popover` (`oklch(1 0 0)`)
- **Texto:** `--popover-foreground` (`oklch(0.145 0 0)`)

### WhatsApp Widget
- **Fondo:** `bg-emerald-500`
- **Sombra:** `rgba(16,185,129,0.35)`

---

## 7. Recursos de Marca

| Recurso | Archivo |
|---------|---------|
| Logo principal | `public/logo-exa.png` |
| Logo rojo | `public/logo-rojo.png` |
| Logo blanco | `public/logo-blanco.png` |
| Logo sin tagline | `public/logo-sin-tagline.png` |
| Favicon | `public/favicon.png` |

### Contacto
- **Web:** https://exacontable.com
- **Email:** info@exacontable.com
- **Instagram:** @exacontable
- **Facebook:** @exacontable
- **WhatsApp:** +593 97 883 5575

---

## 8. Stack Técnico

- **Framework:** Next.js (App Router)
- **CSS:** Tailwind CSS v4 (configuración vía `@theme inline` en `globals.css`)
- **UI Library:** shadcn/ui (style: `base-nova`, base color: `neutral`)
- **Iconos:** Lucide React
- **Dark Mode:** next-themes v0.4.6 (soporte preparado, valores dark aún no definidos)
- **Fuentes:** Sora + Outfit vía Google Fonts
