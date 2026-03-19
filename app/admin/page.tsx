import { PlusCircle, Store, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import { getProfile } from "@/app/actions/auth";
import { DS } from "@/lib/constants";

export default async function AdminDashboardPage() {
  const profile = await getProfile();

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Heading Badge Pattern */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-4">
          <div className={DS.typography.sectionLabelLine} />
          <span className={DS.typography.sectionLabel}>Panel Maestro</span>
          <div className={DS.typography.sectionLabelLine} />
        </div>
        <h1 className={`text-4xl md:text-5xl ${DS.typography.heading} text-slate-900 dark:text-white`}>
          Bienvenido, <span className={DS.gradient.primaryText}>{profile?.full_name?.split(' ')[0] || "Admin"}</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Gestiona la infraestructura global de Fidelilocal y despliega nuevos comercios <span className="italic font-bold">sin límites</span>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[
          { title: "Locales Totales", icon: Store, value: "--" },
          { title: "Usuarios Activos", icon: Users, value: "--" },
          { title: "Escaneos Mes", icon: BarChart3, value: "--" },
        ].map((stat, i) => (
          <div 
            key={i}
            className={`${DS.card.rounded} ${DS.card.border} ${DS.glass.card} p-6 transition-all hover:border-primary/30 group relative overflow-hidden`}
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${DS.glow.accent} opacity-20 group-hover:opacity-40 transition-opacity`} />
            <div className="flex flex-row items-center justify-between mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                {stat.title}
              </span>
              <stat.icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors hover:scale-110 duration-300" />
            </div>
            <div className={`text-3xl ${DS.typography.headingMd} text-slate-900 dark:text-white`}>
              {stat.value}
            </div>
            <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mt-2">
              Sincronizando...
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 pt-6">
        <div className="flex items-center gap-3">
          <div className="h-px w-8 bg-primary/20" />
          <h3 className="text-sm font-black tracking-widest uppercase text-primary">
            Acciones de Despliegue
          </h3>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
           <Link href="/admin/shops/new" className="block">
            <button className={`w-full h-32 ${DS.card.rounded} ${DS.gradient.primary} p-px group transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary/20 active:scale-95`}>
              <div className={`w-full h-full ${DS.card.rounded} bg-white dark:bg-slate-900 flex flex-col items-center justify-center gap-2 group-hover:bg-transparent transition-colors`}>
                <PlusCircle className="h-8 w-8 text-primary group-hover:text-white transition-colors" />
                <span className={`text-lg font-black tracking-tight group-hover:text-white transition-colors ${!DS.gradient.primaryText.includes('text-white') ? DS.gradient.primaryText : ''}`}>
                  Crear Local Infinito
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-white/70 transition-colors">
                  Sin restricciones de plan
                </span>
              </div>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

