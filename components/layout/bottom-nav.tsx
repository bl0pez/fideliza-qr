import Link from "next/link";
import { Home, Search, ScanLine, Ticket, User, LogIn } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export async function BottomNav() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role || null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border flex justify-around py-3 pb-8 px-4 z-50 shadow-lg">
      <Link href="/" className="flex flex-col items-center gap-1 text-primary">
        <Home className="w-6 h-6 fill-primary" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Inicio</span>
      </Link>
      <Link href="/explore" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
        <Search className="w-6 h-6" />
        <span className="text-[10px] font-bold uppercase tracking-wider">Explorar</span>
      </Link>
      
      {user ? (
        <>
          {role !== "client" && (
            <Link href="/scan" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
              <ScanLine className="w-6 h-6" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Escanear</span>
            </Link>
          )}
          <Link href="/cards" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <Ticket className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Tarjetas</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
            <User className="w-6 h-6" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Perfil</span>
          </Link>
        </>
      ) : (
        <Link href="/login" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors">
          <LogIn className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Acceder</span>
        </Link>
      )}
    </nav>
  );
}
