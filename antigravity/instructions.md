# Objetivo del proyecto

Crear una **aplicación SaaS de fidelización para negocios locales**, donde los clientes puedan **suscribirse a negocios** y acceder a programas de recompensas como **tarjetas de sellos, cupones y promociones**.

La plataforma permitirá que los negocios creen y gestionen **programas de fidelización digitales**, mientras que los clientes podrán **descubrir negocios, suscribirse a ellos y ver todas las recompensas disponibles en un solo lugar**.

El proyecto se desarrollará utilizando **NextJS (App Router)**, **TailwindCSS** y **shadcn/ui**.

El proyecto **ya está creado y con Tailwind instalado**, pero actualmente **no tiene estilos ni funcionalidades implementadas**.

El objetivo es **implementar el diseño y las funcionalidades básicas de la plataforma**, construyendo una aplicación moderna, minimalista y escalable orientada a un **producto SaaS para fidelización de clientes en negocios locales**.

---

# Funcionamiento general del sistema

La aplicación tendrá **dos tipos principales de usuarios**:

- **Business Owners (negocios)**
- **Customers (clientes)**

---

# Experiencia para clientes

Los clientes podrán:

- buscar negocios dentro de la plataforma
- entrar al perfil de un negocio
- **suscribirse al negocio**
- ver todos los **beneficios disponibles**
- visualizar su **progreso en tarjetas de sellos**
- mostrar su **QR personal para recibir sellos**

Cuando un cliente se suscribe a un negocio, podrá ver todas las recompensas disponibles, por ejemplo:

```
☕ Café Central

Recompensas disponibles

Tarjeta de sellos
10 cafés → 1 café gratis

Cupón
10% descuento en desayuno

Promoción
2x1 en capuchino los viernes
```

---

# Experiencia para negocios

Los negocios tendrán acceso a un **dashboard administrativo** donde podrán:

- crear **programas de fidelización**
- crear **tarjetas de sellos**
- crear **cupones y promociones**
- ver **clientes suscritos**
- agregar **sellos a los clientes**
- ver **estadísticas del programa**

---

# Sistema de entrega de sellos

Cada cliente tendrá un **QR personal** asociado a su cuenta.

Flujo:

1. El cliente abre su tarjeta digital.
2. Muestra su **QR personal**.
3. El negocio escanea el QR desde su panel.
4. El sistema agrega automáticamente el **sello correspondiente**.

Esto permite que el proceso sea **rápido y fácil dentro del local**.

---

# Tipos de negocios que pueden usar la plataforma

La plataforma está pensada para negocios locales como:

- cafeterías
- barberías
- restaurantes
- panaderías
- lavados de autos
- tiendas locales

---

# Objetivo del desarrollo

El objetivo inicial es implementar las **pantallas principales y funcionalidades básicas del sistema**, incluyendo:

- landing page
- dashboard para negocios
- buscador de negocios
- página de perfil del negocio
- sistema de suscripción a negocios
- visualización de recompensas
- tarjetas de sellos digitales
- sistema de escaneo QR para agregar sellos
- panel de estadísticas básicas

El proyecto debe desarrollarse con una **arquitectura clara y escalable**, priorizando:

- reutilización de componentes
- organización clara de carpetas
- consistencia visual
- código limpio y mantenible

---

# Reglas de desarrollo

- Todas las **carpetas, archivos, funciones y variables deben estar nombradas en inglés**.
- Se deben crear **componentes reutilizables** para cualquier elemento que se repita.
- Mantener una **estructura de carpetas organizada por páginas o módulos**.
- No realizar **instalaciones de librerías o configuraciones adicionales sin consultar primero**.

---

# Diseño de la interfaz

La interfaz debe seguir un estilo:

- **SaaS moderno**
- **minimalista**
- **limpio**
- **enfocado en experiencia de usuario**

Utilizando la **paleta de colores y tipografía definidas en el sistema de diseño del proyecto**.
