
"use client";

import React, { useState, useMemo } from 'react';
import type { WeeklyData, Empleado, PlanificacionItem, ProductividadData } from "@/lib/data";
import { KpiCard, DatoSimple } from "../kpi-card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Users, Box, Shirt } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

type PlanificacionTabProps = {
  data: WeeklyData;
  empleados: Empleado[];
  isEditing: boolean;
  onDataChange: React.Dispatch<React.SetStateAction<WeeklyData | null>>;
};

const SectionPlanificacion = ({
    sectionKey,
    title,
    dayKey,
    dayData,
    empleados,
    isEditing,
    onDataChange,
    onInputChange
}: {
    sectionKey: 'woman' | 'man' | 'nino',
    title: string,
    dayKey: 'lunes' | 'jueves',
    dayData: ProductividadData,
    empleados: Empleado[],
    isEditing: boolean,
    onDataChange: PlanificacionTabProps['onDataChange'],
    onInputChange: (path: string, value: any) => void;
}) => {
    const planificacionSeccion = dayData.planificacion.filter(p => p.seccion === sectionKey);
    const confeccionItems = planificacionSeccion.filter(p => p.tarea === 'confeccion');
    const paqueteriaItems = planificacionSeccion.filter(p => p.tarea === 'paqueteria');

    const handlePlanChange = (itemId: string, field: keyof PlanificacionItem, value: any) => {
        onDataChange(prevData => {
            if (!prevData) return null;
            const newData = JSON.parse(JSON.stringify(prevData));
            const plan = newData.productividad[dayKey].planificacion;
            const itemIndex = plan.findIndex((p: PlanificacionItem) => p.id === itemId);

            if (itemIndex > -1) {
                if (field === 'idEmpleado') {
                    const empleado = empleados.find(e => e.id === value);
                    plan[itemIndex].idEmpleado = value;
                    plan[itemIndex].nombreEmpleado = empleado?.nombre || '';
                } else {
                    (plan[itemIndex] as any)[field] = value;
                }
            }
            return newData;
        });
    };

    const handleAddItem = (tarea: 'confeccion' | 'paqueteria') => {
        onDataChange(prevData => {
            if (!prevData) return null;
            const newData = { ...prevData };
            const newItem: PlanificacionItem = {
                id: uuidv4(),
                idEmpleado: '',
                nombreEmpleado: '',
                seccion: sectionKey,
                tarea,
                anotaciones: '',
            };
            newData.productividad[dayKey].planificacion.push(newItem);
            return newData;
        });
    };

    const handleRemoveItem = (itemId: string) => {
         onDataChange(prevData => {
            if (!prevData) return null;
            const newData = { ...prevData };
            newData.productividad[dayKey].planificacion = newData.productividad[dayKey].planificacion.filter((p: PlanificacionItem) => p.id !== itemId);
            return newData;
        });
    };

    const renderColumn = (items: PlanificacionItem[], tarea: 'confeccion' | 'paqueteria', columnTitle: string) => (
        <div className="flex flex-col gap-2">
            <h3 className="font-bold text-center text-muted-foreground">{columnTitle}</h3>
            {items.map(item => (
                <div key={item.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                    {isEditing ? (
                        <>
                            <Select value={item.idEmpleado || ''} onValueChange={(value) => handlePlanChange(item.id, 'idEmpleado', value)}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                <SelectContent>
                                    {empleados.map(e => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <Input
                                value={item.anotaciones}
                                onChange={(e) => handlePlanChange(item.id, 'anotaciones', e.target.value)}
                                placeholder="Anotaciones..."
                            />
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <p className="font-medium p-2">{item.nombreEmpleado || <span className="text-muted-foreground">--</span>}</p>
                            <p className="text-sm text-muted-foreground p-2">{item.anotaciones || <span className="text-muted-foreground">--</span>}</p>
                        </>
                    )}
                </div>
            ))}
            {isEditing && (
                <Button variant="outline" onClick={() => handleAddItem(tarea)}>
                    <Plus className="mr-2 h-4 w-4" /> Añadir Empleado
                </Button>
            )}
        </div>
    );

    return (
        <Card className="font-light">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="grid grid-cols-2 gap-4 items-center">
                     <DatoSimple
                        label="Unidades Confección"
                        value={dayData.productividadPorSeccion[sectionKey]?.unidadesConfeccion || 0}
                        isEditing={isEditing}
                        onInputChange={(path, val) => onInputChange(path, val)}
                        valueId={`productividad.${dayKey}.productividadPorSeccion.${sectionKey}.unidadesConfeccion`}
                        align="left"
                    />
                    <DatoSimple
                        label="Unidades Paquetería"
                        value={dayData.productividadPorSeccion[sectionKey]?.unidadesPaqueteria || 0}
                        isEditing={isEditing}
                        onInputChange={(path, val) => onInputChange(path, val)}
                        valueId={`productividad.${dayKey}.productividadPorSeccion.${sectionKey}.unidadesPaqueteria`}
                        align="left"
                    />
                </div>
                <div className="grid grid-cols-2 gap-6">
                    {renderColumn(confeccionItems, 'confeccion', 'CONFECCIÓN')}
                    {renderColumn(paqueteriaItems, 'paqueteria', 'PAQUETERÍA')}
                </div>
            </CardContent>
        </Card>
    );
};


const DayPlanificacion = ({ 
    dayKey, 
    dayData, 
    empleados, 
    isEditing, 
    onDataChange,
    onInputChange
}: { 
    dayKey: 'lunes' | 'jueves', 
    dayData: ProductividadData, 
    empleados: Empleado[], 
    isEditing: boolean, 
    onDataChange: PlanificacionTabProps['onDataChange'],
    onInputChange: (path: string, value: any) => void;
}) => {
    return (
        <div className="space-y-6 font-light">
            <SectionPlanificacion
                sectionKey="woman"
                title="WOMAN"
                dayKey={dayKey}
                dayData={dayData}
                empleados={empleados}
                isEditing={isEditing}
                onDataChange={onDataChange}
                onInputChange={onInputChange}
            />
            <SectionPlanificacion
                sectionKey="man"
                title="MAN"
                dayKey={dayKey}
                dayData={dayData}
                empleados={empleados}
                isEditing={isEditing}
                onDataChange={onDataChange}
                onInputChange={onInputChange}
            />
            <SectionPlanificacion
                sectionKey="nino"
                title="NIÑO"
                dayKey={dayKey}
                dayData={dayData}
                empleados={empleados}
                isEditing={isEditing}
                onDataChange={onDataChange}
                onInputChange={onInputChange}
            />
        </div>
    );
};

export function PlanificacionTab({ data, empleados, isEditing, onDataChange }: PlanificacionTabProps) {
  const [activeSubTab, setActiveSubTab] = useState('lunes');
  
  if (!data.productividad) return null;

  const handleDayInputChange = (path: string, value: any) => {
    onDataChange(prevData => {
        if (!prevData) return null;
        const newData = JSON.parse(JSON.stringify(prevData));
        let current: any = newData;
        const keys = path.split('.');
        for (let i = 0; i < keys.length - 1; i++) {
            if (current[keys[i]] === undefined) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length-1]] = Number(value) || 0;
        return newData;
    });
  }

  return (
    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full font-light">
        <div className="mb-4 grid w-full grid-cols-2 gap-2">
            <Button
                variant={activeSubTab === 'lunes' ? 'default' : 'outline'}
                onClick={() => setActiveSubTab('lunes')}
            >
                LUNES
            </Button>
            <Button
                variant={activeSubTab === 'jueves' ? 'default' : 'outline'}
                onClick={() => setActiveSubTab('jueves')}
            >
                JUEVES
            </Button>
        </div>

        <TabsContent value="lunes" className="mt-0">
           <DayPlanificacion 
                dayKey="lunes"
                dayData={data.productividad.lunes} 
                empleados={empleados} 
                isEditing={isEditing} 
                onDataChange={onDataChange}
                onInputChange={handleDayInputChange}
            />
        </TabsContent>
        <TabsContent value="jueves" className="mt-0">
            <DayPlanificacion 
                dayKey="jueves"
                dayData={data.productividad.jueves} 
                empleados={empleados} 
                isEditing={isEditing} 
                onDataChange={onDataChange}
                onInputChange={handleDayInputChange}
            />
        </TabsContent>
    </Tabs>
  );
}
