import { Check, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const plans = [
  {
    name: "Básico",
    price: "Gratis",
    description: "Ideal para micro-negocios que están empezando.",
    features: [
      "1 Sucursal",
      "50 escaneos de sellos/mes",
      "1 Tipo de tarjeta activa",
      "QR Estándar",
      "Soporte por Comunidad"
    ],
    cta: "Empezar gratis",
    popular: false,
    color: "slate"
  },
  {
    name: "Pro",
    price: "$5.000",
    period: "/mes",
    description: "Para comercios que buscan profesionalizarse.",
    features: [
      "2 Sucursales",
      "Escaneos ilimitados",
      "Tarjetas personalizables",
      "QR con tu Logo",
      "Historial de clientes",
      "Soporte prioritario"
    ],
    cta: "Elegir Pro",
    popular: true,
    color: "primary"
  },
  {
    name: "Business",
    price: "$24.990",
    period: "/mes",
    description: "Para negocios con múltiples sucursales.",
    features: [
      "Hasta 5 Sucursales",
      "Escaneos ilimitados",
      "Múltiples administradores",
      "Estadísticas de fidelidad",
      "Exportación de datos",
      "Soporte 24/7"
    ],
    cta: "Elegir Business",
    popular: false,
    color: "orange"
  }
];

export function PricingSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Design System: Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-20 space-y-6">
          {/* Design System: Heading Badge */}
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

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-[2.5rem] border transition-all duration-500 hover:shadow-2xl ${
                plan.popular 
                ? "bg-slate-900 text-white border-primary/20 scale-105 shadow-primary/10" 
                : "bg-white border-slate-100 text-slate-900 hover:border-primary/20 shadow-slate-200/50"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                   <Badge className="bg-primary text-white font-black px-4 py-1 rounded-full shadow-lg">
                      MÁS POPULAR
                   </Badge>
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-2xl font-black mb-2 tracking-tight">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black tracking-tighter">{plan.price}</span>
                  {plan.period && <span className="text-sm font-bold opacity-60">{plan.period}</span>}
                </div>
                <p className={`mt-4 text-sm font-medium ${plan.popular ? "text-slate-400" : "text-slate-500"}`}>
                  {plan.description}
                </p>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature, fIndex) => (
                  <div key={fIndex} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                      plan.popular ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary"
                    }`}>
                      <Check className="w-3 h-3 stroke-3" />
                    </div>
                    <span className="text-sm font-bold tracking-tight">{feature}</span>
                  </div>
                ))}
              </div>

              <Link 
                href="/register?plan=pro"
                className={`flex items-center justify-center w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 ${
                  plan.popular 
                  ? "bg-white text-slate-900 hover:bg-primary hover:text-white shadow-xl shadow-white/5" 
                  : "bg-slate-900 text-white hover:bg-primary shadow-xl shadow-black/10"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 md:p-12 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
               <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900 mb-1">¿Necesitas algo a medida?</h4>
              <p className="text-slate-500 font-medium text-sm">Contáctanos para planes corporativos o integraciones especiales.</p>
            </div>
          </div>
          <button className="whitespace-nowrap bg-white border border-slate-200 text-slate-900 px-8 py-4 rounded-xl font-black hover:bg-slate-100 transition-all shadow-sm">
             Hablar con un experto
          </button>
        </div>
      </div>
    </section>
  );
}
