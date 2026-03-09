import { createClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con privilegios administrativos (SERVICE_ROLE).
 * Solo puede ser usado en Server Components o Server Actions.
 * SE SALTA LAS POLÍTICAS RLS. Úsalo con extrema precaución.
 */
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Faltan las variables de entorno de Supabase para el cliente Admin.");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};
