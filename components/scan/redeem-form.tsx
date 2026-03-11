"use client";

import { useState } from "react";
import { redeemReward } from "@/app/actions/rewards";
import { Button } from "@/components/ui/button";
import { Loader2, Gift, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface RedeemFormProps {
  businessId: string;
  businessSlug: string;
  customerId: string;
  rewardId: string;
}

export function RedeemForm({ businessId, businessSlug, customerId, rewardId }: RedeemFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleRedeem = async () => {
    setIsSubmitting(true);
    try {
      const result = await redeemReward(businessId, customerId, rewardId);
      
      if (result.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      toast.success(`CANJE EXITOSO: ${result.rewardTitle}`);
      
      setTimeout(() => {
        router.push(`/dashboard/businesses/${businessSlug}`);
      }, 2500);
      
    } catch {
      toast.error("Ocurrió un error inesperado al autorizar el canje.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <p className="font-bold text-center text-emerald-800 text-xl leading-tight">
          ¡Premio Entregado! <br /> Visitas Descontadas
        </p>
        <p className="text-sm text-emerald-600 font-medium">Redirigiendo al panel...</p>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleRedeem}
      disabled={isSubmitting}
      className="w-full h-16 mt-4 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-xl shadow-xl shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      {isSubmitting ? (
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
      ) : (
        <Gift className="mr-2 h-6 w-6" />
      )}
      {isSubmitting ? "Autorizando..." : "Autorizar y Entregar"}
    </Button>
  );
}
