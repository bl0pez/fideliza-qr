"use server";

import { createClient } from "@/utils/supabase/server";

export interface Business {
  id: string;
  name: string;
  type: string;
  image_url: string;
  rewards_available: number;
}

export interface Category {
  id: string;
  name: string;
  icon_name?: string;
}

export async function getBusinesses(limit?: number): Promise<Business[]> {
  const supabase = await createClient();
  let query = supabase
    .from("businesses")
    .select("*")
    .order("created_at", { ascending: false });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching businesses:", error);
    return [];
  }

  return data as Business[];
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching categories:", error);
    return [];
  }

  return data as Category[];
}
