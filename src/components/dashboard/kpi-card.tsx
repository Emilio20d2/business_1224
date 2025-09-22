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
    <div className={cn("bg-card text-card-foreground rounded-xl p-5 flex flex-col gap-4 shadow-lg", className)}>
      <h3 className="flex items-center gap-3 text-base font-semibold leading-none tracking-tight -m-5 mb-0 border-b p-5">
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
  const trendColor = variation === undefined ? '' : variation >= 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';

  return (
    <div className="flex justify-between items-baseline">
      {label && <span className="text-lg">{label}</span>}
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
        if (typeof value === 'string' && (value.includes('€') || value.includes('Unid.') || value.includes('%'))) {
            const parts = value.split(' / ');
            if (parts.length > 1) {
              return (
                  <span className="font-semibold">
                      <span className={parseFloat(parts[0].replace(/[^0-9.,-]+/g, '').replace(',', '.')) >= 0 ? 'text-green-600' : 'text-red-600'}>{parts[0]}</span>
                      {' / '}
                      {parts[1] && <span className={parseFloat(parts[1].replace(/[^0-9.,-]+/g, '').replace(',', '.')) >= 0 ? 'text-green-600' : 'text-red-600'}>{parts[1]}</span>}
                  </span>
              );
            }
        }
        return <strong className="font-semibold">{value}</strong>;
    }

    return (
        <div className={cn("flex justify-between text-lg", className)}>
            <span>{label}:</span>
            {isEditing ? <Input type="number" inputMode="decimal" defaultValue={String(value).replace(/[^0-9.]+/g, '')} className="w-24 h-8" id={valueId}/> : renderValue()}
        </div>
    );
}
