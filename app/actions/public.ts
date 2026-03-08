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
    return { business: null, user: null, subscription: null, rewards: [] };
  }

  // Fetch rewards with limits
  const { data: rewards } = await supabase
    .from("rewards")
    .select("*, max_redemptions_per_user")
    .eq("business_id", business.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  let subscription = null;
  const userRedemptions: Record<string, number> = {};

  if (user && rewards) {
    // Parallel fetch for subscription and redemptions
    const [subResult, redemptionsResult] = await Promise.all([
      supabase.from("business_customers").select("*").eq("business_id", business.id).eq("user_id", user.id).maybeSingle(),
      supabase.from("reward_redemptions").select("reward_id").eq("business_id", business.id).eq("user_id", user.id)
    ]);
      
    subscription = subResult.data;
    
    // Count redemptions per reward
    (redemptionsResult.data || []).forEach(r => {
      userRedemptions[r.reward_id] = (userRedemptions[r.reward_id] || 0) + 1;
    });
  }

  // Map rewards including user specific status
  const mappedRewards = (rewards || []).map(r => ({
    ...r,
    user_redemptions_count: userRedemptions[r.id] || 0,
    is_limit_reached: r.max_redemptions_per_user !== null && (userRedemptions[r.id] || 0) >= r.max_redemptions_per_user
  }));

  return { business, user, subscription, rewards: mappedRewards };
}

export interface WalletReward {
  id: string;
  business_id: string;
  title: string;
  description?: string;
  scans_required: number;
  is_active: boolean;
  max_redemptions_per_user: number | null;
  created_at?: string;
  scans_count?: number;
  user_redemptions_count?: number;
  is_limit_reached?: boolean;
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
    .select("*, max_redemptions_per_user")
    .in("business_id", businessIds)
    .eq("is_active", true)
    .order("scans_required", { ascending: true });

  if (reqError) {
    console.error("Error fetching wallet rewards:", reqError);
  }

  // 2.5 Fetch reward progress and redemptions for this user
  const [progressResult, redemptionsResult] = await Promise.all([
    supabase.from("reward_progress").select("reward_id, scans_count").eq("user_id", user.id).in("business_id", businessIds),
    supabase.from("reward_redemptions").select("reward_id").eq("user_id", user.id).in("business_id", businessIds)
  ]);

  const progressMap = new Map((progressResult.data || []).map(p => [p.reward_id, p.scans_count]));
  
  const redemptionCounts: Record<string, number> = {};
  (redemptionsResult.data || []).forEach(r => {
    redemptionCounts[r.reward_id] = (redemptionCounts[r.reward_id] || 0) + 1;
  });

  // 3. Attach the rewards to each subscription for easy frontend rendering
  const walletData: WalletSubscription[] = subscriptions.map((sub) => {
    // Convert array/object from Supabase join correctly
    const businessData = Array.isArray(sub.businesses) ? sub.businesses[0] : sub.businesses;
    
    return {
      id: sub.id,
      scans_count: sub.scans_count,
      business_id: sub.business_id,
      businesses: businessData as { name: string; slug: string; image_url: string | null } | null,
      available_rewards: (rewards || []).filter(r => r.business_id === sub.business_id).map(r => {
        const userRedemptions = redemptionCounts[r.id] || 0;
        const reachedLimit = r.max_redemptions_per_user !== null && userRedemptions >= r.max_redemptions_per_user;
        
        return {
          ...r,
          scans_count: progressMap.get(r.id) || 0,
          user_redemptions_count: userRedemptions,
          is_limit_reached: reachedLimit
        };
      })
    };
  });

  return { subscriptions: walletData };
}
