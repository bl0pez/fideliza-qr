"use client";

import { useState } from "react";
import { addScanToCustomer } from "@/app/actions/subscription";
import { Button } from "@/components/ui/button";
import { Loader2, QrCode, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AddScanFormProps {
  businessId: string;
  customerId: string;
  currentCount: number;
}

export function AddScanForm({ businessId, customerId, currentCount }: AddScanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleScan = async () => {
    setIsSubmitting(true);
    try {
      const result = await addScanToCustomer(businessId, customerId);
      
      if (result.error) {
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }

      setSuccess(true);
      toast.success("Visita sumada exitosamente a la suscripción.");
      
      // We can redirect the owner back to their dashboard, or clear the page
      setTimeout(() => {
        router.push(`/dashboard/businesses/${businessId}`);
      }, 2000);
      
    } catch (e) {
      toast.error("Ocurrió un error al sumar la visita.");
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-6 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-3">
        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        <p className="font-bold text-emerald-800 text-lg">¡Visita Registrada!</p>
        <p className="text-sm text-emerald-600 font-medium">Redirigiendo al panel...</p>
      </div>
    );
  }

  return (
    <Button 
      onClick={handleScan}
      disabled={isSubmitting}
      className="w-full h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xl shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
    >
      {isSubmitting ? (
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
      ) : (
        <QrCode className="mr-2 h-6 w-6" />
      )}
      {isSubmitting ? "Procesando..." : "Sumar 1 Visita"}
    </Button>
  );
}
