import { LayoutDashboard, Store, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { createClient } from "@/utils/supabase/server";
import { APP_NAME } from "@/lib/constants";

const items = [
  {
    title: "Panel General",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Configuración",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
        <Sidebar className="border-r border-border/40 bg-white/50 dark:bg-slate-900/20 backdrop-blur-xl shadow-2xl shadow-primary/5">
          <SidebarHeader className="p-6 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-primary to-orange-500 shadow-lg shadow-primary/20">
                <Store className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter italic text-slate-900 dark:text-white">
                {APP_NAME} <span className="text-primary font-bold not-italic">Admin</span>
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-2">Sitio Público</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="group h-11 transition-all hover:bg-primary/5 hover:text-primary">
                      <Link href="/" className="flex items-center gap-3 w-full text-muted-foreground font-semibold">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Volver al inicio</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70 mb-2">Administración</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton className="group h-11 transition-all hover:bg-primary/5 hover:text-primary">
                        <Link href={item.url} className="flex items-center gap-3 w-full text-muted-foreground font-medium">
                          <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border/40">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-linear-to-r from-muted/50 to-transparent border border-border/40 shadow-sm transition-all hover:shadow-md">
              <div className="h-9 w-9 rounded-full bg-linear-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-sm font-bold truncate text-slate-900 dark:text-white">{user?.user_metadata?.full_name || "Negocio"}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-border/40 bg-white/80 dark:bg-slate-950/80 px-6 backdrop-blur-md">
            <SidebarTrigger className="-ml-2 hover:bg-primary/5 hover:text-primary transition-colors delay-0" />
            <h1 className="text-sm font-bold text-muted-foreground tracking-wide uppercase">Panel de Control</h1>
          </header>
          <div className="p-6 md:p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
