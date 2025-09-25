import { format, addDays, getWeek, parse, startOfWeek } from 'date-fns';
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
    const now = new Date('2025-09-15T12:00:00Z');
    const monday = startOfWeek(now, { weekStartsOn: 1 });
    return `semana-${format(monday, 'd-M-yy')}`;
}

export const formatWeekIdToDateRange = (weekId: string): string => {
  if (!weekId.startsWith('semana-')) {
    return weekId;
  }
  const datePart = weekId.substring(7); // remove "semana-"
  
  try {
    const startDate = parse(datePart, 'd-M-yy', new Date());
    const endDate = addDays(startDate, 6);
    
    const startFormat = format(startDate, 'dd MMM', { locale: es });
    const endFormat = format(endDate, 'dd MMM, yyyy', { locale: es });

    return `${startFormat} - ${endFormat}`;
  } catch (e) {
    console.error("Error parsing weekId to date range:", e);
    return weekId; // Fallback
  }
};
