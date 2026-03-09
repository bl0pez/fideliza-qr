import { getBusinesses } from "@/lib/data/api";
import { BusinessCard } from "@/components/ui/business-card";
import { Search } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

interface Props {
  search?: string;
  category?: string;
  country?: string;
  city?: string;
}

export async function ExploreList({ search, category, country, city }: Props) {
  const supabase = await createClient();
  let countryId: string | undefined;
  let cityId: string | undefined;

  // Resolve country name to ID
  if (country && country !== "all") {
    const { data: countryData } = await supabase
      .from("countries")
      .select("id")
      .eq("name", country)
      .single();
    if (countryData) countryId = countryData.id;
  }

  // Resolve city name to ID
  if (city && city !== "all") {
    const { data: cityData } = await supabase
      .from("cities")
      .select("id")
      .eq("name", city)
      .single();
    if (cityData) cityId = cityData.id;
  }

  const filteredBusinesses = await getBusinesses({
    category,
    countryId,
    cityId,
  });

  const searchedBusinesses = filteredBusinesses.filter((business) => {
    const matchesSearch = search
      ? business.name.toLowerCase().includes(search.toLowerCase()) ||
        business.type.toLowerCase().includes(search.toLowerCase())
      : true;

    return matchesSearch;
  });

  if (searchedBusinesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="bg-slate-100 p-6 rounded-full">
          <Search className="h-10 w-10 text-slate-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">No encontramos nada</h3>
          <p className="text-slate-500 max-w-xs">
            Intenta con otra palabra clave o cambia de categoría.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {searchedBusinesses.map((business) => (
        <BusinessCard key={business.id} business={business} />
      ))}
    </div>
  );
}

export function ExploreSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div
          key={i}
          className="h-[380px] w-full bg-slate-100 rounded-2xl animate-pulse"
        />
      ))}
    </div>
  );
}
