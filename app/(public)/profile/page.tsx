import { redirect } from "next/navigation";
import { Mail, Shield, Calendar, Ticket, ArrowRight, UserCircle2 } from "lucide-react";
import { DS } from "@/lib/constants";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getCurrentUser, getProfile } from "@/app/actions/auth";

export default async function ProfilePage() {
  const profile = await getProfile();

  if (!profile) {
    redirect("/login");
  }

  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const fullName = profile.full_name || user.user_metadata?.full_name || "Usuario";
  const avatarUrl = profile.avatar_url || user.user_metadata?.avatar_url;
  const roleLabel = profile.role === "business_owner" ? "Negocio / Dueño" : "Cliente / Miembro";
  
  const joinedDate = new Date(user.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-4xl mx-auto px-6 pt-12 pb-24">
        {/* Header Badge */}
        <div className="flex flex-col items-center mb-12 text-center">
          <div className="flex items-center gap-3 mb-6">
            <div className={DS.typography.sectionLabelLine} />
            <span className={DS.typography.sectionLabel}>Mi Cuenta</span>
            <div className={DS.typography.sectionLabelLine} />
          </div>
          <h1 className={`text-4xl md:text-6xl ${DS.typography.heading}`}>
            Tu <span className={DS.gradient.primaryText}>Perfil</span>
          </h1>
        </div>

        {/* Profile Card */}
        <div className={`relative overflow-hidden ${DS.card.rounded} bg-white border border-slate-100 shadow-2xl p-8 md:p-12 mb-8`}>
          {/* Ambient Glow */}
          <div className={`absolute -top-24 -right-24 w-64 h-64 ${DS.glow.light} opacity-50`} />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-linear-to-r from-primary to-orange-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <Avatar className="w-32 h-32 md:w-40 md:h-40 border-4 border-white shadow-xl relative">
                <AvatarImage src={avatarUrl} alt={fullName} />
                <AvatarFallback className="text-4xl bg-slate-100 text-slate-400">
                  {fullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info Section */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
                  {fullName}
                </h2>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest border border-primary/20">
                  <Shield className="w-3.5 h-3.5" />
                  {roleLabel}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-50">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Mail className="w-3 h-3" /> Correo Electrónico
                  </p>
                  <p className="text-slate-900 font-bold">{user.email}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Miembro desde
                  </p>
                  <p className="text-slate-900 font-bold">{joinedDate}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link 
            href="/rewards" 
            className={`group p-8 ${DS.card.rounded} bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-between overflow-hidden relative`}
          >
            <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Ticket className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Mis Tarjetas</h3>
                <p className="text-slate-500 text-sm font-medium">Gestiona tus puntos y premios.</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary group-hover:translate-x-2 transition-all translate-x-0 relative z-10" />
          </Link>

          <Link 
            href="/explore" 
            className={`group p-8 ${DS.card.rounded} bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 flex items-center justify-between overflow-hidden relative`}
          >
            <div className="absolute inset-0 bg-linear-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                <UserCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Explorar</h3>
                <p className="text-slate-500 text-sm font-medium">Descubre nuevos comercios.</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-orange-500 group-hover:translate-x-2 transition-all translate-x-0 relative z-10" />
          </Link>
        </div>
      </div>
    </div>
  );
}
