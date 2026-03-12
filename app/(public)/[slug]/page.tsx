import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SubscribeButton } from "@/components/public/subscribe-button";
import { CustomerQrModal } from "@/components/public/customer-qr-modal";
import { RedeemQrModal } from "@/components/public/redeem-qr-modal";
import {
  Instagram,
  MapPin,
  Ticket,
  ExternalLink,
  Phone,
  Globe,
} from "lucide-react";
import { ShareProfileButton } from "@/components/public/share-profile-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicBusinessData, PublicReward } from "@/app/actions/public";
import { APP_NAME } from "@/lib/constants";

interface PublicBusinessPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PublicBusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("name, type")
    .eq("slug", slug)
    .single();

  if (!business) return { title: "Negocio no encontrado" };

  return {
    title: `${business.name} | ${APP_NAME}`,
    description: `Descubre las recompensas de ${business.name} (${business.type}) en ${APP_NAME}.`,
  };
}

export default async function PublicBusinessPage({
  params,
}: PublicBusinessPageProps) {
  const { slug } = await params;

  // Ocupar las Server Actions explícitamente como pidió el usuario
  const { business, user, subscription, rewards } =
    await getPublicBusinessData(slug);

  if (!business) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 pb-24">
      {/* 
        ====================================================
        BANNER DE IMAGEN SUPERIOR (Sin texto adentro)
        ====================================================
      */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden bg-zinc-900 border-b border-border">
        <Image
          src={business.image_url || "/placeholder-business.jpg"}
          alt={business.name}
          fill
          className="object-cover"
          priority
        />
        {/* Un gradiente tenue solo para darle profundidad al borde */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-background/80 to-transparent" />
      </div>

      {/* 
        ====================================================
        INFORMACIÓN PRINCIPAL (Contenedor sobrepuesto o debajo)
        ====================================================
      */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 -mt-12 space-y-8">
        {/* Tarjeta de Información del Negocio */}
        <Card className="border-border rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden">
          <CardContent className="p-6 flex flex-col items-center text-center md:flex-row md:text-left justify-between gap-6">
            <div className="flex flex-col items-center md:items-start">
              <Badge
                variant="secondary"
                className="mb-3 bg-secondary text-secondary-foreground uppercase tracking-[0.2em] font-bold text-xs px-3 py-1"
              >
                {business.type}
              </Badge>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
                {business.name}
              </h1>
              <div className="flex flex-col items-center md:items-start gap-1 mt-2">
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <MapPin className="h-4 w-4 text-primary shrink-0" />
                  <span className="line-clamp-1">
                    {business.city}
                    {business.countries && (
                      <>
                        ,{" "}
                        {Array.isArray(business.countries)
                          ? business.countries[0]?.name
                          : (business.countries as { name: string }).name}
                      </>
                    )}
                  </span>
                </div>

                {business.address && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      `${business.address}, ${business.city}, ${
                        Array.isArray(business.countries)
                          ? business.countries[0]?.name
                          : (business.countries as { name: string })?.name || ""
                      }`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex mt-1 group"
                  >
                    <div className="flex items-center gap-2 bg-zinc-100 dark:bg-white/5 hover:bg-primary/10 border border-border group-hover:border-primary/30 px-3 py-1.5 rounded-full transition-all duration-300">
                      <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground line-clamp-1">
                        {business.address}
                      </span>
                      <div className="h-3 w-px bg-border group-hover:bg-primary/30 mx-1" />
                      <span className="text-[10px] font-black text-primary uppercase tracking-tighter flex items-center gap-1">
                        Cómo llegar
                        <ExternalLink className="h-2.5 w-2.5" />
                      </span>
                    </div>
                  </a>
                )}
              </div>
              {business.description && (
                <p className="mt-4 text-muted-foreground text-sm leading-relaxed max-w-2xl">
                  {business.description}
                </p>
              )}
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <ShareProfileButton
                businessName={business.name}
                className="w-full md:w-auto bg-background text-foreground hover:bg-secondary border-border shadow-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* 
          ====================================================
          REDES SOCIALES Y ESTADO DE SUSCRIPCIÓN (Grid)
          ====================================================
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* SECCIÓN 1: Redes y Contacto */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground px-2">
              Contacto y Redes
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {business.whatsapp_url && (
                <a
                  href={business.whatsapp_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="flex items-center gap-4 bg-background hover:bg-[#25D366]/10 border border-border hover:border-[#25D366]/30 p-4 rounded-2xl transition-all duration-300 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">
                        WhatsApp
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Escríbenos ahora
                      </span>
                    </div>
                    <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-[#25D366]" />
                  </div>
                </a>
              )}

              {business.instagram_url && (
                <a
                  href={business.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="flex items-center gap-4 bg-background hover:bg-[#E1306C]/10 border border-border hover:border-[#E1306C]/30 p-4 rounded-2xl transition-all duration-300 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-[#E1306C]/20 flex items-center justify-center text-[#E1306C]">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">
                        Instagram
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Ver nuestras fotos
                      </span>
                    </div>
                    <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-[#E1306C]" />
                  </div>
                </a>
              )}

              {business.tiktok_url && (
                <a
                  href={business.tiktok_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="flex items-center gap-4 bg-background hover:bg-zinc-800/10 dark:hover:bg-white/10 border border-border hover:border-foreground/30 p-4 rounded-2xl transition-all duration-300 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-white/10 flex items-center justify-center text-zinc-800 dark:text-white">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                      </svg>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">
                        TikTok
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Novedades en video
                      </span>
                    </div>
                    <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                  </div>
                </a>
              )}

              {business.website_url && (
                <a
                  href={business.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <div className="flex items-center gap-4 bg-background hover:bg-primary/10 border border-border hover:border-primary/30 p-4 rounded-2xl transition-all duration-300 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">
                        Sitio Web
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Visita nuestra página
                      </span>
                    </div>
                    <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-primary" />
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* SECCIÓN 2: Fidelización y Beneficios (Estado de Autenticación) */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground px-2">
              Tus Beneficios
            </h3>

            {!user ? (
              // ESTADO 1: NO LOGUEADO
              <Card className="rounded-3xl border-border text-center shadow-2xl">
                <CardContent className="p-6 space-y-5">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Ticket className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-foreground">
                      Únete al club
                    </h4>
                    <p className="text-sm text-muted-foreground px-4 mt-2">
                      Inicia sesión y suscríbete para empezar a acumular visitas
                      en {business.name}.
                    </p>
                  </div>
                  <Link href="/login" className="block w-full pt-2">
                    <Button size="lg" className="w-full">
                      INICIAR SESIÓN
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : !subscription ? (
              // ESTADO 2: LOGUEADO PERO NO SUSCRITO
              <Card className="bg-primary/5 rounded-3xl border-primary/30 text-center shadow-xl shadow-primary/5 relative overflow-hidden group">
                <CardContent className="p-6 space-y-4">
                  <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent opacity-50 pointer-events-none" />
                  <h4 className="font-bold text-2xl text-primary relative z-10 pt-2">
                    ¡Empieza a ganar!
                  </h4>
                  <p className="text-sm text-muted-foreground relative z-10 w-4/5 mx-auto">
                    Conviértete en miembro frecuente y obtén beneficios únicos.
                    Activa tu suscripción gratis.
                  </p>
                  <div className="relative z-10 pt-4">
                    {/* Client Component que inserta la suscripción */}
                    <SubscribeButton businessId={business.id} slug={slug} />
                  </div>
                </CardContent>
              </Card>
            ) : (
              // ESTADO 3: SUSCRITO (Panel Premium de Visitas)
              <div className="space-y-4">
                <Card className="rounded-3xl border-primary/20 shadow-2xl shadow-primary/10 bg-primary/5">
                  <CardContent className="p-6 space-y-5">
                    {/* Contenedor de Visitas */}
                    <div className="bg-background border border-primary/20 shadow-inner rounded-3xl p-6 text-center">
                      <p className="text-xs text-muted-foreground font-black uppercase tracking-[0.2em] mb-2">
                        Total de Visitas Activas
                      </p>
                      <p className="text-7xl font-black text-primary leading-none tracking-tighter mix-blend-multiply dark:mix-blend-screen drop-shadow-xs">
                        {subscription.scans_count || 0}
                      </p>
                    </div>

                    {/* Meta/Recompensas Dispobles */}
                    {rewards && rewards.length > 0 ? (
                      <div className="space-y-3 pt-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground text-center">
                          Recompensas Disponibles
                        </p>
                        <div className="grid gap-2">
                          {rewards.map((reward: PublicReward) => {
                            const reached =
                              (reward.scans_count || 0) >= reward.scans_required;
                            const progress = Math.min(
                              100,
                              ((reward.scans_count || 0) /
                                reward.scans_required) *
                                100,
                            );

                            return (
                              <div
                                key={reward.id}
                                className="bg-background border border-border rounded-xl p-4 overflow-hidden relative"
                              >
                                {/* Barra de Progreso de fondo */}
                                <div
                                  className={`absolute top-0 left-0 bottom-0 opacity-10 transition-all duration-1000 ${reached ? "bg-emerald-500" : "bg-primary"}`}
                                  style={{ width: `${progress}%` }}
                                />

                                <div className="relative z-10 flex items-center justify-between gap-4">
                                  <div className="flex-1">
                                    <h4
                                      className={`font-bold text-sm ${reached ? "text-emerald-500" : "text-foreground"}`}
                                    >
                                      {reward.title}
                                    </h4>
                                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                                      {reward.scans_count || 0} /{" "}
                                      {reward.scans_required} escaneos
                                    </p>
                                  </div>
                                  <div className="shrink-0 flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md border border-border shadow-xs">
                                    <Ticket
                                      className={`h-3 w-3 ${reached ? "text-emerald-500" : "text-muted-foreground"}`}
                                    />
                                    <span className="text-xs font-bold tabular-nums">
                                      {reward.scans_required}
                                    </span>
                                  </div>
                                </div>
                                {/* Action Area for reached rewards */}
                                {reached ? (
                                  <div className="relative z-10 w-full animate-in fade-in slide-in-from-top-2 mt-3">
                                    <RedeemQrModal 
                                      businessSlug={slug} 
                                      userId={user.id} 
                                      rewardId={reward.id} 
                                      rewardTitle={reward.title} 
                                      scansRequired={reward.scans_required} 
                                    />
                                  </div>
                                ) : (
                                  <div className="relative z-10 w-full mt-3">
                                    <CustomerQrModal 
                                      businessSlug={slug} 
                                      userId={user.id} 
                                      rewardId={reward.id} 
                                      rewardTitle={reward.title} 
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground bg-background rounded-xl border border-dashed border-border">
                        <Ticket className="h-6 w-6 mx-auto mb-2 opacity-50" />
                        <p className="text-xs font-medium">
                          No hay recompensas activas, pero sigue sumando.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>

        {/* Footer Cierre */}
        <div className="pt-12 border-t border-border/50 text-center">
          <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest flex items-center justify-center gap-2">
            <span className="w-4 h-px bg-border"></span>
            Powered by {APP_NAME}
            <span className="w-4 h-px bg-border"></span>
          </p>
        </div>
      </main>

      {/* Floating Share Button */}
      <ShareProfileButton
        businessName={business.name}
        variant="secondary"
        size="icon"
        showText={false}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 shadow-2xl flex items-center justify-center text-white hover:bg-zinc-800 transition-colors z-50 p-0"
      />
    </div>
  );
}
