"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { BusinessSchedule, ScheduleException } from "@/lib/utils/schedule-helpers";
import { ROUTES } from "@/lib/constants";

export async function getBusinessSchedules(businessId: string) {
  const supabase = await createClient();
  
  const { data: schedules, error } = await supabase
    .from("business_schedules")
    .select("*")
    .eq("business_id", businessId)
    .order("day_of_week", { ascending: true });

  if (error) {
    console.error("Error fetching schedules:", error);
    return [];
  }

  return schedules as BusinessSchedule[];
}

export async function upsertBusinessSchedules(
  businessId: string,
  schedules: Omit<BusinessSchedule, 'id' | 'business_id'>[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  // Verify ownership
  const { data: business } = await supabase
    .from("businesses")
    .select("owner_id, slug")
    .eq("id", businessId)
    .single();

  if (!business || business.owner_id !== user.id) {
    return { error: "No tienes permiso para gestionar estos horarios." };
  }

  // 1. Delete existing schedules for this business
  const { error: deleteError } = await supabase
    .from("business_schedules")
    .delete()
    .eq("business_id", businessId);

  if (deleteError) {
    return { error: `Error limpiando horarios anteriores: ${deleteError.message}` };
  }

  // 2. Insert new schedules
  const schedulesToInsert = schedules.map(s => ({
    ...s,
    business_id: businessId
  }));

  const { error: insertError } = await supabase
    .from("business_schedules")
    .insert(schedulesToInsert);

  if (insertError) {
    return { error: `Error guardando nuevos horarios: ${insertError.message}` };
  }

  revalidatePath(ROUTES.dashboard);
  revalidatePath(`/dashboard/businesses/${business.slug}`);
  revalidatePath(`/${business.slug}`);

  return { success: true };
}

export async function updateBusinessExceptions(
  businessId: string,
  exceptions: ScheduleException[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "No autorizado" };
  }

  // Verify ownership
  const { data: business } = await supabase
    .from("businesses")
    .select("owner_id, slug")
    .eq("id", businessId)
    .single();

  if (!business || business.owner_id !== user.id) {
    return { error: "No tienes permiso para gestionar excepciones." };
  }

  const { error: updateError } = await supabase
    .from("businesses")
    .update({ schedule_exceptions: exceptions })
    .eq("id", businessId);

  if (updateError) {
    return { error: `Error guardando excepciones: ${updateError.message}` };
  }

  revalidatePath(ROUTES.dashboard);
  revalidatePath(`/dashboard/businesses/${business.slug}`);
  revalidatePath(`/${business.slug}`);

  return { success: true };
}
