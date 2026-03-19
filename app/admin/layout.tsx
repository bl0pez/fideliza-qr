"use server";

import { LayoutDashboard, ArrowLeft, ShieldCheck, PlusCircle } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getProfile } from "@/app/actions/auth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { DS, APP_NAME } from "@/lib/constants";

const adminItems = [
  {
    title: "Panel Admin",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Crear Local",
    url: "/admin/shops/new",
    icon: PlusCircle,
  },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();

  if (!profile) {
    redirect("/auth");
  }

  if (profile.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
        <Sidebar className="border-r border-border/40 bg-white/50 dark:bg-slate-900/20 backdrop-blur-xl shadow-2xl shadow-primary/5">
          <SidebarHeader className="p-6 border-b border-border/40">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/20">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter italic text-slate-900 dark:text-white">
                {APP_NAME} <span className="text-indigo-600 font-bold not-italic">Admin</span>
              </span>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-4">
            <SidebarGroup>
              <SidebarGroupLabel className={cn(DS.typography.sectionLabel, "mb-2")}>Administración Sistema</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        render={<Link href={item.url} />}
                        className="group h-11 transition-all hover:bg-indigo-500/5 hover:text-indigo-600"
                      >
                        <div className="flex items-center gap-3 w-full text-muted-foreground font-medium">
                          <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className={cn(DS.typography.sectionLabel, "mb-2")}>Otros</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton 
                      render={<Link href="/dashboard" />}
                      className="group h-11 transition-all hover:bg-primary/5 hover:text-primary"
                    >
                      <div className="flex items-center gap-3 w-full text-muted-foreground font-medium">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Ir al Dashboard</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="p-4 border-t border-border/40">
            <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-linear-to-r from-muted/50 to-transparent border border-border/40 shadow-sm">
              <div className="h-9 w-9 rounded-full bg-linear-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-md shrink-0">
                {profile.full_name?.charAt(0).toUpperCase() || "A"}
              </div>
              <div className="flex flex-col flex-1 overflow-hidden">
                <span className="text-sm font-bold truncate text-slate-900 dark:text-white">{profile.full_name || "Administrador"}</span>
                <span className="text-xs text-muted-foreground truncate italic">Superuser Mode</span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="relative overflow-hidden flex flex-col">
                <div className={`absolute top-0 left-1/4 w-[500px] h-[500px] -z-10 ${DS.glow.light} opacity-50`} />
          <div className={`absolute bottom-0 right-1/4 w-[400px] h-[400px] -z-10 ${DS.glow.accent} opacity-30`} />

          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border/40 bg-white/40 dark:bg-slate-950/40 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-2 hover:bg-indigo-500/5 hover:text-indigo-600 transition-colors" />
              <div className="h-4 w-px bg-border/40 mx-2 hidden sm:block" />
              <div className="flex items-center gap-2">
                <div className={DS.typography.sectionLabelLine + " w-6"} />
                <h1 className="text-sm font-black text-muted-foreground tracking-widest uppercase">
                  Panel de Control <span className={DS.gradient.primaryText}>Maestro</span>
                </h1>
                <div className={DS.typography.sectionLabelLine + " w-6"} />
              </div>
            </div>
          </header>
          
          <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
