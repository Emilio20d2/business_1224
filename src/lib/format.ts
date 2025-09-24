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
    // El getDay() de JS devuelve 0 para domingo, 1 para lunes, etc.
    // Necesitamos encontrar el primer lunes.
    const dayOfWeek = getDay(firstDayOfYear); // 0=Sun, 1=Mon, ..., 6=Sat
    const daysToAdd = dayOfWeek === 1 ? 0 : (8 - dayOfWeek) % 7;
    const firstMonday = addDays(firstDayOfYear, daysToAdd);

    // Si la primera semana del año es la semana 1, entonces para la semana 'N'
    // necesitamos añadir 'N-1' semanas. Sin embargo, los weekId pueden no
    // empezar en 1 si el año anterior tuvo 53 semanas.
    // Una aproximación segura es sumar (N-1) semanas al primer lunes.
    // Esto puede tener un desfase de una semana en algunos años bisiestos.
    // La lógica de `parse` era mejor, pero fallaba.
    // Vamos a intentarlo de otra manera.
    
    // Basado en el estándar ISO 8601, la semana 1 es la que contiene el primer jueves.
    // O la que contiene el 4 de enero.
    const simpleDate = new Date(year, 0, 4); // Enero es 0. 4 de Enero.
    const dayOfYear = Math.floor((simpleDate.getTime() - new Date(year, 0, 1).getTime()) / (1000 * 60 * 60 * 24));
    const dayOfWeekForJan4 = getDay(simpleDate);
    const dayShift = dayOfWeekForJan4 === 0 ? 6 : dayOfWeekForJan4 - 1; // Lunes = 0
    
    const weekStartDayOfYear = 1 + (weekNumber - 1) * 7 - dayShift;

    const startDate = addDays(new Date(year, 0, 1), weekStartDayOfYear - 1);
    const endDate = addDays(startDate, 6);

    const startFormat = format(startDate, 'd MMM', { locale: es });
    const endFormat = format(endDate, 'd MMM, yyyy', { locale: es });
    
    return `${startFormat} - ${endFormat}`;

  } catch (e) {
    console.error("Error formatting weekId", e);
    // Fallback al formato antiguo en caso de error
    return `Semana ${weekStr} - ${yearStr}`;
  }
};
