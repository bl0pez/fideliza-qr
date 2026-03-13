import { SupabaseClient } from "@supabase/supabase-js";
import slugify from "slugify";

/**
 * Generates a unique slug for a business.
 * 
 * @param name The name of the business to slugify.
 * @param supabase The Supabase client.
 * @param excludeId Optional business ID to exclude from uniqueness check (useful for updates).
 * @returns A unique slug string.
 */
export async function generateUniqueSlug(
  name: string,
  supabase: SupabaseClient,
  excludeId?: string
): Promise<string> {
  const baseSlug = slugify(name, { lower: true, strict: true });
  let uniqueSlug = baseSlug;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    let query = supabase
      .from("businesses")
      .select("id")
      .eq("slug", uniqueSlug);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data: existing } = await query.maybeSingle();

    if (existing) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    } else {
      isUnique = true;
    }
  }

  return uniqueSlug;
}
