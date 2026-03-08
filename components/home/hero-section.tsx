import { Search, Sparkles } from "lucide-react";
import { Suspense } from "react";
import { CategoriesList } from "./categories-list";

export function HeroSection() {
  return (
    <header className="px-4 pt-16 pb-12 bg-linear-to-b from-primary/15 via-background to-background text-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none -translate-y-1/2" />
      
      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest animate-pulse mx-auto">
            <Sparkles className="w-3 h-3" />
            <span>Fidelidad reinventada</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] md:leading-[0.85] text-slate-900 border-b-4 border-transparent">
            Descubre <span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent italic">recompensas</span> <br className="hidden md:block" /> 
            en negocios locales
          </h1>
          
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
            La forma más <span className="text-slate-900 underline decoration-primary/30 underline-offset-4">simple</span> de apoyar a tu comunidad y ganar premios increíbles en el camino.
          </p>
        </div>

        {/* Premium Search Bar */}
        <div className="relative max-w-2xl mx-auto group">
          <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-orange-500/20 rounded-3xl blur opacity-25 group-focus-within:opacity-100 transition duration-1000 group-focus-within:duration-200"></div>
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6 group-focus-within:text-primary transition-colors" />
            <input 
              className="w-full pl-14 pr-6 py-5 rounded-2xl border border-slate-200 bg-white/80 backdrop-blur-xl shadow-xl focus:ring-4 focus:ring-primary/10 text-xl transition-all outline-none placeholder:text-slate-400" 
              placeholder="¿Qué buscas hoy?" 
              type="text" 
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="pt-10 w-full overflow-hidden">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="h-px w-8 bg-slate-200" />
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Explora por categoría</p>
            <div className="h-px w-8 bg-slate-200" />
          </div>
          <Suspense fallback={
            <div className="flex flex-wrap justify-center gap-6 py-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                 <div key={i} className="w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-slate-100 animate-pulse" />
              ))}
            </div>
          }>
            <CategoriesList />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
