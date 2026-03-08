import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Gift, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RedeemForm } from "@/components/scan/redeem-form";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: `Canjear Recompensa | ${APP_NAME}`,
};

export default async function RedeemScanPage({
  searchParams,
}: {
  searchParams: Promise<{ b?: string; u?: string; r?: string }>;
}) {
  const { b: businessSlug, u: customerId, r: rewardId } = await searchParams;

  if (!businessSlug || !customerId || !rewardId) {
    return (
      <InvalidRedeemPage message="Faltan parámetros en el código QR. QR Inválido." />
    );
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/scan/redeem?b=${businessSlug}&u=${customerId}&r=${rewardId}`);
  }

  // 1. Resolver el ID del negocio desde el slug y verificar si el usuario es dueño
  const { data: business } = await supabase
    .from("businesses")
    .select("id, slug, name")
    .eq("slug", businessSlug)
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return (
      <InvalidRedeemPage message="No tienes permisos para autorizar canjes en este negocio o el negocio no existe." />
    );
  }

  const businessId = business.id;

  // 2. Fetch reward details
  const { data: reward } = await supabase
    .from("rewards")
    .select("id, title, scans_required")
    .eq("id", rewardId)
    .eq("business_id", businessId)
    .single();

  if (!reward) {
    return <InvalidRedeemPage message="La recompensa no existe." />;
  }

  // 3. Fetch customer sub and verify points
  const { data: subscription } = await supabase
    .from("business_customers")
    .select("id, scans_count, user_id")
    .eq("business_id", businessId)
    .eq("user_id", customerId)
    .single();

  if (!subscription) {
    return <InvalidRedeemPage message="El cliente no pertenece al negocio." />;
  }

  if (subscription.scans_count < reward.scans_required) {
    return (
      <InvalidRedeemPage 
        message={`El cliente no tiene visitas suficientes. Necesita ${reward.scans_required} pero solo tiene ${subscription.scans_count}.`} 
      />
    );
  }

  const customerRef = customerId.split("-")[0].toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
            <Gift className="h-8 w-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">{business.name}</h1>
          <p className="text-muted-foreground">Autorizar Canje de Recompensa</p>
        </div>

        <div className="bg-white border border-border shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
             <p className="text-emerald-800 font-medium text-sm mb-1">El cliente #{customerRef} quiere canjear:</p>
             <p className="text-xl font-black text-emerald-950">{reward.title}</p>
          </div>

          <div className="flex items-center justify-center gap-6 py-4 border-y border-border/50">
             <div className="space-y-1 text-center">
               <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Saldo Actual</p>
               <p className="text-3xl font-black text-foreground">{subscription.scans_count}</p>
             </div>
             <div className="h-10 w-px bg-border"></div>
             <div className="space-y-1 text-center">
               <p className="text-xs font-bold uppercase tracking-widest text-destructive/70">Costo</p>
               <p className="text-3xl font-black text-destructive/90">-{reward.scans_required}</p>
             </div>
             <div className="h-10 w-px bg-border"></div>
             <div className="space-y-1 text-center">
               <p className="text-xs font-bold uppercase tracking-widest text-emerald-600/70">Nuevo Saldo</p>
               <p className="text-3xl font-black text-emerald-600">{subscription.scans_count - reward.scans_required}</p>
             </div>
          </div>

          <p className="text-xs text-center text-muted-foreground max-w-[250px] mx-auto">
             Al autorizar, se descontarán las visitas y se guardará el registro del canje en el historial.
          </p>

          <RedeemForm businessId={businessId} customerId={customerId} rewardId={rewardId} />

        </div>

        <div className="text-center">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground" nativeButton={false} render={
            <Link href={`/dashboard/businesses/${business.slug}`}>
               <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar y Volver
            </Link>
          } />
        </div>
      </div>
    </div>
  );
}

function InvalidRedeemPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-destructive/20 shadow-2xl shadow-destructive/10 rounded-3xl p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
          <Gift className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Canje Inválido</h2>
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
