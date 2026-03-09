"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCountries() {
  const supabase = await createClient();
  
  const { data: countries, error } = await supabase
    .from('countries')
    .select('*')
    .order('name');

  if (error) {
    console.error("Error fetching countries:", error);
    return [];
  }

  return countries || [];
}
