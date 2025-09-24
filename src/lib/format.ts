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
    // We create a date on the first day of the year, then find the Monday of the target week.
    const firstDayOfYear = parse(`${year}-01-04`, 'yyyy-MM-dd', new Date());
    const dateWithWeek = parse(`${week}`, 'w', firstDayOfYear);
    const start = startOfWeek(dateWithWeek, { weekStartsOn: 1, locale: es });
    const end = addDays(start, 6);

    const startFormat = 'd MMM';
    const endFormat = 'd MMM, yyyy';
    
    return `${format(start, startFormat, { locale: es })} - ${format(end, endFormat, { locale: es })}`;
  } catch (e) {
    console.error("Error formatting weekId", e);
    return `Semana ${week} - ${year}`;
  }
};