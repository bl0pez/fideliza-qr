import { Check } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { PLAN_IDS } from "@/lib/constants";
import { getPlans } from "@/app/actions/plans";
import { getCurrentUser } from "@/app/actions/auth";

export async function PricingSection() {
  // Cargar usuario y planes en paralelo a través de Server Actions
  const [user, safePlans] = await Promise.all([
    getCurrentUser(),
    getPlans(),
  ]);

  // Determina el href del CTA segun si hay sesion activa
  const getPlanHref = (planId: string): string => {
    if (planId === PLAN_IDS.basic) {
      // Plan gratuito: si ya esta logueado va al dashboard, sino al login
      return user ? "/dashboard" : `/login?next=/dashboard`;
    }
    // Planes de pago: si esta logueado va directo al checkout, sino al login con redirect
    return user
      ? `/register?plan=${planId}`
      : `/login?next=/register?plan=${planId}`;
  };

  const formatPrice = (price: number | null): string => {
    if (price === null || price === 0) return "Gratis";
    return `$${price.toLocaleString("es-CL")}`;
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Heading Badge */}
        <div className="text-center mb-20 space-y-6">
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-8 bg-primary/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Planes y Precios</span>
            <div className="h-px w-8 bg-primary/20" />
          </div>

          <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.95]">
            Hagamos crecer <br />
            tu <span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent italic">comunidad</span>
          </h2>

          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Elige el plan que mejor se adapte a tu etapa de crecimiento. Sin contratos ocultos.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {safePlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl ${
                plan.is_popular
                  ? "bg-slate-900 text-white border-primary/20 scale-105 shadow-primary/10"
                  : "bg-white border-slate-100 text-slate-900 hover:border-primary/20 shadow-slate-200/50"
              }`}
            >
              {plan.is_popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-white font-black px-4 py-1 rounded-full shadow-lg">
                    MÁS POPULAR
                  </Badge>
                </div>
              )}

              {/* Price header */}
              <div className="mb-8">
                <h3 className="text-2xl font-black mb-2 tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tighter">{formatPrice(plan.price)}</span>
                  {plan.price !== null && plan.price > 0 && (
                    <span className="text-sm font-bold opacity-60">/mes</span>
                  )}
                </div>
                <p className={`mt-3 text-sm font-medium ${plan.is_popular ? "text-slate-400" : "text-slate-500"}`}>
                  {plan.max_branches === 1
                    ? "Ideal para micro-negocios que están empezando."
                    : plan.max_branches <= 3
                    ? "Para comercios que buscan profesionalizarse."
                    : "Para negocios con múltiples sucursales."}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4 mb-10">
                {(plan.features ?? []).map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      plan.is_popular ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary"
                    }`}>
                      <Check className="w-3 h-3 stroke-3" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={getPlanHref(plan.id)}
                className={`flex items-center justify-center w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 ${
                  plan.is_popular
                    ? "bg-white text-slate-900 hover:bg-primary hover:text-white shadow-xl shadow-white/5"
                    : "bg-slate-900 text-white hover:bg-primary shadow-xl shadow-black/10"
                }`}
              >
                {plan.price === null || plan.price === 0
                  ? "Empezar gratis"
                  : `Elegir ${plan.name}`}
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
