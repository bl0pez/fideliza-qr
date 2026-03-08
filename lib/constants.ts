// ─── App ──────────────────────────────────────────────────────────────────────
export const APP_NAME = "Fidelilocal";
export const APP_DESCRIPTION = "Fidelización de clientes sencilla y efectiva.";

export function getSiteUrl(): string {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  url = url.startsWith("http") ? url : `https://${url}`;
  return url.replace(/\/$/, "");
}

// ─── Routes ───────────────────────────────────────────────────────────────────
export const ROUTES = {
  dashboard: "/dashboard",
  billing: "/dashboard/settings/billing",
  billingSuccess: "/dashboard/settings/billing?status=success",
  settings: "/dashboard/settings",
  profile: "/dashboard/settings/profile",
  security: "/dashboard/settings/security",
  notifications: "/dashboard/settings/notifications",
} as const;

// ─── Billing / Providers ──────────────────────────────────────────────────────
export type BillingProvider = "mercadopago" | "stripe";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "incomplete";

export const BILLING_CURRENCY = "CLP" as const;

// ─── Plans ────────────────────────────────────────────────────────────────────

/** IDs de planes tal como están en la base de datos. */
export const PLAN_IDS = {
  basic: "basic",
  pro: "pro",
} as const;

export type PlanId = (typeof PLAN_IDS)[keyof typeof PLAN_IDS];

/** Límites por defecto de cada plan (fallback si la BD no devuelve datos). */
export const PLAN_DEFAULTS = {
  [PLAN_IDS.basic]: {
    maxBranches: 1,
    maxScansMonthly: 50,
  },
  [PLAN_IDS.pro]: {
    maxBranches: 3,
    maxScansMonthly: 500,
  },
} as const satisfies Record<PlanId, { maxBranches: number; maxScansMonthly: number }>;

/** Plan con el que se crea cada negocio por defecto. */
export const DEFAULT_PLAN_ID: PlanId = PLAN_IDS.basic;

// ─── Business ─────────────────────────────────────────────────────────────────
export const BUSINESS_INITIAL_REWARDS = 0;

// ─── Design System ────────────────────────────────────────────────────────────
// Fuente de verdad: antigravity/design-system.md
// Si modificas algo aquí, refleja el cambio en ese archivo también.

export const DS = {
  /** Tipografía */
  typography: {
    /** Títulos h1/h2 principales */
    heading: "font-black tracking-tighter leading-[0.95]",
    /** Títulos medianos */
    headingMd: "font-black tracking-tight leading-none",
    /** Sub-label de sección (encima del título) */
    sectionLabel: "text-xs font-black tracking-[0.3em] text-primary uppercase",
    /** Línea decorativa flanqueadora del sub-label */
    sectionLabelLine: "hidden sm:block h-px w-12 bg-primary/20",
  },

  /** Degradados */
  gradient: {
    /** Degradado principal: naranja primario → naranja */
    primary: "bg-linear-to-r from-primary to-orange-500",
    /** Para texto con degradado: aplicar junto con bg-clip-text text-transparent */
    primaryText: "bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent",
  },

  /** Iluminación ambiental (Ambient Glow) */
  glow: {
    light: "bg-primary/5 blur-[120px] rounded-full pointer-events-none",
    dark: "bg-primary/20 blur-[120px] rounded-full pointer-events-none",
    accent: "bg-orange-500/10 blur-[120px] rounded-full pointer-events-none",
  },

  /** Glassmorphism */
  glass: {
    light: "bg-white/40 backdrop-blur-md border border-white/20",
    dark: "bg-white/10 backdrop-blur-md border border-white/20",
    card: "bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl",
  },

  /** Cards estilo editorial */
  card: {
    rounded: "rounded-[2rem]",
    shadow: "hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]",
    imageHover: "hover:scale-110 duration-700",
    border: "border-slate-100",
  },

  /** Spacing mobile-first */
  spacing: {
    sectionVertical: "py-16 sm:py-20",
  },
} as const;

