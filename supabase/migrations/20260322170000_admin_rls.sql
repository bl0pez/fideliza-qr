-- Permitir a los administradores actualizar cualquier negocio
-- Esto es necesario porque usamos el cliente estándar de Supabase que respeta RLS
DROP POLICY IF EXISTS "Allow admins to update businesses" ON public.businesses;
CREATE POLICY "Allow admins to update businesses" 
ON public.businesses 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Permitir a los administradores insertar negocios
DROP POLICY IF EXISTS "Allow admins to insert businesses" ON public.businesses;
CREATE POLICY "Allow admins to insert businesses" 
ON public.businesses 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

-- Permitir a los administradores eliminar negocios
DROP POLICY IF EXISTS "Allow admins to delete businesses" ON public.businesses;
CREATE POLICY "Allow admins to delete businesses" 
ON public.businesses 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
