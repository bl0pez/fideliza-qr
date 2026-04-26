import { getCustomerWallet, WalletSubscription, WalletReward } from "@/app/actions/public";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { APP_NAME } from "@/lib/constants";
import { Ticket, Store, Wallet, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { RedeemQrModal } from "@/components/public/redeem-qr-modal";
import { CustomerQrModal } from "@/components/public/customer-qr-modal";
import { Navbar } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Footer } from "@/components/layout/footer";

export const metadata = {
  title: `Mis Tarjetas | ${APP_NAME}`,
};

export default async function RewardsWalletPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/rewards");
  }

  const { subscriptions, error } = await getCustomerWallet();

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center p-4">
          <p className="text-destructive font-bold">{error}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />


      <main className="flex-1 max-w-2xl mx-auto w-full p-4 sm:p-6 lg:p-8 pb-32 space-y-6">
        
        <div className="flex items-center gap-3 pb-2 border-b">
          <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Mis Tarjetas</h1>
            <p className="text-sm text-muted-foreground">Tu billetera de fidelidad global</p>
          </div>
        </div>

        {!subscriptions || subscriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4 border-2 border-dashed rounded-3xl bg-zinc-50/50">
            <Ticket className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <h3 className="text-lg font-bold">No tienes tarjetas activas</h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-sm">
              Visita tus negocios locales favoritos y suscríbete para empezar a sumar visitas y ganar premios.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {subscriptions.map((sub: WalletSubscription) => {
              const business = sub.businesses;
              const rewards = sub.available_rewards || [];
              
              if (!business) return null;
              
              return (
                <div key={sub.id} className="bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Encabezado del Negocio */}
                  <div className="p-5 flex items-center justify-between border-b bg-zinc-50/50">
                    <Link href={`/${business.slug}`} className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border">
                        <Store className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-bold text-lg group-hover:text-primary transition-colors">
                          {business.name}
                        </h2>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">
                          {sub.scans_count} Visitas Acumuladas
                        </p>
                      </div>
                    </Link>
                    <div className="shrink-0 flex items-center gap-2">
                      <Link href={`/${business.slug}`} className="p-2 text-muted-foreground hover:bg-black/5 rounded-full transition-colors hidden sm:flex">
                        <ChevronRight className="w-5 h-5" />
                      </Link>
                    </div>
                  </div>

                  {/* Recompensas de este Negocio */}
                  <div className="p-5 bg-white">
                    {rewards.length > 0 ? (
                      <div className="grid gap-3">
                        {rewards.map((reward: WalletReward) => {
                          const currentScans = reward.scans_count || 0;
                          const reached = currentScans >= reward.scans_required;
                          const progress = Math.min(100, (currentScans / reward.scans_required) * 100);
                          
                          return (
                            <div key={reward.id} className="bg-zinc-50 border rounded-2xl relative overflow-hidden group">
                              <div 
                                className={`absolute top-0 left-0 bottom-0 opacity-10 transition-all duration-1000 ${reached ? 'bg-emerald-500' : 'bg-primary'}`} 
                                style={{ width: `${progress}%` }} 
                              />
                              
                              <div className="relative z-10 p-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                    <h4 className={`font-bold text-sm ${reached ? 'text-emerald-600' : 'text-foreground'}`}>
                                      {reward.title}
                                    </h4>
                                    <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">
                                      {currentScans} / {reward.scans_required} escaneos
                                    </p>
                                  </div>
                                  <div className="shrink-0 flex flex-col items-center">
                                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border shadow-xs">
                                      <Ticket className={`h-3 w-3 ${reached ? 'text-emerald-500' : 'text-muted-foreground'}`} />
                                      <span className="text-xs font-bold tabular-nums">{reward.scans_required}</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {reward.is_limit_reached ? (
                                  <div className="mt-3 w-full p-3 bg-zinc-100 rounded-xl flex items-center justify-center gap-2 border border-dashed text-zinc-400">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs font-bold uppercase tracking-widest">Ya canjeado</span>
                                  </div>
                                ) : reached ? (
                                  <div className="mt-3 w-full animate-in fade-in slide-in-from-top-1">
                                    <RedeemQrModal 
                                      businessSlug={business.slug}
                                      userId={user.id} 
                                      rewardId={reward.id} 
                                      rewardTitle={reward.title} 
                                      scansRequired={reward.scans_required} 
                                    />
                                  </div>
                                ) : (
                                  <div className="mt-3 w-full">
                                    <CustomerQrModal 
                                      businessSlug={business.slug}
                                      userId={user.id} 
                                      rewardId={reward.id} 
                                      rewardTitle={reward.title} 
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-center text-muted-foreground py-2 italic">
                        Este negocio no tiene recompensas activas en este momento.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
}
