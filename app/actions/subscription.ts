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

  // 1. Verificar que el usuario que ejecuta esto es el DUEÑO del negocio y ver sus límites
  const { data: business } = await supabase
    .from("businesses")
    .select(`
      id, 
      slug,
      name, 
      scans_this_month,
      plans (
        max_scans_monthly
      )
    `)
    .eq("id", businessId)
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    return { error: "No tienes permiso para escanear en este negocio." };
  }

  // 2. Verificar si el negocio ha alcanzado su límite mensual
  const planLimits = business.plans as unknown as { max_scans_monthly: number };
  if (planLimits && planLimits.max_scans_monthly !== -1) {
    if ((business.scans_this_month || 0) >= planLimits.max_scans_monthly) {
      return { 
        error: `Has alcanzado el límite mensual de ${planLimits.max_scans_monthly} escaneos de tu plan Básico. Sube a Pro para seguir recibiendo clientes.` 
      };
    }
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

  // 3. Incrementar el contador mensual del NEGOCIO
  const { error: businessUpdateError } = await supabase
    .from("businesses")
    .update({ scans_this_month: (business.scans_this_month || 0) + 1 })
    .eq("id", businessId);

  if (businessUpdateError) {
    // No bloqueamos el proceso si esto falla, pero lo logueamos
    console.error("Error updating business scan counter:", businessUpdateError);
  }

  // Purge cached pages so both the owner dashboard AND the client wallet refresh
  revalidatePath("/rewards");
  revalidatePath(`/dashboard/businesses/${business.slug}`);
  revalidatePath(`/${business.slug}`);

  return { success: true, newCount, businessName: business.name };
}
