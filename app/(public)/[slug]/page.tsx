import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { 
  Instagram, 
  MessageCircle, 
  Share2, 
  MapPin, 
  Ticket, 
  ExternalLink,
  Phone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
  const supabase = await createClient();

  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!business) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary/30">
      {/* Hero / Cover Section */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <Image
          src={business.image_url || "/placeholder-business.jpg"}
          alt={business.name}
          fill
          className="object-cover opacity-60"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 max-w-2xl mx-auto flex flex-col items-center text-center">
          <Badge variant="secondary" className="mb-3 bg-primary/20 text-primary border-primary/30 backdrop-blur-md px-3 py-1 text-xs uppercase tracking-[0.2em] font-bold">
            {business.type}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-2 drop-shadow-2xl">
            {business.name}
          </h1>
          <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
            <MapPin className="h-4 w-4" />
            <span>Disponible ahora</span>
          </div>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 -mt-4 relative z-10 space-y-8 pb-20">
        {/* Quick Stats / Rewards */}
        <Card className="bg-zinc-900/80 backdrop-blur-xl border-zinc-800 shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-transparent opacity-50" />
          <CardContent className="p-8 flex flex-col items-center text-center relative">
            <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <Ticket className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-bold mb-1">¡Fideliza y Gana!</h2>
            <p className="text-zinc-400 text-sm mb-6 max-w-xs mx-auto">
              Escanea el código QR en el local para acumular visitas y canjear por premios exclusivos.
            </p>
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700/50">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Premios</p>
                <p className="text-2xl font-black text-primary">{business.rewards_available}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-2xl p-4 border border-zinc-700/50">
                <p className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold mb-1">Estado</p>
                <p className="text-2xl font-black text-emerald-500">Activo</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Links Section */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500 px-1">Contacto y Redes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {business.whatsapp_url && (
              <a href={business.whatsapp_url} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="flex items-center gap-4 bg-zinc-900/50 hover:bg-[#25D366]/10 border border-zinc-800 hover:border-[#25D366]/30 p-4 rounded-2xl transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[#25D366]/20 flex items-center justify-center text-[#25D366]">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">WhatsApp</span>
                    <span className="text-[10px] text-zinc-500">Chat directo</span>
                  </div>
                  <ExternalLink className="ml-auto h-4 w-4 text-zinc-600 group-hover:text-[#25D366]" />
                </div>
              </a>
            )}

            {business.instagram_url && (
              <a href={business.instagram_url} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="flex items-center gap-4 bg-zinc-900/50 hover:bg-[#E1306C]/10 border border-zinc-800 hover:border-[#E1306C]/30 p-4 rounded-2xl transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-[#E1306C]/20 flex items-center justify-center text-[#E1306C]">
                    <Instagram className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">Instagram</span>
                    <span className="text-[10px] text-zinc-500">Ver novedades</span>
                  </div>
                  <ExternalLink className="ml-auto h-4 w-4 text-zinc-600 group-hover:text-[#E1306C]" />
                </div>
              </a>
            )}

            {business.tiktok_url && (
              <a href={business.tiktok_url} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="flex items-center gap-4 bg-zinc-900/50 hover:bg-white/10 border border-zinc-800 hover:border-white/30 p-4 rounded-2xl transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">TikTok</span>
                    <span className="text-[10px] text-zinc-500">Videos y tendencias</span>
                  </div>
                  <ExternalLink className="ml-auto h-4 w-4 text-zinc-600 group-hover:text-white" />
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black text-lg shadow-2xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            REGISTRAR MI VISITA
          </Button>
          <p className="text-center text-zinc-500 text-[10px] mt-4 font-medium uppercase tracking-widest">
            Powered by Fideliza QR
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
