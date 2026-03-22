export interface BusinessSchedule {
  id?: string;
  business_id?: string;
  day_of_week: number; // 0-6
  hour_range: string; // Postgres int4range format "[start, end)"
}

export interface ScheduleException {
  date: string; // ISO date "YYYY-MM-DD"
  is_closed: boolean;
  reason?: string;
  hour_range?: string;
}

export type BusinessStatus = 'open' | 'closed' | 'closing_soon';

/**
 * Converts "09:30" to 570 (minutes from midnight)
 */
export const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Converts 570 to "09:30"
 */
export const minutesToTime = (min: number): string => {
  // Use modulo 1440 to ensure we stay within 00:00 - 23:59
  // This is critical for <input type="time"> which doesn't support "24:00"
  const normalizedMin = min % 1440;
  const hours = Math.floor(normalizedMin / 60);
  const minutes = normalizedMin % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Formats start and end times to Supabase int4range string
 */
export const formatRangeForSupabase = (start: string, end: string): string => {
  const startMin = timeToMinutes(start);
  let endMin = timeToMinutes(end);
  
  // Si el fin es menor que el inicio, asumimos que es el día siguiente (overnight)
  if (endMin <= startMin) {
    endMin += 1440;
  }
  
  return `[${startMin}, ${endMin})`;
};

/**
 * Parses Postgres int4range string "[540, 1020)" to { start: 540, end: 1020 }
 */
export const parseRange = (range: string): { start: number; end: number } => {
  const match = range.match(/\[(\d+),\s*(\d+)\)/);
  if (!match) return { start: 0, end: 0 };
  return { start: parseInt(match[1]), end: parseInt(match[2]) };
};

/**
 * Validates if a business is open based on its schedules and exceptions
 */
export const getBusinessStatus = (
  schedules: BusinessSchedule[],
  exceptions: ScheduleException[] = []
): { status: BusinessStatus; nextChange?: string } => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const currentDay = now.getDay();

  // 1. Check Exceptions (Holidays, special closures)
  const exception = exceptions.find((e) => e.date === todayStr);
  if (exception) {
    if (exception.is_closed) return { status: 'closed', nextChange: 'Mañana' };
    if (exception.hour_range) {
      const { start, end } = parseRange(exception.hour_range);
      if (currentMinutes >= start && currentMinutes < end) {
        if (end - currentMinutes <= 30) return { status: 'closing_soon', nextChange: minutesToTime(end) };
        return { status: 'open', nextChange: minutesToTime(end) };
      }
      return { status: 'closed', nextChange: minutesToTime(start) };
    }
  }

  // 2. Check Regular Schedules
  // We check both today and yesterday (in case of overnight shifts)
  const yesterday = (currentDay + 6) % 7;
  
  const relevantSchedules = [
    ...schedules
      .filter((s) => s.day_of_week === yesterday)
      .map((s) => ({ ...parseRange(s.hour_range), isYesterday: true })),
    ...schedules
      .filter((s) => s.day_of_week === currentDay)
      .map((s) => ({ ...parseRange(s.hour_range), isYesterday: false }))
  ].sort((a, b) => (a.isYesterday ? a.start - 1440 : a.start) - (b.isYesterday ? b.start - 1440 : b.start));

  for (const range of relevantSchedules) {
    const start = range.isYesterday ? range.start - 1440 : range.start;
    const end = range.isYesterday ? range.end - 1440 : range.end;

    // A range is active if currentMinutes is between start and end
    // (start/end can be negative if it peaked from yesterday into today)
    if (currentMinutes >= start && currentMinutes < end) {
      if (end - currentMinutes <= 30) {
        return { status: 'closing_soon', nextChange: minutesToTime(end < 0 ? end + 1440 : (end >= 1440 ? end - 1440 : end)) };
      }
      return { status: 'open', nextChange: minutesToTime(end < 0 ? end + 1440 : (end >= 1440 ? end - 1440 : end)) };
    }
  }

  // Find next opening
  const nextOpening = schedules
    .filter(s => s.day_of_week === currentDay)
    .map(s => parseRange(s.hour_range))
    .filter(r => r.start > currentMinutes)
    .sort((a, b) => a.start - b.start)[0];

  if (nextOpening) {
    return { status: 'closed', nextChange: minutesToTime(nextOpening.start) };
  }

  return { status: 'closed' };
};
