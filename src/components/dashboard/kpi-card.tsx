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
  icon?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
};

export function DatoSimple({ label, value, isEditing, valueId, className, icon, align = 'left' }: DatoSimpleProps) {
    const renderValue = () => {
        if (typeof value === 'object') return value;
        
        if (typeof value === 'string' && value.includes(' / ')) {
            const parts = value.split(' / ');
            const firstPart = parts[0] || '';
            const secondPart = parts[1] || '';

            const firstValue = parseFloat(firstPart.replace(/[^0-9.,-]+/g, '').replace(',', '.'));
            const secondValue = parseFloat(secondPart.replace(/[^0-9.,-]+/g, '').replace(',', '.'));

            return (
                <div className="font-semibold text-right">
                    <div className={firstValue >= 0 ? 'text-green-600' : 'text-red-600'}>{firstPart}</div>
                    <div className={secondValue >= 0 ? 'text-green-600' : 'text-red-600'}>{secondPart}</div>
                </div>
            );
        }
        
        if (typeof value === 'string' && value.includes('(') && value.includes(')')) {
             const mainValue = value.substring(0, value.indexOf('(')).trim();
             const percentage = value.substring(value.indexOf('('));
             return <div className="font-semibold text-right">{mainValue} <span className="text-muted-foreground">{percentage}</span></div>
        }

        return <strong className="font-semibold text-right">{value}</strong>;
    }

    const alignmentClasses = {
        left: "justify-between",
        center: "flex-col items-center",
        right: "justify-between",
    }
    const labelAlignmentClasses = {
        left: "",
        center: "text-center",
        right: "text-right",
    }
    const valueAlignmentClasses = {
        left: "text-right",
        center: "text-center",
        right: "text-right",
    }


    return (
        <div className={cn("flex items-center text-md", alignmentClasses[align], className)}>
            <span className={cn("flex items-center gap-2 text-muted-foreground", labelAlignmentClasses[align])}>
              {icon}
              {label}:
            </span>
            {isEditing ? <Input type="text" defaultValue={String(value).replace(/[^0-p-9.]+/g, '')} className="w-24 h-8" id={valueId}/> : <div className={valueAlignmentClasses[align]}>{renderValue()}</div>}
        </div>
    );
}
