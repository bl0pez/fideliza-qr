import { Search, UserPlus, Gift, ArrowRight } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/app/actions/auth";

export async function HowItWorks() {
  const user = await getCurrentUser();

  return (
    <section className="py-20 px-4 bg-slate-50/50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
            <span>Guía rápida</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-none">Cómo funciona</h2>
          <p className="text-slate-500 text-lg max-w-lg mx-auto">Conoce el proceso simple para empezar a ganar beneficios hoy mismo.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="group space-y-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mx-auto md:mx-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <Search className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-xl text-slate-900">1. Busca</h3>
              <p className="text-slate-600 leading-relaxed">Encuentra tus lugares locales favoritos en nuestro mapa o buscador.</p>
            </div>
          </div>

          <div className="group space-y-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mx-auto md:mx-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <UserPlus className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-xl text-slate-900">2. Únete</h3>
              <p className="text-slate-600 leading-relaxed">Suscríbete al programa de fidelización con un solo toque desde tu móvil.</p>
            </div>
          </div>

          <div className="group space-y-6 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mx-auto md:mx-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <Gift className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-2">
              <h3 className="font-black text-xl text-slate-900">3. Gana</h3>
              <p className="text-slate-600 leading-relaxed">Escanea tu código en cada visita y canjea tus puntos por premios reales.</p>
            </div>
          </div>
        </div>

        {!user && (
          <div className="mt-16 flex justify-center">
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-black text-base shadow-xl shadow-primary/20 transition-all duration-300"
            >
              Crear mi cuenta gratis
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
