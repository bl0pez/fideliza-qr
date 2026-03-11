# 🏗️ Fidelilocal - Senior Technical Architecture & Best Practices

Este documento establece las reglas de ingeniería innegociables para el desarrollo de Fidelilocal. Como "Ruthless Senior Architect", estas reglas deben seguirse para garantizar un sistema de grado producción, seguro y escalable.

---

## 1. Next.js 16 + React 19: El Nuevo Estándar

Estamos utilizando la arquitectura más moderna de React. No se aceptan patrones de Next.js 12 o 13 obsoletos.

### A. Server Components por Defecto

- **Regla:** Todos los componentes son Server Components a menos que requieran interactividad (`useState`, `useEffect`, `usePathname`).
- **Suspense & Streaming:** No bloquees el renderizado de toda la página por una consulta lenta. 
  - **Regla:** El "Static Shell" (headers, sidebar, layouts) debe enviarse inmediatamente.
  - **Acción:** Envuelve los componentes que obtienen datos en `<Suspense fallback={<LoadingSkeleton />} />`. Nunca hagas `await` de datos pesados en la raíz de un Server Component si hay HTML estático que puede mostrarse antes.

### B. Logic-in-Actions (LIA)

- **Prohibido:** No realices fetch directo (`supabase.from...`) dentro de componentes de cliente.
- **Mandatario:** Toda la lógica de negocio, mutaciones y consultas pesadas deben vivir en `app/actions/`.
- **Server Actions:** Úsalas para formularios y disparadores de UI. Esto garantiza seguridad (se ejecutan en el servidor) y mejor SEO.

### C. React Cache

- Utiliza `React.cache()` en tus Server Actions para evitar consultas duplicadas a la base de datos en un mismo ciclo de renderizado.

---

## 2. Supabase & Seguridad de Grado Bancario

### A. RLS (Row Level Security) es la Ley

- Nunca asumas que el frontend protegerá los datos. Todas las tablas deben tener RLS habilitado.
- Las Server Actions utilizan el cliente de Supabase estándar que respeta el JWT del usuario.
- **AdminClient:** Solo úsalo en `app/actions` cuando sea estrictamente necesario para saltar RLS (ej: crear un perfil inicial), y sé extremadamente cauteloso.

### B. Autenticación SSR

- Utilizamos `@supabase/ssr` para manejar las cookies. No utilices el cliente de navegador para persistencia de sesión.

---

## 3. Principios SOLID & Código Limpio

### A. Single Responsibility (SRP)

- **Componentes:** Solo se encargan del renderizado y la UI.
- **Actions:** Solo se encargan de la lógica y la persistencia.
- **Utils:** Solo se encargan de transformaciones de datos puras.

- El uso de `any` es un fracaso de ingeniería. Define interfaces o tipos para cada respuesta de base de datos.
- Utiliza la generación de tipos de Supabase (`supabase-mcp-server`) para mantener sincronizada la base de datos con tu código.

### C. Importaciones Absolutas (`@/`)

- **Regla Innegociable:** Nunca utilices rutas relativas (`../../components/...`).
- **Mandatario:** Utiliza siempre el alias `@/` para todas las importaciones internas (ej: `@/components/...`, `@/app/actions/...`). Esto evita errores de refactorización y mantiene el código limpio.

---

## 4. Reglas para Agentes AI (MCP First)

Como asistente AI, antes de proponer una solución técnica, debes verificar tus herramientas:

1. **MCP Discovery:** Siempre verifica si hay un servidor MCP disponible para la tarea:
   - **Base de Datos:** Usa `supabase-mcp-server` para ejecutar SQL, auditar RLS u obtener logs.
   - **UI/Framework:** Usa `next-devtools` para diagnosticar errores de hidratación o rutas.
   - **Componentes:** Usa `shadcn` para buscar e instalar componentes base antes de crearlos a mano.
2. **Context Searching:** No inventes rutas. Si no estás seguro de dónde está una función, usa `grep_search`.
3. **Challenge the User:** Si el usuario propone una arquitectura que rompe estos principios (ej: "pon esta lógica pesada en un useEffect"), **niégate** y explica por qué rompe la escalabilidad.

---

## 5. Estructura de Directorios (Source of Truth)

