"use client";

import { useSearchParams } from "next/navigation";
import { PricingSection } from "@/components/register/pricing-section";
import { RegistrationForm } from "@/components/register/registration-form";
import { Suspense } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

function RegistrationContent() {
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan");

  if (!selectedPlan) {
    return <PricingSection />;
  }

  return (
    <div className="max-w-4xl mx-auto py-20 px-4">
      <Link 
        href="/register" 
        className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors mb-12 font-bold text-sm uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a planes
      </Link>

      <div className="space-y-12">
        <div className="space-y-4">
           <div className="flex items-center gap-3">
             <div className="h-px w-8 bg-primary/20" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Paso 1 de 2</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 leading-none">
             Configura tu <br />
             <span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent italic">negocio</span>
           </h1>
           <p className="text-slate-500 text-lg font-medium max-w-xl">
             Estás a un paso de digitalizar tu fidelización. Cuéntanos sobre tu comercio.
           </p>
        </div>

        <RegistrationForm />
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-white">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      }>
        <RegistrationContent />
      </Suspense>
    </main>
  );
}
