# Paleta de colores

La aplicación utiliza un sistema de colores basado en **OKLCH** compatible con **shadcn/ui**.

Todos los estilos deben utilizar **las variables CSS del tema**, no colores hardcodeados.

## Tokens de color principales

```
--background
--foreground
--card
--card-foreground
--primary
--primary-foreground
--secondary
--secondary-foreground
--muted
--muted-foreground
--accent
--accent-foreground
--destructive
--border
--input
--ring
```

El sistema incluye soporte automático para **modo claro y modo oscuro**.

---

# Uso de colores dentro del producto

## Fondo principal

Usar:

```
bg-background
```

Este color se utiliza para:

- fondo general de la aplicación
- páginas principales
- contenedores principales

---

## Texto principal

Usar:

```
text-foreground
```

Para:

- títulos
- párrafos
- labels
- navegación

---

## Botones principales

Usar:

```
bg-primary
text-primary-foreground
```

Ejemplos de acciones:

- Crear cuenta
- Suscribirse a negocio
- Crear programa de fidelización
- Agregar sello
- Guardar cambios

---

## Tarjetas

Las tarjetas deben usar:

```
bg-card
text-card-foreground
border-border
```

Ejemplos:

- tarjetas de negocio
- tarjetas de recompensas
- tarjetas de estadísticas
- tarjetas de promociones

---

## Elementos secundarios

Usar:

```
bg-secondary
text-secondary-foreground
```

Para:

- botones secundarios
- contenedores informativos
- badges suaves

---

## Elementos suaves o deshabilitados

Usar:

```
bg-muted
text-muted-foreground
```

Para:

- textos secundarios
- estados vacíos
- información adicional

---

# Estilo visual del producto

El diseño debe transmitir:

- producto SaaS moderno
- simplicidad
- claridad visual
- experiencia mobile-first
- estética minimalista

Inspiración visual similar a:

- Stripe
- Linear
- Vercel
- Notion

---

# Tipografía

Uso obligatorio de:

**SF Pro Display**

Jerarquía:

## Títulos principales

```
SF Pro Display Bold
```

Usado en:

- Hero
- títulos de página
- títulos de sección

---

## Subtítulos

```
SF Pro Display Semibold
```

Usado en:

- encabezados de tarjetas
- títulos de componentes

---

## Texto normal

```
SF Pro Display Regular
```

Usado en:

- descripciones
- contenido general

---

## Botones y navegación

```
SF Pro Display Medium
```

---

# Prioridades de desarrollo

- Trabajar siempre pensando en **reutilizar componentes**.
- Mantener consistencia visual entre **landing, dashboard y páginas internas**.
- Usar siempre **tokens del theme** en lugar de colores directos.

Ejemplo correcto:

```
className="bg-primary text-primary-foreground"
```

Ejemplo incorrecto:

```
className="bg-purple-600"
```

---

# Convenciones de código

Para mantener el proyecto limpio y escalable:

- Carpetas en **kebab-case**
- Variables y funciones en **camelCase**
- Componentes en **PascalCase**

---

## Ejemplos

Variables:

```ts
const businessList = [];
const featuredBusinesses = [];
```

Funciones:

```ts
function createLoyaltyProgram() {}

function subscribeToBusiness() {}

function addStampToCustomer() {}
```

Componentes:

```tsx
BusinessCard.tsx;
RewardCard.tsx;
FeatureCard.tsx;
PrimaryButton.tsx;
Navbar.tsx;
Sidebar.tsx;
```

---

# Estructura de carpetas recomendada

Organizar el proyecto **por dominios del producto**.

```
src/
  app/
    landing/
      page.tsx
      components/
        HeroSection.tsx
        BusinessSearch.tsx
        FeaturedBusinesses.tsx
        HowItWorks.tsx
        FooterSection.tsx

    dashboard/
      page.tsx
      components/
        StatsCard.tsx
        ActivityChart.tsx

    businesses/
      page.tsx
      components/
        BusinessCard.tsx
        BusinessProfile.tsx

    rewards/
      page.tsx
      components/
        RewardCard.tsx
        LoyaltyStampCard.tsx

    customers/
      page.tsx
      components/
        CustomerTable.tsx
        CustomerRow.tsx

  components/
    ui/
      Button.tsx
      Card.tsx
      Input.tsx
      Badge.tsx
      Modal.tsx
      Tabs.tsx

  styles/
    globals.css
```

---

# Componentes reutilizables clave

## Botones

```
PrimaryButton
SecondaryButton
IconButton
```

---

## Tarjetas

```
BusinessCard
RewardCard
LoyaltyStampCard
StatsCard
FeatureCard
```

---

## Elementos de interfaz

```
Navbar
Sidebar
Footer
SectionContainer
SearchBar
```

Estos componentes deben ser reutilizables en:

- landing
- dashboard
- páginas de negocio
- páginas de recompensas

---

# Contexto del producto

El sistema es un **SaaS de fidelización para negocios locales**.

Los negocios podrán:

- crear **programas de fidelización**
- crear **tarjetas de sellos digitales**
- crear **cupones y promociones**
- gestionar **clientes suscritos**
- escanear **QR de clientes**
- ver **estadísticas del programa**

---

# Experiencia del cliente

Los clientes podrán:

- buscar negocios
- suscribirse a negocios
- ver recompensas disponibles
- acumular sellos
- canjear recompensas

---

# Tipos de negocios objetivo

La plataforma está pensada para:

- cafeterías
- barberías
- restaurantes
- panaderías
- lavados de autos
- tiendas locales