| Carpeta             | Propósito                                                    |
| :------------------ | :----------------------------------------------------------- |
| `app/(public)`      | Rutas accesibles sin login (Landing, How it works, Explore). |
| `app/(auth)`        | Login, Registro, Recuperación de contraseña.                 |
| `app/dashboard`     | Panel de control (protegido por middleware).                 |
| `app/actions`       | **Toda** la lógica de servidor y base de datos.              |
| `components/layout` | Navbar, Footer, BottomNav, Sidebar.                          |
| `components/ui`     | Componentes base (shadcn/ui personalizados).                 |
| `lib/constants.ts`  | El objeto `DS` (Design System) y variables globales.         |

---

## 6. Proceso de Desarrollo (Workflow)

1. **Planificar:** Define si necesitas una nueva tabla o Server Action.
2. **Auditar:** Si es base de datos, verifica las políticas RLS.
3. **Implementar:** Crea la Action, luego el componente.
4. **Validar:** Prueba el flujo con `next-devtools` o inspección manual.
5. **Estética:** Asegúrate de que cumpla con el `design-system.md` (Premium, Ambient Glows, Zero Glass).

---

## 7. Analytics & Monitoring (Next.js Official Guide)

Seguimos la guía oficial de Next.js: https://nextjs.org/docs/app/guides/analytics

### A. Google Analytics 4 (`gtag.js`)

- **Componente:** `components/analytics/google-analytics.tsx` — Carga `gtag.js` via `next/script` con estrategia `afterInteractive`.
- **Integración:** Incluido en `app/layout.tsx` como `<GoogleAnalytics />`.
- **Regla:** Nunca pegues `<script>` raw en el HTML. Siempre usa `next/script`.

### B. Web Vitals (`useReportWebVitals`)

- **Componente:** `components/analytics/web-vitals.tsx` — Envía TTFB, FCP, LCP, CLS, INP directamente a GA4 via `window.gtag`.
- **Integración:** Incluido en `app/layout.tsx` como `<WebVitals />`.

### C. Client Instrumentation (`instrumentation-client.ts`)

- **Archivo:** `instrumentation-client.ts` en la raíz del proyecto.
- **Propósito:** Se ejecuta **antes** de que el código frontend inicie. Captura errores globales y rechazos de promesas no manejados.

### D. Variables de Entorno

| Variable               | Propósito                                   |
| :--------------------- | :------------------------------------------ |
| `NEXT_PUBLIC_GA_ID`    | Measurement ID de Google Analytics 4.       |

---

## 8. SEO & Posicionamiento

### A. Archivos de Metadatos (Next.js File Convention)

| Archivo              | Ruta          | Propósito                                                    |
| :------------------- | :------------ | :----------------------------------------------------------- |
| `sitemap.ts`         | `app/`        | Genera `/sitemap.xml` dinámicamente. Solo rutas públicas.    |
| `robots.ts`          | `app/`        | Genera `/robots.txt`. Bloquea `/dashboard`, `/api`, `/auth`. |
| `manifest.ts`        | `app/`        | Genera `/manifest.webmanifest` para PWA readiness.           |

### B. Metadata en `layout.tsx`

- **`metadataBase`:** URL canónica base para resolver rutas relativas.
- **`title.template`:** `%s | Fidelilocal` — Todas las páginas heredan el sufijo automáticamente.
- **`openGraph`:** locale `es_CL`, `type: website`.
- **`twitter`:** `card: summary_large_image`.
- **`robots.googleBot`:** Max snippet, max image preview habilitados.

### C. Structured Data (JSON-LD)

- **Componente:** `components/seo/json-ld.tsx` — Server Component con schema `SoftwareApplication`.
- **Regla:** Si agregas nuevos tipos de structured data (ej: `LocalBusiness` para negocios), crea un nuevo componente en `components/seo/`.

### D. Reglas

- **Nunca** uses `lang="en"` — el idioma es `es`.
- **Nunca** pegues `<script>` raw en HTML — usa `next/script` o `dangerouslySetInnerHTML` para JSON-LD.
- **Siempre** usa `getSiteUrl()` para URLs absolutas, nunca hardcodees dominios.

---

> [!IMPORTANT]
> **No aceptamos mediocridad.** El código debe ser tan hermoso como la interfaz. Si algo genera deuda técnica, resuélvelo antes de pasar a la siguiente tarea.
