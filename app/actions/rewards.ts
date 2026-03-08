"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function createReward(data: {
  business_id: string;
  title: string;
  description?: string;
  requirements?: string;
  scans_required: number;
  expires_at?: string;
  max_redemptions_per_user?: number | null;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  const { data: newReward, error } = await supabase
    .from("rewards")
    .insert([
      {
        business_id: data.business_id,
        title: data.title,
        description: data.description,
        requirements: data.requirements,
        scans_required: data.scans_required,
        expires_at: data.expires_at || null,
        max_redemptions_per_user: data.max_redemptions_per_user ?? null,
      }
    ])
    .select()
    .single();

  if (error) {
    console.error("Error creating reward:", error);
    return { error: "No se pudo crear la recompensa. " + error.message };
  }

  revalidatePath(`/dashboard/businesses/${data.business_id}`);
  
  return { success: true, reward: newReward };
}

export async function getBusinessRewards(businessId: string) {
  const supabase = await createClient();
  
  const { data: rewards, error } = await supabase
    .from("rewards")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching rewards:", error);
    return [];
  }

  return rewards;
}

export async function deleteReward(rewardId: string, businessId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "No autorizado" };

  const { error } = await supabase
    .from("rewards")
    .delete()
    .eq("id", rewardId);

  if (error) {
    return { error: "Error al eliminar: " + error.message };
  }

  revalidatePath(`/dashboard/businesses/${businessId}`);
  return { success: true };
}

export async function redeemReward(businessId: string, customerUserId: string, rewardId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado." };
  }

  // 1. Verify the current user is the owner of the business
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("id", businessId)
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return { error: "No tienes permiso para autorizar canjes en este negocio." };
  }

  // 2. Get the reward details to know how much it costs and its limits
  const { data: reward } = await supabase
    .from("rewards")
    .select("id, title, scans_required, max_redemptions_per_user")
    .eq("id", rewardId)
    .eq("business_id", businessId)
    .single();

  if (!reward) {
    return { error: "La recompensa no existe o no pertenece a este negocio." };
  }

  // 2.5 Check if the user has already reached the redemption limit
  if (reward.max_redemptions_per_user !== null) {
    const { count: redemptionsCount } = await supabase
      .from("reward_redemptions")
      .select("*", { count: 'exact', head: true })
      .eq("user_id", customerUserId)
      .eq("reward_id", rewardId);

    if ((redemptionsCount || 0) >= reward.max_redemptions_per_user) {
      return { 
        error: `Este cliente ya ha canjeado el máximo de veces (${reward.max_redemptions_per_user}) esta recompensa.` 
      };
    }
  }

  // 3. Verify the customer has enough scans from the specific reward progress table
  const { data: progress } = await supabase
    .from("reward_progress")
    .select("id, scans_count")
    .eq("business_id", businessId)
    .eq("user_id", customerUserId)
    .eq("reward_id", rewardId)
    .maybeSingle();

  if (!progress) {
    return { error: "El cliente no tiene visitas registradas para esta recompensa." };
  }

  if (progress.scans_count < reward.scans_required) {
    return { error: `El cliente no tiene suficientes visitas. Necesita ${reward.scans_required} pero tiene ${progress.scans_count}.` };
  }

  // 4. Perform the deduction and save the redemption record
  // Note: We use the supabase client to update the count and create the log.
  // In a high-concurrency app we'd use a postgres function (RPC) to prevent race conditions,
  // but this is safe enough for point-of-sale scanning where double-scans are rare.
  const newScansCount = progress.scans_count - reward.scans_required;

  const { error: updateError } = await supabase
    .from("reward_progress")
    .update({ scans_count: newScansCount })
    .eq("id", progress.id);

  if (updateError) {
    return { error: "Error al descontar las visitas: " + updateError.message };
  }

  const { error: insertError } = await supabase
    .from("reward_redemptions")
    .insert({
      business_id: businessId,
      user_id: customerUserId,
      reward_id: rewardId,
      scans_cost: reward.scans_required,
      status: "completed"
    });

  if (insertError) {
    // If this fails, the points were deducted but no receipt was stored. 
    // Ideally this would be an RPC transaction. We log it for now.
    console.error("Critical: Points deducted but redemption log failed", insertError);
  }

  // Purge cached pages so both the owner dashboard AND the client wallet refresh
  revalidatePath("/rewards");
  revalidatePath(`/dashboard/businesses/${businessId}`);

  return { success: true, rewardTitle: reward.title, remainingScans: newScansCount };
}
