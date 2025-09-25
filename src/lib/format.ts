import { format, addDays, getISOWeek, getYear, startOfISOWeek, parse, addWeeks } from 'date-fns';
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
    return "Selecciona una fecha";
  }

  const [yearStr, weekStr] = weekId.split('-');
  const year = parseInt(yearStr, 10);
  const weekNumber = parseInt(weekStr, 10);

  if (isNaN(year) || isNaN(weekNumber)) {
    return `${weekId}`;
  }

  try {
    const firstDayOfYear = new Date(year, 0, 4);
    const dateWithWeek = addWeeks(startOfISOWeek(firstDayOfYear), weekNumber - 1);
    
    return format(dateWithWeek, 'dd MMM', { locale: es });
  } catch (e) {
    console.error("Error parsing ISO weekId:", weekId, e);
    return `${weekId}`;
  }
};
