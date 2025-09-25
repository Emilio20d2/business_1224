import { format, addDays, parse, isValid, startOfWeek, getYear } from 'date-fns';
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
  if (!weekId.startsWith('semana-')) {
    return weekId;
  }
  
  const parts = weekId.substring(7).split('-');
  let startDate: Date;

  try {
    if (parts.length === 2) { // Formato AÑO-WW, ej: "2025-38"
      const year = parseInt(parts[0], 10);
      const weekNumber = parseInt(parts[1], 10);
      if (isNaN(year) || isNaN(weekNumber)) throw new Error("Invalid year or week number");
      
      // Crea una fecha en ese año y luego encuentra el inicio de la semana ISO
      const janFirst = new Date(year, 0, 1);
      const firstMonday = startOfWeek(janFirst, { weekStartsOn: 1 });
      startDate = addDays(firstMonday, (weekNumber - 1) * 7);

      // Ajuste por si el 1 de enero no es lunes
      if (getYear(startDate) > year || (weekNumber === 1 && getYear(startDate) < year)) {
         startDate = addDays(startDate, 7);
      }


    } else if (parts.length === 3) { // Formato D-M-YY, ej: "15-9-25"
      startDate = parse(weekId.substring(7), 'd-M-yy', new Date());
    } else {
      return weekId; // Formato no reconocido
    }

    if (!isValid(startDate)) {
      console.error("Invalid date parsed from weekId:", weekId);
      return weekId;
    }

    const endDate = addDays(startDate, 6);
    
    const startFormat = format(startDate, 'dd MMM', { locale: es });
    const endFormat = format(endDate, 'dd MMM, yyyy', { locale: es });

    return `${startFormat} - ${endFormat}`;
  } catch (e) {
    console.error("Error parsing weekId to date range:", e, weekId);
    return weekId; // Fallback
  }
};
