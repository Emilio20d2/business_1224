
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
    return (Math.round(value * 4) / 4).toFixed(2);
}


const PaqueteriaRow = ({ label, unidades, productividad, isEditing, onInputChange, unidadesId, icon }: { label: string, unidades: number, productividad: number, isEditing: boolean, onInputChange: any, unidadesId: string, icon?: React.ReactNode }) => {
    return (
        <div className="grid grid-cols-3 items-center text-center gap-2">
            <span className="text-sm font-medium text-muted-foreground text-left flex items-center gap-2">{icon}{label}</span>
            <DatoSimple
                value={unidades}
                isEditing={isEditing}
                valueId={unidadesId}
                onInputChange={onInputChange}
                unit="un."
                align="right"
            />
            <div className="text-right text-lg font-medium">
                 {roundToQuarter(productividad)}h
            </div>
        </div>
    );
};


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

    const totalUnidadesConfeccion = sections.reduce((sum, sec) => sum + (dayData.productividadPorSeccion[sec.key]?.unidadesConfeccion || 0), 0);
    const totalUnidadesPaqueteria = sections.reduce((sum, sec) => sum + (dayData.productividadPorSeccion[sec.key]?.unidadesPaqueteria || 0), 0);
    
    const horasConfeccionRequeridas = totalUnidadesConfeccion / ratioConfeccion;
    const horasPerchadoRequeridas = (totalUnidadesPaqueteria * 0.4) / ratioPerchado;
    const horasPickingRequeridas = (totalUnidadesPaqueteria * 0.6) / ratioPicking;
    const horasProductividadRequeridas = horasConfeccionRequeridas + horasPerchadoRequeridas + horasPickingRequeridas;

    const confeccionData = sections.map(sec => ({
      title: sec.title,
      unidades: dayData.productividadPorSeccion[sec.key]?.unidadesConfeccion || 0,
      horas: (dayData.productividadPorSeccion[sec.key]?.unidadesConfeccion || 0) / ratioConfeccion,
    }));

    const perchadoData = sections.map(sec => ({
        title: sec.title,
        unidades: (dayData.productividadPorSeccion[sec.key]?.unidadesPaqueteria || 0) * 0.4,
        horas: ((dayData.productividadPorSeccion[sec.key]?.unidadesPaqueteria || 0) * 0.4) / ratioPerchado,
    }));
    
    const pickingData = sections.map(sec => ({
        title: sec.title,
        unidades: (dayData.productividadPorSeccion[sec.key]?.unidadesPaqueteria || 0) * 0.6,
        horas: ((dayData.productividadPorSeccion[sec.key]?.unidadesPaqueteria || 0) * 0.6) / ratioPicking,
    }));
    
    return (
        <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {sections.map(section => {
                    const sectionData = dayData.productividadPorSeccion[section.key];
                    if (!sectionData) return null;
                    
                    const horasPaqueteriaPerchado = (sectionData.unidadesPaqueteria * 0.4) / ratioPerchado;
                    const horasPaqueteriaPicking = (sectionData.unidadesPaqueteria * 0.6) / ratioPicking;

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
                                    icon={<Scissors className="h-4 w-4" />}
                                    unidades={sectionData.unidadesConfeccion}
                                    productividad={(sectionData.unidadesConfeccion || 0) / ratioConfeccion}
                                    isEditing={isEditing}
                                    onInputChange={onInputChange}
                                    unidadesId={`productividad.${dayKey}.productividadPorSeccion.${section.key}.unidadesConfeccion`}
                                />
                                <DatoSimple
                                    label="PAQUETERIA"
                                    value={sectionData.unidadesPaqueteria}
                                    isEditing={isEditing}
                                    onInputChange={onInputChange}
                                    valueId={`productividad.${dayKey}.productividadPorSeccion.${section.key}.unidadesPaqueteria`}
                                    align="center"
                                    icon={<Package className="h-4 w-4" />}
                                    unit="un."
                                />
                                <div className="text-right text-lg font-bold">{roundToQuarter(horasPaqueteriaPerchado + horasPaqueteriaPicking)}h</div>
                            </div>
                        </KpiCard>
                    );
                })}
            </div>

            <KpiCard title="TOTAL" icon={<Zap className="h-5 w-5 text-primary" />}>
                <div className="space-y-4 pt-2">
                    <div className="grid grid-cols-3 items-center text-center gap-2">
                        <span className="text-sm font-semibold text-muted-foreground text-left"></span>
                        <span className="text-sm font-semibold text-muted-foreground text-right">Unidades</span>
                        <span className="text-sm font-semibold text-muted-foreground text-right">Productividad</span>
                    </div>
                    <Separator />
                     <div className="grid grid-cols-3 items-center text-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground text-left flex items-center gap-2"><Scissors className="h-4 w-4" />UN. CONFECCION</span>
                        <span className="text-lg font-medium text-right">{totalUnidadesConfeccion} un.</span>
                        <span className="text-lg font-medium text-right">{roundToQuarter(horasConfeccionRequeridas)} h</span>
                    </div>
                     <div className="grid grid-cols-3 items-center text-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground text-left flex items-center gap-2"><PackageOpen className="h-4 w-4" />PAQUETERIA (PERCHADO)</span>
                        <span className="text-lg font-medium text-right">{(totalUnidadesPaqueteria * 0.4).toFixed(0)} un.</span>
                        <span className="text-lg font-medium text-right">{roundToQuarter(horasPerchadoRequeridas)} h</span>
                    </div>
                     <div className="grid grid-cols-3 items-center text-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground text-left flex items-center gap-2"><Package className="h-4 w-4" />PAQUETERIA (PICKING)</span>
                        <span className="text-lg font-medium text-right">{(totalUnidadesPaqueteria * 0.6).toFixed(0)} un.</span>
                        <span className="text-lg font-medium text-right">{roundToQuarter(horasPickingRequeridas)} h</span>
                    </div>
                     <Separator />
                     <div className="grid grid-cols-3 items-center text-center gap-2">
                        <span className="text-sm font-bold text-left">TOTAL HORAS</span>
                        <span></span>
                        <span className="text-lg font-bold text-right">{roundToQuarter(horasProductividadRequeridas)} h</span>
                    </div>
                </div>

                <Separator className="my-4"/>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Scissors className="h-4 w-4" />
                            CONFECCIÓN
                        </h4>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sección</TableHead>
                                    <TableHead className="text-right">Unidades</TableHead>
                                    <TableHead className="text-right">Horas</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {confeccionData.map(item => (
                                    <TableRow key={item.title}>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell className="text-right">{item.unidades}</TableCell>
                                        <TableCell className="text-right">{roundToQuarter(item.horas)}h</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                      </div>
                    <div className="space-y-2">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <PackageOpen className="h-4 w-4" />
                        PAQUETERÍA (PERCHADO)
                        </h4>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sección</TableHead>
                                    <TableHead className="text-right">Unidades</TableHead>
                                    <TableHead className="text-right">Horas</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {perchadoData.map(item => (
                                    <TableRow key={item.title}>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell className="text-right">{item.unidades.toFixed(0)}</TableCell>
                                        <TableCell className="text-right">{roundToQuarter(item.horas)}h</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                     <div className="space-y-2">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <Package className="h-4 w-4" />
                        PAQUETERÍA (PICKING)
                        </h4>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Sección</TableHead>
                                    <TableHead className="text-right">Unidades</TableHead>
                                    <TableHead className="text-right">Horas</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {pickingData.map(item => (
                                    <TableRow key={item.title}>
                                        <TableCell>{item.title}</TableCell>
                                        <TableCell className="text-right">{item.unidades.toFixed(0)}</TableCell>
                                        <TableCell className="text-right">{roundToQuarter(item.horas)}h</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                  </div>
                </div>

                <Separator className="my-4"/>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                            <Users className="h-4 w-4" />
                            COBERTURA
                        </h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-4 space-y-2">
                            <div className="grid grid-cols-8 text-center text-sm font-semibold text-muted-foreground">
                                {dayData.coberturaPorHoras.map(item => <div key={item.hora}>{item.hora}</div>)}
                            </div>
                            <div className="grid grid-cols-8 text-center">
                                {dayData.coberturaPorHoras.map((item, index) => {
                                    const totalPersonasHastaAhora = dayData.coberturaPorHoras.slice(0, index + 1).reduce((sum, current) => sum + (current.personas || 0), 0);
                                    const horasCubiertas = totalPersonasHastaAhora; 
                                    const objetivoCumplido = horasCubiertas >= horasProductividadRequeridas;

                                    return (
                                        <div key={item.hora} className={cn(
                                            "p-1 rounded", 
                                            (objetivoCumplido ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30')
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

    