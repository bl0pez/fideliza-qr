import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { BillingClientView } from "./billing-client-view";

export const metadata = {
  title: "Facturación y Suscripciones | FidelizaQR",
};

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 1. Fetch user's active/past_due subscription
  const { data: subscription } = await supabase
    .from("owner_subscriptions")
    .select("*")
    .eq("owner_id", user.id)
    .in("status", ["active", "past_due", "canceled"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // 2. Fetch all available plans
  const { data: plans } = await supabase
    .from("plans")
    .select("*")
    .order("price", { ascending: true });

  // Add dummy features based on standard naming
  const availablePlans = (plans || []).map((p) => {
     let features: string[] = [];
     if (p.name.toLowerCase().includes("pro")) {
       features = ["Hasta 2.000 clientes", "5 Sucursales", "Estadísticas avanzadas", "Soporte prioritario"];
     } else if (p.name.toLowerCase().includes("business")) {
       features = ["Clientes ilimitados", "10 Sucursales", "API de Integración", "Soporte dedicado", "Dominios personalizados"];
     } else {
       features = ["Hasta 500 clientes", "1 Sucursal", "Estadísticas básicas", "1 Empleado adicional"];
     }
     
     return {
       id: p.id,
       name: p.name,
       price: p.price,
       features
     };
  });

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
