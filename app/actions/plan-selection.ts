"use server";

import { activatePlan } from "@/app/actions/plans";
import { createSubscriptionCheckout } from "@/app/actions/billing";
import { PLAN_IDS, type PlanId } from "@/lib/constants";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

export async function handlePlanSelection(formData: FormData) {
  const planId = formData.get("planId") as string;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/register?plan=${planId}`);
  }

  if (planId === PLAN_IDS.basic) {
    const result = await activatePlan(planId);
    if (result.success) {
      redirect("/dashboard");
    }
  } else {
    // Para planes de pago
    const result = await createSubscriptionCheckout(planId as PlanId);
    if (result.success && result.checkoutUrl) {
      redirect(result.checkoutUrl);
    }
  }
  
  redirect("/register?error=selection_failed");
}

/**
 * Acción simplificada para el CTA de la Home que activa el plan gratis directamente.
 */
export async function selectFreePlan() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Si no hay usuario, mandarlo al login con redirect al registro + plan
  if (!user) {
    redirect(`/login?next=/register?plan=${PLAN_IDS.basic}`);
  }

  // Si hay usuario, activar el plan directamente
  const result = await activatePlan(PLAN_IDS.basic);
  
  if (result.success) {
    redirect("/dashboard");
  }

  redirect("/register?error=selection_failed");
}
