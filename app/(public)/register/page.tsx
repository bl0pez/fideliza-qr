import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/actions/auth";
import { createSubscriptionCheckout } from "@/app/actions/billing";
import { PricingSection } from "@/components/register/pricing-section";
import { PLAN_IDS, type PlanId } from "@/lib/constants";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface RegisterPageProps {
  searchParams: Promise<{ plan?: string; error?: string }>;
}

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  const { plan, error } = await searchParams;

  // Si hay un plan en la URL, ejecutar el auth guard + checkout
  if (plan) {
    const user = await getCurrentUser();

    // Sin sesión → login con next param para volver aquí tras autenticar
    if (!user) {
      redirect(`/login?next=/register?plan=${plan}`);
    }

    // Plan básico (gratis) → dashboard directo
    if (plan === PLAN_IDS.basic) {
      redirect("/dashboard");
    }

    // Validar que el planId sea uno que conocemos
    const validPlanIds = Object.values(PLAN_IDS) as string[];
    if (!validPlanIds.includes(plan)) {
      redirect("/register");
    }

    // Crear checkout en MercadoPago y redirigir
    const result = await createSubscriptionCheckout(plan as PlanId);

    if (result.success && result.checkoutUrl) {
      redirect(result.checkoutUrl);
    }

    // Si falla el checkout, volver a la selección de planes
    redirect("/register?error=checkout_failed");
  }

  // Sin plan → mostrar selección de planes
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

      {error === "checkout_failed" && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-bold text-sm">
            Hubo un problema al iniciar el proceso de pago. Por favor intenta de nuevo.
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
