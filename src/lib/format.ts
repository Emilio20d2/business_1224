
import { format, addDays, getISOWeek, getYear, startOfISOWeek, parse, addWeeks, subWeeks } from 'date-fns';
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
  return `${value.toFixed(2).replace('.', ',')}%`;
};

export const formatGap = (value: number) => {
    const sign = value > 0 ? '+' : '';
    const formattedValue = new Intl.NumberFormat('es-ES').format(value);
    return `${sign}${formattedValue}`;
}

export const getWeekIdFromDate = (date: Date): string => {
    const year = getYear(date);
    const weekNumber = getISOWeek(date);
    return `${year}-${weekNumber}`;
}

export const getCurrentWeekId = (): string => {
    return getWeekIdFromDate(new Date());
}

export const formatWeekIdToDateRange = (weekId: string): string => {
  if (!weekId || typeof weekId !== 'string' || !weekId.includes('-')) {
    return "Selecciona";
  }

  try {
    const [yearStr, weekStr] = weekId.split('-');
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStr, 10);

    if (isNaN(year) || isNaN(week)) {
      return weekId;
    }
    
    // Create a date on the first day of the year, then add weeks
    const firstDayOfYear = new Date(year, 0, 1);
    const firstDayOfIsoWeek = startOfISOWeek(firstDayOfYear);
    const targetWeek = addWeeks(firstDayOfIsoWeek, week - 1);
    const monday = startOfISOWeek(targetWeek);
    
    return format(monday, 'dd MMM', { locale: es });
  } catch (e) {
    console.error(`Error parsing weekId "${weekId}":`, e);
    return weekId;
  }
};
