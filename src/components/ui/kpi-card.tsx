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
    <div className={cn("bg-card text-card-foreground rounded-xl p-4 flex flex-col gap-4 shadow", className)}>
      <h3 className="flex items-center gap-3 text-base font-semibold leading-none tracking-tight text-card-foreground/80 -m-4 mb-0 border-b p-3">
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
  variationId?: string;
};

export function DatoDoble({ label, value, variation, unit, isEditing, valueId, variationId }: DatoDobleProps) {
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
          isEditing ? (
             <Input type="number" inputMode="decimal" defaultValue={variation} className="w-16 h-8" id={variationId}/>
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
  label?: string;
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
        
        const stringValue = String(value);

        if (stringValue.includes('€') || stringValue.includes('Unid.')) {
            const isPositive = !stringValue.includes('-');
            const colorClass = isPositive ? 'text-green-600' : 'text-red-600';
            return <span className={cn("font-semibold text-lg", colorClass)}>{stringValue}</span>
        }

        if (stringValue.includes(' / ')) {
            const parts = stringValue.split(' / ');
            const firstPart = parts[0] || '';
            const secondPart = parts[1] || '';

            return (
                <div className="flex flex-row items-center justify-center gap-2">
                    <span>{firstPart}</span>
                    <span>{secondPart}</span>
                </div>
            );
        }

        return <strong className="font-semibold text-lg">{value}</strong>;
    }

    const alignmentClasses = {
        left: "justify-between",
        center: "flex-col items-center justify-center text-center gap-1 h-full",
        right: "justify-end",
    }
    const labelAlignmentClasses = {
        left: "",
        center: "text-center !text-sm !font-normal !text-muted-foreground",
        right: "text-right",
    }
    const valueAlignmentClasses = {
        left: "text-right",
        center: "text-center",
        right: "text-right",
    }


    return (
        <div className={cn("flex items-center text-md", alignmentClasses[align], className)}>
            <div className={cn("flex flex-col gap-1 w-full", labelAlignmentClasses[align])}>
              <span className="flex items-center gap-2 text-muted-foreground justify-center">
                {icon}
                {label && label}
              </span>
              {isEditing ? <Input type="text" defaultValue={String(value).replace(/[^0-p-9.%]+/g, '')} className="w-24 h-8 self-center" id={valueId}/> : <div className={valueAlignmentClasses[align]}>{renderValue()}</div>}
            </div>
        </div>
    );
}
