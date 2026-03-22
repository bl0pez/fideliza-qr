"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { BUSINESS_INITIAL_REWARDS, ROUTES } from "@/lib/constants";
import { generateUniqueSlug } from "@/lib/utils/slug-helpers";
import { getProfile } from "@/app/actions/auth";
import { upsertBusinessSchedules } from "@/app/actions/business-schedules";
import { formatRangeForSupabase, parseRange, minutesToTime, BusinessSchedule } from "@/lib/utils/schedule-helpers";

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

  const { data: business, error }: { data: { id: string, slug: string } | null; error: { message: string } | null } = await supabase.from("businesses").insert({
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
  }).select("id, slug").single();

  if (error || !business) {
    console.error("[createAdminBusiness] Error:", error?.message);
    return { error: error?.message || "Error al crear el negocio" };
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

interface AdminBusinessListEntry {
  id: string;
  name: string;
  slug: string;
  type: string;
  image_url: string;
  country_id: string;
  city: string;
  address: string;
  created_at: string;
  plan_id: string;
  plans: { name: string } | null;
  profiles: { full_name: string | null; email: string | null } | null;
}

export async function getAllBusinesses() {
  const profile = await getProfile();

  if (!profile || profile.role !== "admin") {
    return null;
  }

  const supabase = await createClient();

  const { data: businesses, error }: { data: AdminBusinessListEntry[] | null; error: { message: string } | null } = await supabase
    .from("businesses")
    .select(`
      *,
      plans (
        name
      ),
      profiles:owner_id (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[getAllBusinesses] Error:", error.message);
    return null;
  }

  return businesses;
}

interface AdminBusinessWithSchedules {
  id: string;
  name: string;
  slug: string;
  type: string;
  description: string | null;
  image_url: string;
  country_id: string;
  city: string;
  city_id: string;
  address: string;
  tiktok_url: string | null;
  whatsapp_url: string | null;
  instagram_url: string | null;
  website_url: string | null;
  owner_id: string | null;
  created_at: string;
  plan_id: string;
  schedules: BusinessSchedule[];
}

export async function getAdminBusinessById(id: string) {
  const profile = await getProfile();

  if (!profile || profile.role !== "admin") {
    return null;
  }

  const supabase = await createClient();

  // Explicit type annotation for the result to avoid 'any' and 'as' while maintaining strict types
  const { data: business, error }: { data: AdminBusinessWithSchedules | null; error: { message: string } | null } = await supabase
    .from("businesses")
    .select(`
      *,
      schedules:business_schedules(*)
    `)
    .eq("id", id)
    .single();

  if (error || !business) {
    console.error("[getAdminBusinessById] Error:", error);
    return null;
  }

  // Transform schedules for the form
  const formattedSchedules = (business.schedules || []).map((s: BusinessSchedule) => {
    const { start, end } = parseRange(s.hour_range);
    
    return {
      day_of_week: s.day_of_week,
      start: minutesToTime(start),
      end: minutesToTime(end)
    };
  });

  // Ensure no nulls are passed to the form which expects string | undefined
  return {
    ...business,
    description: business.description || "",
    website_url: business.website_url || "",
    tiktok_url: business.tiktok_url || "",
    whatsapp_url: business.whatsapp_url || "",
    instagram_url: business.instagram_url || "",
    owner_id: business.owner_id || "",
    schedules: formattedSchedules
  };
}

export async function updateAdminBusiness(id: string, data: {
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

  // Verificar si el nombre cambió para actualizar el slug
  const { data: currentBusiness }: { data: { name: string, slug: string } | null } = await supabase
    .from("businesses")
    .select("name, slug")
    .eq("id", id)
    .single();

  let newSlug = currentBusiness?.slug;
  if (data.name.trim() !== currentBusiness?.name?.trim()) {
    newSlug = await generateUniqueSlug(data.name, supabase, id);
  }

  const { error }: { error: { message: string } | null } = await supabase
    .from("businesses")
    .update({
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
      owner_id: data.owner_id || undefined, // Si no se provee, no lo cambiamos
      slug: newSlug,
    })
    .eq("id", id);

  if (error) {
    console.error("[updateAdminBusiness] Error:", error.message);
    return { error: error.message };
  }

  // Actualizar horarios
  if (data.schedules) {
    const formattedSchedules = data.schedules.map(s => ({
      day_of_week: s.day_of_week,
      hour_range: formatRangeForSupabase(s.start, s.end)
    }));

    const schedulesResult = await upsertBusinessSchedules(id, formattedSchedules);
    if (schedulesResult.error) {
       console.error("[updateAdminBusiness] Error guardando horarios:", schedulesResult.error);
    }
  }

  revalidatePath(ROUTES.dashboard);
  revalidatePath("/admin");
  revalidatePath(`/admin/shops/${id}/edit`);

  return { success: true };
}
