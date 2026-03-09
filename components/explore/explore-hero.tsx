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

        {/* Filters - Simplified and more integrated (No card wrapper) */}
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Search Input */}
            <div className="lg:col-span-12 xl:col-span-6 group relative">
              <div className="absolute -inset-0.5 bg-linear-to-r from-primary/20 to-orange-500/20 rounded-2xl blur-sm opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Buscar por nombre o categoría..."
                  className="pl-13 h-16 rounded-2xl border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 text-lg md:text-xl focus-visible:ring-primary/20 focus-visible:ring-offset-0 border shadow-lg transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Location Filters - More compact */}
            <div className="lg:col-span-12 xl:col-span-6 grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
               <div className="relative group">
                 <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 group-focus-within:text-primary transition-colors" />
                 <Select 
                   value={selectedCountry} 
                   onValueChange={(val: string | null) => {
                     const value = val ?? "";
                     setSelectedCountry(value);
                     updateParams("country", value);
                   }}
                 >
                   <SelectTrigger className="h-14 md:h-16 pl-11 rounded-2xl border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-primary/20 shadow-md text-base font-bold transition-all hover:border-primary/30">
                     <SelectValue placeholder="País" />
                   </SelectTrigger>
                   <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xl">
                     <SelectItem value="all" className="font-medium">Todos los países</SelectItem>
                     {countries.map((country) => (
                       <SelectItem key={country.id} value={country.name} className="font-medium">
                         {country.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>

               <div className="relative group">
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
                   <SelectTrigger className="h-14 md:h-16 pl-11 rounded-2xl border-slate-200 bg-white text-slate-900 focus:ring-1 focus:ring-primary/20 shadow-md text-base font-bold disabled:opacity-50 transition-all hover:border-primary/30">
                     <SelectValue placeholder={selectedCountry && selectedCountry !== "all" ? "Ciudad" : "País primero"} />
                   </SelectTrigger>
                   <SelectContent className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xl">
                     <SelectItem value="all" className="font-medium">Todas las ciudades</SelectItem>
                     {cities.map((city) => (
                       <SelectItem key={city.id} value={city.name} className="font-medium">
                         {city.name}
                       </SelectItem>
                     ))}
                   </SelectContent>
                 </Select>
               </div>
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
