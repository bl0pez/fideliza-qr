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

export async function addScanToCustomer(businessId: string, customerUserId: string) {
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

  // 2. Incrementar la visita del cliente
  const { data: customerData, error: fetchError } = await supabase
    .from("business_customers")
    .select("scans_count, id")
    .eq("business_id", businessId)
    .eq("user_id", customerUserId)
    .single();

  if (fetchError || !customerData) {
    return { error: "El cliente no está suscrito a tu negocio." };
  }

  const { error: updateError } = await supabase
    .from("business_customers")
    .update({ scans_count: customerData.scans_count + 1 })
    .eq("id", customerData.id);

  if (updateError) {
    return { error: "Error al sumar la visita: " + updateError.message };
  }

  return { success: true, newCount: customerData.scans_count + 1, businessName: business.name };
}
