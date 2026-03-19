"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { BUSINESS_INITIAL_REWARDS, ROUTES } from "@/lib/constants";
import { generateUniqueSlug } from "@/lib/utils/slug-helpers";
import { getProfile } from "@/app/actions/auth";
import { upsertBusinessSchedules } from "@/app/actions/business-schedules";
import { formatRangeForSupabase } from "@/lib/utils/schedule-helpers";

export async function createAdminBusiness(data: {
  name: string;
  type: string;
  description?: string;
  website_url?: string;
  image_url: string;
  country_id: string;
  city: string;
  city_id: string;
  address: string;
  tiktok_url?: string;
  whatsapp_url?: string;
  instagram_url?: string;
  owner_id?: string;
  schedules?: { day_of_week: number; start: string; end: string }[];
}) {
  const profile = await getProfile();

  if (!profile || profile.role !== "admin") {
    return { error: "No tienes permisos de administrador para realizar esta acción." };
  }

  const supabase = await createClient();

  // Generar un slug único basado en el nombre
  const uniqueSlug = await generateUniqueSlug(data.name, supabase);

  // Insertar en la base de datos (Sin límites de plan)
  const { data: business, error } = await supabase.from("businesses").insert({
    name: data.name,
    type: data.type,
    description: data.description || null,
    website_url: data.website_url || null,
    image_url: data.image_url,
    country_id: data.country_id,
    city: data.city,
    city_id: data.city_id,
    address: data.address,
    tiktok_url: data.tiktok_url || null,
    whatsapp_url: data.whatsapp_url || null,
    instagram_url: data.instagram_url || null,
    rewards_available: BUSINESS_INITIAL_REWARDS,
    owner_id: data.owner_id || profile.id,
    slug: uniqueSlug,
    plan_id: "pro", 
    status: "active"
  }).select().single();

  if (error) {
    console.error("[createAdminBusiness] Error:", error);
    return { error: error.message };
  }

  // Guardar horarios si se proporcionaron
  if (data.schedules && data.schedules.length > 0) {
    // Mapear al formato de la base de datos (hour_range)
    const formattedSchedules = data.schedules.map(s => ({
      day_of_week: s.day_of_week,
      hour_range: formatRangeForSupabase(s.start, s.end)
    }));

    const schedulesResult = await upsertBusinessSchedules(business.id, formattedSchedules);
    if (schedulesResult.error) {
       console.error("[createAdminBusiness] Error guardando horarios:", schedulesResult.error);
    }
  }

  // Revalidar rutas
  revalidatePath(ROUTES.dashboard);
  revalidatePath("/admin");

  return { success: true, data: { id: business.id, slug: business.slug } };
}
