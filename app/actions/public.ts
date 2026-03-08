"use server";

import { createClient } from "@/utils/supabase/server";

export async function getPublicBusinessData(slug: string) {
  const supabase = await createClient();

  // Run both queries in parallel
  const [{ data: business }, { data: { user } }] = await Promise.all([
    supabase.from("businesses").select("*").eq("slug", slug).single(),
    supabase.auth.getUser()
  ]);

  if (!business) {
    return { business: null, user: null, subscription: null };
  }

  let subscription = null;
  
  // Fetch rewards
  const { data: rewards } = await supabase
    .from("rewards")
    .select("*")
    .eq("business_id", business.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (user) {
    const { data } = await supabase
      .from("business_customers")
      .select("*")
      .eq("business_id", business.id)
      .eq("user_id", user.id)
      .maybeSingle();
      
    subscription = data;
  }

  return { business, user, subscription, rewards: rewards || [] };
}

export interface WalletReward {
  id: string;
  business_id: string;
  title: string;
  description?: string;
  scans_required: number;
  is_active: boolean;
  created_at?: string;
  scans_count?: number;
}

export interface WalletSubscription {
  id: string;
  scans_count: number;
  business_id: string;
  businesses: {
    name: string;
    slug: string;
    image_url: string | null;
  } | null;
  available_rewards?: WalletReward[];
}

export async function getCustomerWallet(): Promise<{ subscriptions?: WalletSubscription[], error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  // 1. Fetch all businesses the user is subscribed to
  // And doing a join to get the business name, logo, and slug
  const { data: subscriptions, error: subError } = await supabase
    .from("business_customers")
    .select(`
      id,
      scans_count,
      business_id,
      businesses (
        name,
        slug,
        image_url
      )
    `)
    .eq("user_id", user.id);

  if (subError) {
    console.error("Error fetching subscriptions:", subError);
    return { subscriptions: [] };
  }

  if (!subscriptions || subscriptions.length === 0) {
    return { subscriptions: [] };
  }

  // 2. Fetch all active rewards for these businesses
  const businessIds = subscriptions.map(s => s.business_id);
  
  const { data: rewards, error: reqError } = await supabase
    .from("rewards")
    .select("*")
    .in("business_id", businessIds)
    .eq("is_active", true)
    .order("scans_required", { ascending: true });

  if (reqError) {
    console.error("Error fetching wallet rewards:", reqError);
  }

  // 2.5 Fetch reward progress for this user
  const { data: progressData, error: progressError } = await supabase
    .from("reward_progress")
    .select("reward_id, scans_count")
    .eq("user_id", user.id)
    .in("business_id", businessIds);

  if (progressError) {
    console.error("Error fetching reward progress:", progressError);
  }

  const progressMap = new Map((progressData || []).map(p => [p.reward_id, p.scans_count]));

  // 3. Attach the rewards to each subscription for easy frontend rendering
  const walletData: WalletSubscription[] = subscriptions.map((sub) => {
    // Convert array/object from Supabase join correctly
    const businessData = Array.isArray(sub.businesses) ? sub.businesses[0] : sub.businesses;
    
    return {
      id: sub.id,
      scans_count: sub.scans_count,
      business_id: sub.business_id,
      businesses: businessData as { name: string; slug: string; image_url: string | null } | null,
      available_rewards: (rewards || []).filter(r => r.business_id === sub.business_id).map(r => ({
        ...r,
        scans_count: progressMap.get(r.id) || 0
      }))
    };
  });

  return { subscriptions: walletData };
}
