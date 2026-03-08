# Paleta de colores (usar exactamente estos valores)

- **Nordic — #19322F** (Color principal oscuro)
- **Mosque — #006655** (Color primario de acción)
- **Hint of Green — #D9ECC8** (Fondo suave / tarjetas destacadas)
- **Clear Day — #EEF6F6** (Fondo general de la app)

## Uso dentro del proyecto SaaS de tarjetas de fidelización

- **Fondo principal de la aplicación y landing:** Clear Day
- **Botones principales** como _Crear tarjeta_, _Crear cuenta_, _Agregar sello_: Mosque
- **Headers / navegación / sidebar del dashboard:** Nordic
- **Tarjetas destacadas** como features, pasos y promociones: Hint of Green
- **Texto principal** de todo el sitio y dashboard: Nordic

Esta paleta debe transmitir:

- tecnología
- confianza
- simplicidad para negocios locales
- estética moderna tipo SaaS

---

# Tipografía

Uso obligatorio de **SF Pro Display**.

## Reglas de uso

- **Títulos principales:** SF Pro Display Bold
- **Subtítulos:** SF Pro Display Semibold
- **Texto normal:** SF Pro Display Regular
- **Botones y navegación:** SF Pro Display Medium

Objetivo: lograr una **jerarquía visual clara y moderna**, similar a productos SaaS como Stripe o Linear.

---

# Prioridades

- Trabaja pensando en **reutilizar componentes y estilos** para todo el proyecto.

- Crea **componentes reutilizables** para cualquier elemento que se repita como:
  - tarjetas de funcionalidades
  - tarjetas de precios
  - tarjetas de promociones
  - botones
  - secciones de pasos

- Mantén **consistencia visual entre la landing page y el dashboard**.

- **No hagas configuraciones ni instalaciones de librerías sin consultar primero.**

---

# Convenciones de código

Para mantener el proyecto limpio y escalable:

- **Carpetas, archivos, funciones y variables deben estar nombrados en inglés.**
- Usar **camelCase** para variables y funciones.
- Usar **PascalCase** para componentes.
- Usar **kebab-case** para rutas cuando sea necesario.

## Ejemplos

```ts
const customerList = [];

function createLoyaltyCard() {}

function addStampToCustomer() {}
```

Componentes:

```tsx
LoyaltyCard.tsx;
PricingCard.tsx;
FeatureCard.tsx;
PrimaryButton.tsx;
Navbar.tsx;
Sidebar.tsx;
```

---

# Estructura de carpetas recomendada

Las carpetas deben organizarse **por páginas o dominios del producto**.

```
src/
  app/
    landing/
      page.tsx
      components/
        HeroSection.tsx
        FeaturesSection.tsx
        PricingSection.tsx
        FooterSection.tsx

    dashboard/
      page.tsx
      components/
        StatsCard.tsx
        ActivityChart.tsx

    loyalty-cards/
      page.tsx
      components/
        LoyaltyCardItem.tsx
        CreateLoyaltyCardForm.tsx

    customers/
      page.tsx
      components/
        CustomerTable.tsx
        CustomerRow.tsx

    analytics/
      page.tsx
      components/
        AnalyticsChart.tsx
        AnalyticsSummary.tsx

  components/
    ui/
      Button.tsx
      Card.tsx
      Input.tsx
      Modal.tsx

  styles/
    globals.css
```

---

# Componentes reutilizables clave

Se deben crear componentes reutilizables para mantener consistencia en todo el sistema.

## Botones

```
PrimaryButton
SecondaryButton
IconButton
```

## Tarjetas

```
FeatureCard
PricingCard
LoyaltyCard
StatsCard
```

## Elementos de interfaz

```
Navbar
Sidebar
Footer
SectionContainer
```

Estos componentes deben ser **reutilizables entre la landing page y el dashboard**.

---

# Contexto del producto

El diseño debe estar pensado para un **SaaS de fidelización para negocios locales**, donde los negocios puedan:

- crear **tarjetas de sellos digitales**
- registrar **clientes**
- escanear **códigos QR para agregar sellos**
- ver **estadísticas de fidelización**
- gestionar **recompensas para sus clientes**

## Tipos de negocios que usarán el sistema

- cafeterías
- barberías
- restaurantes
- lavados de autos
- panaderías
- tiendas locales
