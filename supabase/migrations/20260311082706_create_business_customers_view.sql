-- 1. Create a view for easy access to customer aggregated data for each business
-- This joins business_customers with profiles to get the customer names/emails
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
    ) as total_redemptions
FROM 
    public.business_customers bc
JOIN 
    public.profiles p ON bc.user_id = p.id
JOIN 
    auth.users u ON bc.user_id = u.id;

-- 2. Grant permissions to the view
GRANT SELECT ON public.business_customers_view TO authenticated;
GRANT SELECT ON public.business_customers_view TO service_role;

-- 3. We cannot attach RLS to a View directly in Postgres (unless using security definer functions).
-- But since it's querying underlying tables (business_customers, profiles) that ALREADY have RLS, 
-- the query will automatically be filtered by those tables' RLS policies if queried by an authenticated user.
