import { Store } from "lucide-react";

export function BusinessCTA() {
  return (
    <section className="m-4 p-8 rounded-3xl bg-primary/10 border border-primary/20 text-center shadow-sm">
      <Store className="mx-auto text-primary w-12 h-12 mb-4" />
      <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">¿Tienes un negocio?</h2>
      <p className="text-muted-foreground mb-8 text-sm">Crea tu programa de fidelización en minutos y haz que tus clientes vuelvan una y otra vez.</p>
      <button className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
        Crear programa de fidelización
      </button>
    </section>
  );
}
