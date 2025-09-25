import { format, addDays, getWeek, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
};

export const formatNumber = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined) return 'N/A';
  return new Intl.NumberFormat('es-ES').format(amount);
};

export const formatPercentage = (value: number | null | undefined) => {
  if (value === null || value === undefined) return 'N/A';
  return `${value.toLocaleString('es-ES')}%`;
};

export const formatGap = (value: number) => {
    const sign = value > 0 ? '+' : '';
    const formattedValue = new Intl.NumberFormat('es-ES').format(value);
    return `${sign}${formattedValue}`;
}

export const getCurrentWeekId = (): string => {
    const now = new Date('2025-09-15T12:00:00Z'); // Use a specific time in UTC
    const year = now.getUTCFullYear();
    // Use ISO week calculation which is more standard
    const weekNumber = getWeek(now, { weekStartsOn: 1, firstWeekContainsDate: 4 });
    return `semana-${year}-${weekNumber}`;
}

export const formatWeekIdToDateRange = (weekId: string): string => {
  if (!weekId.startsWith('semana-')) {
    return weekId;
  }
  const parts = weekId.split('-');
  if (parts.length !== 3) {
    return weekId;
  }
  const [, yearStr, weekStr] = parts;

  try {
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStr, 10);

    if (isNaN(year) || isNaN(week)) {
      return weekId;
    }

    // Create a date for the first day of the year
    const firstDayOfYear = new Date(Date.UTC(year, 0, 1));
    // Calculate the number of days to get to the specified week
    const days = (week - 1) * 7;
    // The start of the week is `days` days after the first day of the year, adjusted for the day of the week.
    // We parse the ISO string to avoid timezone issues.
    const date = new Date(firstDayOfYear.getTime() + days * 24 * 60 * 60 * 1000);
    
    // date-fns' `parse` is the most reliable way. 'Y-Ww-i' = Year-Week-DayOfWeek
    // '1' is for Monday.
    const startDate = parseISO(`${year}-W${String(week).padStart(2, '0')}-1`);
    const endDate = addDays(startDate, 6);
    
    const startFormat = format(startDate, 'dd MMM', { locale: es });
    const endFormat = format(endDate, 'dd MMM, yyyy', { locale: es });

    return `${startFormat} - ${endFormat}`;
  } catch (e) {
    console.error("Error formatting weekId to date range:", e);
    return weekId; // Fallback
  }
};
