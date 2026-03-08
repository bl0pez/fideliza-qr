import { Search } from "lucide-react";
import { Suspense } from "react";
import { CategoriesList } from "./categories-list";

export function HeroSection() {
  return (
    <header className="px-4 pt-8 pb-6 bg-linear-to-b from-primary/10 to-transparent">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight mb-4">
        Descubre recompensas en tus <span className="text-primary">negocios favoritos</span>
      </h1>
      <p className="text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
        Suscríbete a negocios locales y acumula recompensas con tarjetas de sellos digitales y cupones.
      </p>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
        <input 
          className="w-full pl-12 pr-4 py-4 rounded-xl border border-border bg-card shadow-sm focus:ring-2 focus:ring-primary text-base transition-shadow" 
          placeholder="Buscar cafeterías, barberías, restaurantes..." 
          type="text" 
        />
      </div>

      {/* Quick Categories */}
      <Suspense fallback={
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {[1,2,3,4,5].map(i => (
             <div key={i} className="flex-none w-24 h-10 rounded-full bg-slate-200 animate-pulse"></div>
          ))}
        </div>
      }>
        <CategoriesList />
      </Suspense>
    </header>
  );
}
