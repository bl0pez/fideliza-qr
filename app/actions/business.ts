"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import slugify from "slugify";
import { DEFAULT_PLAN_ID, BUSINESS_INITIAL_REWARDS, ROUTES, PLAN_DEFAULTS } from "@/lib/constants";

export async function createBusiness(data: {
  name: string;
  type: string;
  image_url: string;
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

  // Generar un slug único basado en el nombre
  const baseSlug = slugify(data.name, { lower: true, strict: true });
  let uniqueSlug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    const { data: existing } = await supabase
      .from("businesses")
      .select("slug")
      .eq("slug", uniqueSlug)
      .maybeSingle();
    
    if (existing) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    } else {
      isUnique = true;
    }
  }

  // Insertar en la base de datos de manera segura
  const { error } = await supabase.from("businesses").insert({
    name: data.name,
    type: data.type,
    image_url: data.image_url,
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

  // Purgar la caché de la página del dashboard para que muestre el nuevo dato inmediatamente
  revalidatePath(ROUTES.dashboard);

  return { success: true };
}
