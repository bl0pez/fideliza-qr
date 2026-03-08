import { Business, getBusinesses } from "@/lib/data/api";
import { BusinessCard } from "@/components/ui/business-card";
import { Search } from "lucide-react";

interface Props {
  search?: string;
  category?: string;
}

export async function ExploreList({ search, category }: Props) {
  const allBusinesses = await getBusinesses();

  const filteredBusinesses = allBusinesses.filter((business) => {
    const matchesSearch = search
      ? business.name.toLowerCase().includes(search.toLowerCase()) ||
        business.type.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesCategory = category && category !== "all"
      ? business.type.toLowerCase() === category.toLowerCase()
      : true;

    return matchesSearch && matchesCategory;
  });

  if (filteredBusinesses.length === 0) {
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
      {filteredBusinesses.map((business) => (
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
