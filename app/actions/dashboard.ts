"use server";

import { createClient } from "@/utils/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { totalCustomers: 0, totalRewardsDelivered: 0 };
  }

  // Obtener los IDs de los negocios que le pertenecen al usuario
  const { data: businesses, error: busError } = await supabase
    .from("businesses")
    .select("id")
    .eq("owner_id", user.id);

  if (busError || !businesses || businesses.length === 0) {
    return { totalCustomers: 0, totalRewardsDelivered: 0 };
  }

  const businessIds = businesses.map((b) => b.id);

  // 1. Calcular Clientes Totales (count en la tabla business_customers)
  const { count: totalCustomersCount, error: custError } = await supabase
    .from("business_customers")
    .select("*", { count: "exact", head: true })
    .in("business_id", businessIds);

  if (custError) {
    console.error("Error fetching customers count:", custError);
  }

  // 2. Calcular Recompensas Entregadas (count en la tabla reward_redemptions)
  const { count: totalRewardsCount, error: rewardsError } = await supabase
    .from("reward_redemptions")
    .select("*", { count: "exact", head: true })
    .in("business_id", businessIds);

  if (rewardsError) {
    console.error("Error fetching rewards redemptions count:", rewardsError);
  }

  return {
    totalCustomers: totalCustomersCount || 0,
    totalRewardsDelivered: totalRewardsCount || 0,
  };
}
