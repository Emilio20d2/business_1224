
import React from 'react';
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type KpiCardProps = {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function KpiCard({ title, icon, children, className }: KpiCardProps) {
  return (
    <div className={cn("bg-card text-card-foreground rounded-xl p-3 flex flex-col gap-2 shadow", className)}>
      <h3 className="flex items-center gap-3 text-base font-normal leading-none tracking-tight text-card-foreground/80 -m-3 mb-0 border-b p-3">
        {icon} {title}
      </h3>
      <div className="flex flex-col gap-2 h-full">
        {children}
      </div>
    </div>
  );
}

type DatoDobleProps = {
  label?: string;
  value: string | number;
  variation?: number;
  unit?: string;
  isEditing?: boolean;
  valueId?: string;
  variationId?: string;
  onInputChange?: (path: string, value: string | number) => void;
};

export function DatoDoble({ label, value, variation, unit, isEditing, valueId, variationId, onInputChange }: DatoDobleProps) {
  const trendColor = variation === undefined ? '' : variation >= 0 ? 'text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-900/50' : 'text-red-600 bg-red-100 dark:text-red-200 dark:bg-red-900/50';

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onInputChange && valueId) {
      onInputChange(valueId, e.target.value);
    }
  };

  const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onInputChange && variationId) {
      onInputChange(variationId, e.target.value);
    }
  };

  const rawValue = typeof value === 'string'
    ? parseFloat(value.replace(/[^0-9.,-]+/g, '').replace(',', '.'))
    : value;

  const valueColor = typeof rawValue === 'number' && rawValue < 0 ? 'text-red-600' : '';

  return (
    <div className="flex justify-between items-baseline">
      {label && <span className="text-lg text-muted-foreground">{label}</span>}
      <div className="flex items-baseline gap-2">
        {isEditing && valueId ? (
          <div className="flex items-center gap-1">
             <Input 
               type="number" 
               inputMode="decimal" 
               defaultValue={Number.isNaN(rawValue) ? '' : rawValue}
               className="w-24 h-8" 
               id={valueId}
               onChange={handleValueChange}
             />
             {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
           </div>
        ) : (
           <div className={cn("text-xl font-bold", valueColor)}>{value}{unit}</div>
        )}
        {variation !== undefined && (
          isEditing && variationId ? (
            <div className="flex items-center gap-1">
             <Input 
               type="number" 
               inputMode="decimal" 
               defaultValue={variation} 
               className="w-16 h-8" 
               id={variationId}
               onChange={handleVariationChange}
             />
             <span className="text-sm text-muted-foreground">%</span>
            </div>
          ) : (
            <span className={cn("rounded-md px-2 py-1 text-sm font-bold", trendColor)}>
              {variation >= 0 ? '+' : ''}{variation.toLocaleString('es-ES')}%
            </span>
          )
        )}
      </div>
    </div>
  );
}


type DatoSimpleProps = {
  label?: string | React.ReactNode;
  value: string | number | React.ReactNode;
  variation?: number;
  trendDirection?: 'up' | 'down'; // 'up' means green is good, 'down' means red is good
  isEditing?: boolean;
  valueId?: string;
  variationId?: string;
  className?: string;
  icon?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  unit?: string;
  onInputChange?: (path: string, value: string | number) => void;
  alwaysShowVariation?: boolean;
};

export function DatoSimple({ 
    label, 
    value, 
    variation,
    trendDirection = 'up',
    isEditing, 
    valueId, 
    variationId,
    className, 
    icon, 
    align = 'left', 
    unit, 
    onInputChange,
    alwaysShowVariation = false
}: DatoSimpleProps) {
    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onInputChange && valueId) {
            onInputChange(valueId, e.target.value);
        }
    };
    const handleVariationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onInputChange && variationId) {
            const numericValue = parseFloat(e.target.value.replace(',', '.'));
            onInputChange(variationId, isNaN(numericValue) ? "" : numericValue);
        }
    };
    
    const rawValue = typeof value === 'string'
      ? parseFloat(value.replace(/[^0-9.,-]+/g, '').replace(',', '.'))
      : value;

    const valueColor = typeof rawValue === 'number' && rawValue < 0 ? 'text-red-600' : 
                       (typeof value === 'string' && value.includes('-')) ? 'text-red-600' : '';

    const getTrendColor = () => {
        if (variation === undefined) return '';
        const isPositive = variation >= 0;
        let colorClass = isPositive ? 'text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-900/50' : 'text-red-600 bg-red-100 dark:text-red-200 dark:bg-red-900/50';

        if (trendDirection === 'down') {
           colorClass = isPositive ? 'text-red-600 bg-red-100 dark:text-red-200 dark:bg-red-900/50' : 'text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-900/50';
        }
        
        return colorClass;
    };
    
    const renderValue = () => {
        if (isEditing && valueId && onInputChange) {
            const numericValue = typeof rawValue === 'number' && !isNaN(rawValue) ? rawValue : '';
            return (
                 <div className="flex items-baseline justify-center gap-1 w-full">
                    <Input 
                      type="number"
                      inputMode="decimal" 
                      step="any" 
                      defaultValue={numericValue === 0 ? '0' : numericValue} 
                      className={cn("text-lg w-24", align === 'right' ? 'text-right' : 'text-center')} 
                      id={valueId}
                      onChange={handleValueChange}
                    />
                    {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
                 </div>
            )
        }
        const showValue = value !== 0 && (!value && (alwaysShowVariation && variation !== undefined)) ? '' : value;

        if (showValue === '' && !isEditing) return null;
        
        return <strong className={cn("text-lg w-full flex items-center justify-center gap-1", valueColor, align === 'right' && 'justify-end', align === 'left' && 'justify-start')}>{showValue}{!isEditing && unit && showValue !== '' ? unit : ''}</strong>;
    }

    const renderVariation = () => {
      if (variation === undefined) return null;

      if (isEditing && variationId && onInputChange) {
        return (
          <div className="flex items-center justify-center gap-1 mt-1">
              <Input 
                  type="number" 
                  inputMode="decimal" 
                  defaultValue={variation} 
                  className="w-16 h-7 text-xs text-right" 
                  id={variationId}
                  onChange={handleVariationChange}
              />
              <span className="text-xs text-muted-foreground">%</span>
          </div>
        );
      }
      
      if (!isEditing || alwaysShowVariation) {
        const colorClass = getTrendColor();
        return (
          <div className={cn("rounded-md px-2 py-1 text-sm font-bold", colorClass)}>
            {variation >= 0 ? '+' : ''}{variation.toLocaleString('es-ES')}%
          </div>
        );
      }
      
      return null;
    }

    const alignmentClasses = {
        left: "items-center justify-start text-left",
        center: "flex-col items-center justify-center text-center gap-1 h-full",
        right: "items-center justify-end text-right",
    }

    const iconToShow = typeof label === 'string' ? icon : label;
    const textLabel = typeof label === 'string' ? label : null;


    return (
        <div className={cn("flex w-full", alignmentClasses[align], className)}>
            <div className={cn("flex flex-col gap-1 w-full", `items-${align}`)}>
              {(textLabel || iconToShow) && 
                <span className="flex items-center gap-2 text-muted-foreground justify-center text-sm font-normal">
                    {iconToShow}
                    {textLabel}
                </span>
              }
               <div className="text-center flex-col justify-center items-center flex gap-1">
                    {renderValue()}
                    {renderVariation()}
               </div>
            </div>
        </div>
    );
}
