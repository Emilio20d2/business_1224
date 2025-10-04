
import { format, addDays, getISOWeek, getYear, startOfISOWeek, parse, addWeeks, subWeeks, endOfISOWeek } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatCurrency = (amount: number) => {
  if (amount === null || amount === undefined || isNaN(amount)) return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(0);
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(amount);
};

export const formatNumber = (amount: number | null | undefined) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '0';
  return new Intl.NumberFormat('es-ES').format(amount);
};

export const formatPercentage = (value: number | null | undefined, alwaysShowSign = false) => {
  if (value === null || value === undefined || isNaN(value)) return '0,0%';
  const formattedValue = value.toFixed(1).replace('.', ',');
  if (alwaysShowSign) {
      return `${formattedValue}%`;
  }
  const sign = value > 0 ? '+' : '';
  return `${sign}${formattedValue}%`;
};

export const formatPercentageInt = (value: number | null | undefined) => {
    if (value === null || value === undefined || isNaN(value)) return '0%';
    const roundedValue = Math.round(value);
    return `${roundedValue}%`;
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
    
    // Create a date based on year and week number. ISO 8601 weeks start on Monday.
    const date = parse(`${year}-W${String(week).padStart(2, '0')}-1`, "RRRR-'W'II-i", new Date());
    
    const start = startOfISOWeek(date);
    const end = endOfISOWeek(date);

    const startFormatted = format(start, 'd', { locale: es });
    const endFormatted = format(end, 'd \'de\' MMMM', { locale: es });

    return `${startFormatted} - ${endFormatted}`;
  } catch (e) {
    console.error(`Error parsing weekId "${weekId}":`, e);
    return weekId;
  }
};

export const getPreviousWeekId = (weekId: string): string => {
    if (!weekId || typeof weekId !== 'string' || !weekId.includes('-')) {
        return weekId;
    }

    try {
        const [yearStr, weekStr] = weekId.split('-');
        const year = parseInt(yearStr, 10);
        const week = parseInt(weekStr, 10);

        if (isNaN(year) || isNaN(week)) {
            return weekId;
        }
        
        const date = parse(`${year}-W${String(week).padStart(2, '0')}-1`, "RRRR-'W'II-i", new Date());
        const previousWeekDate = subWeeks(date, 1);
        return getWeekIdFromDate(previousWeekDate);
    } catch (e) {
        console.error(`Error calculating previous week for "${weekId}":`, e);
        return weekId;
    }
};

export const getDateOfWeek = (weekId: string, day: 'lunes' | 'jueves'): Date | null => {
    if (!weekId || typeof weekId !== 'string' || !weekId.includes('-')) {
        return null;
    }
    try {
        const [yearStr, weekStr] = weekId.split('-');
        const year = parseInt(yearStr, 10);
        const week = parseInt(weekStr, 10);

        if (isNaN(year) || isNaN(week)) {
            return null;
        }

        const date = parse(`${year}-W${String(week).padStart(2, '0')}-1`, "RRRR-'W'II-i", new Date());
        const monday = startOfISOWeek(date);

        if (day === 'lunes') {
            return monday;
        } else { // thursday
            return addDays(monday, 3);
        }
    } catch (e) {
        console.error(`Error getting date for weekId "${weekId}":`, e);
        return null;
    }
};
