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
    <div className={cn("bg-card text-card-foreground rounded-xl p-5 flex flex-col gap-4 shadow", className)}>
      <h3 className="flex items-center gap-3 text-base font-semibold leading-none tracking-tight text-card-foreground/80 -m-5 mb-0 border-b p-5">
        {icon} {title}
      </h3>
      <div className="flex flex-col gap-4">
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
};

export function DatoDoble({ label, value, variation, unit, isEditing, valueId }: DatoDobleProps) {
  const trendColor = variation === undefined ? '' : variation >= 0 ? 'text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-900/50' : 'text-red-600 bg-red-100 dark:text-red-200 dark:bg-red-900/50';

  return (
    <div className="flex justify-between items-baseline">
      {label && <span className="text-lg text-muted-foreground">{label}</span>}
      <div className="flex items-baseline gap-2">
        {isEditing ? (
           <Input type="number" inputMode="decimal" defaultValue={String(value).replace(/[^0-9.,-]+/g, '')} className="w-24 h-8" id={valueId}/>
        ) : (
           <div className="text-2xl font-bold">{value}{unit}</div>
        )}
        {variation !== undefined && (
          <span className={cn("rounded-md px-2 py-1 text-sm font-bold", trendColor)}>
            {variation >= 0 ? '+' : ''}{variation.toLocaleString('es-ES')}%
          </span>
        )}
      </div>
    </div>
  );
}


type DatoSimpleProps = {
  label: string;
  value: string | number | React.ReactNode;
  isEditing?: boolean;
  valueId?: string;
  className?: string;
};

export function DatoSimple({ label, value, isEditing, valueId, className }: DatoSimpleProps) {
    const renderValue = () => {
        if (typeof value === 'object') return value;
        
        if (typeof value === 'string' && value.includes(' / ')) {
            const parts = value.split(' / ');
            const firstPart = parts[0] || '';
            const secondPart = parts[1] || '';

            const firstValue = parseFloat(firstPart.replace(/[^0-9.,-]+/g, '').replace(',', '.'));
            const secondValue = parseFloat(secondPart.replace(/[^0-9.,-]+/g, '').replace(',', '.'));

            return (
                <span className="font-semibold text-right">
                    <span className={firstValue >= 0 ? 'text-green-600' : 'text-red-600'}>{firstPart}</span>
                    {' / '}
                    <span className={secondValue >= 0 ? 'text-green-600' : 'text-red-600'}>{secondPart}</span>
                </span>
            );
        }
        
        if (typeof value === 'string' && value.includes('(') && value.includes(')')) {
             const mainValue = value.substring(0, value.indexOf('(')).trim();
             const percentage = value.substring(value.indexOf('('));
             return <span className="font-semibold text-right">{mainValue} <span className="text-muted-foreground">{percentage}</span></span>
        }

        return <strong className="font-semibold text-right">{value}</strong>;
    }

    return (
        <div className={cn("flex justify-between items-center text-md", className)}>
            <span className="text-muted-foreground">{label}:</span>
            {isEditing ? <Input type="text" defaultValue={String(value).replace(/[^0-p-9.]+/g, '')} className="w-24 h-8" id={valueId}/> : renderValue()}
        </div>
    );
}