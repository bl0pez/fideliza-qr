import { PlusCircle, Store, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import { getProfile } from "@/app/actions/auth";
import { getAllBusinesses } from "@/app/actions/admin-business";
import { DS } from "@/lib/constants";
import { Edit2, ExternalLink, MapPin, BadgeCheck } from "lucide-react";
import Image from "next/image";
export default async function AdminDashboardPage() {
  const [profile, businesses] = await Promise.all([
    getProfile(),
    getAllBusinesses()
  ]);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Heading Badge Pattern */}
      <div className="flex flex-col items-start gap-4">
        <div className="flex items-center gap-4">
          <div className={DS.typography.sectionLabelLine} />
          <span className={DS.typography.sectionLabel}>Panel Maestro</span>
          <div className={DS.typography.sectionLabelLine} />
        </div>
        <h1 className={`text-5xl md:text-6xl ${DS.typography.heading} text-slate-900 dark:text-white`}>
          Bienvenido, <span className={DS.gradient.primaryText}>{profile?.full_name?.split(' ')[0] || "Admin"}</span>
        </h1>
        <p className="text-muted-foreground text-xl max-w-2xl font-medium italic">
          Gestiona la infraestructura global de Fidelilocal y despliega nuevos comercios <span className="text-primary font-black uppercase">sin límites</span>.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Locales Totales", icon: Store, value: businesses?.length || 0, color: "indigo" },
          { title: "Planes Pro", icon: BadgeCheck, value: businesses?.filter(b => b.plan_id === 'pro').length || 0, color: "amber" },
          { title: "Usuarios Activos", icon: Users, value: "--", color: "emerald" },
          { title: "Escaneos Mes", icon: BarChart3, value: "--", color: "pink" },
        ].map((stat, i) => (
          <div 
            key={i}
            className={`${DS.card.rounded} ${DS.card.border} ${DS.glass.card} p-8 transition-all hover:border-primary/30 group relative overflow-hidden shadow-xl shadow-primary/5`}
          >
            <div className={`absolute -right-4 -top-4 w-24 h-24 ${DS.glow.accent} opacity-20 group-hover:opacity-40 transition-opacity`} />
            <div className="flex flex-row items-center justify-between mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                {stat.title}
              </span>
              <stat.icon className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors hover:scale-110 duration-300" />
            </div>
            <div className={`text-4xl ${DS.typography.headingMd} text-slate-900 dark:text-white`}>
              {stat.value}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <div className="h-1 w-8 rounded-full bg-primary/20" />
              <p className="text-[9px] uppercase font-black tracking-widest text-muted-foreground">
                Sincronizado
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-primary/20" />
            <h3 className="text-base font-black tracking-widest uppercase text-primary">
              Infraestructura de Comercios
            </h3>
          </div>
          
          <Link href="/admin/shops/new">
            <button className={`px-6 h-12 ${DS.card.rounded} ${DS.gradient.primary} text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:-translate-y-1 hover:shadow-2xl active:scale-95 flex items-center gap-2`}>
              <PlusCircle className="h-4 w-4" />
              Nuevo Local Infinito
            </button>
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {businesses?.map((business) => (
            <div 
              key={business.id}
              className={`${DS.card.rounded} ${DS.card.border} ${DS.glass.card} overflow-hidden group hover:border-primary/40 transition-all duration-500`}
            >
              <div className="flex flex-col sm:flex-row h-full">
                {/* Image Section */}
                <div className="w-full sm:w-48 h-48 sm:h-auto relative overflow-hidden border-b sm:border-b-0 sm:border-r border-border/40">
                  <Image 
                    src={business.image_url || "/placeholder-shop.jpg"} 
                    alt={business.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-900/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex gap-2">
                     <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-white font-black uppercase tracking-widest">
                        {business.type}
                     </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`text-2xl ${DS.typography.headingMd} text-slate-900 dark:text-white leading-tight`}>
                          {business.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground font-medium">{business.city}, {business.address}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${business.plan_id === 'pro' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-600 border border-indigo-500/20'}`}>
                        Plan {business.plans?.name || 'Basic'}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-2">
                      <div className="flex flex-col">
                        <span className="text-[8px] uppercase font-black tracking-widest text-muted-foreground/60">Propietario</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{business.profiles?.full_name || 'Sin asignar'}</span>
                      </div>
                      <div className="flex flex-col border-l border-border/40 pl-4">
                        <span className="text-[8px] uppercase font-black tracking-widest text-muted-foreground/60">Registro</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {new Date(business.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-6">
                    <Link href={`/admin/shops/${business.id}/edit`} className="flex-1">
                      <button className={`w-full h-10 ${DS.card.rounded} bg-slate-100 dark:bg-slate-800 hover:bg-primary hover:text-white text-slate-900 dark:text-slate-100 transition-all font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 group/btn`}>
                        <Edit2 className="h-3.5 w-3.5 group-hover/btn:rotate-12 transition-transform" />
                        Editar Comercio
                      </button>
                    </Link>
                    <Link href={`/${business.slug}`} target="_blank">
                      <button className={`h-10 w-10 ${DS.card.rounded} bg-slate-100 dark:bg-slate-800 hover:bg-indigo-500 hover:text-white text-slate-900 dark:text-slate-100 transition-all flex items-center justify-center group/btn`}>
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {(!businesses || businesses.length === 0) && (
            <div className="lg:col-span-2 py-20 text-center border-2 border-dashed border-border/30 rounded-[3rem] bg-slate-500/5">
              <Store className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-xl font-black text-slate-400 uppercase tracking-tight">Cero Comercios Desplegados</h3>
              <p className="text-muted-foreground text-sm font-medium mt-2 italic">Empieza desplegando infraestructura &quot;Infinite&quot; para tus clientes.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

