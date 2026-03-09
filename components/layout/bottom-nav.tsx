import { getProfile, getCurrentUser } from "@/app/actions/auth";
import { NavItem } from "./nav-item";
import { QuickActionButton } from "./quick-action-button";

export async function BottomNav() {
  const profile = await getProfile();
  const user = await getCurrentUser();
  const role = profile?.role || null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 flex justify-around items-end py-4 pb-10 px-4 z-50 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
      <NavItem href="/" iconName="home" label="Inicio" />
      <NavItem href="/explore" iconName="search" label="Explorar" />
      
      {user ? (
        <>
          {/* Central Highlight Button */}
          <QuickActionButton role={role as "business_owner" | "customer"} userId={user.id} />

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
