# 🧭 Fideliza QR - Premium Design System

Este documento define los lineamientos visuales y de experiencia de usuario (UX) que hemos implementado para elevar la aplicación a una estética profesional, única y de alto impacto.

> **Fuente de verdad en código:** Todos los tokens de este documento están formalizados como constantes TypeScript en `lib/constants.ts` bajo el objeto exportado `DS`. Si modificas una clase aquí, actualiza también `DS` en constants, y viceversa.

---

## 1. Tipografía y Jerarquía

Utilizamos **Plus Jakarta Sans** como fuente principal por su legibilidad moderna y carácter tecnológico.

### Títulos de Alto Calibre

- **Peso:** Siempre usa `font-black` para los títulos principales (`h1` y `h2`).
- **Espaciado:** `tracking-tighter` o `tracking-tight` para dar un look masivo y moderno.
- **Interlineado:** `leading-[0.95]` o `leading-none` en títulos grandes para mantener la fuerza visual.

### "Heading Badge" (Sistema de Encabezado)

Cada sección nueva debe seguir esta estructura centrada:

1. **Sub-label:** Texto pequeño en mayúsculas, `font-bold` o `font-black`, con mucho espaciado (`tracking-[0.3em]`) y color `text-primary`.
2. **Iconos Decorativos:** Uso de líneas `h-px w-8 bg-primary/20` a los lados del sub-label para centrar la atención.
3. **Título Principal:** H2 grande con una palabra clave en **Cursiva + Degradado**.

**Tokens (`DS.typography`):**

| Token              | Clases                                                       |
| ------------------ | ------------------------------------------------------------ |
| `heading`          | `font-black tracking-tighter leading-[0.95]`                 |
| `headingMd`        | `font-black tracking-tight leading-none`                     |
| `sectionLabel`     | `text-xs font-black tracking-[0.3em] text-primary uppercase` |
| `sectionLabelLine` | `hidden sm:block h-px w-12 bg-primary/20`                    |

---

## 2. Paleta de Colores y Efectos

### Degradados Prototipo

- **Primario:** `bg-linear-to-r from-primary to-orange-500`.
- **Uso:** Solo en palabras clave específicas o botones de acción principal para no saturar.

**Tokens (`DS.gradient`):**

| Token         | Clases                                                                    |
| ------------- | ------------------------------------------------------------------------- |
| `primary`     | `bg-linear-to-r from-primary to-orange-500`                               |
| `primaryText` | `bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent` |

### Iluminación Ambiental (Ambient Glow)

Para evitar fondos blancos planos, usamos "luces" de fondo:

- **Claro:** `bg-primary/5 blur-[120px] rounded-full`.
- **Oscuro:** `bg-primary/20` o `orange-500/10` sobre fondos `slate-900`.

**Tokens (`DS.glow`):**

| Token    | Clases                                                           |
| -------- | ---------------------------------------------------------------- |
| `light`  | `bg-primary/5 blur-[120px] rounded-full pointer-events-none`     |
| `dark`   | `bg-primary/20 blur-[120px] rounded-full pointer-events-none`    |
| `accent` | `bg-orange-500/10 blur-[120px] rounded-full pointer-events-none` |

### Glassmorphism

Para elementos flotantes (buscadores, filtros):

- `bg-white/10` o `bg-white/40` con `backdrop-blur-md` y bordes sutiles `border-white/20`.

**Tokens (`DS.glass`):**

| Token   | Clases                                                |
| ------- | ----------------------------------------------------- |
| `light` | `bg-white/40 backdrop-blur-md border border-white/20` |
| `dark`  | `bg-white/10 backdrop-blur-md border border-white/20` |
| `card`  | `bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl`   |

---

## 3. Componentes Core

### Business Cards (Estilo Editorial)

- **Bordes:** `rounded-[2rem]` (Redondeado profundo).
- **Sombra:** `hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]`.
- **Interacción:** Las imágenes deben tener un efecto de zoom `hover:scale-110` con `duration-700`.
- **Identidad:** Incluir siempre el badge de "Negocio Verificado" para generar confianza.

**Tokens (`DS.card`):**

| Token        | Clases                                             |
| ------------ | -------------------------------------------------- |
| `rounded`    | `rounded-[2rem]`                                   |
| `shadow`     | `hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]` |
| `imageHover` | `hover:scale-110 duration-700`                     |
| `border`     | `border-slate-100`                                 |

### Secciones de Contenido (Cards de Recompensa/Pasos)

- Fondos neutros `bg-slate-50`.
- Iconos grandes en contenedores redondeados `rounded-2xl`.
- Evitar el uso de bordes negros; preferir bordes sutiles `border-slate-100`.

---

## 4. Tono y Voz del Diseño

- **Profesional, no Genérico:** Evitar componentes estándar de librerías sin modificar.
- **Enfoque Administrativo:** En el área de negocios, hablar de "Control", "Panel" y "Gestión", no solo de "Pagos".
- **Fidelización Digital:** El mensaje central siempre es "Eliminar el papel" y "Digitalizar la tarjeta de sellos".

---

## 5. Mobile First

- Todos los carruseles deben mostrar un "hint" (un pequeño fragmento) de la siguiente tarjeta para invitar al scroll.
- El espaciado en móvil debe ser generoso (`py-16` a `py-20`) para dar aire a la tipografía pesada.

**Tokens (`DS.spacing`):**

| Token             | Clases           |
| ----------------- | ---------------- |
| `sectionVertical` | `py-16 sm:py-20` |

---

## 6. Uso en Código

```tsx
import { DS } from "@/lib/constants";

// Ejemplo de heading badge
<div className="flex items-center gap-4">
  <div className={DS.typography.sectionLabelLine} />
  <span className={DS.typography.sectionLabel}>Panel de Control</span>
  <div className={DS.typography.sectionLabelLine} />
</div>
<h1 className={`text-5xl ${DS.typography.heading}`}>
  Título con{" "}
  <span className={DS.gradient.primaryText}>degradado</span>
</h1>

// Ambient glow de fondo
<div className={`absolute top-0 left-1/4 w-96 h-96 -z-10 ${DS.glow.light}`} />

// Card editorial
<div className={`${DS.card.rounded} ${DS.card.border} ${DS.glass.card}`}>
  ...
</div>
```

---

## 7. Arquitectura y Rendimiento (Next.js)

Para asegurar una aplicación rápida, mantenible y escalable, sigue estas reglas estructurales:

### Server Actions

1. **Prioridad Absoluta:** Toda petición o mutación de datos debe realizarse mediante **Server Actions**.
2. **Ubicación Centralizada:** Todas las Server Actions deben residir en la carpeta `app/actions`.
3. **Reutilización:** Antes de crear una nueva Server Action, verifica si ya existe una acción que cumpla el mismo propósito dentro de `app/actions`.

### Componentes de Servidor Asíncronos (Suspense)

1. **Carga Selectiva:** En un Server Component, mantén el código asíncrono lo más aislado posible.
2. **Uso de Suspense:** Envuelve únicamente las partes de la interfaz que dependan de la carga de datos dentro de componentes `<Suspense>`.
3. **HTML Estático Inmediato:** El HTML que no requiera datos asíncronos debe ser síncrono para que se renderice inmediatamente sin bloquear la experiencia del usuario.
