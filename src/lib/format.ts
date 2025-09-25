import { format, addDays, parseISO, isValid, getWeek, getYear, startOfISOWeek } from 'date-fns';
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
    // Using a fixed date for consistency, based on ISO week 38 for 2025
    const today = new Date('2025-09-15T12:00:00'); 
    const year = getYear(today);
    const weekNumber = getWeek(today, { weekStartsOn: 1, firstWeekContainsDate: 4 });
    return `semana-${year}-${weekNumber}`;
}

export const formatWeekIdToDateRange = (weekId: string): string => {
  if (!weekId.startsWith('semana-')) {
    return weekId;
  }
  
  const parts = weekId.substring(7).split('-');
  
  // Handles ISO week format: semana-YYYY-WW
  if (parts.length === 2) {
    const year = parseInt(parts[0], 10);
    const weekNumber = parseInt(parts[1], 10);

    if (isNaN(year) || isNaN(weekNumber)) return weekId;

    try {
      // Create a date on that year, then find the start of that ISO week.
      const tempDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
      const startDate = startOfISOWeek(tempDate);
      
      if (!isValid(startDate)) return weekId;

      const endDate = addDays(startDate, 6);
      
      const startFormat = format(startDate, 'dd MMM', { locale: es });
      const endFormat = format(endDate, 'dd MMM, yyyy', { locale: es });

      return `${startFormat} - ${endFormat}`;
    } catch (e) {
      console.error("Error parsing ISO weekId:", weekId, e);
      return weekId; // Fallback
    }
  }

  return weekId; // Fallback for any other format
};
