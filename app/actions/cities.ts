"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCities(countryId?: string) {
  const supabase = await createClient();
  
  let query = supabase
    .from('cities')
    .select('*')
    .order('name');

  if (countryId) {
    query = query.eq('country_id', countryId);
  }

  const { data: cities, error } = await query;

  if (error) {
    console.error("Error fetching cities:", error);
    return [];
  }

  return cities || [];
}
