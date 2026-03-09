"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { APP_NAME, DS } from "@/lib/constants";
import { useSearchParams } from "next/navigation";

import { signInWithGoogle } from "@/app/actions/auth";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") ?? "/dashboard";

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setMessage(null);
    try {
      await signInWithGoogle(nextUrl);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Ocurrió un error con Google Auth.';
      setMessage({ type: 'error', text: errorMessage });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      {/* Background Glow */}
      <div className={`absolute top-0 left-1/4 w-96 h-96 -z-10 ${DS.glow.light}`} />
      <div className={`absolute bottom-0 right-1/4 w-96 h-96 -z-10 ${DS.glow.accent}`} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4">
           <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h1 className={`text-4xl ${DS.typography.heading}`}>
            {APP_NAME}
          </h1>
        </div>
        
        <div className="flex items-center gap-4 mb-2">
          <div className={DS.typography.sectionLabelLine} />
          <span className={DS.typography.sectionLabel}>Acceso Seguro</span>
          <div className={DS.typography.sectionLabelLine} />
        </div>
      </div>

      <Card className={`sm:mx-auto sm:w-full sm:max-w-md border-border shadow-2xl ${DS.card.rounded} ${DS.glass.card}`}>
        <CardHeader className="space-y-1 text-center items-center">
          <CardTitle className={`text-3xl ${DS.typography.headingMd}`}>
            Bienvenido de <span className={DS.gradient.primaryText}>nuevo</span>
          </CardTitle>
          <CardDescription className="text-base">
            Inicia sesión o regístrate para continuar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2 py-6 text-foreground border-border hover:bg-secondary/50"
            onClick={handleGoogleLogin}
            disabled={googleLoading}
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

          <LoginForm nextUrl={nextUrl} />

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-destructive/15 text-destructive' : 'bg-primary/15 text-primary'}`}>
              {message.text}
            </div>
          )}

          
          
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center sm:mx-auto sm:w-full sm:max-w-md">
        <p className="text-xs text-muted-foreground">
          Al continuar, aceptas nuestros <span className="underline cursor-pointer hover:text-primary transition-colors">Términos</span> y <span className="underline cursor-pointer hover:text-primary transition-colors">Política de Privacidad</span>.
        </p>
      </div>
    </div>
  );
}
