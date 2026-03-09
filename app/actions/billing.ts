"use server";

import { createClient } from "@/utils/supabase/server";
import { MercadoPagoConfig, PreApproval } from "mercadopago";
import { getSiteUrl, BILLING_CURRENCY, ROUTES } from "@/lib/constants";

export type { BillingProvider, SubscriptionStatus } from "@/lib/constants";

export interface CreateCheckoutResult {
  success: boolean;
  checkoutUrl?: string;
  error?: string;
}

export interface CancelSubscriptionResult {
  success: boolean;
  error?: string;
}

function getPreApprovalClient() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) {
    throw new Error("Missing MP_ACCESS_TOKEN environment variable.");
  }
  const client = new MercadoPagoConfig({ accessToken: token });
  return new PreApproval(client);
}

export async function getCurrentSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: subscription } = await supabase
    .from("owner_subscriptions")
    .select("*")
    .eq("owner_id", user.id)
    .in("status", ["active", "past_due", "canceled"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return subscription || null;
}
export async function createSubscriptionCheckout(planId: string): Promise<CreateCheckoutResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "AUTH_REQUIRED" };
  }

  // 1. Get plan details from database
  const { data: plan, error: planError } = await supabase
    .from("plans")
    .select("id, name, price")
    .eq("id", planId)
    .single();

  if (planError || !plan) {
    return { success: false, error: "PLAN_NOT_FOUND" };
  }

  // Fallback to simple default if missing
  const price = plan.price ?? 10000;
  const currency = BILLING_CURRENCY;

  try {
    const preapproval = getPreApprovalClient();
    const siteUrl = getSiteUrl();

    // To link the subscription securely, we pass custom info in external_reference
    const metadata = JSON.stringify({ userId: user.id, planId: plan.id });

    // 2. Create Preapproval in MercadoPago
    const result = await preapproval.create({
      body: {
        reason: `FidelizaQR - Plan ${plan.name}`,
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: price,
          currency_id: currency,
        },
        back_url: `${siteUrl}${ROUTES.billingSuccess}`,
        payer_email: user.email,
        external_reference: metadata,
      }
    });

    if (!result.init_point) {
       return { success: false, error: "MERCADOPAGO_API_ERROR" };
    }

    return { success: true, checkoutUrl: result.init_point };
  } catch (error) {
    console.error("Error creating MercadoPago subscription:", error);
    return { success: false, error: "PROVIDER_ERROR" };
  }
}

export async function cancelSubscription(subscriptionId: string): Promise<CancelSubscriptionResult> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "AUTH_REQUIRED" };
  }

  // 1. Get user's subscription from DB to verify ownership
  const { data: subscription, error: subError } = await supabase
    .from("owner_subscriptions")
    .select("*")
    .eq("id", subscriptionId)
    .eq("owner_id", user.id)
    .single();

  if (subError || !subscription) {
    return { success: false, error: "SUBSCRIPTION_NOT_FOUND" };
  }

  if (subscription.cancel_at_period_end || subscription.status === 'canceled') {
    return { success: false, error: "ALREADY_CANCELED" };
  }

  try {
    if (subscription.provider === 'mercadopago') {
      const preapproval = getPreApprovalClient();
      
      // In MercadoPago, we cancel the preapproval via API.
      await preapproval.update({
        id: subscription.provider_subscription_id,
        body: {
          status: "cancelled"
        }
      });
    }

    // 2. Update DB to mark as canceling at period end
    // Status remains active until period ends, but flag is true
    const { error: updateError } = await supabase
      .from("owner_subscriptions")
      .update({ cancel_at_period_end: true })
      .eq("id", subscriptionId);

    if (updateError) {
       console.error("Failed to update subscription in DB", updateError);
       return { success: false, error: "DB_UPDATE_ERROR" };
    }

    return { success: true };
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return { success: false, error: "PROVIDER_ERROR" };
  }
}
