import { parse, format, addDays, startOfWeek } from 'date-fns';
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
  const [, year, week] = parts;

  try {
    // Using Jan 4th of the year is a safe way to get the correct year for ISO week dates.
    const firstDayOfYear = parse(`${year}-01-04`, 'yyyy-MM-dd', new Date());
    const dateWithWeek = parse(`${week}`, 'w', firstDayOfYear, { locale: es });
    const start = startOfWeek(dateWithWeek, { weekStartsOn: 1, locale: es });
    const end = addDays(start, 6);

    const startFormat = format(start, 'd MMM', { locale: es });
    const endFormat = format(end, 'd MMM, yyyy', { locale: es });
    
    return `${startFormat} - ${endFormat}`;
  } catch (e) {
    console.error("Error formatting weekId", e);
    // Fallback to the old format in case of error
    return `Semana ${week} - ${year}`;
  }
};
