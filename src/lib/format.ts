import { format, addDays, getISOWeek, getYear, startOfISOWeek, parse } from 'date-fns';
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
    return `Semana: ${weekId}`;
  }

  const parts = weekId.split('-');
  
  if (parts.length === 2) {
    const year = parseInt(parts[0], 10);
    const weekNumber = parseInt(parts[1], 10);

    if (!isNaN(year) && !isNaN(weekNumber)) {
      try {
        const firstDayOfYear = new Date(year, 0, 1);
        const daysOffset = (weekNumber - 1) * 7;
        const tempDate = addDays(firstDayOfYear, daysOffset);
        
        const startDate = startOfISOWeek(tempDate);
        const endDate = addDays(startDate, 6);
        
        const startFormat = format(startDate, 'dd MMM', { locale: es });
        const endFormat = format(endDate, 'dd MMM, yyyy', { locale: es });

        return `${startFormat} - ${endFormat}`;
      } catch (e) {
        console.error("Error parsing ISO weekId:", weekId, e);
        return `Semana: ${weekId}`;
      }
    }
  }

  return `Semana: ${weekId}`;
};
