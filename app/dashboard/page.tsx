import { createClient } from "@/utils/supabase/server";
import { Store, Ticket, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CreateBusinessButton } from "@/components/dashboard/create-business-button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch businesses owned by this user
  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .eq('owner_id', user?.id || '');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bienvenido, {user?.user_metadata?.full_name || "Dueño"}</h2>
          <p className="text-muted-foreground">Aquí tienes un resumen de tus negocios y fidelización.</p>
        </div>
        <CreateBusinessButton />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Negocios Activos
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Registrados en la plataforma
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recompensas Entregadas
            </CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              A clientes recurrentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Clientes Totales
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">
              Escaneos únicos
            </p>
          </CardContent>
        </Card>
      </div>

      <h3 className="text-lg font-semibold mt-8">Tus Negocios</h3>
      {businesses && businesses.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <Card key={business.id}>
              <CardHeader>
                <CardTitle className="text-md">{business.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Tipo: {business.type}</p>
                <p className="text-sm text-muted-foreground">Recompensas: {business.rewards_available}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="h-32 flex flex-col items-center justify-center text-muted-foreground">
            <Store className="h-8 w-8 mb-2 opacity-50" />
            <p>Todavía no has registrado ningún negocio.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
