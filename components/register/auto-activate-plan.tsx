"use client";

import { useEffect, useState } from "react";
import { activatePlan } from "@/app/actions/plans";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { DS } from "@/lib/constants";

interface AutoActivatePlanProps {
  planId: string;
}

export function AutoActivatePlan({ planId }: AutoActivatePlanProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performActivation = async () => {
      try {
        const result = await activatePlan(planId);
        if (result.success) {
          router.push("/dashboard");
          router.refresh();
        } else {
          setError(result.error || "No se pudo activar el plan automáticamente.");
        }
      } catch (e) {
        setError("Ocurrió un error inesperado al activar tu plan.");
        console.error("Auto-activation error:", e);
      }
    };

    performActivation();
  }, [planId, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 px-4 text-center">
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-bold max-w-md">
          {error}
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="text-primary font-bold hover:underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
        <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
      </div>
      <div className="text-center space-y-2 relative z-10">
        <h2 className={`text-2xl ${DS.typography.headingMd} text-slate-900`}>
          Configurando tu <span className={DS.gradient.primaryText}>negocio</span>
        </h2>
        <p className="text-slate-500 font-medium animate-pulse">
          Estamos activando tu plan gratuito, un momento...
        </p>
      </div>
    </div>
  );
}
