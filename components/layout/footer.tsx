import Link from "next/link";
import { Ticket } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-secondary px-6 py-12 border-t border-border mb-16">
      <div className="flex flex-col gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Ticket className="text-primary w-6 h-6" />
            <span className="text-lg font-bold">FideliLocal</span>
          </div>
          <p className="text-slate-500 text-sm">Empoderando a los negocios locales a través de la tecnología y la fidelización.</p>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <p className="font-bold text-sm uppercase tracking-widest text-slate-400">Plataforma</p>
            <Link href="/explore" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Explorar</Link>
            <Link href="/how-it-works" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Cómo funciona</Link>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-bold text-sm uppercase tracking-widest text-slate-400">Compañía</p>
            <Link href="/business" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Para negocios</Link>
            <Link href="/contact" className="text-slate-600 dark:text-slate-300 hover:text-primary transition-colors">Contacto</Link>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
          <p className="text-slate-400 text-xs">© 2024 FideliLocal. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
