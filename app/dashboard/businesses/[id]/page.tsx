import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Ticket, CalendarIcon, CheckCircle2, QrCode, ScanLine } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { RewardForm } from "@/components/dashboard/reward-form";
import { getBusinessRewards, deleteReward } from "@/app/actions/rewards";
import { APP_NAME } from "@/lib/constants";

export const metadata = {
  title: `Gestión de Negocio | ${APP_NAME}`,
};

export default async function BusinessDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: businessId } = await params;
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  // 1. Obtener detalles del negocio
  const { data: business } = await supabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .eq("owner_id", user.id)
    .single();

  if (!business) {
    notFound();
  }

  // 2. Obtener las recompensas creadas para este negocio
  const rewards = await getBusinessRewards(businessId);

  return (
    <div className="space-y-8 pb-10 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">
            {business.name}
          </h2>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Badge variant="outline" className="uppercase text-[10px] tracking-wider font-bold">
              {business.type}
            </Badge>
            Panel de fidelización y recompensas
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="default"
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
            nativeButton={false}
            render={
              <Link href={`/dashboard/businesses/${businessId}/scanner`}>
                <ScanLine className="mr-2 h-4 w-4" /> Abrir Escáner
              </Link>
            }
          />
          <Button variant="outline" className="border-primary/20 hover:bg-primary/10">
            <QrCode className="mr-2 h-4 w-4 text-primary" />
            Descargar QR
          </Button>
          <RewardForm businessId={businessId} />
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold tracking-tight text-white/90 flex items-center gap-2">
            <Ticket className="h-5 w-5 text-primary" /> Tarjetas de Fidelización 
          </h3>
          <Badge variant="secondary" className="font-mono text-xs">
            {rewards.length} CREADAS
          </Badge>
        </div>

        {rewards.length === 0 ? (
          <Card className="border-dashed h-48 flex flex-col items-center justify-center text-muted-foreground/60 transition-colors hover:border-primary/50 hover:bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center pt-6 text-center">
              <Ticket className="h-10 w-10 mb-4 opacity-20" />
              <p className="text-sm font-medium text-foreground">Aún no has creado ninguna recompensa.</p>
              <p className="text-xs mt-1">Crea tu primera tarjeta para que tus clientes comiencen a escanear.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rewards.map((reward) => (
              <Card key={reward.id} className="flex flex-col border-border shadow-lg overflow-hidden group">
                <CardHeader className="bg-muted/30 border-b border-border pb-4">
                  <div className="flex justify-between items-start gap-4">
                    <CardTitle className="text-lg font-bold leading-tight">
                      {reward.title}
                    </CardTitle>
                    {reward.is_active ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 border-none shrink-0 uppercase text-[10px] font-bold tracking-wider">Activa</Badge>
                    ) : (
                      <Badge variant="secondary" className="shrink-0 uppercase text-[10px] font-bold tracking-wider">Inactiva</Badge>
                    )}
                  </div>
                  {reward.description && (
                    <CardDescription className="text-xs mt-2 line-clamp-2">
                      {reward.description}
                    </CardDescription>
                  )}
                </CardHeader>

                <CardContent className="flex-1 pt-4 pb-2 space-y-4">
                  {/* Meta - Escaneos */}
                  <div className="flex items-center justify-between bg-background border border-border rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <QrCode className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Meta</span>
                    </div>
                    <span className="font-black text-xl tabular-nums text-foreground">
                      {reward.scans_required} <span className="text-[10px] font-medium text-muted-foreground">escaneos</span>
                    </span>
                  </div>

                  {/* Fecha de expiración */}
                  {reward.expires_at && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-primary/5 p-2 rounded-lg border border-primary/10">
                      <CalendarIcon className="h-4 w-4 text-primary shrink-0" />
                      <span>Expira el {format(new Date(reward.expires_at), "PPP", { locale: es })}</span>
                    </div>
                  )}

                  {/* Requisitos */}
                  {reward.requirements && (
                    <div className="text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-foreground/80">
                        <CheckCircle2 className="h-3 w-3" /> Condiciones:
                      </div>
                      <p className="text-muted-foreground pl-4 border-l-2 border-border/50 ml-1">
                        {reward.requirements}
                      </p>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-2 pb-4 px-4 flex justify-end gap-2 border-t border-border/50 bg-muted/10">
                   {/* Formulario Server Action para eliminar */}
                   <form action={async () => {
                     "use server";
                     await deleteReward(reward.id, businessId);
                   }}>
                     <Button type="submit" variant="destructive" size="sm" className="h-8 text-xs font-semibold">
                       Eliminar
                     </Button>
                   </form>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
