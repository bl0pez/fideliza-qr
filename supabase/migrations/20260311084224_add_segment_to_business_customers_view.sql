-- 1. Actualizar la vista para incluir la nueva columna 'segment'
CREATE OR REPLACE VIEW public.business_customers_view AS
SELECT 
    bc.id,
    bc.business_id,
    bc.user_id,
    bc.scans_count,
    bc.updated_at as last_visit,
    bc.created_at as first_visit,
    p.full_name as customer_name,
    p.role as customer_role,
    u.email as customer_email,
    -- Calculate total redemptions for this business and user
    (
        SELECT COUNT(*)
        FROM public.reward_redemptions rr
        WHERE rr.business_id = bc.business_id AND rr.user_id = bc.user_id AND rr.status = 'completed'
    ) as total_redemptions,
    -- Segmentación Inteligente (CRM Phase 2) calculada al vuelo
    CASE 
        WHEN bc.scans_count >= 10 THEN 'vip'
        WHEN EXTRACT(DAY FROM (now() - bc.updated_at)) <= 7 THEN 'frecuente'
        WHEN EXTRACT(DAY FROM (now() - bc.updated_at)) > 60 THEN 'perdido'
        WHEN EXTRACT(DAY FROM (now() - bc.updated_at)) > 30 THEN 'riesgo'
        ELSE 'nuevo'
    END as segment
FROM 
    public.business_customers bc
JOIN 
    public.profiles p ON bc.user_id = p.id
JOIN 
    auth.users u ON bc.user_id = u.id;

-- 2. Asegurarnos que los permisos perduren tras reemplazar la vista
GRANT SELECT ON public.business_customers_view TO authenticated;
GRANT SELECT ON public.business_customers_view TO service_role;
ALTER VIEW public.business_customers_view SET (security_invoker = on);
