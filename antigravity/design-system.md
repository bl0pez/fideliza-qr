# 🧭 Fideliza QR - Premium Design System

Este documento define los lineamientos visuales y de experiencia de usuario (UX) que hemos implementado para elevar la aplicación a una estética profesional, única y de alto impacto.

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

---

## 2. Paleta de Colores y Efectos

### Degradados Prototipo

- **Primario:** `bg-linear-to-r from-primary to-orange-500`.
- **Uso:** Solo en palabras clave específicas o botones de acción principal para no saturar.

### Iluminación Ambiental (Ambient Glow)

Para evitar fondos blancos planos, usamos "luces" de fondo:

- **Claro:** `bg-primary/5 blur-[120px] rounded-full`.
- **Oscuro:** `bg-primary/20` o `orange-500/10` sobre fondos `slate-900`.

### Glassmorphism

Para elementos flotantes (buscadores, filtros):

- `bg-white/10` o `bg-white/40` con `backdrop-blur-md` y bordes sutiles `border-white/20`.

---

## 3. Componentes Core

### Business Cards (Estilo Editorial)

- **Bordes:** `rounded-[2rem]` (Redondeado profundo).
- **Sombra:** `hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]`.
- **Interacción:** Las imágenes deben tener un efecto de zoom `hover:scale-110` con `duration-700`.
- **Identidad:** Incluir siempre el badge de "Negocio Verificado" para generar confianza.

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
