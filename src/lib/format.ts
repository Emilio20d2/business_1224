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

export const getCurrentWeekId = (): string => {
    const today = new Date();
    const year = getYear(today);
    const weekNumber = getISOWeek(today);
    return `${year}-${weekNumber}`;
}

export const formatWeekIdToDateRange = (weekId: string): string => {
  const parts = weekId.split('-');
  
  if (parts.length === 2) {
    const year = parseInt(parts[0], 10);
    const weekNumber = parseInt(parts[1], 10);

    if (!isNaN(year) && !isNaN(weekNumber)) {
      try {
        const tempDate = new Date(year, 0, 1 + (weekNumber - 1) * 7);
        const startDate = startOfISOWeek(tempDate);
        
        // Ensure we're in the correct year if the week belongs to the previous/next one
        if (getISOWeek(startDate) !== weekNumber) {
            if (weekNumber === 1 && startDate.getMonth() === 11) {
                 startDate.setFullYear(year);
            } else if (weekNumber > 50 && startDate.getMonth() === 0) {
                 startDate.setFullYear(year - 1);
            }
        }
        
        const endDate = addDays(startDate, 6);
        
        const startFormat = format(startDate, 'dd MMM', { locale: es });
        const endFormat = format(endDate, 'dd MMM, yyyy', { locale: es });

        return `${startFormat} - ${endFormat}`;
      } catch (e) {
        console.error("Error parsing ISO weekId:", weekId, e);
        return weekId;
      }
    }
  }

  return weekId;
};