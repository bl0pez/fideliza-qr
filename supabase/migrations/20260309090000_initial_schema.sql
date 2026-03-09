-- 1. Create Custom Enum Types
CREATE TYPE public.user_role AS ENUM ('client', 'business_owner', 'admin');
CREATE TYPE public.subscription_status AS ENUM ('active', 'past_due', 'canceled', 'incomplete');
CREATE TYPE public.payment_provider AS ENUM ('mercadopago', 'stripe');

-- 2. Create Tables

-- Plans
CREATE TABLE public.plans (
    id text PRIMARY KEY,
    name text NOT NULL,
    max_branches integer NOT NULL,
    max_scans_monthly integer NOT NULL,
    max_card_types integer NOT NULL,
    custom_qr boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now(),
    price integer,
    features text[] DEFAULT '{}'::text[],
    is_popular boolean DEFAULT false,
    sort_order integer DEFAULT 0
);

-- Countries
CREATE TABLE public.countries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    code text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now()
);

-- Cities
CREATE TABLE public.cities (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    created_at timestamp with time zone DEFAULT now(),
    country_id uuid REFERENCES public.countries(id) ON DELETE CASCADE
);

-- Categories
CREATE TABLE public.categories (
    id text PRIMARY KEY,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    icon_name text DEFAULT 'Tag'
);

-- Profiles (Linked to auth.users)
CREATE TABLE public.profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role public.user_role DEFAULT 'client'::public.user_role,
    created_at timestamp with time zone DEFAULT now(),
    full_name text
);

-- Businesses
CREATE TABLE public.businesses (
    id text PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    type text NOT NULL,
    image_url text NOT NULL,
    rewards_available integer DEFAULT 0,
    category_id text REFERENCES public.categories(id),
    created_at timestamp with time zone DEFAULT now(),
    owner_id uuid REFERENCES public.profiles(id),
    instagram_url text,
    tiktok_url text,
    whatsapp_url text,
    slug text UNIQUE,
    plan_id text REFERENCES public.plans(id) DEFAULT 'basic',
    scans_this_month integer DEFAULT 0,
    city text,
    address text,
    city_id uuid REFERENCES public.cities(id),
    country_id uuid REFERENCES public.countries(id),
    status text NOT NULL DEFAULT 'active'
);

-- Business Customers
CREATE TABLE public.business_customers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id text REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    scans_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Rewards
CREATE TABLE public.rewards (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id text REFERENCES public.businesses(id) ON DELETE CASCADE,
    title text NOT NULL,
    description text,
    requirements text,
    scans_required integer NOT NULL CHECK (scans_required > 0),
    expires_at timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    max_redemptions_per_user integer
);

-- Reward Progress
CREATE TABLE public.reward_progress (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id text REFERENCES public.businesses(id) ON DELETE CASCADE,
    reward_id uuid REFERENCES public.rewards(id) ON DELETE CASCADE,
    scans_count integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Reward Redemptions
CREATE TABLE public.reward_redemptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id text REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    reward_id uuid REFERENCES public.rewards(id) ON DELETE CASCADE,
    scans_cost integer NOT NULL CHECK (scans_cost > 0),
    status text DEFAULT 'completed' CHECK (status = ANY (ARRAY['pending'::text, 'completed'::text, 'cancelled'::text])),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Owner Subscriptions
CREATE TABLE public.owner_subscriptions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id text REFERENCES public.plans(id),
    status public.subscription_status DEFAULT 'incomplete'::public.subscription_status,
    provider public.payment_provider,
    provider_subscription_id text UNIQUE,
    cancel_at_period_end boolean DEFAULT false,
    current_period_start timestamp with time zone,
    current_period_end timestamp with time zone,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 3. Functions
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, role, full_name)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'role', 'client'), 
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$function$;

-- 4. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. Enable RLS
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.owner_subscriptions ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Plans
CREATE POLICY "Allow public read access for plans" ON public.plans FOR SELECT USING (true);

-- Countries
-- (No policies in original, assuming same as cities?)
-- Cities
-- (No policies in original)

-- Categories
CREATE POLICY "Allow public read access for categories" ON public.categories FOR SELECT USING (true);

-- Profiles
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Businesses
CREATE POLICY "Allow public read access for businesses" ON public.businesses FOR SELECT USING (true);
CREATE POLICY "Allow owners to insert their businesses" ON public.businesses FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Allow owners to update their businesses" ON public.businesses FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Allow owners to delete their businesses" ON public.businesses FOR DELETE USING (auth.uid() = owner_id);

-- Business Customers
CREATE POLICY "Business owners can view their customers" ON public.business_customers FOR SELECT USING (EXISTS (SELECT 1 FROM businesses b WHERE b.id = business_customers.business_id AND b.owner_id = auth.uid()));
CREATE POLICY "Business owners can update customer scans" ON public.business_customers FOR UPDATE USING (EXISTS (SELECT 1 FROM businesses b WHERE b.id = business_customers.business_id AND b.owner_id = auth.uid()));
CREATE POLICY "Users can insert their own subscriptions" ON public.business_customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own subscriptions" ON public.business_customers FOR SELECT USING (auth.uid() = user_id);

-- Rewards
CREATE POLICY "Anyone can view active rewards" ON public.rewards FOR SELECT USING (is_active = true);
CREATE POLICY "Business owners can view all their rewards" ON public.rewards FOR SELECT USING (EXISTS (SELECT 1 FROM businesses b WHERE b.id = rewards.business_id AND b.owner_id = auth.uid()));
CREATE POLICY "Business owners can insert rewards" ON public.rewards FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM businesses b WHERE b.id = rewards.business_id AND b.owner_id = auth.uid()));
CREATE POLICY "Business owners can update their rewards" ON public.rewards FOR UPDATE USING (EXISTS (SELECT 1 FROM businesses b WHERE b.id = rewards.business_id AND b.owner_id = auth.uid()));
CREATE POLICY "Business owners can delete their rewards" ON public.rewards FOR DELETE USING (EXISTS (SELECT 1 FROM businesses b WHERE b.id = rewards.business_id AND b.owner_id = auth.uid()));

-- Reward Progress
CREATE POLICY "Users can view their own progress" ON public.reward_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own progress" ON public.reward_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Business owners can view their customers progress" ON public.reward_progress FOR SELECT USING (EXISTS (SELECT 1 FROM businesses b WHERE b.id = reward_progress.business_id AND b.owner_id = auth.uid()));
CREATE POLICY "Business owners can insert customer progress" ON public.reward_progress FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM businesses b WHERE b.id = reward_progress.business_id AND b.owner_id = auth.uid()));
CREATE POLICY "Business owners can update their customers progress" ON public.reward_progress FOR UPDATE USING (EXISTS (SELECT 1 FROM businesses b WHERE b.id = reward_progress.business_id AND b.owner_id = auth.uid()));

-- Reward Redemptions
CREATE POLICY "Users can view their own redemptions" ON public.reward_redemptions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Business owners can view redemptions for their business" ON public.reward_redemptions FOR SELECT USING (EXISTS (SELECT 1 FROM businesses b WHERE b.id = reward_redemptions.business_id AND b.owner_id = auth.uid()));
CREATE POLICY "Business owners can insert redemptions" ON public.reward_redemptions FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM businesses b WHERE b.id = reward_redemptions.business_id AND b.owner_id = auth.uid()));

-- Owner Subscriptions
CREATE POLICY "Owners can view own subscriptions" ON public.owner_subscriptions FOR SELECT USING (auth.uid() = owner_id);
