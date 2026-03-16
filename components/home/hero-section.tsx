import { Search, Sparkles, ArrowRight, Store, ChevronRight } from "lucide-react";
import { Suspense } from "react";
import { CategoriesList } from "./categories-list";
import { selectFreePlan } from "@/app/actions/plan-selection";

export function HeroSection() {
  return (
    <header className="px-4 pt-16 pb-12 bg-linear-to-b from-primary/15 via-background to-background text-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/5 blur-3xl rounded-full pointer-events-none -translate-y-1/2" />
      
      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        <div className="space-y-6">
          {/* Business Owner Top Badge - Premium Entry Point */}
          <div className="flex justify-center mb-2">
            <form action={selectFreePlan}>
              <button
                type="submit"
                className="group relative flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 hover:bg-slate-900/10 border border-slate-900/10 hover:border-slate-900/20 transition-all duration-300 backdrop-blur-sm"
              >
                <span className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wider">
                  <Store className="w-3.5 h-3.5 text-primary" />
                  Comercios
                </span>
                <div className="h-3 w-px bg-slate-300" />
                <span className="text-[10px] md:text-xs font-medium text-slate-900 group-hover:text-primary transition-colors flex items-center gap-1">
                  Registra tu negocio gratis
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 rounded-full bg-primary/20 blur opacity-0 group-hover:opacity-30 transition-opacity" />
              </button>
            </form>
          </div>

          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] md:text-xs font-bold uppercase tracking-widest animate-pulse mx-auto">
              <Sparkles className="w-3 h-3" />
              <span>Fidelidad reinventada</span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.9] md:leading-[0.85] text-slate-900">
              Descubre <span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent italic">recompensas</span> <br className="hidden md:block" /> 
              en negocios locales
            </h1>
            
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium">
              La forma más <span className="text-slate-900 underline decoration-primary/30 underline-offset-4">simple</span> de apoyar a tu comunidad y ganar premios increíbles en el camino.
            </p>
          </div>
        </div>

        {/* Premium Search Bar - Clean & Centered */}
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
