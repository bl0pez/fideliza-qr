"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function subscribeToBusiness(businessId: string, slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Debes iniciar sesión para suscribirte." };
  }

  // Verificar si ya está suscrito
  const { data: existing } = await supabase
    .from("business_customers")
    .select("id")
    .eq("business_id", businessId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    return { error: "Ya estás suscrito a este negocio." };
  }

  // Insertar la suscripción
  const { error } = await supabase.from("business_customers").insert({
    business_id: businessId,
    user_id: user.id,
    scans_count: 0
  });

  if (error) {
    return { error: "No se pudo realizar la suscripción: " + error.message };
  }

  revalidatePath(`/${slug}`);
  return { success: true };
}

export async function addScanToCustomer(businessId: string, customerUserId: string, rewardId: string) {
  if (!rewardId) return { error: "Falta el ID de la recompensa." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado." };
  }

  // 1. Verificar que el usuario que ejecuta esto es el DUEÑO del negocio
  const { data: business } = await supabase
    .from("businesses")
    .select("id, name")
    .eq("id", businessId)
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return { error: "No tienes permiso para escanear en este negocio." };
  }

  // 2. Incrementar la visita del cliente EN reward_progress
  
  // First ensure they are globally subscribed to the business
  const { data: customerData, error: fetchError } = await supabase
    .from("business_customers")
    .select("id")
    .eq("business_id", businessId)
    .eq("user_id", customerUserId)
    .single();

  if (fetchError || !customerData) {
    return { error: "El cliente no está suscrito a tu negocio." };
  }

  // Get current reward progress
  const { data: progress } = await supabase
    .from("reward_progress")
    .select("scans_count, id")
    .eq("user_id", customerUserId)
    .eq("business_id", businessId)
    .eq("reward_id", rewardId)
    .maybeSingle();

  const newCount = (progress?.scans_count || 0) + 1;

  if (progress) {
    const { error: updateError } = await supabase
      .from("reward_progress")
      .update({ scans_count: newCount })
      .eq("id", progress.id);
      
    if (updateError) return { error: "Error al sumar la visita: " + updateError.message };
  } else {
    const { error: insertError } = await supabase
      .from("reward_progress")
      .insert({
        user_id: customerUserId,
        business_id: businessId,
        reward_id: rewardId,
        scans_count: 1
      });
      
    if (insertError) return { error: "Error al registrar la primera visita: " + insertError.message };
  }

  // Purge cached pages so both the owner dashboard AND the client wallet refresh
  revalidatePath("/rewards");
  revalidatePath(`/dashboard/businesses/${businessId}`);

  return { success: true, newCount, businessName: business.name };
}
