
import { format, addDays, parse, startOfWeek, isValid } from 'date-fns';
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

export const formatWeekIdToDateRange = (weekId: string): string => {
  if (!weekId.startsWith('semana-')) {
    return weekId;
  }
  const datePart = weekId.substring(7);
  
  try {
    // We use a reference date of 0 to ensure parse works correctly with 'd-M-yy'
    const startDate = parse(datePart, 'd-M-yy', new Date());
    
    if (!isValid(startDate)) {
        return weekId; // Fallback if date is invalid
    }

    const endDate = addDays(startDate, 6);
    
    const startFormat = format(startDate, 'dd MMM', { locale: es });
    const endFormat = format(endDate, 'dd MMM, yyyy', { locale: es });

    return `${startFormat} - ${endFormat}`;
  } catch (e) {
    console.error("Error parsing weekId to date range:", e);
    return weekId; // Fallback
  }
};
