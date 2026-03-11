-- 1. Actualizar la vista para que funcione con los permisos del usuario que la consulta (Seguridad)
-- Esto previene el warning de Supabase ("Data is publicly accessible via API as this is a Security definer view")
ALTER VIEW public.business_customers_view SET (security_invoker = on);
