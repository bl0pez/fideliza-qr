"use server";

import { createClient } from "@/utils/supabase/server";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { getSiteUrl } from "@/lib/constants";
import { cache } from "react";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
});

/**
 * Obtiene el perfil del usuario actual mediante una Server Action controlada.
 * Se asume que el perfil existe previamente (vía trigger u otro mecanismo).
 */
export const getProfile = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return profile;
});

export async function signInWithGoogle(nextUrl: string) {
  const supabase = await createClient();
  const origin = (await headers()).get('origin') || getSiteUrl();
  const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl,
    },
  });

  if (error) {
    throw error;
  }

  if (data.url) {
    redirect(data.url);
  }
}

export async function signInWithEmail(email: string, nextUrl: string) {
  const supabase = await createClient();
  const origin = (await headers()).get('origin') || getSiteUrl();
  const callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(nextUrl)}`;

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: callbackUrl,
    },
  });

  if (error) {
    throw error;
  }

  return { success: true, message: "Revisa tu bandeja de entrada para el enlace de inicio de sesión." };
}
