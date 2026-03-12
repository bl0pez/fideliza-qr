"use client";

import { Clock, AlertCircle } from "lucide-react";
import { minutesToTime, parseRange } from "@/lib/utils/schedule-helpers";

interface BusinessSchedulesListProps {
  schedules: { day_of_week: number; hour_range: string }[];
  exceptions?: { date: string; is_closed: boolean; reason?: string; hour_range?: string }[];
}

const DAYS_NAMES = [
  { id: 1, name: "Lunes" },
  { id: 2, name: "Martes" },
  { id: 3, name: "Miércoles" },
  { id: 4, name: "Jueves" },
  { id: 5, name: "Viernes" },
  { id: 6, name: "Sábado" },
  { id: 0, name: "Domingo" },
];

export function BusinessSchedulesList({ schedules, exceptions = [] }: BusinessSchedulesListProps) {
  const today = new Date().getDay();

  // Group schedules by day
  const groupedSchedules = schedules.reduce((acc, curr) => {
    if (!acc[curr.day_of_week]) acc[curr.day_of_week] = [];
    acc[curr.day_of_week].push(curr.hour_range);
    return acc;
  }, {} as Record<number, string[]>);

  // Filter and sort upcoming exceptions
  const upcomingExceptions = exceptions
    .filter(ex => new Date(ex.date) >= new Date(new Date().setHours(0,0,0,0)))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="bg-background border border-border rounded-3xl p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 px-1">
          <Clock className="w-4 h-4 text-primary" />
          <h4 className="text-sm font-bold text-foreground italic">Horarios de Atención</h4>
        </div>
        
        <div className="space-y-3">
          {DAYS_NAMES.map((day) => {
            const daySchedules = groupedSchedules[day.id];
            const isToday = today === day.id;

            return (
              <div 
                key={day.id} 
                className={`flex items-center justify-between py-1 px-2 rounded-lg transition-colors ${
                  isToday ? "bg-primary/5 border border-primary/10" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>
                    {day.name}
                  </span>
                  {isToday && (
                    <span className="flex h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                
                <div className="flex flex-col items-end">
                  {daySchedules && daySchedules.length > 0 ? (
                    daySchedules.map((range, idx) => {
                      const { start, end } = parseRange(range);
                      return (
                        <span key={idx} className={`text-sm ${isToday ? "font-bold text-foreground" : "text-muted-foreground"}`}>
                          {minutesToTime(start)} - {minutesToTime(end)}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-sm text-muted-foreground/50 italic">Cerrado</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {upcomingExceptions.length > 0 && (
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <h4 className="text-sm font-bold text-amber-600">Avisos Especiales</h4>
          </div>
          <div className="space-y-3">
            {upcomingExceptions.map((ex, idx) => (
              <div key={idx} className="flex flex-col gap-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-700">
                    {new Date(ex.date).toLocaleDateString('es-CL', { day: 'numeric', month: 'long', timeZone: 'UTC' })}
                  </span>
                  <span className="text-[10px] uppercase font-black text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-md">
                    {ex.is_closed ? "Cerrado" : "Horario Especial"}
                  </span>
                </div>
                {ex.reason && (
                  <p className="text-[11px] text-amber-600/80 leading-tight">
                    {ex.reason}
                  </p>
                )}
                {!ex.is_closed && ex.hour_range && (
                  <p className="text-[11px] font-bold text-amber-700">
                    Horario: {(() => {
                      const { start, end } = parseRange(ex.hour_range);
                      return `${minutesToTime(start)} - ${minutesToTime(end)}`;
                    })()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
