import { format, addDays, parse, isValid, startOfWeek } from 'date-fns';
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
    const today = new Date('2025-09-15T12:00:00'); // Using a fixed date for consistency
    const monday = startOfWeek(today, { weekStartsOn: 1 });
    return `semana-${format(monday, 'd-M-yy')}`;
}

export const formatWeekIdToDateRange = (weekId: string): string => {
  if (!weekId.startsWith('semana-') || !weekId.includes('-')) {
    return weekId;
  }
  
  const datePart = weekId.substring(7);
  
  // Check if the date part is in the expected d-M-yy format
  const parts = datePart.split('-');
  if (parts.length !== 3) {
    return weekId;
  }

  try {
    const startDate = parse(datePart, 'd-M-yy', new Date());
    
    if (!isValid(startDate)) {
        console.error("Invalid date parsed from weekId:", weekId);
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

    