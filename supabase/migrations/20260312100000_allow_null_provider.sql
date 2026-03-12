ALTER-- Allow nullable columns in owner_subscriptions (needed for free plans)
ALTER TABLE public.owner_subscriptions ALTER COLUMN provider DROP NOT NULL;
ALTER TABLE public.owner_subscriptions ALTER COLUMN provider_subscription_id DROP NOT NULL;
ALTER TABLE public.owner_subscriptions ALTER COLUMN current_period_start DROP NOT NULL;
_subscription_id DROP NOT NULL;