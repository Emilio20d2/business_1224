
"use client";

import React, { useState } from 'react';
import type { ProductividadData, ProductividadSeccion } from "@/lib/data";
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

const DayProductividad = ({ dayData, dayKey, isEditing, onInputChange }: { dayData: ProductividadData, dayKey: 'lunes' | 'jueves', isEditing: boolean, onInputChange: any }) => {
    if (!dayData || !dayData.productividadPorSeccion) return null;

    const sections = [
        { key: 'woman', title: 'WOMAN' },
        { key: 'man', title: 'MAN' },
        { key: 'nino', title: 'NIÑO' },
    ] as const;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sections.map(section => {
                const sectionData = dayData.productividadPorSeccion[section.key];
                if (!sectionData) return null;
                
                return (
                    <KpiCard key={section.key} title={section.title} icon={<Users className="h-5 w-5 text-primary" />}>
                        <div className="space-y-4">
                            <DatoSimple
                                label="Productividad"
                                value={sectionData.productividad}
                                isEditing={isEditing}
                                valueId={`productividad.${dayKey}.productividadPorSeccion.${section.key}.productividad`}
                                onInputChange={onInputChange}
                                unit="€/h"
                                align="center"
                            />
                            <DatoSimple
                                label="Horas contratadas"
                                value={sectionData.horasContratadas}
                                isEditing={isEditing}
                                valueId={`productividad.${dayKey}.productividadPorSeccion.${section.key}.horasContratadas`}
                                onInputChange={onInputChange}
                                unit="h"
                                align="center"
                            />
                            <DatoSimple
                                label="Coste / Venta"
                                value={sectionData.costeVenta}
                                isEditing={isEditing}
                                valueId={`productividad.${dayKey}.productividadPorSeccion.${section.key}.costeVenta`}
                                onInputChange={onInputChange}
                                unit="%"
                                align="center"
                            />
                             <DatoSimple
                                label="Coste Real"
                                value={sectionData.costeReal}
                                isEditing={isEditing}
                                valueId={`productividad.${dayKey}.productividadPorSeccion.${section.key}.costeReal`}
                                onInputChange={onInputChange}
                                unit="€"
                                align="center"
                            />
                            <DatoSimple
                                label="Nómina Real"
                                value={sectionData.nominaReal}
                                isEditing={isEditing}
                                valueId={`productividad.${dayKey}.productividadPorSeccion.${section.key}.nominaReal`}
                                onInputChange={onInputChange}
                                unit="€"
                                align="center"
                            />
                        </div>
                    </KpiCard>
                );
            })}
        </div>
    );
}


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
