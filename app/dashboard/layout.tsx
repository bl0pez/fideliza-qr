import { LayoutDashboard, Store, Settings } from "lucide-react";
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
    title: "Mis Negocios",
    url: "/dashboard/businesses",
    icon: Store,
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
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <Sidebar className="border-r border-border">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2 px-2">
              <Store className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold tracking-tight">{APP_NAME} Admin</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Administración</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton>
                        <Link href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-muted/50">
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-medium">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-sm font-medium truncate">{user?.user_metadata?.full_name || "Negocio"}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 overflow-y-auto">
          <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background/95 px-6 backdrop-blur">
            <SidebarTrigger className="-ml-2" />
            <h1 className="text-sm font-semibold">Panel de Control</h1>
          </header>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
