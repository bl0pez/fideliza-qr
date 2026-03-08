"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

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
    rewards_available: 0, // Inicia siempre en 0
    owner_id: user.id, // Obtenido directo desde la cookie de sesión por seguridad
    slug: uniqueSlug, // Guardamos el slug único
  });

  if (error) {
    return { error: error.message };
  }

  // Purgar la caché de la página del dashboard para que muestre el nuevo dato inmediatamente
  revalidatePath("/dashboard");

  return { success: true };
}
