import { parse, format, addDays, getDay, add, sub } from 'date-fns';
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
    const firstDayOfYear = new Date(year, 0, 1);
    let daysToFirstMonday = (8 - getDay(firstDayOfYear) + 7) % 7;
    // Si el 1 de enero es lunes (getDay devuelve 1), daysToFirstMonday será 0, lo cual es correcto
    // Si no es lunes, se ajusta para encontrar el primer lunes.
    if(getDay(firstDayOfYear) === 0){ // Sunday
        daysToFirstMonday=1;
    } else if (getDay(firstDayOfYear) > 1){ // Not Monday
        daysToFirstMonday = 8 - getDay(firstDayOfYear)
    }

    const firstMondayOfYear = addDays(firstDayOfYear, daysToFirstMonday);
    
    // The first week of the year is the one containing the first Thursday.
    // A simpler approach for ISO week is to calculate from a known date.
    // Let's use a simpler logic for now: start from the first monday.
    const weekStartDate = addDays(firstMondayOfYear, (weekNumber - 2) * 7);

    // Let's try another approach based on date-fns `parse`
    const parsedDate = parse(`${year}-W${weekStr}`, 'YYYY-y', new Date(), { locale: es });
    const startDate = parsedDate; // date-fns parse with "w" will point to the start of the week.

    const endDate = addDays(startDate, 6);

    const startFormat = format(startDate, 'd MMM', { locale: es });
    const endFormat = format(endDate, 'd MMM, yyyy', { locale: es });
    
    return `${startFormat} - ${endFormat}`;
  } catch (e) {
    console.error("Error formatting weekId", e);
    // Fallback to the old format in case of error
    return `Semana ${weekStr} - ${yearStr}`;
  }
};