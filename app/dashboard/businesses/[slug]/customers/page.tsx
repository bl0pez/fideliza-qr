import { notFound } from "next/navigation";
import { Suspense } from "react";

import { getBusinessBySlug, getBusinessCustomers } from "@/app/actions/business";
import { APP_NAME } from "@/lib/constants";
import { Users } from "lucide-react";
import { CustomersTableClient } from "./customers-table-client";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata = {
  title: `Clientes | ${APP_NAME}`,
};

export default function BusinessCustomersPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" /> Directorio de Clientes
        </h3>
      </div>

      <Suspense fallback={<CustomersTableSkeleton />}>
        <CustomersDataWrapper params={params} />
      </Suspense>
    </div>
  );
}

/**
 * Wrapper asíncrono que maneja la obtención de datos fuera del renderizado principal
 * para no bloquear la carga del layout y el header.
 */
async function CustomersDataWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // 1. Obtener detalles del negocio
  const business = await getBusinessBySlug(slug);

  if (!business) {
    notFound();
  }

  // 2. Obtener los clientes (con el `segment` precalculado)
  const customers = await getBusinessCustomers(slug);

  if (!customers) {
      return (
          <div className="flex h-[400px] w-full flex-col items-center justify-center rounded-xl border border-dashed text-center">
             <p className="text-muted-foreground">Error al cargar la lista de clientes</p>
          </div>
      )
  }

  return <CustomersTableClient initialCustomers={customers} />;
}

/**
 * Skeleton Premium para una carga suave y profesional.
 */
function CustomersTableSkeleton() {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center bg-muted/20 p-4 rounded-xl border border-border">
                <Skeleton className="h-10 w-72" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-24" />
                </div>
            </div>
            <div className="border rounded-xl overflow-hidden">
                <div className="h-12 bg-muted/50 border-b flex items-center px-4 gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/6" />
                    <Skeleton className="h-4 w-1/6" />
                    <Skeleton className="h-4 w-1/6 ml-auto" />
                </div>
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 border-b flex items-center px-4 gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-4 w-12" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24 ml-auto" />
                    </div>
                ))}
            </div>
        </div>
    )
}

