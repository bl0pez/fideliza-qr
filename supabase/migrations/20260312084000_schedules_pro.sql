-- Habilitar extensión para índices de exclusión y tipos de rango
CREATE EXTENSION IF NOT EXISTS btree_gist;

-- Tabla de Horarios Semanales (Múltiples turnos por día soportados)
CREATE TABLE IF NOT EXISTS public.business_schedules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  business_id text NOT NULL, -- FK a la tabla businesses
  day_of_week integer NOT NULL, -- 0 (Dom) a 6 (Sab)
  hour_range int4range NOT NULL, -- Minutos desde medianoche (0-1439)
  
  CONSTRAINT business_schedules_pkey PRIMARY KEY (id),
  CONSTRAINT business_schedules_business_id_fkey 
    FOREIGN KEY (business_id) REFERENCES public.businesses (id) ON DELETE CASCADE,
  CONSTRAINT day_range_check CHECK (day_of_week BETWEEN 0 AND 6),
  
  -- Restricción de Exclusión: Impide solapamientos de horarios para el mismo negocio/día
  CONSTRAINT no_overlapping_hours EXCLUDE USING gist (
    business_id WITH =,
    day_of_week WITH =,
    hour_range WITH &&
  )
);

-- Columna para casos especiales (Feriados, cierres temporales)
ALTER TABLE public.businesses 
ADD COLUMN IF NOT EXISTS schedule_exceptions jsonb DEFAULT '[]'::jsonb;

-- Activar RLS
ALTER TABLE public.business_schedules ENABLE ROW LEVEL SECURITY;

-- Política de Lectura: Cualquiera puede ver los horarios
CREATE POLICY "Horarios visibles para todos" 
ON public.business_schedules FOR SELECT 
USING (true);

-- Política de Escritura: Solo el dueño del negocio (owner_id en tabla businesses)
CREATE POLICY "Solo dueños gestionan sus horarios" 
ON public.business_schedules FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.businesses 
    WHERE businesses.id = business_schedules.business_id 
    AND businesses.owner_id = auth.uid()
  )
);
