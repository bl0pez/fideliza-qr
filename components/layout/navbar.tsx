import { Ticket, LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { DropdownMenuAvatar } from "@/components/auth/dropdown-menu-avatar";
import { APP_NAME } from "@/lib/constants";

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let role = 'client';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    if (profile) role = profile.role;
  }

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-2">
        <Ticket className="text-primary w-8 h-8" />
        <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{APP_NAME}</span>
      </div>
      <div className="flex items-center gap-3">
        {user ? (
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
        ) : (
          <Link href="/login" className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
            <LogIn className="w-5 h-5" />
          </Link>
        )}
      </div>
    </nav>
  );
}
