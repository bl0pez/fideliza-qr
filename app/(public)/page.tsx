import { Suspense } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedBusinesses } from "@/components/home/featured-businesses";
import { HowItWorks } from "@/components/home/how-it-works";
import { RewardTypes } from "@/components/home/reward-types";
import { BusinessCTA } from "@/components/home/business-cta";
import Link from "next/link";

// Skeleton for Featured Businesses to show while loading
function FeaturedBusinessesSkeleton() {
  return (
    <section className="py-20 bg-slate-50/30">
      <div className="max-w-6xl mx-auto px-4 mb-12 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 bg-primary/20" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Selección Curada</span>
          <div className="h-px w-8 bg-primary/20" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4">Negocios destacados</h2>
        <div className="w-24 h-4 bg-slate-200 rounded animate-pulse mx-auto"></div>
      </div>
      <div className="flex gap-6 overflow-x-auto hide-scrollbar px-4 pb-8 max-w-7xl mx-auto">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex-none w-72 md:w-80 rounded-[2rem] bg-slate-100 animate-pulse h-96"
          />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />

      <section className="py-24 bg-white relative overflow-hidden">
        {/* Decorative ambient light */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 mb-16 text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-primary/20" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Explora lo mejor</span>
            <div className="h-px w-8 bg-primary/20" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6 mt-2">
            Negocios <span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent italic">destacados</span>
          </h2>
          <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-medium mb-10">
            Una selección exclusiva de los comercios que están transformando la fidelidad local.
          </p>
          <Link
            href="/explore"
            className="group inline-flex items-center gap-2 bg-slate-50 hover:bg-primary hover:text-white px-6 py-3 rounded-2xl text-sm font-black transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-primary/20"
          >
            Descubrir todos los negocios
            <span className="text-lg group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="relative z-10">
          <Suspense fallback={<FeaturedBusinessesSkeleton />}>
            <FeaturedBusinesses />
          </Suspense>
        </div>
      </section>

      <HowItWorks />

      <RewardTypes />

      <BusinessCTA />
    </>
  );
}
