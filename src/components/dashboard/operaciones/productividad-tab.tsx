
"use client";

import React from 'react';
import type { ProductividadData } from "@/lib/data";
import { KpiCard, DatoSimple } from "../kpi-card";
import { Zap, Users, Euro } from 'lucide-react';

type ProductividadTabProps = {
  data: ProductividadData;
  isEditing: boolean;
  onInputChange: (path: string, value: any, reorder?: boolean) => void;
};

export function ProductividadTab({ data, isEditing, onInputChange }: ProductividadTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KpiCard title="Productividad General" icon={<Zap className="h-5 w-5 text-primary" />}>
        <div className="space-y-4">
            <DatoSimple
                label="Productividad"
                value={data.productividad}
                isEditing={isEditing}
                valueId="productividad.productividad"
                onInputChange={onInputChange}
                unit="€/h"
                align="center"
            />
            <DatoSimple
                label="Horas contratadas"
                value={data.horasContratadas}
                isEditing={isEditing}
                valueId="productividad.horasContratadas"
                onInputChange={onInputChange}
                unit="h"
                align="center"
            />
        </div>
      </KpiCard>
       <KpiCard title="Coste Personal" icon={<Users className="h-5 w-5 text-primary" />}>
        <div className="space-y-4">
           <DatoSimple
                label="Coste / Venta"
                value={data.costeVenta}
                isEditing={isEditing}
                valueId="productividad.costeVenta"
                onInputChange={onInputChange}
                unit="%"
                align="center"
            />
            <DatoSimple
                label="Coste Real"
                value={data.costeReal}
                isEditing={isEditing}
                valueId="productividad.costeReal"
                onInputChange={onInputChange}
                unit="€"
                align="center"
            />
        </div>
      </KpiCard>
       <KpiCard title="Nómina" icon={<Euro className="h-5 w-5 text-primary" />}>
            <DatoSimple
                label="Nómina Real"
                value={data.nominaReal}
                isEditing={isEditing}
                valueId="productividad.nominaReal"
                onInputChange={onInputChange}
                unit="€"
                align="center"
            />
      </KpiCard>
    </div>
  );
}
