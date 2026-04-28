"use client";

import { useState, useEffect } from "react";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";
import { getCustomerWallet, WalletSubscription } from "@/app/actions/public";
import { QrCode, Store, ChevronRight, Loader2, Info } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { cldThumb } from "@/lib/cloudinary";

interface QuickQrDrawerProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QuickQrDrawer({ userId, open, onOpenChange }: QuickQrDrawerProps) {
  const [subscriptions, setSubscriptions] = useState<WalletSubscription[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<WalletSubscription | null>(null);

  useEffect(() => {
    if (open) {
      loadWallet();
    } else {
      setSelectedBusiness(null);
    }
  }, [open]);

  useEffect(() => {
    const currentRewardId = selectedBusiness?.available_rewards?.[0]?.id;
    if (!currentRewardId || !open) return;

    const handleScanEvent = (e: CustomEvent<{ rewardId: string }>) => {
      if (e.detail?.rewardId === currentRewardId) onOpenChange(false);
    };
    window.addEventListener('reward-scanned', handleScanEvent as EventListener);
    return () => window.removeEventListener('reward-scanned', handleScanEvent as EventListener);
  }, [selectedBusiness, open, onOpenChange]);

  async function loadWallet() {
    setLoading(true);
    try {
      const { subscriptions: data } = await getCustomerWallet();
      setSubscriptions(data || []);
      
      // If only one subscription, auto-select it
      if (data && data.length === 1) {
        setSelectedBusiness(data[0]);
      }
    } catch (error) {
      console.error("Error loading wallet for quick QR:", error);
    } finally {
      setLoading(false);
    }
  }

  const getScanUrl = (sub: WalletSubscription) => {
    if (typeof window === "undefined") return "";
    const businessSlug = sub.businesses?.slug;
    // We target the first available reward by default for quick access
    const rewardId = sub.available_rewards?.[0]?.id;
    
    return `${window.location.origin}/scan?b=${businessSlug}&u=${userId}${rewardId ? `&r=${rewardId}` : ""}`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] sm:h-[70vh] rounded-t-[3rem] p-0 overflow-hidden border-t-0 shadow-2xl">
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full" />
        
        <div className="flex flex-col h-full bg-white dark:bg-slate-900">
          <SheetHeader className="p-8 pb-4 text-center">
            <SheetTitle className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              {selectedBusiness ? "Tu Código QR" : "Selecciona un Negocio"}
            </SheetTitle>
            <SheetDescription className="text-slate-500 font-medium text-base">
              {selectedBusiness 
                ? `Muestra este código en ${selectedBusiness.businesses?.name} para sumar tu visita.`
                : "Toca tu tarjeta para mostrar el código de fidelidad instantáneo."}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1 px-6 pb-12">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-slate-400 font-black uppercase tracking-widest text-xs animate-pulse">
                  Cargando tus tarjetas...
                </p>
              </div>
            ) : selectedBusiness ? (
              /* QR View */
              <div className="flex flex-col items-center animate-in fade-in zoom-in duration-500 py-4">
                <div className="relative group">
                   <div className="absolute -inset-4 bg-linear-to-tr from-primary/20 to-orange-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000" />
                   <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-slate-100 relative z-10">
                     <QRCodeSVG 
                       value={getScanUrl(selectedBusiness)} 
                       size={240} 
                       level="H"
                       includeMargin={false}
                       imageSettings={{
                         src: "/icon-192x192.png",
                         height: 40,
                         width: 40,
                         excavate: true,
                       }}
                     />
                   </div>
                </div>

                <div className="mt-10 text-center w-full max-w-xs">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-4 border border-slate-100 dark:border-slate-700">
                    <Store className="w-4 h-4 text-primary" />
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {selectedBusiness.businesses?.name}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {selectedBusiness.available_rewards?.[0] && (
                       <p className="text-sm font-medium text-slate-500">
                          Sumando visitas para:<br/>
                          <span className="text-slate-900 dark:text-white font-black">
                            {selectedBusiness.available_rewards[0].title}
                          </span>
                       </p>
                    )}
                    <button 
                      onClick={() => setSelectedBusiness(null)}
                      className="text-xs font-black text-primary uppercase tracking-widest hover:underline pt-4"
                    >
                      Cambiar de tarjeta
                    </button>
                  </div>
                </div>
              </div>
            ) : subscriptions.length === 0 ? (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                  <QrCode className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black text-slate-900">No tienes tarjetas aún</h3>
                  <p className="text-slate-500 text-sm max-w-[240px] font-medium leading-relaxed">
                    Suscríbete a un negocio visitando su perfil para que aparezcan aquí tus QR de fidelidad.
                  </p>
                </div>
              </div>
            ) : (
              /* List View */
              <div className="grid grid-cols-1 gap-4 py-4 animate-in slide-in-from-bottom-5 duration-500">
                {subscriptions.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedBusiness(sub)}
                    className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-5 rounded-[2rem] flex items-center justify-between hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-5 text-left">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors overflow-hidden border border-slate-100 dark:border-slate-600">
                        {sub.businesses?.image_url ? (
                          <Image
                            src={cldThumb(sub.businesses.image_url)}
                            alt={sub.businesses.name}
                            width={56}
                            height={56}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Store className="w-7 h-7" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">
                          {sub.businesses?.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                          <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">
                            {sub.scans_count} Visitas
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="p-8 pt-0 text-center">
            <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
               <Info className="w-3 h-3" />
               Fidelilocal Global QR Protocol
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
