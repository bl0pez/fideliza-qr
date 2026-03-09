import { DS, APP_NAME } from "@/lib/constants";
import { 
  UserCircle2, 
  Store, 
  Search, 
  QrCode, 
  Ticket, 
  Zap, 
  Smartphone, 
  BarChart3, 
  CheckCircle2,
  ArrowRight,
  LucideIcon
} from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Ambient Glows */}
      <div className={`absolute top-0 right-0 w-[600px] h-[600px] ${DS.glow.light} opacity-30 -z-10`} />
      <div className={`absolute bottom-0 left-0 w-[500px] h-[500px] ${DS.glow.accent} opacity-20 -z-10`} />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center mb-24">
          <div className="flex items-center gap-4 mb-6">
            <div className={DS.typography.sectionLabelLine} />
            <span className={DS.typography.sectionLabel}>Guía del Usuario</span>
            <div className={DS.typography.sectionLabelLine} />
          </div>
          <h1 className={`text-5xl md:text-8xl ${DS.typography.heading} mb-8`}>
            ¿Cómo funciona <br />
            <span className={DS.gradient.primaryText}>{APP_NAME}</span>?
          </h1>
          <p className="text-slate-500 text-xl md:text-2xl max-w-2xl font-medium leading-relaxed">
            Eliminamos el papel y digitalizamos la lealtad. Descubre cómo transformar tu negocio o tus compras en segundos.
          </p>
        </div>

        {/* Path Picker (Mobile visual hint) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 relative">
          {/* Vertical Divider for Desktop */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 -translate-x-1/2" />

          {/* For Customers */}
          <div className="space-y-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <UserCircle2 className="w-6 h-6" />
              </div>
              <h2 className={`text-3xl ${DS.typography.headingMd}`}>Para Clientes</h2>
            </div>

            <div className="space-y-12">
              <Step 
                number="01"
                icon={Search}
                title="Descubre Comercios"
                description="Usa nuestro buscador para encontrar tus tiendas favoritas o descubrir nuevos lugares cerca de ti que ofrecen recompensas."
              />
              <Step 
                number="02"
                icon={Smartphone}
                title="Escanea tu QR"
                description="Al pagar, muestra tu código QR personal. El comercio lo escaneará para sumarte puntos inmediatamente, sin papeles."
              />
              <Step 
                number="03"
                icon={Ticket}
                title="Canjea Premios"
                description="Cuando completes tu tarjeta de sellos digital, recibirás una notificación para canjear tu premio en el mismo local."
              />
            </div>
          </div>

          {/* For Businesses */}
          <div className="space-y-16">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500">
                <Store className="w-6 h-6" />
              </div>
              <h2 className={`text-3xl ${DS.typography.headingMd}`}>Para Negocios</h2>
            </div>

            <div className="space-y-12">
              <Step 
                number="01"
                icon={Zap}
                title="Crea tu Perfil"
                description="Regístrate y configura tu oferta en minutos. Define cuántos sellos se necesitan para ganar un premio."
                accent="orange"
              />
              <Step 
                number="02"
                icon={QrCode}
                title="Escanea y Fideliza"
                description="Usa nuestra webapp desde cualquier móvil para escanear a tus clientes. Es rápido, fácil y no requiere hardware caro."
                accent="orange"
              />
              <Step 
                number="03"
                icon={BarChart3}
                title="Analiza y Crece"
                description="Accede a estadísticas en tiempo real sobre tus clientes más leales y el rendimiento de tus promociones."
                accent="orange"
              />
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className={`mt-32 p-12 md:p-20 ${DS.card.rounded} bg-slate-900 overflow-hidden relative group`}>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl text-center md:text-left">
              <h2 className={`text-4xl md:text-5xl text-white ${DS.typography.heading} mb-6`}>
                ¿Listo para <span className={DS.gradient.primaryText}>crecer</span>?
              </h2>
              <p className="text-slate-400 text-lg font-medium mb-8">
                Únete a cientos de comercios que ya están digitalizando su experiencia de cliente. Sin complicaciones técnicas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register" className={`px-8 py-4 ${DS.gradient.primary} text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:scale-105 transition-transform shadow-xl shadow-primary/20`}>
                  Empezar Ahora <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/contact" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
                  Hablar con Soporte
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FeatureBadge label="Sin Papel" />
              <FeatureBadge label="QR Instantáneo" />
              <FeatureBadge label="Analítica Real" />
              <FeatureBadge label="Configuración 5 min" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Step({ number, icon: Icon, title, description, accent = "primary" }: { 
  number: string, 
  icon: LucideIcon, 
  title: string, 
  description: string,
  accent?: "primary" | "orange"
}) {
  const accentClasses = accent === "primary" ? "text-primary bg-primary/10" : "text-orange-500 bg-orange-500/10";
  
  return (
    <div className="flex gap-8 group">
      <div className="flex flex-col items-center">
        <div className={`text-sm font-black ${accent === "primary" ? "text-primary" : "text-orange-500"} mb-4`}>
          {number}
        </div>
        <div className="w-px h-full bg-slate-100 group-last:bg-transparent" />
      </div>
      
      <div className="pb-12 border-b border-slate-50 last:border-0 last:pb-0">
        <div className={`w-14 h-14 ${accentClasses} rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-3">
          {title}
        </h3>
        <p className="text-slate-500 font-medium leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

function FeatureBadge({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
      <CheckCircle2 className="w-5 h-5 text-primary" />
      <span className="text-white text-sm font-black uppercase tracking-widest">{label}</span>
    </div>
  );
}
