import { Zap, AlertCircle, TrendingUp } from "lucide-react";
import Link from "next/link";

interface PlanUsageCardProps {
  planName: string;
  usage: number;
  limit: number;
  branchesUsage: number;
  branchesLimit: number;
  daysUntilReset: number;
}

export function PlanUsageCard({ 
  planName, 
  usage, 
  limit, 
  branchesUsage, 
  branchesLimit,
  daysUntilReset
}: PlanUsageCardProps) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((usage / limit) * 100, 100);
  const isWarning = !isUnlimited && percentage >= 80;

  return (
    <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl space-y-8 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Estado de tu Suscripción</span>
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">Plan {planName}</h3>
        </div>
        <Link href="/dashboard/settings/billing">
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-black text-[10px] hover:bg-primary transition-all shadow-lg shadow-black/10 uppercase tracking-widest">
            MEJORAR PLAN
          </button>
        </Link>
      </div>

      <div className="space-y-6">
        {/* Escaneos Monthly */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Escaneos del Mes</span>
            <span className={`text-xl font-black tracking-tighter ${isWarning ? 'text-orange-500' : 'text-slate-900'}`}>
              {usage} <span className="text-slate-300 font-medium text-sm">/ {isUnlimited ? '∞' : limit}</span>
            </span>
          </div>
          {!isUnlimited && (
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div 
                className={`h-full transition-all duration-1000 ease-out rounded-full ${
                  isWarning 
                  ? 'bg-linear-to-r from-orange-400 to-orange-600 shadow-[0_0_12px_rgba(249,115,22,0.4)]' 
                  : 'bg-linear-to-r from-primary to-orange-400 shadow-[0_0_12px_rgba(var(--primary),0.4)]'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}
          {isWarning && (
            <div className="flex items-center gap-2 text-orange-500 animate-pulse bg-orange-50 p-2 rounded-lg border border-orange-100">
              <AlertCircle className="w-4 h-4" />
              <p className="text-[9px] font-black uppercase tracking-[0.2em]">¡Estás cerca de tu límite mensual!</p>
            </div>
          )}
        </div>

        {/* Otras métricas con diseño premium */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 group hover:border-primary/20 transition-colors">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Sucursales</p>
             <p className="text-2xl font-black text-slate-900 tracking-tighter">{branchesUsage} <span className="text-slate-300 text-sm font-medium">/ {branchesLimit}</span></p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 group hover:border-primary/20 transition-colors">
             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Reset en</p>
             <p className="text-2xl font-black text-slate-900 tracking-tighter">{daysUntilReset} <span className="text-slate-300 text-sm font-medium">Días</span></p>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100">
        <div className="flex items-start gap-4 text-primary bg-primary/5 p-5 rounded-3xl border border-primary/10">
           <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-sm shrink-0">
              <TrendingUp className="w-5 h-5" />
           </div>
           <p className="text-xs font-bold leading-relaxed text-slate-600">
             ¿Necesitas más libertad? Sube al plan <span className="font-black italic text-primary">Pro</span> y obtén sucursales ilimitadas y QR con tu logo.
           </p>
        </div>
      </div>
    </div>
  );
}
