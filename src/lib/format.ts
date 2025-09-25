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
    const firstDayOfYear = new Date(year, 0, 4);
    let firstDayOfWeekOne = startOfWeek(firstDayOfYear, { weekStartsOn: 1 });
    // Handle case where week 1 starts in the previous year
    if (getYear(firstDayOfWeekOne) < year) {
        firstDayOfWeekOne = addDays(firstDayOfWeekOne, 7);
    }
    
    const targetDate = addDays(firstDayOfWeekOne, (weekNumber - 1) * 7);
    
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
