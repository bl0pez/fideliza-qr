import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedBusinesses } from "@/components/home/featured-businesses";
import { HowItWorks } from "@/components/home/how-it-works";
import { RewardTypes } from "@/components/home/reward-types";
import { BusinessCTA } from "@/components/home/business-cta";
import { getBusinesses, getCategories } from "@/lib/data/mock";

// Skeleton for Featured Businesses to show while loading
function FeaturedBusinessesSkeleton() {
  return (
    <section className="py-8">
      <div className="px-4 flex justify-between items-end mb-6">
        <h2 className="text-2xl font-bold">Negocios destacados</h2>
        <div className="w-16 h-4 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 pb-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-none w-72 h-72 bg-card border border-border rounded-2xl overflow-hidden shadow-sm animate-pulse">
            <div className="h-40 bg-slate-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 bg-slate-200 rounded w-1/2"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4"></div>
              <div className="h-10 bg-slate-200 rounded-xl w-full mt-4"></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Data fetching component for the featured section
async function FeaturedBusinessesData() {
  const businesses = await getBusinesses();
  return <FeaturedBusinesses businesses={businesses} />;
}

// Data fetching component for the hero section categories
async function HeroSectionData() {
  const categories = await getCategories();
  return <HeroSection categories={categories} />;
}

export default function HomePage() {
  return (
    <main className="font-display">
      <Suspense fallback={<div className="h-96 bg-primary/5 animate-pulse" />}>
        <HeroSectionData />
      </Suspense>

      <Suspense fallback={<FeaturedBusinessesSkeleton />}>
        <FeaturedBusinessesData />
      </Suspense>

      <HowItWorks />
      
      <RewardTypes />
      
      <BusinessCTA />
    </main>
  );
}
