"use server";

import { createClient } from "@/utils/supabase/server";
import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { getSiteUrl } from "@/lib/constants";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return null;
  }
  
  return user;
}

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
