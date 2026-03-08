# 🛡️ Estrategia de Limitación por Planes

Para asegurar que los negocios respeten los límites de su plan (Básico, Pro, Business), implementaremos un sistema de **"Guardián de Límites"** basado en base de datos y lógica de servidor (Next.js + Supabase).

---

## 1. Estructura de Datos (Schema)

### Tabla `plans` (Metadata)

Define qué permite cada plan. Esto nos permite cambiar los límites sin tocar el código.
| Campo | Tipo | Ejemplo (Básico) | Ejemplo (Pro) |
| :--- | :--- | :--- | :--- |
| `id` | `text` | `basic` | `pro` |
| `max_branches` | `int` | `1` | `2` |
| `max_scans_monthly`| `int` | `50` | `-1` (ilimitado) |
| `max_card_types` | `int` | `1` | `10` |
| `custom_qr` | `bool` | `false` | `true` |

### Tabla `businesses` (Extensión)

| Campo              | Tipo   | Descripción                                           |
| :----------------- | :----- | :---------------------------------------------------- |
| `plan_id`          | `text` | Relación con `plans.id`                               |
| `scans_this_month` | `int`  | Contador de escaneos realizados. Se resetea cada mes. |
| `plan_status`      | `text` | `active`, `past_due`, `canceled`.                     |

---

## 2. Mecanismos de Control

### A. Guardián de API (Server Action)

Antes de crear una sucursal o tarjeta, verificamos el límite:

```typescript
// Ejemplo de comprobación
async function canCreateBranch(businessId: string) {
  const { data: business } = await supabase
    .from("businesses")
    .select("plan_id, (count branches)")
    .eq("id", businessId);

  const limits = PLAN_LIMITS[business.plan_id];
  return business.branches.count < limits.max_branches;
}
```

### B. Control de Escaneos (Monthly Quartz)

1.Cada vez que un cliente escanea un QR, sumamos `+1` a `scans_this_month`.
2.Si el negocio es `basic` y llega a `50`, la API de escaneo devuelve un error: _"Límite mensual alcanzado. Sube a Pro para seguir recibiendo clientes."_
3.Un **Cron Job** (Edge Function) resetea este contador el día 1 de cada mes.

### C. Restricción Visual (UI)

- Los botones de "Agregar nueva tarjeta" o "Nueva sucursal" se muestran deshabilitados con un mensaje: _"Has alcanzado el límite de tu plan Básico"_.
- Aparecerá un botón de **Upgrade** directo a la nueva página de precios.

---

## 4. Visualización de Consumo (Status Widget)

Para que el usuario no se lleve sorpresas, incluiremos un componente de **Estado del Plan** en su de Inicio (Dashboard):

### Componente `PlanUsageCard`

- **Barras de Progreso:** Visuales sutiles según el `design-system.md`.
- **Alertas Preventivas:**
  - Al 80% de uso: El color de la barra cambia de `primary` a `orange-500`.
  - Al 100% de uso: Mensaje crítico: _"Servicio pausado. Sube a Pro para continuar."_
- **Métricas Clave:**
  - "Escaneos del Mes" (ej: 42/50).
  - "Sucursales" (ej: 1/1).
  - "Días para el reset" (ej: Reset en 12 días).

---

## 5. Registro y Suscripción

Al registrarse mediante el nuevo `RegistrationForm`:

1. El `plan_id` seleccionado se guarda en el perfil del negocio.
2. Si es un plan pagado, el estado queda como `pending` hasta que se confirme el pago (integración futura).
3. El negocio recibe acceso inmediato a las funciones según su nivel.
