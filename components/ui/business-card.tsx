import Image from "next/image";
import { Business } from "@/lib/data/mock";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <div className="flex-none w-72 bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="h-40 bg-slate-200 relative">
        <Image 
          src={business.imageUrl} 
          alt={`Imagen de ${business.name}`} 
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-lg text-xs font-bold shadow-md">
          {business.type}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1">{business.name}</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{business.rewardsAvailable} recompensas disponibles</p>
        <button className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-colors shadow">
          Ver recompensas
        </button>
      </div>
    </div>
  );
}
