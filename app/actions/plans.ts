"use server";

import { createClient } from "@/utils/supabase/server";
import { PLAN_IDS } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/utils/supabase/admin";

export interface Plan {
  id: string;
  name: string;
  price: number | null;
  max_branches: number;
  max_scans_monthly: number;
  max_card_types: number;
  custom_qr: boolean;
  features: string[];
  is_popular: boolean;
  sort_order: number;
}

export async function getPlans(): Promise<Plan[]> {
  const supabase = await createClient();
  
  const { data: plans } = await supabase
    .from("plans")
    .select("id, name, price, max_branches, max_scans_monthly, max_card_types, custom_qr, features, is_popular, sort_order")
    .order("sort_order", { ascending: true });

  return (plans ?? []) as Plan[];
}

export async function activatePlan(planId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Debes iniciar sesión para activar un plan." };
  }

  // 1. Si es el plan básico, actualizamos el rol a business_owner directamente
  // Si es un plan de pago, esto normalmente lo manejaría el webhook de pago,
  // pero para asegurar que el usuario tenga acceso inmediato podemos hacerlo aquí también
  // si confiamos en el flujo (o simplemente si ya pagó).
  // En este contexto, el usuario dice que "no hace nada" al elegir el gratis.
  
  if (planId === PLAN_IDS.basic) {
    const adminSupabase = createAdminClient();

    // 1. Actualizar el rol del perfil usando el cliente Admin (omite RLS)
    const { error: profileError } = await adminSupabase
      .from("profiles")
      .update({ role: "business_owner" })
      .eq("id", user.id);

    if (profileError) {
      console.error("Error updating profile role (Admin):", profileError);
      return { error: "No se pudo actualizar el perfil: " + profileError.message };
    }
    
    // 2. Crear suscripción gratuita usando el cliente Admin (omite RLS)
    const { error: subError } = await adminSupabase
      .from("owner_subscriptions")
      .upsert({
        owner_id: user.id,
        plan_id: planId,
        status: "active",
        current_period_end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 10).toISOString(), // 10 años
      }, { onConflict: "owner_id" });

    if (subError) {
      console.error("Error creating free subscription (Admin):", subError);
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings/billing");
  }

  return { success: true };
}
