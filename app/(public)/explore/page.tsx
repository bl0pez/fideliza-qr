import { Suspense } from "react";
import { ExploreHero } from "@/components/explore/explore-hero";
import { ExploreList, ExploreSkeleton } from "@/components/explore/explore-list";
import { getCategories } from "@/lib/data/api";

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
}

export default async function ExplorePage({ searchParams }: Props) {
  const { search, category } = await searchParams;
  const categories = await getCategories();

  return (
    <div className="py-6 space-y-8 px-4 max-w-7xl mx-auto">
      <ExploreHero categories={categories} />

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-800 ml-1">Resultados</h2>
        <Suspense key={`${search}-${category}`} fallback={<ExploreSkeleton />}>
          <ExploreList search={search} category={category} />
        </Suspense>
      </div>
    </div>
  );
}
