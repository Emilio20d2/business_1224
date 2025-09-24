import { format, addDays, getDay, add, sub, startOfWeek } from 'date-fns';
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

export const formatWeekId = (weekId: string): string => {
  if (!weekId.startsWith('semana-')) {
    return weekId;
  }
  const parts = weekId.split('-');
  if (parts.length !== 3) {
    return weekId;
  }
  const [, yearStr, weekStr] = parts;
  const year = parseInt(yearStr, 10);
  const weekNumber = parseInt(weekStr, 10);

  if (isNaN(year) || isNaN(weekNumber)) {
    return weekId;
  }

  try {
    // Start with Jan 1st of the given year
    const firstDayOfYear = new Date(year, 0, 1);
    // Add (weekNumber - 1) * 7 days
    const dateWithWeekOffset = addDays(firstDayOfYear, (weekNumber - 1) * 7);
    // Get the Monday of that week
    const startDate = startOfWeek(dateWithWeekOffset, { weekStartsOn: 1, locale: es });
    const endDate = addDays(startDate, 6);

    const startFormat = format(startDate, 'd MMM', { locale: es });
    const endFormat = format(endDate, 'd MMM, yyyy', { locale: es });
    
    return `${startFormat} - ${endFormat}`;

  } catch (e) {
    console.error("Error formatting weekId", e);
    // Fallback in case of error
    return `Semana ${weekStr} - ${yearStr}`;
  }
};