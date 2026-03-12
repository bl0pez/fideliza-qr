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
  const hours = Math.floor(min / 60);
  const minutes = min % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

/**
 * Formats start and end times to Supabase int4range string
 */
export const formatRangeForSupabase = (start: string, end: string): string => {
  const startMin = timeToMinutes(start);
  const endMin = timeToMinutes(end);
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
  const todaySchedules = schedules
    .filter((s) => s.day_of_week === currentDay)
    .map((s) => parseRange(s.hour_range))
    .sort((a, b) => a.start - b.start);

  if (todaySchedules.length === 0) return { status: 'closed' };

  for (const range of todaySchedules) {
    if (currentMinutes >= range.start && currentMinutes < range.end) {
      // Closing soon if less than 30 mins remaining
      if (range.end - currentMinutes <= 30) {
        return { status: 'closing_soon', nextChange: minutesToTime(range.end) };
      }
      return { status: 'open', nextChange: minutesToTime(range.end) };
    }
    
    // If it's before the first shift or between shifts
    if (currentMinutes < range.start) {
      return { status: 'closed', nextChange: minutesToTime(range.start) };
    }
  }

  // After all shifts
  return { status: 'closed' };
};
