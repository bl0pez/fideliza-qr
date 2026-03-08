import { redirect } from "next/navigation";
import { BillingClientView } from "./billing-client-view";
import { getPlans } from "@/app/actions/plans";
import { getCurrentUser } from "@/app/actions/auth";
import { getCurrentSubscription } from "@/app/actions/billing";

export const metadata = {
  title: "Facturación y Suscripciones | FidelizaQR",
};

export default async function BillingPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch user's active/past_due subscription using Server Action
  const subscription = await getCurrentSubscription();

  // 2. Fetch all available plans using Server Action
  const plans = await getPlans();
  
  // Transform to match BillingClientView props
  const availablePlans = plans.map(p => ({
     id: p.id,
     name: p.name,
     price: p.price,
     features: p.features || []
  }));

  // Verify if subscription actually is still valid
  const isSubscriptionActive = subscription && new Date(subscription.current_period_end) > new Date();

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 p-4 md:p-0">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Suscripciones y Facturación</h1>
        <p className="text-muted-foreground mt-2">
          Administra tu plan, métodos de pago e historial de compras.
        </p>
      </div>

      <div className="px-4 md:px-0">
         <BillingClientView 
           currentSubscription={isSubscriptionActive ? subscription : null} 
           availablePlans={availablePlans} 
         />
      </div>
    </div>
  );
}
