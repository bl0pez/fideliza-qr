import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { SubscribeButton } from "@/components/public/subscribe-button";
import { 
  Instagram, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Ticket, 
  ExternalLink,
  Phone,
  QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPublicBusinessData } from "@/app/actions/public";

interface PublicBusinessPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PublicBusinessPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: business } = await supabase
    .from("businesses")
    .select("name, type")
    .eq("slug", slug)
    .single();

  if (!business) return { title: "Negocio no encontrado" };

  return {
    title: `${business.name} | Fideliza QR`,
    description: `Descubre las recompensas de ${business.name} (${business.type}) en Fideliza QR.`,
  };
}

export default async function PublicBusinessPage({ params }: PublicBusinessPageProps) {
  const { slug } = await params;
  
  // Ocupar las Server Actions explícitamente como pidió el usuario
  const { business, user, subscription } = await getPublicBusinessData(slug);

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
        <div className="bg-card border border-border rounded-2xl p-6 shadow-2xl flex flex-col items-center text-center md:flex-row md:text-left justify-between gap-6 backdrop-blur-xl">
          <div className="flex flex-col items-center md:items-start">
             <Badge variant="secondary" className="mb-3 bg-secondary text-secondary-foreground uppercase tracking-[0.2em] font-bold text-xs px-3 py-1">
               {business.type}
             </Badge>
             <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
               {business.name}
             </h1>
             <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
               <MapPin className="h-4 w-4" />
               <span>Encuéntranos en la ciudad</span>
             </div>
          </div>
          
          {/* Compartir Button */}
          <div className="shrink-0 w-full md:w-auto">
            <Button variant="outline" className="w-full md:w-auto bg-background text-foreground hover:bg-secondary border-border shadow-xs">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir Perfil
            </Button>
          </div>
        </div>

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
                <a href={business.whatsapp_url} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="flex items-center gap-4 bg-background hover:bg-[#25D366]/10 border border-border hover:border-[#25D366]/30 p-4 rounded-2xl transition-all duration-300 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">WhatsApp</span>
                      <span className="text-[10px] text-muted-foreground">Escríbenos ahora</span>
                    </div>
                    <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-[#25D366]" />
                  </div>
                </a>
              )}

              {business.instagram_url && (
                <a href={business.instagram_url} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="flex items-center gap-4 bg-background hover:bg-[#E1306C]/10 border border-border hover:border-[#E1306C]/30 p-4 rounded-2xl transition-all duration-300 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-[#E1306C]/20 flex items-center justify-center text-[#E1306C]">
                      <Instagram className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">Instagram</span>
                      <span className="text-[10px] text-muted-foreground">Ver nuestras fotos</span>
                    </div>
                    <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-[#E1306C]" />
                  </div>
                </a>
              )}

              {business.tiktok_url && (
                <a href={business.tiktok_url} target="_blank" rel="noopener noreferrer" className="block group">
                  <div className="flex items-center gap-4 bg-background hover:bg-zinc-800/10 dark:hover:bg-white/10 border border-border hover:border-foreground/30 p-4 rounded-2xl transition-all duration-300 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-zinc-200 dark:bg-white/10 flex items-center justify-center text-zinc-800 dark:text-white">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground">TikTok</span>
                      <span className="text-[10px] text-muted-foreground">Novedades en video</span>
                    </div>
                    <ExternalLink className="ml-auto h-4 w-4 text-muted-foreground group-hover:text-foreground" />
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
              <div className="bg-card p-6 rounded-3xl border border-border text-center space-y-5 shadow-2xl">
                 <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                   <Ticket className="h-7 w-7 text-primary" />
                 </div>
                 <div>
                   <h4 className="font-bold text-xl text-foreground">Únete al club</h4>
                   <p className="text-sm text-muted-foreground px-4 mt-2">Inicia sesión y suscríbete para empezar a acumular visitas en {business.name}.</p>
                 </div>
                <Link href="/login" className="block w-full pt-2">
                  <Button className="w-full h-14 rounded-2xl bg-foreground hover:bg-foreground/90 text-background font-black text-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
                    INICIAR SESIÓN
                  </Button>
                </Link>
              </div>
            ) : !subscription ? (
               // ESTADO 2: LOGUEADO PERO NO SUSCRITO
               <div className="bg-primary/5 p-6 rounded-3xl border border-primary/30 text-center space-y-4 shadow-xl shadow-primary/5 relative overflow-hidden group">
                 <div className="absolute inset-0 bg-linear-to-b from-primary/10 to-transparent opacity-50 pointer-events-none" />
                 <h4 className="font-bold text-2xl text-primary relative z-10 pt-2">¡Empieza a ganar!</h4>
                 <p className="text-sm text-muted-foreground relative z-10 w-4/5 mx-auto">
                   Conviértete en miembro frecuente y obtén beneficios únicos. Activa tu suscripción gratis.
                 </p>
                 <div className="relative z-10 pt-4">
                   {/* Client Component que inserta la suscripción */}
                   <SubscribeButton businessId={business.id} slug={slug} />
                 </div>
              </div>
            ) : (
              // ESTADO 3: SUSCRITO (Panel Premium de Visitas)
              <div className="bg-card p-6 rounded-3xl border border-primary/20 space-y-5 shadow-2xl shadow-primary/10">
                 {/* Contenedor de Visitas */}
                 <div className="bg-background border border-border rounded-2xl p-5 md:p-6 flex items-center justify-between">
                   <div>
                     <p className="text-[10px] sm:text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mb-1">Tus Visitas</p>
                     <p className="text-5xl sm:text-6xl font-black text-foreground leading-none tracking-tighter">
                       {subscription.scans_count || 0}
                     </p>
                   </div>
                   <div className="text-right flex flex-col items-end">
                     <p className="text-[10px] sm:text-xs text-primary/80 font-bold uppercase tracking-widest mb-1">Meta actual</p>
                     <div className="flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20">
                       <Ticket className="h-4 w-4 text-primary" />
                       <p className="text-sm sm:text-base font-black text-primary tabular-nums">
                         {business.rewards_available}
                       </p>
                     </div>
                   </div>
                 </div>
                 
                 <Button className="w-full h-14 md:h-16 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
                   <QrCode className="mr-2 h-6 w-6" />
                   MOSTRAR CÓDIGO QR
                 </Button>
                 <p className="text-center text-muted-foreground text-xs md:text-sm">
                   Muestra este código en caja para sumar una visita.
                 </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Cierre */}
        <div className="pt-12 border-t border-border/50 text-center">
            <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-4 h-px bg-border"></span>
              Powered by Fideliza QR
              <span className="w-4 h-px bg-border"></span>
            </p>
        </div>
      </main>

      {/* Floating Share Button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 shadow-2xl flex items-center justify-center text-white hover:bg-zinc-800 transition-colors z-50">
        <Share2 className="h-6 w-6" />
      </button>
    </div>
  );
}
