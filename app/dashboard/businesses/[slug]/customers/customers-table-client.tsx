"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";
import { Activity, Trophy, Clock, Search, Filter } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Coincide con la estructura de la base de datos (business_customers_view)
type Customer = {
  id: string;
  customer_name: string | null;
  customer_email: string;
  scans_count: number;
  total_redemptions: number;
  last_visit: string;
  segment: "vip" | "frecuente" | "riesgo" | "perdido" | "nuevo";
};

type SegmentType = Customer["segment"] | "todos";

export function CustomersTableClient({ initialCustomers }: { initialCustomers: Record<string, unknown>[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSegment, setActiveSegment] = useState<SegmentType>("todos");

  // Casteamos de any para mejor tipado interno
  const customers = initialCustomers as Customer[];

  // Lógica de Filtro
  const filteredCustomers = customers.filter((customer) => {
    // 1. Filtro por Búsqueda de Texto
    const matchesSearch =
      (customer.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (customer.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

    // 2. Filtro por Segmento (Botones)
    const matchesSegment = activeSegment === "todos" || customer.segment === activeSegment;

    return matchesSearch && matchesSegment;
  });

  return (
    <div className="space-y-4">
      {/* Controles: Búsqueda y Filtros Rápidos */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-muted/20 p-4 rounded-xl border border-border">
        
        {/* Buscador */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o correo..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-background"
          />
        </div>

        {/* Filtros Inteligentes (Segmentos pre-calculados por DB) */}
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5 mr-1">
                <Filter className="h-3.5 w-3.5"/> Filtrar:
            </span>
            <Button 
              variant={activeSegment === "todos" ? "default" : "outline"} 
              size="sm" 
              className="h-8 shadow-none"
              onClick={() => setActiveSegment("todos")}
            >
                Todos
            </Button>
            <Button 
                variant={activeSegment === "vip" ? "default" : "outline"}
                size="sm" 
                className={`h-8 shadow-none ${activeSegment === 'vip' ? 'bg-amber-500 hover:bg-amber-600' : 'text-amber-600 border-amber-500/20 hover:bg-amber-500/10'}`}
                onClick={() => setActiveSegment("vip")}
            >
                VIP
            </Button>
            <Button 
                variant={activeSegment === "frecuente" ? "default" : "outline"}
                size="sm" 
                className={`h-8 shadow-none ${activeSegment === 'frecuente' ? 'bg-emerald-500 hover:bg-emerald-600' : 'text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10'}`}
                onClick={() => setActiveSegment("frecuente")}
            >
                Frecuentes
            </Button>
             <Button 
                variant={activeSegment === "riesgo" ? "secondary" : "outline"}
                size="sm" 
                className="h-8 shadow-none"
                onClick={() => setActiveSegment("riesgo")}
            >
                En Riesgo
            </Button>
            <Button 
                variant={activeSegment === "perdido" ? "destructive" : "outline"}
                size="sm" 
                className={`h-8 shadow-none ${activeSegment !== 'perdido' ? 'text-destructive border-destructive/20 hover:bg-destructive/10' : ''}`}
                onClick={() => setActiveSegment("perdido")}
            >
                Perdidos
            </Button>
        </div>
      </div>

      {/* Tabla de Clientes */}
      <div className="flex bg-background border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[300px]">Cliente</TableHead>
              <TableHead><div className="flex items-center gap-1"><Activity className="h-3 w-3" /> Visitas Totales</div></TableHead>
              <TableHead><div className="flex items-center gap-1"><Trophy className="h-3 w-3" /> Recompensas</div></TableHead>
              <TableHead className="text-right"><div className="flex items-center justify-end gap-1"><Clock className="h-3 w-3" /> Última Visita</div></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    {customers.length === 0 ? "Aún no tienes clientes registrados." : "No hay clientes que coincidan con los filtros actuales."}
                </TableCell>
              </TableRow>
            ) : (
                filteredCustomers.map((customer) => {
                    const numScans = customer.scans_count || 0;
                    const fallback = customer.customer_name 
                      ? customer.customer_name.substring(0, 2).toUpperCase() 
                      : customer.customer_email.substring(0,2).toUpperCase();
                    
                    const lastVisitDate = new Date(customer.last_visit);

                    // Mapeo visual del Segmento que viene directo de Base de Datos
                    let segmentBadge = null;
                    switch (customer.segment) {
                        case "vip":
                            segmentBadge = <Badge variant="default" className="bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 shadow-none border-amber-500/20 text-[10px] ml-2">VIP</Badge>;
                            break;
                        case "frecuente":
                            segmentBadge = <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 text-[10px] ml-2 shadow-none">Frecuente</Badge>;
                            break;
                        case "riesgo":
                            segmentBadge = <Badge variant="secondary" className="text-muted-foreground text-[10px] ml-2 shadow-none cursor-help" title="Sin visitas en 30+ días">En Riesgo</Badge>;
                            break;
                        case "perdido":
                            segmentBadge = <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none border-destructive/20 text-[10px] ml-2 cursor-help" title="Sin visitas en 60+ días">Perdido</Badge>;
                            break;
                        case "nuevo":
                        default:
                            break; // No mostramos nada especial para nuevos por ahora para no saturar.
                    }

                    return (
                        <TableRow key={customer.id}>
                            <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9">
                                    <AvatarFallback className="bg-primary/10 text-primary">{fallback}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="flex items-center">
                                        <span className="truncate max-w-[150px] sm:max-w-xs text-foreground/90">{customer.customer_name || 'Usuario Anónimo'}</span>
                                        {segmentBadge}
                                    </span>
                                    <span className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-xs">{customer.customer_email}</span>
                                </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="font-semibold text-foreground/90">{numScans}</div>
                            </TableCell>
                            <TableCell>
                                <div className="text-muted-foreground">{customer.total_redemptions || 0} canjes</div>
                            </TableCell>
                            <TableCell className="text-right">
                                <span className={`text-sm font-medium ${customer.segment === 'perdido' ? 'text-destructive/70' : 'text-foreground/80'}`}>
                                    {formatDistanceToNow(lastVisitDate, { addSuffix: true, locale: es })}
                                </span>
                            </TableCell>
                        </TableRow>
                    )
                })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
