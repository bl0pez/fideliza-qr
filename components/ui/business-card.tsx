import Image from "next/image";
import { Business } from "@/lib/data/api";
import { cldCard } from "@/lib/cloudinary";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, Ticket } from "lucide-react";
import Link from "next/link";

interface BusinessCardProps {
  business: Business;
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Link href={`/${business.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-[2rem] bg-white transition-all duration-500 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-transparent">
        {/* Image Container with Zoom Effect */}
        <div className="relative h-56 md:h-64 overflow-hidden">
          <Image
            src={cldCard(business.image_url)}
            alt={`Imagen de ${business.name}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
          
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/20 backdrop-blur-md border-white/20 text-white font-bold hover:bg-white/30">
              {business.type}
            </Badge>
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
             <div className="flex items-center gap-1.5 text-white/90 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary/20" />
                <span>Negocio Verificado</span>
             </div>
             {business.city && (
               <span className="text-[10px] text-white/80 font-bold uppercase tracking-widest bg-black/20 backdrop-blur-sm px-2 py-1 rounded-lg">
                 {business.city}
               </span>
             )}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {business.name}
            </h3>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 group-hover:bg-primary group-hover:border-primary transition-colors duration-300">
                <Ticket className="w-3.5 h-3.5 text-primary group-hover:text-white" />
                <span className="text-xs font-black uppercase tracking-tight text-primary group-hover:text-white">
                  {business.rewards_available} Recompensas Disponibles
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-50">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Ver beneficios</span>
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
