"use client";

import { useState } from "react";
import { createSubscriptionCheckout, cancelSubscription } from "@/app/actions/billing";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Check, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

// Define strict prop types
type SubscriptionData = {
  id: string;
  plan_id: string;
  status: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
} | null;

interface Plan {
  id: string;
  name: string;
  price: number | null;
  features: string[];
}

interface BillingClientViewProps {
  currentSubscription: SubscriptionData;
  availablePlans: Plan[];
}

export function BillingClientView({ currentSubscription, availablePlans }: BillingClientViewProps) {
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);
  const router = useRouter();

  const handleSubscribe = async (planId: string) => {
    setIsProcessingId(planId);
    try {
      const result = await createSubscriptionCheckout(planId);
      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        toast.error(result.error || "Error al crear el link de pago.");
        setIsProcessingId(null);
      }
    } catch (error) {
       toast.error("Ocurrió un error inesperado.");
       setIsProcessingId(null);
    }
  };

  const handleCancel = async (subId: string) => {
    if (!confirm("¿Estás seguro de que deseas cancelar tu suscripción? Seguirá activa hasta el final del periodo facturado.")) return;
    
    setIsProcessingId("cancel");
    try {
      const result = await cancelSubscription(subId);
      if (result.success) {
        toast.success("Suscripción cancelada exitosamente.");
        router.refresh();
      } else {
        toast.error(result.error || "No se pudo cancelar la suscripción.");
      }
    } catch (error) {
       toast.error("Error al cancelar.");
    } finally {
       setIsProcessingId(null);
    }
  };

  return (
    <div className="space-y-8">
       {/* Current Subscription Status */}
       {currentSubscription && (
         <Card className="border-indigo-100 bg-indigo-50/50">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Sparkles className="h-5 w-5 text-indigo-500" />
               Tu Suscripción Actual
             </CardTitle>
             <CardDescription>
               Estado y detalles de tu plan
             </CardDescription>
           </CardHeader>
           <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Plan Activo</p>
                  <p className="font-bold text-lg capitalize">{currentSubscription.plan_id.replace("plan_", "")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vencimiento</p>
                  <p className="font-semibold text-foreground">
                    {new Date(currentSubscription.current_period_end).toLocaleDateString()}
                  </p>
                </div>
             </div>
             
             {currentSubscription.cancel_at_period_end && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-200">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <p>
                    <strong>Suscripción Cancelada.</strong> Seguirás teniendo acceso a los beneficios del plan hasta el final de tu periodo actual. Después, tu cuenta volverá al plan básico.
                  </p>
                </div>
             )}
           </CardContent>
           <CardFooter>
             {!currentSubscription.cancel_at_period_end && (
                <Button 
                  variant="destructive" 
                  onClick={() => handleCancel(currentSubscription.id)}
                  disabled={isProcessingId === "cancel"}
                >
                   {isProcessingId === "cancel" && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   Cancelar Suscripción
                </Button>
             )}
           </CardFooter>
         </Card>
       )}

       {/* Pricing Selection */}
       <div>
         <h3 className="text-xl font-bold mb-4">Planes Disponibles</h3>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {availablePlans.map((plan) => {
             const isCurrent = currentSubscription?.plan_id === plan.id;
             const priceDisplay = plan.price ? `$${plan.price.toLocaleString()}/mes` : "Gratis";
             
             return (
               <Card key={plan.id} className={`flex flex-col ${isCurrent ? "border-indigo-500 shadow-md ring-1 ring-indigo-500" : ""}`}>
                 <CardHeader>
                   <CardTitle>{plan.name}</CardTitle>
                   <CardDescription className="text-2xl font-bold text-foreground mt-2">
                     {priceDisplay}
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="flex-1">
                   <ul className="space-y-2 text-sm text-muted-foreground">
                     {plan.features.map((feature, idx) => (
                       <li key={idx} className="flex items-center gap-2">
                         <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                         <span>{feature}</span>
                       </li>
                     ))}
                   </ul>
                 </CardContent>
                 <CardFooter>
                   {isCurrent ? (
                     <Button variant="outline" className="w-full" disabled>Plan Actual</Button>
                   ) : plan.price ? (
                     <Button 
                       className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                       onClick={() => handleSubscribe(plan.id)}
                       disabled={!!isProcessingId}
                     >
                       {isProcessingId === plan.id ? (
                         <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Procesando...</>
                       ) : (
                         "Adquirir Plan"
                       )}
                     </Button>
                   ) : (
                     <Button variant="outline" className="w-full" disabled>Plan Base</Button>
                   )}
                 </CardFooter>
               </Card>
             );
           })}
         </div>
       </div>
    </div>
  );
}
