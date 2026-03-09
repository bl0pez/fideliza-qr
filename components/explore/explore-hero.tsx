"use client";

import { Search, Compass, Sparkles, MapPin, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ExploreCategories } from "./explore-categories";
import { Category, Country, City } from "@/lib/data/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCities } from "@/app/actions/cities";

interface Props {
  categories: Category[];
  countries: Country[];
}

export function ExploreHero({ categories, countries }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get("country") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [cities, setCities] = useState<City[]>([]);

  // Toggle selection for country and city
  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Reset city if country changes
    if (key === "country") {
      params.delete("city");
      setSelectedCity("");
    }

    router.push(`/explore?${params.toString()}`, { scroll: false });
  };

  // Debounce search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const currentSearch = searchParams.get("search") || "";
      
      if (searchTerm !== currentSearch) {
        if (searchTerm) {
          params.set("search", searchTerm);
        } else {
          params.delete("search");
        }
        router.push(`/explore?${params.toString()}`, { scroll: false });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, searchParams, router]);

  // Fetch cities when country changes
  useEffect(() => {
    async function loadCities() {
      if (selectedCountry && selectedCountry !== "all") {
        // Find country ID by name to fetch its cities
        const country = countries.find(c => c.name === selectedCountry);
        if (country) {
          const data = await getCities(country.id);
          setCities(data);
        } else {
          setCities([]);
        }
      } else {
        setCities([]);
      }
    }
    loadCities();
  }, [selectedCountry, countries]);

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-white text-slate-900 p-6 md:p-16 mb-8 border-b border-slate-100">
      {/* Decorative background premium elements - Subtler for total integration */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[100px] -ml-24 -mb-24 pointer-events-none" />
      
      <div className="relative z-10 space-y-12 max-w-5xl mx-auto">
        <div className="space-y-6 text-center">
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-primary animate-in fade-in slide-in-from-bottom-4 duration-700 mx-auto">
            <Compass className="w-3.5 h-3.5" />
            <span>Navega tu comunidad global</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] text-slate-900">
            Encuentra lo <br /> 
            <span className="bg-linear-to-r from-primary via-orange-500 to-primary bg-clip-text text-transparent italic">extraordinario</span>
          </h1>
          
          <p className="text-slate-500 text-lg md:text-2xl max-w-2xl leading-relaxed font-medium mx-auto">
            Explora comercios locales, descubre beneficios exclusivos y <span className="text-slate-900 font-bold">fideliza tu pasión</span> sin fronteras.
          </p>
        </div>

        {/* Integrated Filter Bar */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center bg-white p-2 lg:p-3 rounded-[2rem] lg:rounded-[2.5rem] border border-slate-200/60 shadow-2xl relative group/bar gap-1 lg:gap-0">
            {/* Ambient hover effect for the whole bar */}
            <div className="absolute -inset-1 bg-linear-to-r from-primary/5 to-orange-500/5 rounded-[3rem] blur-xl opacity-0 group-hover/bar:opacity-100 transition duration-1000"></div>

            {/* Search Input - Primary field */}
            <div className="flex-1 relative group z-10 py-1 lg:py-0">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="¿Qué buscas hoy?"
                className="pl-13 h-14 lg:h-16 border-none bg-transparent text-slate-900 placeholder:text-slate-400 text-base lg:text-lg focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none transition-all font-bold py-0 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Mobile Divider (Horizontal) / Desktop Divider (Vertical) */}
            <div className="h-px w-full bg-slate-100/80 lg:hidden" />
            <div className="hidden lg:block w-px h-10 bg-slate-100 mx-2" />

            {/* Country Select */}
            <div className="w-full lg:w-[180px] relative group z-10 py-1 lg:py-0">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 group-focus-within:text-primary transition-colors" />
              <Select 
                value={selectedCountry} 
                onValueChange={(val: string | null) => {
                  const value = val ?? "";
                  setSelectedCountry(value);
                  updateParams("country", value);
                }}
              >
                <SelectTrigger className="h-14 lg:h-16 pl-11 border-none bg-transparent text-slate-900 focus:ring-0 shadow-none text-base font-bold transition-all hover:bg-slate-50/50 rounded-xl lg:rounded-2xl w-full text-left justify-start">
                  <SelectValue placeholder="País" />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xl p-2 min-w-[200px]">
                  <SelectItem value="all" className="font-bold py-3 rounded-xl hover:bg-slate-50 focus:bg-slate-50 transition-colors">Todos los países</SelectItem>
                  <div className="h-px bg-slate-100 my-2" />
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.name} className="font-bold py-3 rounded-xl hover:bg-slate-50 focus:bg-slate-50 transition-colors">
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mobile Divider (Horizontal) / Desktop Divider (Vertical) */}
            <div className="h-px w-full bg-slate-100/80 lg:hidden" />
            <div className="hidden lg:block w-px h-10 bg-slate-100 mx-2" />

            {/* City Select */}
            <div className="w-full lg:w-[180px] relative group z-10 py-1 lg:py-0">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 group-focus-within:text-primary transition-colors" />
              <Select 
                value={selectedCity} 
                onValueChange={(val: string | null) => {
                  const value = val ?? "";
                  setSelectedCity(value);
                  updateParams("city", value);
                }}
                disabled={!selectedCountry || selectedCountry === "all" || cities.length === 0}
              >
                <SelectTrigger className="h-14 lg:h-16 pl-11 border-none bg-transparent text-slate-900 focus:ring-0 shadow-none text-base font-bold disabled:opacity-50 transition-all hover:bg-slate-50/50 rounded-xl lg:rounded-2xl w-full text-left justify-start">
                  <SelectValue placeholder={selectedCountry && selectedCountry !== "all" ? "Ciudad" : "Ciudad"} />
                </SelectTrigger>
                <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xl p-2 min-w-[200px]">
                  <SelectItem value="all" className="font-bold py-3 rounded-xl hover:bg-slate-50 focus:bg-slate-50 transition-colors">Todas las ciudades</SelectItem>
                  <div className="h-px bg-slate-100 my-2" />
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.name} className="font-bold py-3 rounded-xl hover:bg-slate-50 focus:bg-slate-50 transition-colors">
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* CTA Button */}
            <div className="p-1 lg:pl-2 pt-2 lg:pt-0">
              <button className="h-14 lg:h-12 w-full lg:w-12 rounded-xl lg:rounded-full bg-slate-900 flex items-center justify-center text-white shadow-lg hover:bg-primary transition-all active:scale-95 group/btn overflow-hidden relative">
                <div className="absolute inset-0 bg-linear-to-r from-primary to-orange-500 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                <span className="lg:hidden relative z-10 font-bold uppercase tracking-[0.2em] text-xs flex items-center gap-2">
                  <Search className="w-4 h-4" /> Buscar ahora
                </span>
                <Search className="hidden lg:block relative z-10 w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200/60">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Descubre por categoría</p>
          </div>
          <ExploreCategories categories={categories} />
        </div>
      </div>
    </section>
  );
}
