export function HowItWorks() {
  return (
    <section className="py-12 px-4 bg-secondary/30">
      <h2 className="text-xl md:text-2xl font-bold mb-8 text-center">Cómo funciona</h2>
      <div className="space-y-6">
        <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card shadow-sm">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-lg">1</div>
          <div>
            <h3 className="font-bold text-lg">Buscar negocio</h3>
            <p className="text-slate-600 dark:text-slate-400">Encuentra tus lugares locales favoritos en nuestro mapa o buscador.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card shadow-sm">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-lg">2</div>
          <div>
            <h3 className="font-bold text-lg">Suscribirte al negocio</h3>
            <p className="text-slate-600 dark:text-slate-400">Únete a su programa de fidelización con un solo toque desde tu móvil.</p>
          </div>
        </div>
        <div className="flex items-start gap-4 p-4 rounded-xl border border-border bg-card shadow-sm">
          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0 font-bold text-lg">3</div>
          <div>
            <h3 className="font-bold text-lg">Acumular recompensas</h3>
            <p className="text-slate-600 dark:text-slate-400">Escanea tu código en cada visita y canjea tus puntos por premios.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
