import { Suspense } from "react";
import { PricingSection } from "@/components/register/pricing-section";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface RegisterPageProps {
  searchParams: Promise<{ plan?: string; error?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { error } = await searchParams;

  // No hacemos nada automático aquí para evitar errores de renderizado.
  // Todo se maneja a través de PricingSection con Server Actions para ser seguro.

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 pt-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-bold text-sm uppercase tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>

      {error === "selection_failed" && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-bold text-sm">
            Hubo un problema al procesar tu selección. Por favor intenta de nuevo.
          </div>
        </div>
      )}

      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        }
      >
        <PricingSection />
      </Suspense>
    </main>
  );
}
