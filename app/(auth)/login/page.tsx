"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

// Definimos el esquema de validación con Yup, acorde a la regla del usuario
const loginSchema = yup.object().shape({
  email: yup.string().email("Correo inválido").required("El correo es requerido"),
});

type LoginFormValues = yup.InferType<typeof loginSchema>;

export default function LoginPage() {
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setMessage(null);
    try {
      // Magic link sin contraseña para simplificar u otro método
      const { error } = await supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Revisa tu bandeja de entrada para el enlace de inicio de sesión.' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error al enviar el correo.';
      setMessage({ type: 'error', text: errorMessage });
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error con Google Auth.';
      setMessage({ type: 'error', text: errorMessage });
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 flex justify-center">
        <h2 className="text-3xl font-extrabold text-primary flex items-center gap-2">
           <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {APP_NAME}
        </h2>
      </div>

      <Card className="border-border shadow-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Bienvenido de nuevo</CardTitle>
          <CardDescription>
            Inicia sesión o regístrate para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 py-6 text-foreground border-border hover:bg-secondary/50"
            onClick={handleGoogleLogin}
            disabled={googleLoading || isSubmitting}
          >
            {googleLoading ? (
               <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.15v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.15C1.43 8.55 1 10.22 1 12s.43 3.45 1.15 4.93l3.69-2.84Z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.15 7.07l3.69 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335"/>
                </svg>
            )}
            <span className="font-semibold">Continuar con Google</span>
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                O continua con correo
              </span>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary'}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@ejemplo.com"
                className={`col-span-3 ${errors.email ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                {...register("email")}
                disabled={isSubmitting || googleLoading}
              />
              {errors.email && (
                <p className="text-xs text-destructive font-medium">{errors.email.message}</p>
              )}
            </div>
            <Button className="w-full py-6 font-semibold" type="submit" disabled={isSubmitting || googleLoading}>
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isSubmitting ? "Enviando enlace..." : "Iniciar sesión por correo"}
            </Button>
          </form>
          
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground pb-6">
          Al iniciar sesión, aceptas nuestros Términos y Política de Privacidad.
        </CardFooter>
      </Card>
    </>
  );
}
