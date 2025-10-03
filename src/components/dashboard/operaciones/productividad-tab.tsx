
"use client";

import React, { useState } from 'react';
import type { WeeklyData, CoberturaHora, ProductividadData } from "@/lib/data";
import { KpiCard, DatoSimple } from "../kpi-card";
import { Zap, Users, Scissors, Package, PackageOpen } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


type ProductividadTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any, reorder?: boolean) => void;
};

const roundToQuarter = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return '0.00';
    return (Math.round(value * 4) / 4).toFixed(2);
}


const DayProductividad = ({ dayData, dayKey, ratios, isEditing, onInputChange }: { dayData: ProductividadData, dayKey: 'lunes' | 'jueves', ratios: WeeklyData['listas']['productividadRatio'], isEditing: boolean, onInputChange: any }) => {
    if (!dayData || !dayData.productividadPorSeccion) return null;

    const ratioConfeccion = ratios?.confeccion || 120;
    const ratioPerchado = ratios?.perchado || 80;
    const ratioPicking = ratios?.picking || 400;

    const sections = [
        { key: 'woman', title: 'WOMAN' },
        { key: 'man', title: 'MAN' },
        { key: 'nino', title: 'NIÑO' },
    ] as const;

    const productividadData = sections.map(sec => {
        const unidadesConfeccion = dayData.productividadPorSeccion[sec.key]?.unidadesConfeccion || 0;
        const unidadesPaqueteria = dayData.productividadPorSeccion[sec.key]?.unidadesPaqueteria || 0;

        const horasConfeccion = unidadesConfeccion / ratioConfeccion;
        const unidadesPerchado = unidadesPaqueteria * 0.4;
        const horasPerchado = unidadesPerchado / ratioPerchado;
        const unidadesPicking = unidadesPaqueteria * 0.6;
        const horasPicking = unidadesPicking / ratioPicking;
        
        return {
            ...sec,
            unidadesConfeccion,
            horasConfeccion,
            unidadesPaqueteria,
            unidadesPerchado,
            horasPerchado,
            unidadesPicking,
            horasPicking,
        };
    });
    
    const totalHorasConfeccion = productividadData.reduce((sum, d) => sum + d.horasConfeccion, 0);
    const totalHorasPerchado = productividadData.reduce((sum, d) => sum + d.horasPerchado, 0);
    const totalHorasPicking = productividadData.reduce((sum, d) => sum + d.horasPicking, 0);
    const horasProductividadRequeridas = totalHorasConfeccion + totalHorasPerchado + totalHorasPicking;

    return (
        <div className="space-y-4">
             <KpiCard title="Productividad por Sección" icon={<Zap className="h-5 w-5 text-primary" />} >
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left w-[25%]">Sección</TableHead>
                            <TableHead className="text-left w-[25%]">Tarea</TableHead>
                            <TableHead className="text-center w-[15%]">Productividad</TableHead>
                            <TableHead className="text-right w-[15%]">Unidades</TableHead>
                            <TableHead className="text-right w-[20%]">Horas Requeridas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productividadData.map((sec, secIndex) => (
                            <React.Fragment key={sec.key}>
                                <TableRow>
                                    <TableCell rowSpan={3} className="font-bold align-top pt-4">{sec.title}</TableCell>
                                    <TableCell className="font-medium text-muted-foreground">Confección</TableCell>
                                    <TableCell className="text-center text-muted-foreground">{ratioConfeccion} u/h</TableCell>
                                    <TableCell className="text-right">
                                        <DatoSimple value={sec.unidadesConfeccion} isEditing={isEditing} onInputChange={onInputChange} valueId={`productividad.${dayKey}.productividadPorSeccion.${sec.key}.unidadesConfeccion`} unit=" un." align="right" />
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{roundToQuarter(sec.horasConfeccion)} h</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-muted-foreground">Paquetería (Perchado)</TableCell>
                                    <TableCell className="text-center text-muted-foreground">{ratioPerchado} u/h</TableCell>
                                    <TableCell className="text-right">
                                       <DatoSimple value={sec.unidadesPerchado} isEditing={isEditing} onInputChange={onInputChange} valueId={`productividad.${dayKey}.productividadPorSeccion.${sec.key}.unidadesPaqueteria`} unit=" un." align="right" />
                                    </TableCell>
                                    <TableCell className="text-right font-medium">{roundToQuarter(sec.horasPerchado)} h</TableCell>
                                </TableRow>
                                <TableRow className={secIndex < sections.length - 1 ? 'border-b-4' : ''}>
                                    <TableCell className="font-medium text-muted-foreground">Paquetería (Picking)</TableCell>
                                    <TableCell className="text-center text-muted-foreground">{ratioPicking} u/h</TableCell>
                                     <TableCell className="text-right">{sec.unidadesPicking.toFixed(0)} un.</TableCell>
                                    <TableCell className="text-right font-medium">{roundToQuarter(sec.horasPicking)} h</TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                         <TableRow className="bg-muted/50 font-bold text-base">
                            <TableCell colSpan={4}>TOTAL HORAS PRODUCTIVIDAD</TableCell>
                            <TableCell className="text-right text-lg">{roundToQuarter(horasProductividadRequeridas)} h</TableCell>
                        </TableRow>
                    </TableBody>
                 </Table>
            </KpiCard>
            
            <KpiCard title="Cobertura de Personal" icon={<Users className="h-5 w-5 text-primary" />} >
                 <div className="space-y-2 pt-2">
                    <div className="grid grid-cols-8 text-center text-sm font-semibold text-muted-foreground">
                        {dayData.coberturaPorHoras.map(item => <div key={item.hora}>{item.hora}</div>)}
                    </div>
                    <div className="grid grid-cols-8 text-center">
                        {dayData.coberturaPorHoras.map((item, index) => {
                            const horasDisponiblesEnFranja = item.personas || 0;
                            const horasRequeridasHastaFranja = (horasProductividadRequeridas / dayData.coberturaPorHoras.length) * (index + 1);
                            const horasAcumuladas = dayData.coberturaPorHoras.slice(0, index + 1).reduce((acc, curr) => acc + (curr.personas || 0), 0);

                            const objetivoCumplido = horasAcumuladas >= horasProductividadRequeridas;

                            return (
                                <div key={item.hora} className={cn(
                                    "p-1 rounded",
                                    !isEditing && (objetivoCumplido ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30')
                                )}>
                                    <DatoSimple
                                        value={item.personas}
                                        isEditing={isEditing}
                                        onInputChange={onInputChange}
                                        valueId={`productividad.${dayKey}.coberturaPorHoras.${index}.personas`}
                                        align="center"
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </KpiCard>
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
           {data && data.productividad.lunes && <DayProductividad dayData={data.productividad.lunes} dayKey="lunes" ratios={data.listas.productividadRatio} isEditing={isEditing} onInputChange={onInputChange} />}
        </TabsContent>
        <TabsContent value="jueves" className="mt-0">
           {data && data.productividad.jueves && <DayProductividad dayData={data.productividad.jueves} dayKey="jueves" ratios={data.listas.productividadRatio} isEditing={isEditing} onInputChange={onInputChange} />}
        </TabsContent>
    </Tabs>
  );
}

    