import { createClient } from "@/utils/supabase/server";
import { Store, Ticket, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { CreateBusinessButton } from "@/components/dashboard/create-business-button";
import { BusinessDashboardCard } from "@/components/dashboard/business-dashboard-card";
import { getDashboardStats } from "@/app/actions/dashboard";

interface Business {
  id: string;
  name: string;
  type: string;
  image_url: string;
  rewards_available: number;
  slug: string;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch businesses owned by this user
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user?.id || '')
    .order('created_at', { ascending: false });

  const { totalCustomers, totalRewardsDelivered } = await getDashboardStats();

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight italic">
            Bienvenido, <span className="text-primary">{user?.user_metadata?.full_name?.split(' ')[0] || "Dueño"}</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Aquí tienes un resumen de tus negocios y fidelización.
          </p>
        </div>
        <CreateBusinessButton />
      </div>

      {/* Stats Section */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Negocios Activos
            </CardTitle>
            <Store className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{businesses?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registrados en la plataforma
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Recompensas Entregadas
            </CardTitle>
            <Ticket className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{totalRewardsDelivered}</div>
            <p className="text-xs text-muted-foreground mt-1">
              A clientes recurrentes
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-none shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Clientes Totales
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tabular-nums">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Escaneos únicos
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-2xl font-bold tracking-tight text-white/90">Tus Negocios</h3>
          <Badge variant="outline" className="font-mono text-xs opacity-60 border-primary/30 text-primary">
            {businesses?.length || 0} TOTAL
          </Badge>
        </div>
        
        {businesses && businesses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {(businesses as Business[]).map((business) => (
              <BusinessDashboardCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <Card className="border-dashed h-48 flex flex-col items-center justify-center text-muted-foreground/60 transition-colors hover:border-primary/50 hover:bg-muted/30">
            <CardContent className="flex flex-col items-center justify-center pt-6">
              <Store className="h-10 w-10 mb-4 opacity-20" />
              <p className="text-sm font-medium">Todavía no has registrado ningún negocio.</p>
              <p className="text-xs mt-1">¡Crea tu primer negocio para empezar a fidelizar!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
