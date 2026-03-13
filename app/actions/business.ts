"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { DEFAULT_PLAN_ID, BUSINESS_INITIAL_REWARDS, ROUTES, PLAN_DEFAULTS } from "@/lib/constants";
import { generateUniqueSlug } from "@/lib/utils/slug-helpers";

export async function createBusiness(data: {
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
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Usuario no autenticado." };
  }

  // Verificar el rol de manera estricta en el backend antes de insertar
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "business_owner") {
    return { error: "No tienes permisos para crear negocios." };
  }

  // 1. Validar límite de sucursales según el plan actual
  const { data: existingBusinesses } = await supabase
    .from("businesses")
    .select(`
      id,
      plan_id,
      plans (
        max_branches
      )
    `)
    .eq("owner_id", user.id);

  const businessCount = existingBusinesses?.length || 0;
  
  // Si ya tiene negocios, buscamos el plan con el mayor límite de sucursales
  let maxBranchesAllowed: number = PLAN_DEFAULTS[DEFAULT_PLAN_ID].maxBranches; // Por defecto Básico
  if (existingBusinesses && existingBusinesses.length > 0) {
    maxBranchesAllowed = Math.max(...existingBusinesses.map(b => (b.plans as unknown as { max_branches: number })?.max_branches || 1));
  }

  if (businessCount >= maxBranchesAllowed) {
    return { 
      error: `Has alcanzado el límite de ${maxBranchesAllowed} sucursal(es) de tu plan. Sube a Pro para tener más.` 
    };
  }

  // Generar un slug único basado en el nombre usando el helper
  const uniqueSlug = await generateUniqueSlug(data.name, supabase);

  // Insertar en la base de datos de manera segura
  const { error } = await supabase.from("businesses").insert({
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
    owner_id: user.id, // Obtenido directo desde la cookie de sesión por seguridad
    slug: uniqueSlug, // Guardamos el slug único
    plan_id: DEFAULT_PLAN_ID,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch the created business to return it (or just return the slug if we can)
  const { data: newBusiness } = await supabase
    .from("businesses")
    .select("id, slug")
    .eq("slug", uniqueSlug)
    .single();

  // Purgar la caché de la página del dashboard para que muestre el nuevo dato inmediatamente
  revalidatePath(ROUTES.dashboard);

  return { success: true, data: newBusiness };
}

export async function getUserBusinesses() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: businesses } = await supabase
    .from('businesses')
    .select(`
      *,
      plans (
        id,
        name,
        max_branches,
        max_scans_monthly
      ),
      rewards:rewards(count)
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  // Transform to include actual rewards count
  return (businesses || []).map(b => ({
    ...b,
    rewards_count: b.rewards?.[0]?.count || 0
  }));
}

export async function getBusinessBySlug(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .eq("owner_id", user.id)
    .single();

  return business;
}

export async function updateBusiness(id: string, data: {
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
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  // Verificar propiedad
  const { data: business } = await supabase
    .from("businesses")
    .select("name, slug, owner_id")
    .eq("id", id)
    .single();

  if (!business || business.owner_id !== user.id) {
    return { error: "No tienes permiso para editar este negocio." };
  }

  // Verificar si el nombre cambió para actualizar el slug
  let newSlug = business.slug;
  if (data.name.trim() !== business.name.trim()) {
    console.log(`[updateBusiness] El nombre cambió de "${business.name}" a "${data.name}". Generando nuevo slug...`);
    newSlug = await generateUniqueSlug(data.name, supabase, id);
    console.log(`[updateBusiness] Nuevo slug generado: ${newSlug}`);
  }
  
  const { error } = await supabase
    .from("businesses")
    .update({
      name: data.name,
      slug: newSlug,
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
    })
    .eq("id", id);

  if (error) {
    console.error("[updateBusiness] Error actualizando negocio:", error);
    return { error: error.message };
  }

  // Revalidar todas las rutas posibles que usen este negocio
  revalidatePath(ROUTES.dashboard);
  revalidatePath(`/dashboard/businesses/${business.slug}`);
  revalidatePath(`/${business.slug}`);
  
  // Si el slug cambió, también revalidamos la nueva ruta
  if (newSlug !== business.slug) {
    console.log(`[updateBusiness] Slug actualizado de ${business.slug} a ${newSlug}. Revalidando nuevas rutas.`);
    revalidatePath(`/dashboard/businesses/${newSlug}`);
    revalidatePath(`/${newSlug}`);
  }

  return { success: true, slug: newSlug };
}

export async function getBusinessCustomers(slug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  // 1. Verify business ownership
  const { data: business } = await supabase
    .from("businesses")
    .select("id, owner_id")
    .eq("slug", slug)
    .single();

  if (!business || business.owner_id !== user.id) {
    return null;
  }

  // 2. Fetch from our new view (business_customers_view)
  // Which already has the joins for names, emails, and redemption counts.
  const { data: customers, error } = await supabase
    .from("business_customers_view")
    .select("*")
    .eq("business_id", business.id)
    .order("last_visit", { ascending: false });

  if (error) {
    console.error("Error fetching customers from view:", error);
    return null;
  }

  return customers;
}
