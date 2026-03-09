import { Suspense } from "react";
import { getCategories } from "@/lib/data/api";
import { getCountries } from "@/app/actions/countries";
import { ExploreHero } from "@/components/explore/explore-hero";
import { ExploreList, ExploreSkeleton } from "@/components/explore/explore-list";

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    country?: string;
    city?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: Props) {
  const { search, category, country, city } = await searchParams;
  const categories = await getCategories();
  const countries = await getCountries();

  return (
    <div className="py-6 space-y-8 px-4 max-w-7xl mx-auto">
      <ExploreHero categories={categories} countries={countries} />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 ml-1">Resultados</h2>
        <Suspense key={`${search}-${category}-${country}-${city}`} fallback={<ExploreSkeleton />}>
          <ExploreList search={search} category={category} country={country} city={city} />
        </Suspense>
      </div>
    </div>
  );
}
