"use client";

import { useEffect, useState, ReactElement } from "react";
import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  getBusinessStatus, 
  BusinessSchedule, 
  ScheduleException,
  BusinessStatus as StatusType
} from "@/lib/utils/schedule-helpers";

interface BusinessStatusBadgeProps {
  schedules: BusinessSchedule[];
  exceptions?: ScheduleException[];
}

export function BusinessStatusBadge({ schedules, exceptions = [] }: BusinessStatusBadgeProps): ReactElement | null {
  const [statusInfo, setStatusInfo] = useState<{ status: StatusType; nextChange?: string } | null>(() => {
    // Standardize the props to match the internal component logic
    return getBusinessStatus(schedules, exceptions);
  });

  useEffect(() => {
    // Update every minute to reflect real-time status changes
    const interval = setInterval(() => {
      setStatusInfo(getBusinessStatus(schedules, exceptions));
    }, 60000);

    return () => clearInterval(interval);
  }, [schedules, exceptions]);

  if (!statusInfo) return null;

  const config = {
    open: {
      label: "Abierto",
      variant: "default" as const,
      className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    },
    closed: {
      label: "Cerrado",
      variant: "secondary" as const,
      className: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    },
    closing_soon: {
      label: "Cierra pronto",
      variant: "outline" as const,
      className: "bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse",
    }
  };

  const { label, className } = config[statusInfo.status];

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${className} font-bold px-3 py-1 rounded-full flex items-center gap-1.5`}>
        <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.status === 'open' ? 'bg-emerald-500' : statusInfo.status === 'closed' ? 'bg-rose-500' : 'bg-amber-500'}`} />
        {label}
      </Badge>
      {statusInfo.nextChange && (
        <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {statusInfo.status === 'closed' ? `Abre a las ${statusInfo.nextChange}` : `Hasta las ${statusInfo.nextChange}`}
        </span>
      )}
    </div>
  );
}
