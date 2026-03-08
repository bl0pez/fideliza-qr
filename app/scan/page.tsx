import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { QrCode, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { AddScanForm } from "@/components/scan/add-scan-form";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Escanear Cliente | ${APP_NAME}`,
};

export default async function ScanPage({
  searchParams,
}: {
  searchParams: Promise<{ b?: string; u?: string }>;
}) {
  const { b: businessId, u: customerId } = await searchParams;

  if (!businessId || !customerId) {
    return (
      <InvalidScanPage message="Faltan parámetros en el código QR. Por favor, asegúrese de escanear un QR válido." />
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Si no está logueado, redirigir al login y luego regresar aquí
    redirect(`/login?redirect=/scan?b=${businessId}&u=${customerId}`);
  }

  // 1. Verificar si el usuario actual es dueño de este negocio
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name, rewards_available")
    .eq("id", businessId)
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return (
      <InvalidScanPage message="No tienes permisos para registrar visitas en este negocio. Solo el propietario puede hacerlo." />
    );
  }

  // 2. Verificar datos del cliente y su suscripción actual
  const { data: subscription } = await supabase
    .from("business_customers")
    .select("id, scans_count, user_id")
    .eq("business_id", businessId)
    .eq("user_id", customerId)
    .single();

  if (!subscription) {
    return (
      <InvalidScanPage message="Este código QR pertenece a un usuario que no está suscrito a tu negocio." />
    );
  }

  // 3. Obtener el nombre del cliente (opcional, desde 'auth.users' si es posible)
  // Dado que no tenemos acceso directo a los metadatos de usuario de _otros_ usuarios por RLS
  // Podríamos mostrar un mensaje génerico o su ID ofuscado
  const customerRef = customerId.split("-")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <QrCode className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">{business.name}</h1>
          <p className="text-muted-foreground">Registrar visita de fidelización</p>
        </div>

        <div className="bg-white border text-center border-border shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Cliente</p>
            <p className="text-xl font-bold font-mono">#{customerRef}</p>
          </div>

          <div className="flex items-center justify-center gap-8 py-4 border-y border-border/50">
             <div className="space-y-1">
               <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Visitas</p>
               <p className="text-4xl font-black text-foreground">{subscription.scans_count}</p>
             </div>
             <div className="h-12 w-px bg-border"></div>
             <div className="space-y-1 text-primary">
               <p className="text-xs font-bold uppercase tracking-widest text-primary/70">Nueva Visita</p>
               <p className="text-4xl font-black flex items-center justify-center gap-1">
                  {subscription.scans_count + 1}
               </p>
             </div>
          </div>

          <AddScanForm businessId={businessId} customerId={customerId} currentCount={subscription.scans_count} />

        </div>

        <div className="text-center">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" nativeButton={false} render={
            <Link href={`/dashboard/businesses/${businessId}`}>
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
