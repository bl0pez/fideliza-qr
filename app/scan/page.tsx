import { redirect } from "next/navigation";
import { QrCode, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AddScanForm } from "@/components/scan/add-scan-form";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { getScanContext } from "@/app/actions/scan";

export const metadata = {
  title: `Escanear Cliente | ${APP_NAME}`,
};

export default async function ScanPage({
  searchParams,
}: {
  searchParams: Promise<{ b?: string; u?: string; r?: string }>;
}) {
  const { b: businessSlug, u: customerId, r: rewardId } = await searchParams;

  if (!businessSlug || !customerId || !rewardId) {
    return (
      <InvalidScanPage message="Faltan parámetros en el código QR. Forma correcta: ?b=SLUG&u=USER_ID&r=REWARD_ID" />
    );
  }

  const result = await getScanContext({ businessSlug, customerId, rewardId });

  if (!result.success) {
    if (result.error === "AUTH_REQUIRED") {
      redirect(`/login?redirect=/scan?b=${businessSlug}&u=${customerId}&r=${rewardId}`);
    }
    if (result.error === "BUSINESS_NOT_FOUND_OR_NOT_OWNER") {
      return (
        <InvalidScanPage message="No tienes permisos para registrar visitas en este negocio o el negocio no existe." />
      );
    }
    if (result.error === "REWARD_NOT_FOUND") {
      return <InvalidScanPage message="La recompensa no existe." />;
    }
    if (result.error === "CUSTOMER_NOT_SUBSCRIBED") {
      return (
        <InvalidScanPage message="Este código QR pertenece a un usuario que no está suscrito a tu negocio." />
      );
    }
    return <InvalidScanPage message="Error desconocido al procesar el código QR." />;
  }

  const { business, reward, customerName, progress } = result;
  
  const currentScans = progress?.scans_count || 0;

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">{business.name}</h1>
          <p className="text-muted-foreground">Registrar visita en: <strong>{reward?.title || 'Recompensa'}</strong></p>
        </div>

        <div className="bg-white border text-center border-border shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cliente</p>
            <p className="text-xl font-bold">{customerName}</p>
          </div>

          <div className="flex items-center justify-center gap-8 py-4 border-y border-border/50">
             <div className="space-y-1">
               <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Visitas</p>
               <p className="text-4xl font-black text-foreground">{currentScans}</p>
             </div>
             <div className="h-12 w-px bg-border"></div>
             <div className="space-y-1 text-primary">
               <p className="text-xs font-bold uppercase tracking-widest text-primary/70">Nueva Visita</p>
               <p className="text-4xl font-black flex items-center justify-center gap-1">
                  {currentScans + 1}
               </p>
             </div>
          </div>

          <AddScanForm businessId={business.id} businessSlug={business.slug} customerId={customerId} rewardId={rewardId} />

        </div>

        <div className="text-center">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" nativeButton={false} render={
            <Link href={`/dashboard/businesses/${business.slug}`}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Volver al panel del negocio
            </Link>
          } />
        </div>
      </div>
    </div>
  );
}

function InvalidScanPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-destructive/20 shadow-2xl shadow-destructive/10 rounded-3xl p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
          <QrCode className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Escaneo Inválido</h2>
          <p className="text-muted-foreground">{message}</p>
        </div>
        <Button variant="outline" className="w-full" nativeButton={false} render={
          <Link href="/dashboard">
             Ir al Panel Principal
          </Link>
        } />
      </div>
    </div>
  );
}
