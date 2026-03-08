"use client";

import Link from "next/link";
import { CreditCard, User, Bell, Shield, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsHubPage() {
  const settingModules = [
    {
      title: "Planes y Facturación",
      description: "Administra tu suscripción, límites de cuenta y métodos de pago.",
      icon: CreditCard,
      href: "/dashboard/settings/billing",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      badge: "Recomendado"
    },
    {
      title: "Perfil de Administrador",
      description: "Actualiza tu información personal, contraseña y preferencias de la cuenta.",
      icon: User,
      href: "/dashboard/settings/profile",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Seguridad y Accesos",
      description: "Roles, permisos de empleados y registro de actividad del sistema.",
      icon: Shield,
      href: "/dashboard/settings/security",
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      badge: "Próximamente",
      disabled: true
    },
    {
      title: "Notificaciones",
      description: "Configura alertas de escaneos, recompensas canjeadas y reportes.",
      icon: Bell,
      href: "/dashboard/settings/notifications",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      badge: "Próximamente",
      disabled: true
    }
  ];

  return (
    <div className="relative min-h-[80vh] w-full max-w-6xl mx-auto py-12 px-4 sm:px-6">
      
      {/* Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full point-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-orange-500/5 blur-[120px] rounded-full point-events-none -z-10" />

      {/* Heading Badge System */}
      <div className="flex flex-col items-center justify-center text-center space-y-4 mb-16">
        <div className="flex items-center gap-4">
          <div className="hidden sm:block h-px w-12 bg-primary/20" />
          <span className="text-xs font-black tracking-[0.3em] text-primary uppercase">
            Panel de Control
          </span>
          <div className="hidden sm:block h-px w-12 bg-primary/20" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter leading-[0.95] text-slate-900 dark:text-white max-w-3xl">
          Configuración y <br className="hidden md:block"/>
          <span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent italic pr-2">Gestión Digital</span>
        </h1>
        
        <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
          Administra todos los aspectos operativos de tus negocios, desde suscripciones hasta la seguridad de tu personal.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {settingModules.map((module, index) => {
          const Content = (
            <Card className={`relative h-full overflow-hidden border-slate-100 rounded-[2rem] bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl transition-all duration-500 ${!module.disabled && 'hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:-translate-y-1 group'} ${module.disabled && 'opacity-60 cursor-not-allowed'}`}>
              
              {/* Top accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <CardHeader className="p-8 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-4 rounded-2xl ${module.bgColor} ${module.color} flex items-center justify-center`}>
                    <module.icon className="w-8 h-8" strokeWidth={2} />
                  </div>
                  {module.badge && (
                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${module.badge === 'Recomendado' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                      {module.badge}
                      {module.badge === 'Recomendado' && <Sparkles className="w-3 h-3 inline ml-1" />}
                    </span>
                  )}
                </div>
                <CardTitle className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {module.title}
                </CardTitle>
                <CardDescription className="text-base text-slate-600 mt-2 font-medium">
                  {module.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-8 pt-4 flex justify-end">
                {!module.disabled && (
                  <div className="flex items-center text-sm font-bold text-primary group-hover:text-orange-500 transition-colors">
                    <span>Gestionar</span>
                    <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </CardContent>
            </Card>
          );

          if (module.disabled) {
            return <div key={index}>{Content}</div>;
          }

          return (
            <Link key={index} href={module.href} className="block outline-hidden">
              {Content}
            </Link>
          );
        })}
      </div>

    </div>
  );
}
