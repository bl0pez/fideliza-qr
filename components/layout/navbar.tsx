import { Ticket, LogIn } from "lucide-react";
import Link from "next/link";
import { DropdownMenuAvatar } from "@/components/auth/dropdown-menu-avatar";
import { APP_NAME } from "@/lib/constants";

import { getProfile } from "@/app/actions/auth";

export async function Navbar() {
  const profile = await getProfile();
  const user = profile ? { email: profile.email, id: profile.id, user_metadata: { avatar_url: profile.avatar_url, full_name: profile.full_name } } : null;
  const role = profile?.role || 'client';

  return (
    <nav className="sticky top-0 z-50 px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
        <Ticket className="text-primary w-8 h-8" />
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{APP_NAME}</span>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link href="/rewards" className="hidden sm:flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-primary transition-colors bg-secondary/50 hover:bg-secondary px-3 py-2 rounded-full border border-border">
              <Ticket className="w-4 h-4" />
              <span>Mis Tarjetas</span>
            </Link>
            <DropdownMenuAvatar 
              role={role}
              user={{
                email: user.email,
                user_metadata: {
                  avatar_url: user.user_metadata?.avatar_url,
                  full_name: user.user_metadata?.full_name
                }
              }} 
            />
          </>
        ) : (
          <Link href="/login" className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
            <LogIn className="w-5 h-5" />
          </Link>
        )}
      </div>
      </div>
    </nav>
  );
}
