import { notFound } from "next/navigation";
import Link from "next/link";
import { QrCode, ScanLine } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { RewardForm } from "@/components/dashboard/reward-form";
import { getBusinessBySlug } from "@/app/actions/business";
import { BusinessTabs } from "./business-tabs";

export default async function BusinessLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // 1. Obtener detalles del negocio por slug (Server Action)
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  const businessId = business.id;

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      {/* Encabezado Compartido (Layout) */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {business.name}
          </h2>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Badge variant="outline" className="uppercase text-[10px] tracking-wider font-bold">
              {business.type}
            </Badge>
            Panel de fidelización y recompensas
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Link 
            href={`/dashboard/businesses/${slug}/scanner`} 
            className="flex-1 md:flex-none"
          >
            <Button
              variant="default"
              className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-10 px-4"
            >
              <ScanLine className="mr-2 h-4 w-4" /> 
              <span className="whitespace-nowrap">Abrir Escáner</span>
            </Button>
          </Link>
          
          <Button 
            variant="outline" 
            className="flex-1 md:flex-none border-primary/20 hover:bg-primary/10 h-10 px-4"
          >
            <QrCode className="mr-2 h-4 w-4 text-primary" />
            <span className="whitespace-nowrap">Descargar QR</span>
          </Button>

          <div className="w-full md:w-auto">
            <RewardForm businessId={businessId} />
          </div>
        </div>
      </div>

      {/* Tabs de Navegación (Shared) */}
      <BusinessTabs slug={slug} />

      {/* Contenido de la Página Específica */}
      <div className="animate-in fade-in duration-500">
        {children}
      </div>
    </div>
  );
}
