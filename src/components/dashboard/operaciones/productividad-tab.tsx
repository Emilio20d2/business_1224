
"use client";

import React, { useState } from 'react';
import type { ProductividadData } from "@/lib/data";
import { KpiCard, DatoSimple } from "../kpi-card";
import { Zap, Users, Euro } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';

type ProductividadTabProps = {
  data: {
    lunes: ProductividadData;
    jueves: ProductividadData;
  };
  isEditing: boolean;
  onInputChange: (path: string, value: any, reorder?: boolean) => void;
};

const DayProductividad = ({ dayData, dayKey, isEditing, onInputChange }: { dayData: ProductividadData, dayKey: 'lunes' | 'jueves', isEditing: boolean, onInputChange: any }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KpiCard title="Productividad General" icon={<Zap className="h-5 w-5 text-primary" />}>
        <div className="space-y-4">
            <DatoSimple
                label="Productividad"
                value={dayData.productividad}
                isEditing={isEditing}
                valueId={`productividad.${dayKey}.productividad`}
                onInputChange={onInputChange}
                unit="€/h"
                align="center"
            />
            <DatoSimple
                label="Horas contratadas"
                value={dayData.horasContratadas}
                isEditing={isEditing}
                valueId={`productividad.${dayKey}.horasContratadas`}
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
                value={dayData.costeVenta}
                isEditing={isEditing}
                valueId={`productividad.${dayKey}.costeVenta`}
                onInputChange={onInputChange}
                unit="%"
                align="center"
            />
            <DatoSimple
                label="Coste Real"
                value={dayData.costeReal}
                isEditing={isEditing}
                valueId={`productividad.${dayKey}.costeReal`}
                onInputChange={onInputChange}
                unit="€"
                align="center"
            />
        </div>
      </KpiCard>
       <KpiCard title="Nómina" icon={<Euro className="h-5 w-5 text-primary" />}>
            <DatoSimple
                label="Nómina Real"
                value={dayData.nominaReal}
                isEditing={isEditing}
                valueId={`productividad.${dayKey}.nominaReal`}
                onInputChange={onInputChange}
                unit="€"
                align="center"
            />
      </KpiCard>
    </div>
);


export function ProductividadTab({ data, isEditing, onInputChange }: ProductividadTabProps) {
  const [activeSubTab, setActiveSubTab] = useState('lunes');
  
  const subTabButtons = [
    { value: 'lunes', label: 'LUNES' },
    { value: 'jueves', label: 'JUEVES' },
  ];

  return (
     <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
        <div className="mb-4 grid w-full grid-cols-2 gap-2">
            {subTabButtons.map(tab => (
                <Button
                    key={tab.value}
                    variant={activeSubTab === tab.value ? 'default' : 'outline'}
                    onClick={() => setActiveSubTab(tab.value)}
                    className="w-full"
                >
                    {tab.label}
                </Button>
            ))}
        </div>

        <TabsContent value="lunes" className="mt-0">
           <DayProductividad dayData={data.lunes} dayKey="lunes" isEditing={isEditing} onInputChange={onInputChange} />
        </TabsContent>
        <TabsContent value="jueves" className="mt-0">
           <DayProductividad dayData={data.jueves} dayKey="jueves" isEditing={isEditing} onInputChange={onInputChange} />
        </TabsContent>
    </Tabs>
  );
}
