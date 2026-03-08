import { Ticket, Coffee, Scissors, Star } from "lucide-react";

export function RewardTypes() {
  const rewards = [
    {
      title: "Tarjetas de Sellos",
      description: "Digitaliza la clásica tarjeta de cartón. Recompensa la frecuencia con reglas 100% personalizables.",
      icon: Ticket,
      color: "bg-blue-500",
    },
    {
      title: "Cupones Premium",
      description: "Descuentos exclusivos y beneficios flash para tus clientes más leales.",
      icon: Star,
      color: "bg-primary",
    },
    {
      title: "Promociones Locales",
      description: "Descubre beneficios únicos en tus comercios favoritos y apoya a la comunidad.",
      icon: Coffee,
      color: "bg-orange-500",
    },
  ];

  return (
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Decorative background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20 space-y-5">
           <div className="flex items-center justify-center gap-2">
            <div className="h-px w-6 bg-primary/30" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Premios Reales</span>
            <div className="h-px w-6 bg-primary/30" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">
            Todo un mundo de <span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent italic">beneficios</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Desde tu café matutino hasta tu corte de cabello, cada visita cuenta para algo grande.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {rewards.map((reward, index) => (
            <div 
              key={index} 
              className="group p-8 rounded-[2rem] bg-slate-50 border border-slate-100/50 hover:bg-white hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 text-center"
            >
              <div className={`${reward.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-8 mx-auto shadow-lg shadow-inherit/20 group-hover:scale-110 transition-transform duration-500`}>
                <reward.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4">{reward.title}</h3>
              <p className="text-slate-600 leading-relaxed font-medium line-clamp-2 md:line-clamp-none">
                {reward.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
