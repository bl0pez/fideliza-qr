import { Store, Rocket, QrCode, ClipboardList, ArrowRight, Smartphone } from "lucide-react";
import Link from "next/link";

export function BusinessCTA() {
  return (
    <section className="px-4 py-16">
      <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[2.5rem] bg-slate-900 p-8 md:p-16 text-white shadow-2xl">
        {/* Decorative Mesh Gradients */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none opacity-50" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[80px] -ml-10 -mb-10 pointer-events-none opacity-30" />
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-md text-xs font-black uppercase tracking-widest text-primary-foreground">
              <Rocket className="w-4 h-4 text-primary" />
              <span>Plataforma para Comercios</span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[0.95]">
              Digitaliza tu <br />
              <span className="bg-linear-to-r from-primary to-orange-400 bg-clip-text text-transparent italic text-5xl md:text-7xl">tarjeta de sellos</span> <br />
              y crece hoy
            </h2>
            
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium max-w-lg">
              Elimina el papel. Fideliza a tus clientes con códigos QR y ofrece recompensas que realmente valoran.
            </p>

            <Link
              href="/register"
              className="group flex items-center gap-3 bg-white text-slate-900 px-8 py-5 rounded-2xl font-black text-lg hover:bg-primary hover:text-white transition-all duration-300 shadow-xl shadow-black/20"
            >
              Registra tu negocio
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="hidden lg:grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
                <QrCode className="w-8 h-8 text-primary" />
                <h3 className="font-bold text-lg leading-tight text-white">Escaneo Simple</h3>
                <p className="text-sm text-slate-500 font-medium">Tus clientes solo necesitan su cámara para sumar puntos.</p>
              </div>
              <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
                <ClipboardList className="w-8 h-8 text-primary" />
                <h3 className="font-bold text-lg leading-tight text-white">Panel de Control</h3>
                <p className="text-sm text-slate-500 font-medium">Administra tus sellos, premios y clientes desde un solo lugar.</p>
              </div>
            </div>
            <div className="space-y-4">
               <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm space-y-3">
                <Smartphone className="w-8 h-8 text-primary" />
                <h3 className="font-bold text-lg leading-tight text-white">App Nativa</h3>
                <p className="text-sm text-slate-500 font-medium">Experiencia fluida para el dueño y el cliente fiel.</p>
              </div>
              <div className="p-1 rounded-[2rem] bg-linear-to-br from-primary/20 to-orange-500/20 border border-white/10">
                <div className="h-full w-full p-6 rounded-[1.9rem] bg-slate-900/40 backdrop-blur-sm">
                   <p className="text-xl font-black text-white leading-tight">Tarjetas <br/><span className="text-primary italic">Ilimitadas</span></p>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Configura tus premios</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
