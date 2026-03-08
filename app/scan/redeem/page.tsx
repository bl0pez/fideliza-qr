import { redirect } from "next/navigation";
import { Gift, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { RedeemForm } from "@/components/scan/redeem-form";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { getScanContext } from "@/app/actions/scan";

export const metadata = {
  title: `Canjear Premio | ${APP_NAME}`,
};

export default async function RedeemScanPage({
  searchParams,
}: {
  searchParams: Promise<{ b?: string; u?: string; r?: string }>;
}) {
  const { b: businessSlug, u: customerId, r: rewardId } = await searchParams;

  if (!businessSlug || !customerId || !rewardId) {
    return (
      <InvalidRedeemPage message="Faltan parámetros en el código QR. Forma correcta: ?b=SLUG&u=USER_ID&r=REWARD_ID" />
    );
  }

  const result = await getScanContext({ businessSlug, customerId, rewardId });

  if (!result.success) {
    if (result.error === "AUTH_REQUIRED") {
      redirect(`/login?redirect=/scan/redeem?b=${businessSlug}&u=${customerId}&r=${rewardId}`);
    }
    if (result.error === "BUSINESS_NOT_FOUND_OR_NOT_OWNER") {
      return (
        <InvalidRedeemPage message="No tienes permisos para canjear premios en este negocio o el negocio no existe." />
      );
    }
    if (result.error === "REWARD_NOT_FOUND") {
      return <InvalidRedeemPage message="La recompensa no existe." />;
    }
    if (result.error === "CUSTOMER_NOT_SUBSCRIBED") {
      return <InvalidRedeemPage message="El cliente no pertenece al negocio." />;
    }
    return <InvalidRedeemPage message="Error desconocido al procesar el código QR." />;
  }

  const { business, reward, subscription, customerName } = result;

  if (subscription.scans_count < reward.scans_required) {
    return (
      <InvalidRedeemPage 
        message={`El cliente solo tiene ${subscription.scans_count} visitas de las ${reward.scans_required} requeridas.`} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center mb-4 text-emerald-600">
            <Gift className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">{business.name}</h1>
          <p className="text-muted-foreground uppercase text-xs font-bold tracking-widest">Canje de Recompensa</p>
        </div>

        <div className="bg-white border border-border shadow-xl rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="bg-emerald-50 rounded-2xl p-4 text-center border border-emerald-100">
             <p className="text-emerald-800 font-medium text-sm mb-1">El cliente <strong>{customerName}</strong> quiere canjear:</p>
             <p className="text-xl font-black text-emerald-950">{reward.title}</p>
          </div>

          <div className="flex items-center justify-center py-4">
             <div className="flex items-center gap-3 bg-zinc-50 px-6 py-3 rounded-2xl border border-zinc-100">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-zinc-700">{reward.scans_required} Visitas Completadas</span>
             </div>
          </div>

          <RedeemForm businessId={business.id} customerId={customerId} rewardId={rewardId} />

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

function InvalidRedeemPage({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-destructive/20 shadow-2xl shadow-destructive/10 rounded-3xl p-8 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-destructive/10 text-destructive rounded-full flex items-center justify-center">
          <Gift className="h-8 w-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black">Canje no Disponible</h2>
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
