import { Store, Ticket, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLAN_DEFAULTS, PLAN_IDS } from "@/lib/constants";


import { CreateBusinessButton } from "@/components/dashboard/create-business-button";
import { BusinessDashboardCard } from "@/components/dashboard/business-dashboard-card";
import { PlanUsageCard } from "@/components/dashboard/plan-usage-card";
import { getDashboardStats } from "@/app/actions/dashboard";
import { getUserBusinesses } from "@/app/actions/business";
import { getCurrentUser } from "@/app/actions/auth";

interface Business {
  id: string;
  name: string;
  type: string;
  image_url: string;
  rewards_count: number;
  slug: string;
  plan_id: string;
  scans_this_month: number;
  plans: {
    id: string;
    name: string;
    max_branches: number;
    max_scans_monthly: number;
  }
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const rawBusinesses = await getUserBusinesses();
  
  const businesses = rawBusinesses as unknown as Business[];

  // Use the first business as the primary for plan limits (standard for SaaS with 1 owner)
  const primaryBusiness = businesses?.[0];

  const { totalCustomers, totalRewardsDelivered } = await getDashboardStats();

  // Determine if branch limit is reached
  const branchCount = businesses?.length || 0;
  const maxBranches = primaryBusiness?.plans?.max_branches || PLAN_DEFAULTS[PLAN_IDS.basic].maxBranches;
  const hasReachedLimit = branchCount >= maxBranches;

  // Calculate days until monthly reset (end of current month)
  const now = new Date();
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const daysUntilReset = lastDayOfMonth.getDate() - now.getDate();

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
        <div className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-slate-900 italic">
              Bienvenido, <span className="bg-linear-to-r from-primary to-orange-500 bg-clip-text text-transparent">{user?.user_metadata?.full_name?.split(' ')[0] || "Dueño"}</span>
            </h2>
            <p className="text-slate-500 text-lg font-medium">
              Aquí tienes un resumen de tus negocios y fidelización.
            </p>
          </div>
          <CreateBusinessButton disabled={hasReachedLimit} />
        </div>
        
        <div className="w-full lg:w-auto shrink-0">
          <PlanUsageCard 
            planName={primaryBusiness?.plans?.name || "Básico"}
            usage={primaryBusiness?.scans_this_month || 0}
            limit={primaryBusiness?.plans?.max_scans_monthly || PLAN_DEFAULTS[PLAN_IDS.basic].maxScansMonthly}
            branchesUsage={businesses?.length || 0}
            branchesLimit={primaryBusiness?.plans?.max_branches || PLAN_DEFAULTS[PLAN_IDS.basic].maxBranches}
            daysUntilReset={daysUntilReset}
          />
        </div>
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
