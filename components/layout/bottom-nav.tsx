import { getProfile } from "@/app/actions/auth";
import { NavItem } from "./nav-item";

export async function BottomNav() {
  const profile = await getProfile();
  const role = profile?.role || null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-100 flex justify-around py-4 pb-10 px-6 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] transition-all animate-in slide-in-from-bottom duration-500">
      <NavItem href="/" iconName="home" label="Inicio" />
      <NavItem href="/explore" iconName="search" label="Explorar" />
      
      {profile ? (
        <>
          {role === "business_owner" && (
            <NavItem href="/scan" iconName="scan" label="Escanear" />
          )}
          <NavItem href="/rewards" iconName="ticket" label="Tarjetas" />
          <NavItem 
            href={role === 'business_owner' ? '/dashboard/settings' : '/profile'} 
            iconName="user" 
            label="Perfil" 
          />
        </>
      ) : (
        <NavItem href="/login" iconName="login" label="Acceder" />
      )}
    </nav>
  );
}
