import Link from "next/link";
import { Twitter, Instagram, Linkedin, Heart } from "lucide-react";
import { APP_NAME, DS } from "@/lib/constants";
import { Logo } from "@/components/brand/logo";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-white border-t border-slate-100 pt-24 pb-20 px-6 lg:px-12 mt-20">
      {/* Premium Decorative Elements */}
      <div className={`absolute -bottom-24 -left-24 w-96 h-96 ${DS.glow.light} opacity-50`} />
      <div className={`absolute -top-48 -right-24 w-[500px] h-[500px] ${DS.glow.accent} opacity-30`} />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 pb-16">
          {/* Brand Identity Column */}
          <div className="lg:col-span-5 space-y-8">
            <Link href="/">
              <Logo size={40} />
            </Link>
            
            <p className="text-slate-500 text-lg md:text-xl leading-relaxed max-w-sm font-medium">
              Transformando la lealtad local en una <span className="text-slate-900 font-bold">experiencia digital extraordinaria</span> para todos.
            </p>

            <div className="flex items-center gap-4">
              <Link href="#" className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-200/60 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 group/social">
                <Twitter className="w-5 h-5 group-hover/social:scale-110 transition-transform" />
              </Link>
              <Link href="#" className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-200/60 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 group/social">
                <Instagram className="w-5 h-5 group-hover/social:scale-110 transition-transform" />
              </Link>
              <Link href="#" className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-50 border border-slate-200/60 text-slate-400 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all duration-500 group/social">
                <Linkedin className="w-5 h-5 group-hover/social:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-1 hidden lg:block" />

          {/* Links Columns */}
          <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-10">
            <div className="space-y-6">
              <h4 className={DS.typography.sectionLabel}>Plataforma</h4>
              <ul className="space-y-4">
                <li><Link href="/explore" className="text-slate-500 hover:text-primary font-bold transition-colors">Explorar</Link></li>
                <li><Link href="/how-it-works" className="text-slate-500 hover:text-primary font-bold transition-colors">Cómo funciona</Link></li>
                <li><Link href="/register" className="text-slate-500 hover:text-primary font-bold transition-colors">Precios</Link></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h4 className={DS.typography.sectionLabel}>Negocios</h4>
              <ul className="space-y-4">
                <li><Link href="/register" className="text-slate-500 hover:text-primary font-bold transition-colors">Crear Cuenta</Link></li>
                <li><Link href="/login" className="text-slate-500 hover:text-primary font-bold transition-colors">Panel Control</Link></li>
                <li><Link href="/contact" className="text-slate-500 hover:text-primary font-bold transition-colors">Soporte</Link></li>
              </ul>
            </div>

            <div className="space-y-6 col-span-2 sm:col-span-1">
              <h4 className={DS.typography.sectionLabel}>Legal</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-slate-500 hover:text-primary font-bold transition-colors">Términos</Link></li>
                <li><Link href="#" className="text-slate-500 hover:text-primary font-bold transition-colors">Privacidad</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 pb-10">
          <p className="text-slate-400 text-sm font-bold tracking-tight">
            © {new Date().getFullYear()} <span className="text-slate-900">{APP_NAME}</span>. Todos los derechos reservados.
          </p>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2 text-slate-500 text-sm font-bold bg-slate-50 px-4 py-2 rounded-full border border-slate-100 italic">
               Hecho con <Heart className="w-4 h-4 text-primary fill-primary animate-pulse" /> por <span className="text-slate-900 not-italic">bryanlopezdev@gmail.com</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
