"use server";

import { createClient } from "@/utils/supabase/server";

export type ScanContextResult =
  | { success: false; error: string }
  | {
      success: true;
      business: { id: string; slug: string; name: string; rewards_available: number | null };
      reward: { id: string; title: string; scans_required: number };
      subscription: { id: string; scans_count: number; user_id: string };
      customerName: string;
      progress: { scans_count: number; id: string | null };
    };

export async function getScanContext(params: {
  businessSlug: string;
  customerId: string;
  rewardId: string;
}): Promise<ScanContextResult> {
  const { businessSlug, customerId, rewardId } = params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "AUTH_REQUIRED" };
  }

  // 1. Resolve business and verify ownership
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id, slug, name, rewards_available")
    .eq("slug", businessSlug)
    .eq("owner_id", user.id)
    .single();

  if (businessError || !business) {
    return { success: false, error: "BUSINESS_NOT_FOUND_OR_NOT_OWNER" };
  }

  // 2. Resolve reward
  const { data: reward, error: rewardError } = await supabase
    .from("rewards")
    .select("id, title, scans_required")
    .eq("id", rewardId)
    .eq("business_id", business.id)
    .single();

  if (rewardError || !reward) {
    return { success: false, error: "REWARD_NOT_FOUND" };
  }

  // 3. Resolve customer subscription & profile
  const [customerResult, profileResult] = await Promise.all([
    supabase
      .from("business_customers")
      .select("id, scans_count, user_id")
      .eq("business_id", business.id)
      .eq("user_id", customerId)
      .single(),
    supabase
      .from("profiles")
      .select("full_name")
      .eq("id", customerId)
      .single()
  ]);

  if (customerResult.error || !customerResult.data) {
    return { success: false, error: "CUSTOMER_NOT_SUBSCRIBED" };
  }

  // 4. Resolve reward progress
  const { data: progress } = await supabase
    .from("reward_progress")
    .select("scans_count, id")
    .eq("business_id", business.id)
    .eq("user_id", customerId)
    .eq("reward_id", rewardId)
    .maybeSingle();

  return {
    success: true,
    business,
    reward,
    subscription: customerResult.data,
    customerName: profileResult.data?.full_name || `Cliente #${customerId.split("-")[0].toUpperCase()}`,
    progress: progress || { scans_count: 0, id: null }
  };
}
