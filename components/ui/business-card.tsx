import Image from "next/image";
import { Business } from "@/lib/data/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Card className="pt-0">
      <div className="h-40 bg-slate-200 relative">
          <Image 
            src={business.image_url} 
            alt={`Imagen de ${business.name}`} 
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground px-2 py-1 rounded-lg text-xs font-bold shadow-md">
            {business.type}
          </span>
        </div>
      <CardContent>
          <h3 className="font-bold text-lg mb-1">{business.name}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{business.rewards_available} recompensas disponibles</p>
      </CardContent>
      <CardFooter>
        <Button size="lg" className="w-full">
          Ver recompensas
        </Button>
      </CardFooter>
    </Card>
  );
}
