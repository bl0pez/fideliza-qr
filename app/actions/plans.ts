"use server";

import { createClient } from "@/utils/supabase/server";

export interface Plan {
  id: string;
  name: string;
  price: number | null;
  max_branches: number;
  max_scans_monthly: number;
  max_card_types: number;
  custom_qr: boolean;
  features: string[];
  is_popular: boolean;
  sort_order: number;
}

export async function getPlans(): Promise<Plan[]> {
  const supabase = await createClient();
  
  const { data: plans } = await supabase
    .from("plans")
    .select("id, name, price, max_branches, max_scans_monthly, max_card_types, custom_qr, features, is_popular, sort_order")
    .order("sort_order", { ascending: true });

  return (plans ?? []) as Plan[];
}
