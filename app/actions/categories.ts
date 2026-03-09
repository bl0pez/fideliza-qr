"use server";

import { createClient } from "@/utils/supabase/server";

export async function getCategories() {
  const supabase = await createClient();
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return categories || [];
}
