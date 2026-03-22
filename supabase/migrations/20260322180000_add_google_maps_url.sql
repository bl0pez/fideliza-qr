-- Añadir columna para el enlace de Google Maps
-- Esto permite que los negocios itinerantes (carritos) puedan compartir su ubicación exacta
ALTER TABLE public.businesses ADD COLUMN IF NOT EXISTS google_maps_url text;

-- Comentario para documentación
COMMENT ON COLUMN public.businesses.google_maps_url IS 'Enlace directo a Google Maps para ubicación fija o dinámica (útil para carritos de comida).';
