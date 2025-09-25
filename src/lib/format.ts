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
    // Create a date for the first day of the given year.
    const firstDayOfYear = new Date(year, 0, 1);
    // Get the day of the week (0=Sun, 1=Mon, ...). `getDay()` in date-fns returns 0 for Sunday.
    const dayOfWeek = getDay(firstDayOfYear);
    // Calculate the number of days to get to the first Monday.
    // If Jan 1 is Monday (1), daysToAdd = 0. If it's Tuesday (2), daysToAdd = -1. If it's Sunday(0), daysToAdd = 1.
    // We want to find the date of the Monday of the first week.
    // The ISO week starts on a Monday. getWeek's locale `es` also starts on Monday.
    const firstMonday = startOfWeek(firstDayOfYear, { weekStartsOn: 1 });

    // Add weeks to the first Monday of the year
    const targetWeek = add(firstMonday, { weeks: weekNumber -1 });
    
    // Get the start of the week for the calculated date
    const startDate = startOfWeek(targetWeek, { weekStartsOn: 1 });
    const endDate = addDays(startDate, 6);

    const startMonth = startDate.getMonth();
    const endMonth = endDate.getMonth();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();
    
    // A final check to ensure we are in the right year, as week calculation can be tricky at year boundaries
    if (getYear(startDate) < year && weekNumber > 50) {
        // This means week 1 of the 'year' actually started in the previous year.
    } else if (getYear(startDate) > year) {
        // This case can happen for week 52/53 of the previous year.
    }

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
    return `Semana ${weekStr}, ${yearStr}`;
  }
};
