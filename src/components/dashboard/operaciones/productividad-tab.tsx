
"use client";

import React, { useState } from 'react';
import type { ProductividadData, ProductividadSeccion } from "@/lib/data";
import { KpiCard, DatoSimple } from "../kpi-card";
import { Zap, Users, Euro, Package, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

type ProductividadTabProps = {
  data: {
    lunes: ProductividadData;
    jueves: ProductividadData;
  };
  isEditing: boolean;
  onInputChange: (path: string, value: any, reorder?: boolean) => void;
};

const PaqueteriaRow = ({ label, unidades, horas, isEditing, onInputChange, basePath, unidadesId, horasId }: { label: string, unidades: number, horas: number, isEditing: boolean, onInputChange: any, basePath: string, unidadesId: string, horasId: string }) => {
    return (
        <div className="grid grid-cols-3 items-center text-center gap-2">
            <span className="text-sm font-medium text-muted-foreground text-left">{label}</span>
            <DatoSimple
                value={unidades}
                isEditing={isEditing}
                valueId={unidadesId}
                onInputChange={onInputChange}
                unit="un."
                align="right"
            />
            <DatoSimple
                value={horas}
                isEditing={isEditing}
                valueId={horasId}
                onInputChange={onInputChange}
                unit="h"
                align="right"
            />
        </div>
    );
};


const DayProductividad = ({ dayData, dayKey, isEditing, onInputChange }: { dayData: ProductividadData, dayKey: 'lunes' | 'jueves', isEditing: boolean, onInputChange: any }) => {
    if (!dayData || !dayData.productividadPorSeccion) return null;

    const sections = [
        { key: 'woman', title: 'WOMAN' },
        { key: 'man', title: 'MAN' },
        { key: 'nino', title: 'NIÑO' },
    ] as const;

    const totalUnidadesConfeccion = sections.reduce((sum, sec) => sum + (dayData.productividadPorSeccion[sec.key]?.unidadesConfeccion || 0), 0);
    const totalHorasConfeccion = sections.reduce((sum, sec) => sum + (dayData.productividadPorSeccion[sec.key]?.horasConfeccion || 0), 0);
    const totalUnidadesPaqueteria = sections.reduce((sum, sec) => sum + (dayData.productividadPorSeccion[sec.key]?.unidadesPaqueteria || 0), 0);
    const totalHorasPaqueteria = sections.reduce((sum, sec) => sum + (dayData.productividadPorSeccion[sec.key]?.horasPaqueteria || 0), 0);

    return (
        <div className="space-y-4">
             <KpiCard title="TOTAL" icon={<Zap className="h-5 w-5 text-primary" />}>
                <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-3 items-center text-center gap-2">
                        <span className="text-sm font-semibold text-muted-foreground text-left"></span>
                        <span className="text-sm font-semibold text-muted-foreground text-right">Unidades</span>
                        <span className="text-sm font-semibold text-muted-foreground text-right">Horas</span>
                    </div>
                    <Separator />
                     <div className="grid grid-cols-3 items-center text-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground text-left">UN. CONFECCION</span>
                        <span className="text-lg font-medium text-right">{totalUnidadesConfeccion}un.</span>
                        <span className="text-lg font-medium text-right">{totalHorasConfeccion}h</span>
                    </div>
                     <div className="grid grid-cols-3 items-center text-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground text-left">UN. PAQUETERIA</span>
                        <span className="text-lg font-medium text-right">{totalUnidadesPaqueteria}un.</span>
                        <span className="text-lg font-medium text-right">{totalHorasPaqueteria}h</span>
                    </div>
                </div>
            </KpiCard>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sections.map(section => {
                    const sectionData = dayData.productividadPorSeccion[section.key];
                    if (!sectionData) return null;
                    
                    return (
                        <KpiCard key={section.key} title={section.title} icon={<Users className="h-5 w-5 text-primary" />}>
                            <div className="space-y-2 pt-2">
                                <div className="grid grid-cols-3 items-center text-center gap-2">
                                    <span className="text-sm font-semibold text-muted-foreground text-left"></span>
                                    <span className="text-sm font-semibold text-muted-foreground text-right">Unidades</span>
                                    <span className="text-sm font-semibold text-muted-foreground text-right">Horas</span>
                                </div>
                                <Separator />
                                <PaqueteriaRow
                                    label="UN. CONFECCION"
                                    unidades={sectionData.unidadesConfeccion}
                                    horas={sectionData.horasConfeccion}
                                    isEditing={isEditing}
                                    onInputChange={onInputChange}
                                    basePath={`productividad.${dayKey}.productividadPorSeccion.${section.key}`}
                                    unidadesId={`productividad.${dayKey}.productividadPorSeccion.${section.key}.unidadesConfeccion`}
                                    horasId={`productividad.${dayKey}.productividadPorSeccion.${section.key}.horasConfeccion`}
                                />
                                <PaqueteriaRow
                                    label="UN. PAQUETERIA"
                                    unidades={sectionData.unidadesPaqueteria}
                                    horas={sectionData.horasPaqueteria}
                                    isEditing={isEditing}
                                    onInputChange={onInputChange}
                                    basePath={`productividad.${dayKey}.productividadPorSeccion.${section.key}`}
                                    unidadesId={`productividad.${dayKey}.productividadPorSeccion.${section.key}.unidadesPaqueteria`}
                                    horasId={`productividad.${dayKey}.productividadPorSeccion.${section.key}.horasPaqueteria`}
                                />
                            </div>
                        </KpiCard>
                    );
                })}
            </div>
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
           {data && <DayProductividad dayData={data.lunes} dayKey="lunes" isEditing={isEditing} onInputChange={onInputChange} />}
        </TabsContent>
        <TabsContent value="jueves" className="mt-0">
           {data && <DayProductividad dayData={data.jueves} dayKey="jueves" isEditing={isEditing} onInputChange={onInputChange} />}
        </TabsContent>
    </Tabs>
  );
}
