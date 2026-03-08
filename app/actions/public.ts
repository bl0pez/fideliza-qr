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
  if (user) {
    const { data } = await supabase
      .from("business_customers")
      .select("*")
      .eq("business_id", business.id)
      .eq("user_id", user.id)
      .maybeSingle();
    subscription = data;
  }

  return { business, user, subscription };
}
