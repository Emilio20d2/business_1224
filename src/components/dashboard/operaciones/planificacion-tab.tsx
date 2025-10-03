
"use client";

import React, { useState, useMemo } from 'react';
import type { WeeklyData, Empleado, PlanificacionItem, ProductividadData } from "@/lib/data";
import { KpiCard, DatoSimple } from "../kpi-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Users, Box, Shirt } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { formatNumber } from '@/lib/format';

type PlanificacionTabProps = {
  data: WeeklyData;
  empleados: Empleado[];
  isEditing: boolean;
  onDataChange: React.Dispatch<React.SetStateAction<WeeklyData | null>>;
};

const roundToQuarter = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return 0;
    return Math.round(value * 4) / 4;
}

const DayPlanificacion = ({ 
    dayKey, 
    dayData, 
    empleados, 
    isEditing, 
    onDataChange, 
    ratios 
}: { 
    dayKey: 'lunes' | 'jueves', 
    dayData: ProductividadData, 
    empleados: Empleado[], 
    isEditing: boolean, 
    onDataChange: PlanificacionTabProps['onDataChange'],
    ratios: WeeklyData['listas']['productividadRatio']
}) => {

    const { horasRequeridas, horasPorSeccion } = useMemo(() => {
        if (!dayData || !dayData.productividadPorSeccion || !ratios) {
            return { horasRequeridas: 0, horasPorSeccion: {} };
        }

        const { confeccion, perchado, picking, porcentajePerchado, porcentajePicking } = ratios;
        
        const secciones = ['woman', 'man', 'nino'] as const;
        let totalHoras = 0;

        const horasPorSeccion = secciones.reduce((acc, seccionKey) => {
            const seccionData = dayData.productividadPorSeccion[seccionKey];
            const horasConfeccion = (seccionData.unidadesConfeccion || 0) / confeccion;
            const horasPerchado = ((seccionData.unidadesPaqueteria || 0) * (porcentajePerchado / 100)) / perchado;
            const horasPicking = ((seccionData.unidadesPaqueteria || 0) * (porcentajePicking / 100)) / picking;
            const totalSeccion = horasConfeccion + horasPerchado + horasPicking;

            totalHoras += totalSeccion;
            acc[seccionKey] = {
                confeccion: horasConfeccion,
                paqueteria: horasPerchado + horasPicking,
                total: totalSeccion
            };
            return acc;
        }, {} as Record<'woman' | 'man' | 'nino', { confeccion: number; paqueteria: number; total: number }>);
        
        return { horasRequeridas: totalHoras, horasPorSeccion };
    }, [dayData, ratios]);

    const horasAsignadas = useMemo(() => dayData.planificacion.reduce((acc, item) => acc + item.horasAsignadas, 0), [dayData.planificacion]);
    const horasPendientes = horasRequeridas - horasAsignadas;

    const tareas = [
        "Confección WOMAN", "Paquetería WOMAN",
        "Confección MAN", "Paquetería MAN",
        "Confección NIÑO", "Paquetería NIÑO",
    ];

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
                } else if (field === 'horasAsignadas') {
                    plan[itemIndex].horasAsignadas = Number(value) || 0;
                } else {
                    (plan[itemIndex] as any)[field] = value;
                }
            }
            return newData;
        });
    };
    
    const handleAddItem = () => {
        onDataChange(prevData => {
            if (!prevData) return null;
            const newData = { ...prevData };
            const newItem: PlanificacionItem = {
                id: uuidv4(),
                idEmpleado: '',
                nombreEmpleado: '',
                tarea: '',
                horasAsignadas: 0,
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

    return (
        <div className="space-y-4 font-light">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <KpiCard title="Horas Requeridas por Sección" icon={<Users />} className="md:col-span-3">
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <h4 className="font-bold text-lg">WOMAN</h4>
                            <p><strong className="text-xl">{roundToQuarter(horasPorSeccion.woman?.total || 0).toFixed(2)}</strong> h</p>
                            <p className="text-xs text-muted-foreground">Confe: {roundToQuarter(horasPorSeccion.woman?.confeccion || 0).toFixed(2)}h | Paque: {roundToQuarter(horasPorSeccion.woman?.paqueteria || 0).toFixed(2)}h</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">MAN</h4>
                            <p><strong className="text-xl">{roundToQuarter(horasPorSeccion.man?.total || 0).toFixed(2)}</strong> h</p>
                            <p className="text-xs text-muted-foreground">Confe: {roundToQuarter(horasPorSeccion.man?.confeccion || 0).toFixed(2)}h | Paque: {roundToQuarter(horasPorSeccion.man?.paqueteria || 0).toFixed(2)}h</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-lg">NIÑO</h4>
                            <p><strong className="text-xl">{roundToQuarter(horasPorSeccion.nino?.total || 0).toFixed(2)}</strong> h</p>
                            <p className="text-xs text-muted-foreground">Confe: {roundToQuarter(horasPorSeccion.nino?.confeccion || 0).toFixed(2)}h | Paque: {roundToQuarter(horasPorSeccion.nino?.paqueteria || 0).toFixed(2)}h</p>
                        </div>
                    </div>
                </KpiCard>
                <KpiCard title="Total Horas Requeridas" icon={<Users />}>
                    <DatoSimple value={roundToQuarter(horasRequeridas).toFixed(2)} align="center" unit="h" />
                </KpiCard>
                <KpiCard title="Total Horas Asignadas" icon={<Users />}>
                    <DatoSimple value={roundToQuarter(horasAsignadas).toFixed(2)} align="center" unit="h" />
                </KpiCard>
                <KpiCard title="Horas Pendientes" icon={<Users />}>
                    <DatoSimple value={roundToQuarter(horasPendientes).toFixed(2)} align="center" unit="h" />
                </KpiCard>
            </div>
            
            <KpiCard title="Planificación de Personal" icon={<Users/>}>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="font-bold">Empleado</TableHead>
                            <TableHead className="font-bold">Tarea</TableHead>
                            <TableHead className="text-right font-bold">Horas</TableHead>
                            {isEditing && <TableHead className="w-[50px]"></TableHead>}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {dayData.planificacion.map((item: PlanificacionItem) => (
                            <TableRow key={item.id}>
                                <TableCell className="w-[40%]">
                                    {isEditing ? (
                                        <Select value={item.idEmpleado} onValueChange={(value) => handlePlanChange(item.id, 'idEmpleado', value)}>
                                            <SelectTrigger><SelectValue placeholder="Seleccionar empleado..." /></SelectTrigger>
                                            <SelectContent>
                                                {empleados.map(e => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        item.nombreEmpleado
                                    )}
                                </TableCell>
                                <TableCell className="w-[40%]">
                                     {isEditing ? (
                                        <Select value={item.tarea} onValueChange={(value) => handlePlanChange(item.id, 'tarea', value)}>
                                            <SelectTrigger><SelectValue placeholder="Seleccionar tarea..." /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Confección WOMAN">Confección WOMAN</SelectItem>
                                                <SelectItem value="Paquetería WOMAN">Paquetería WOMAN</SelectItem>
                                                <SelectItem value="Confección MAN">Confección MAN</SelectItem>
                                                <SelectItem value="Paquetería MAN">Paquetería MAN</SelectItem>
                                                <SelectItem value="Confección NIÑO">Confección NIÑO</SelectItem>
                                                <SelectItem value="Paquetería NIÑO">Paquetería NIÑO</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        item.tarea
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isEditing ? (
                                        <Input 
                                            type="number" 
                                            step="0.25"
                                            value={item.horasAsignadas} 
                                            onChange={(e) => handlePlanChange(item.id, 'horasAsignadas', e.target.value)} 
                                            className="w-24 ml-auto text-right"
                                        />
                                    ) : (
                                        `${item.horasAsignadas.toFixed(2)} h`
                                    )}
                                </TableCell>
                                {isEditing && (
                                    <TableCell>
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                {isEditing && (
                    <div className="pt-4">
                        <Button onClick={handleAddItem}><Plus className="mr-2 h-4 w-4" /> Añadir Fila</Button>
                    </div>
                )}
            </KpiCard>
        </div>
    );
};

export function PlanificacionTab({ data, empleados, isEditing, onDataChange }: PlanificacionTabProps) {
  const [activeSubTab, setActiveSubTab] = useState('lunes');
  
  if (!data.productividad) return null;

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
                ratios={data.listas.productividadRatio}
            />
        </TabsContent>
        <TabsContent value="jueves" className="mt-0">
            <DayPlanificacion 
                dayKey="jueves"
                dayData={data.productividad.jueves} 
                empleados={empleados} 
                isEditing={isEditing} 
                onDataChange={onDataChange}
                ratios={data.listas.productividadRatio}
            />
        </TabsContent>
    </Tabs>
  );
}
