"use server";

import { createClient } from "@/utils/supabase/server";
import { User } from "@supabase/supabase-js";

export interface PublicBusiness {
  id: string;
  name: string;
  type: string;
  description: string | null;
  website_url: string | null;
  image_url: string;
  city: string;
  address: string | null;
  whatsapp_url: string | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  google_maps_url: string | null;
  slug: string;
  countries?: { name: string } | { name: string }[] | null;
  business_schedules?: { day_of_week: number; hour_range: string }[];
  schedule_exceptions?: { date: string; is_closed: boolean; reason?: string; hour_range?: string }[];
}

export interface PublicSubscription {
  id: string;
  user_id: string;
  business_id: string;
  scans_count: number;
  created_at: string;
}

export interface PublicReward {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  scans_required: number;
  scans_count: number;
  max_redemptions_per_user: number | null;
  is_active: boolean;
  expires_at: string | null;
  user_redemptions_count: number;
  is_limit_reached: boolean;
}

interface DatabaseReward {
  id: string;
  business_id: string;
  title: string;
  description: string | null;
  requirements: string | null;
  scans_required: number;
  max_redemptions_per_user: number | null;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export async function getPublicBusinessData(slug: string): Promise<{
  business: PublicBusiness | null;
  user: User | null;
  subscription: PublicSubscription | null;
  rewards: PublicReward[];
}> {
  const supabase = await createClient();

  // Run queries in parallel
  const [{ data: businessData }, { data: { user } }] = await Promise.all([
    supabase
      .from("businesses")
      .select("*, countries(name), business_schedules(*)")
      .eq("slug", slug)
      .single(),
    supabase.auth.getUser()
  ]);

  const business = businessData as PublicBusiness | null;

  if (!business) {
    return { business: null, user: null, subscription: null, rewards: [] };
  }

  // Fetch rewards with limits
  const { data: rewardsData } = await supabase
    .from("rewards")
    .select("*, max_redemptions_per_user")
    .eq("business_id", business.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  let subscription: PublicSubscription | null = null;
  const userRedemptions: Record<string, number> = {};

  if (user && rewardsData) {
    // Parallel fetch for subscription, redemptions, and reward progress
    const [subResult, redemptionsResult, progressResult] = await Promise.all([
      supabase.from("business_customers").select("*").eq("business_id", business.id).eq("user_id", user.id).maybeSingle(),
      supabase.from("reward_redemptions").select("reward_id").eq("business_id", business.id).eq("user_id", user.id),
      supabase.from("reward_progress").select("reward_id, scans_count").eq("business_id", business.id).eq("user_id", user.id)
    ]);
      
    subscription = subResult.data as PublicSubscription | null;
    
    // Create map for easy lookup
    const progressMap = new Map((progressResult.data || []).map(p => [p.reward_id, p.scans_count]));

    // Count redemptions per reward
    (redemptionsResult.data || []).forEach((r: { reward_id: string }) => {
      userRedemptions[r.reward_id] = (userRedemptions[r.reward_id] || 0) + 1;
    });

    // Map rewards including user specific status and REAL reward-specific progress
    const mappedRewards = (rewardsData as (DatabaseReward[]) || []).map((r) => {
      const rewardScans = progressMap.get(r.id) || 0;
      return {
        ...r,
        scans_count: rewardScans, // REAL progress for this specific reward
        user_redemptions_count: userRedemptions[r.id] || 0,
        is_limit_reached: r.max_redemptions_per_user !== null && (userRedemptions[r.id] || 0) >= r.max_redemptions_per_user
      };
    }) as PublicReward[];

    return { business, user, subscription, rewards: mappedRewards };
  }

  // If no user, return default rewards mapping
  const mappedRewards = (rewardsData as (DatabaseReward[]) || []).map((r) => ({
    ...r,
    scans_count: 0,
    user_redemptions_count: 0,
    is_limit_reached: false
  })) as PublicReward[];

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
