-- Tabla de Metadatos de Planes
CREATE TABLE IF NOT EXISTS public.plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    max_branches INTEGER NOT NULL,
    max_scans_monthly INTEGER NOT NULL, -- -1 para ilimitado
    max_card_types INTEGER NOT NULL,
    custom_qr BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Insertar Configuración de Planes (Basado en el diseño final)
INSERT INTO public.plans (id, name, max_branches, max_scans_monthly, max_card_types, custom_qr)
VALUES 
    ('basic', 'Básico', 1, 50, 1, FALSE),
    ('pro', 'Pro', 2, -1, 10, TRUE),
    ('business', 'Business', 5, -1, 50, TRUE)
ON CONFLICT (id) DO UPDATE SET
    max_branches = EXCLUDED.max_branches,
    max_scans_monthly = EXCLUDED.max_scans_monthly,
    max_card_types = EXCLUDED.max_card_types,
    custom_qr = EXCLUDED.custom_qr;

-- Actualizar Tabla de Negocios
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS plan_id TEXT REFERENCES public.plans(id) DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS scans_this_month INTEGER DEFAULT 0;

-- Comentario para el desarrollador:
-- Necesitaremos un cron job o function para resetear scans_this_month cada mes.
