import { Suspense } from "react";
import { DS } from "@/lib/constants";
import { LoginClient } from "@/components/auth/login-client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/brand/logo";

export default function LoginPage() {
  return (
    <div className="relative min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      {/* Background Glow */}
      <div className={`absolute top-0 left-1/4 w-96 h-96 -z-10 ${DS.glow.light}`} />
      <div className={`absolute bottom-0 right-1/4 w-96 h-96 -z-10 ${DS.glow.accent}`} />

      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-8 flex flex-col items-center">
        <div className="flex items-center gap-3 mb-4">
          <Logo size={48} />
        </div>
        
        <div className="flex items-center gap-4 mb-2">
          <div className={DS.typography.sectionLabelLine} />
          <span className={DS.typography.sectionLabel}>Acceso Seguro</span>
          <div className={DS.typography.sectionLabelLine} />
        </div>
      </div>

      <Suspense fallback={<LoginFallback />}>
        <LoginClient />
      </Suspense>
      
      <div className="mt-8 text-center sm:mx-auto sm:w-full sm:max-w-md">
        <p className="text-xs text-muted-foreground">
          Al continuar, aceptas nuestros <span className="underline cursor-pointer hover:text-primary transition-colors">Términos</span> y <span className="underline cursor-pointer hover:text-primary transition-colors">Política de Privacidad</span>.
        </p>
      </div>
    </div>
  );
}

function LoginFallback() {
  return (
    <Card className={`sm:mx-auto sm:w-full sm:max-w-md border-border shadow-2xl ${DS.card.rounded} ${DS.glass.card}`}>
      <CardHeader className="space-y-1 text-center items-center">
        <CardTitle className={`text-3xl ${DS.typography.headingMd}`}>
          Iniciando <span className={DS.gradient.primaryText}>sesión</span>
        </CardTitle>
        <CardDescription className="text-base">
          Cargando configuración de autenticación...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-10">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </CardContent>
    </Card>
  );
}
