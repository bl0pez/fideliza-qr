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
