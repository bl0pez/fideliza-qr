"use server";

import { createClient } from "@/utils/supabase/server";

export interface Business {
  id: string;
  slug: string;
  name: string;
  type: string;
  image_url: string;
  rewards_available: number;
  city_id?: string;
  country_id?: string;
  city?: string;
  status: string;
  rewards?: { count: number }[];
}

export async function getBusinesses(options?: { 
  limit?: number; 
  countryId?: string; 
  cityId?: string;
  category?: string;
}): Promise<Business[]> {
  const supabase = await createClient();
  let query = supabase
    .from("businesses")
    .select(`
      *,
      rewards:rewards(count)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.countryId) {
    query = query.eq("country_id", options.countryId);
  }

  if (options?.cityId) {
    query = query.eq("city_id", options.cityId);
  }

  if (options?.category && options.category !== "all") {
    query = query.ilike("type", `%${options.category}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching businesses:", error);
    return [];
  }

  // Map to include reward count
  return (data || []).map(b => {
    const business = b as Business;
    return {
      ...business,
      rewards_available: business.rewards?.[0]?.count || 0
    };
  });
}

export interface Country {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  country_id: string;
}

export interface Category {
  id: string;
  name: string;
  icon_name?: string;
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
