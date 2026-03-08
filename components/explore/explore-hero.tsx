"use client";

import { Search, Compass, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ExploreCategories } from "./explore-categories";
import { Category } from "@/lib/data/api";

interface Props {
  categories: Category[];
}

export function ExploreHero({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Debounce logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        params.set("search", searchTerm);
      } else {
        params.delete("search");
      }
      
      if (params.get("search") !== (searchParams.get("search") || "")) {
        router.push(`/explore?${params.toString()}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchParams, router]);

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 text-white p-6 md:p-12 mb-12 shadow-2xl border border-white/5">
      {/* Decorative background premium elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none opacity-30" />
      
      <div className="relative z-10 space-y-8 max-w-4xl">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary-foreground animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>Navega tu comunidad</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-black tracking-tight leading-[0.95] md:leading-[0.9]">
            Encuentra lo <br /> 
            <span className="bg-linear-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent italic drop-shadow-sm">extraordinario</span>
          </h1>
          
          <p className="text-slate-400 text-base md:text-xl max-w-2xl leading-relaxed font-medium">
            Explora comercios locales, descubre beneficios exclusivos y <span className="text-white font-bold">fideliza tu pasión</span> por lo nuestro.
          </p>
        </div>

        <div className="max-w-xl group relative">
          <div className="absolute -inset-1 bg-linear-to-r from-primary to-orange-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Buscar por nombre o categoría..."
              className="pl-12 h-14 md:h-16 rounded-2xl border-white/10 bg-white/10 backdrop-blur-xl text-white placeholder:text-slate-500 text-lg md:text-xl focus-visible:ring-primary/50 focus-visible:ring-offset-0 border-0 shadow-2xl transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-5">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-[10px] md:text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Filtros Rápidos</p>
          </div>
          <ExploreCategories categories={categories} />
        </div>
      </div>
    </section>
  );
}
