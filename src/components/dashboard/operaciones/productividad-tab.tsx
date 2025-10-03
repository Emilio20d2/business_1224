
"use client";

import React, { useState } from 'react';
import type { ProductividadData, CoberturaHora } from "@/lib/data";
import { KpiCard, DatoSimple } from "../kpi-card";
import { Zap, Users } from 'lucide-react';
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

const PaqueteriaRow = ({ label, unidades, productividadRatio, isEditing, onInputChange, unidadesId }: { label: string, unidades: number, productividadRatio: number, isEditing: boolean, onInputChange: any, unidadesId: string }) => {
    const horas = productividadRatio > 0 ? (unidades || 0) / productividadRatio : 0;
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
            <div className="text-right text-lg font-medium">
                {(horas || 0).toFixed(2)}h
            </div>
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
    const totalUnidadesPaqueteria = sections.reduce((sum, sec) => sum + (dayData.productividadPorSeccion[sec.key]?.unidadesPaqueteria || 0), 0);
    const totalHorasConfeccion = totalUnidadesConfeccion / 120;
    const totalHorasPaqueteria = totalUnidadesPaqueteria / 80;

    const totalPersonas = dayData.coberturaPorHoras.reduce((sum, item) => sum + (item.personas || 0), 0);


    return (
        <div className="space-y-4">
             <KpiCard title="TOTAL" icon={<Zap className="h-5 w-5 text-primary" />}>
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-3 items-center text-center gap-2">
                        <span className="text-sm font-semibold text-muted-foreground text-left"></span>
                        <span className="text-sm font-semibold text-muted-foreground text-right">Unidades</span>
                        <span className="text-sm font-semibold text-muted-foreground text-right">Productividad</span>
                    </div>
                    <Separator />
                     <div className="grid grid-cols-3 items-center text-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground text-left">UN. CONFECCION</span>
                        <span className="text-lg font-medium text-right">{totalUnidadesConfeccion} un.</span>
                        <span className="text-lg font-medium text-right">{totalHorasConfeccion.toFixed(2)} h</span>
                    </div>
                     <div className="grid grid-cols-3 items-center text-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground text-left">UN. PAQUETERIA</span>
                        <span className="text-lg font-medium text-right">{totalUnidadesPaqueteria} un.</span>
                        <span className="text-lg font-medium text-right">{totalHorasPaqueteria.toFixed(2)} h</span>
                    </div>
                </div>

                <Separator className="my-4"/>

                <div>
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                        <Users className="h-4 w-4" />
                        COBERTURA
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3 space-y-2">
                            <div className="grid grid-cols-7 text-center text-sm font-semibold text-muted-foreground">
                                {dayData.coberturaPorHoras.map(item => <div key={item.hora}>{item.hora}</div>)}
                            </div>
                            <div className="grid grid-cols-7 text-center">
                                {dayData.coberturaPorHoras.map((item, index) => (
                                    <DatoSimple
                                        key={item.hora}
                                        value={item.personas}
                                        isEditing={isEditing}
                                        onInputChange={onInputChange}
                                        valueId={`productividad.${dayKey}.coberturaPorHoras.${index}.personas`}
                                        align="center"
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center space-y-2 border-l pl-4">
                            <span className="text-sm font-semibold text-muted-foreground">TOTAL</span>
                            <span className="text-3xl font-bold">{totalPersonas}</span>
                        </div>
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
                                    <span className="text-sm font-semibold text-muted-foreground text-right">Productividad</span>
                                </div>
                                <Separator />
                                <PaqueteriaRow
                                    label="UN. CONFECCION"
                                    unidades={sectionData.unidadesConfeccion}
                                    productividadRatio={120}
                                    isEditing={isEditing}
                                    onInputChange={onInputChange}
                                    unidadesId={`productividad.${dayKey}.productividadPorSeccion.${section.key}.unidadesConfeccion`}
                                />
                                <PaqueteriaRow
                                    label="UN. PAQUETERIA"
                                    unidades={sectionData.unidadesPaqueteria}
                                    productividadRatio={80}
                                    isEditing={isEditing}
                                    onInputChange={onInputChange}
                                    unidadesId={`productividad.${dayKey}.productividadPorSeccion.${section.key}.unidadesPaqueteria`}
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
           {data && data.lunes && <DayProductividad dayData={data.lunes} dayKey="lunes" isEditing={isEditing} onInputChange={onInputChange} />}
        </TabsContent>
        <TabsContent value="jueves" className="mt-0">
           {data && data.jueves && <DayProductividad dayData={data.jueves} dayKey="jueves" isEditing={isEditing} onInputChange={onInputChange} />}
        </TabsContent>
    </Tabs>
  );
}
