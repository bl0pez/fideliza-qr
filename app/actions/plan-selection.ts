"use server";

import { activatePlan } from "@/app/actions/plans";
import { createSubscriptionCheckout } from "@/app/actions/billing";
import { PLAN_IDS, type PlanId } from "@/lib/constants";
import { redirect } from "next/navigation";

export async function handlePlanSelection(formData: FormData) {
  const planId = formData.get("planId") as string;
  const user = formData.get("isLoggedIn") === "true";

  if (!user) {
    redirect(`/login?next=/register?plan=${planId}`);
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
