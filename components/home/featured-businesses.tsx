import Link from "next/link";
import { Business } from "@/lib/data/api";
import { BusinessCard } from "@/components/ui/business-card";

interface FeaturedBusinessesProps {
  businesses: Business[];
}

export function FeaturedBusinesses({ businesses }: FeaturedBusinessesProps) {
  return (
    <section className="py-8">
      <div className="px-4 flex justify-between items-end mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Negocios destacados</h2>
        <Link href="/explore" className="text-primary text-sm font-semibold hover:underline">
          Ver todos
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 pb-4">
        {businesses.map((business) => (
          <BusinessCard key={business.id} business={business} />
        ))}
      </div>
    </section>
  );
}
