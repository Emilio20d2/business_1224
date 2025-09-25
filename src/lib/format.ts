import { format, addDays, getDay, add, sub, startOfWeek, getWeek, getYear } from 'date-fns';
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
    const now = new Date('2025-09-15');
    const year = now.getFullYear();
    const weekNumber = getWeek(now, { weekStartsOn: 1, locale: es });
    return `semana-${year}-${weekNumber}`;
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
    // Start with the first day of the year.
    const firstDayOfYear = new Date(year, 0, 1);
    // Find the day of the week (0 for Sunday, 1 for Monday, etc.).
    const firstDayOfWeek = getDay(firstDayOfYear) === 0 ? 7 : getDay(firstDayOfYear);
    // Calculate the date of the first Monday of the year.
    const firstMonday = addDays(firstDayOfYear, (8 - firstDayOfWeek) % 7);
    
    let targetDate;
    if (weekNumber === 1) {
        // For week 1, the start is the first Monday of the year if it falls within the first few days.
        // `date-fns` logic for week 1 is complex, so we can use `startOfWeek`.
        targetDate = startOfWeek(new Date(year, 0, 4), { weekStartsOn: 1, locale: es });
    } else {
        // For other weeks, add the number of weeks to the first Monday.
        targetDate = addDays(firstMonday, (weekNumber - 2) * 7);
    }
    
    const startDate = startOfWeek(targetDate, { weekStartsOn: 1, locale: es });
    const endDate = addDays(startDate, 6);

    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    let startFormat: string;
    let endFormat: string;

    if (startYear !== endYear) {
      startFormat = format(startDate, 'd MMM, yyyy', { locale: es });
      endFormat = format(endDate, 'd MMM, yyyy', { locale: es });
    } else if (startMonth !== endMonth) {
      startFormat = format(startDate, 'd MMM', { locale: es });
      endFormat = format(endDate, 'd MMM, yyyy', { locale: es });
    } else {
      startFormat = format(startDate, 'd', { locale: es });
      endFormat = format(endDate, 'd MMM, yyyy', { locale: es });
    }

    return `${startFormat} - ${endFormat}`;

  } catch (e) {
    console.error("Error formatting weekId", e);
    // Fallback in case of error
    return `Semana ${weekStr} - ${yearStr}`;
  }
};
