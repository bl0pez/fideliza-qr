"use client";

import Image from "next/image";
import Link from "next/link";
import { ExternalLink, LayoutDashboard, Settings2, Ticket, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface BusinessDashboardCardProps {
  business: {
    id: string;
    name: string;
    type: string;
    image_url: string;
    rewards_count?: number;
    slug: string;
  };
}

export function BusinessDashboardCard({ business }: BusinessDashboardCardProps) {
  return (
    <Card className="pt-0 group overflow-hidden border-none shadow-lg bg-card/50 backdrop-blur-sm border border-border/50">
      {/* Header Image Section */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={business.image_url || "/placeholder-business.jpg"}
          alt={business.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="space-y-1">
            <Badge variant="secondary" className="bg-primary/20 text-primary-foreground backdrop-blur-md border-primary/30 uppercase tracking-wider text-[10px] px-2 py-0">
              {business.type}
            </Badge>
            <h3 className="text-xl font-bold text-white truncate leading-tight">
              {business.name}
            </h3>
          </div>
        </div>
      </div>

      <CardContent className="pt-6 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="p-2 rounded-full bg-primary/10">
              <Ticket className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-semibold tracking-tight leading-none text-muted-foreground/70">Premios Creados</span>
              <span className="text-lg font-bold text-foreground tabular-nums">
                {business.rewards_count || 0}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <Link href={`/${business.slug}`} target="_blank">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Ver tarjeta pública</span>
              </Button>
            </Link>
            
            <Link href={`/dashboard/businesses/${business.slug}/scanner`}>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <QrCode className="h-4 w-4" />
                <span className="sr-only">Escanear</span>
              </Button>
            </Link>

            <Link href={`/dashboard/businesses/${business.slug}`}>
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <Settings2 className="h-4 w-4" />
                <span className="sr-only">Configurar</span>
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <Link href={`/dashboard/businesses/${business.slug}`} className="w-full">
          <Button className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-md shadow-primary/20 transition-all active:scale-[0.98] group/btn">
            <LayoutDashboard className="h-4 w-4 transition-transform group-hover/btn:scale-110 mr-2" />
            Gestionar Fidelización
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
