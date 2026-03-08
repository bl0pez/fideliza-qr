import { Ticket, Star, Megaphone } from "lucide-react";

export function RewardTypes() {
  return (
    <section className="py-12 px-4">
      <h2 className="text-xl md:text-2xl font-bold mb-8">Beneficios para ti</h2>
      <div className="grid grid-cols-1 gap-4">
        {/* Cupones */}
        <div className="bg-primary text-primary-foreground p-6 rounded-2xl relative overflow-hidden shadow-sm">
          <Ticket className="absolute -right-4 -bottom-4 text-white/10 w-32 h-32 transform rotate-12" />
          <h3 className="text-lg md:text-xl font-bold mb-2 relative z-10">Cupones</h3>
          <p className="text-white/80 relative z-10">Descuentos exclusivos y ofertas relámpago en tus próximas compras.</p>
        </div>
        
        {/* Sellos y Promos */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-primary/10 border border-primary/20 text-primary p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <Star className="w-8 h-8 mb-4" />
            <div>
              <h3 className="font-bold mb-2">Sellos</h3>
              <p className="text-xs text-primary/80 font-medium">Tarjeta digital: la 10ª es gratis.</p>
            </div>
          </div>
          
          <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col justify-between shadow-sm">
            <Megaphone className="w-8 h-8 mb-4" />
            <div>
              <h3 className="font-bold mb-2">Promos</h3>
              <p className="text-xs text-white/70">Eventos VIP y accesos anticipados.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
