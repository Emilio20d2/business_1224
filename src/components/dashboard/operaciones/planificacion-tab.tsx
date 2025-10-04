
"use client";

import React, { useState } from 'react';
import type { WeeklyData, Empleado, PlanificacionItem } from "@/lib/data";
import { DatoSimple } from "../kpi-card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Printer } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatNumber, getDateOfWeek } from '@/lib/format';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';


type PlanificacionTabProps = {
  data: WeeklyData;
  empleados: Empleado[];
  isEditing: boolean;
  onDataChange: React.Dispatch<React.SetStateAction<WeeklyData | null>>;
  weekId: string;
};

const SectionPlanificacion = ({
    sectionKey,
    title,
    dayKey,
    dayData,
    empleados,
    isEditing,
    onDataChange,
}: {
    sectionKey: 'woman' | 'man' | 'nino',
    title: string,
    dayKey: 'lunes' | 'jueves',
    dayData: WeeklyData['productividad']['lunes'] | WeeklyData['productividad']['jueves'],
    empleados: Empleado[],
    isEditing: boolean,
    onDataChange: PlanificacionTabProps['onDataChange'],
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

    const renderColumn = (items: PlanificacionItem[], tarea: 'confeccion' | 'paqueteria', columnTitle: string) => {
      return (
        <div className="flex flex-col gap-2">
            <h3 className="font-bold text-center text-muted-foreground">{columnTitle}</h3>
            {items.map(item => (
                <div key={item.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                    {isEditing ? (
                        <>
                            <Select value={item.idEmpleado || 'VACIO'} onValueChange={(value) => handlePlanChange(item.id, 'idEmpleado', value === 'VACIO' ? '' : value)}>
                                <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="VACIO">-- Vacío --</SelectItem>
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
    }

    return (
        <Card className="font-light">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div className="flex justify-around items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-muted-foreground">Unidades Confección:</span>
                      <span className="font-bold">{formatNumber(dayData.productividadPorSeccion[sectionKey]?.unidadesConfeccion) || 0}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-muted-foreground">Unidades Paquetería:</span>
                      <span className="font-bold">{formatNumber(dayData.productividadPorSeccion[sectionKey]?.unidadesPaqueteria) || 0}</span>
                    </div>
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
}: { 
    dayKey: 'lunes' | 'jueves', 
    dayData: WeeklyData['productividad']['lunes'] | WeeklyData['productividad']['jueves'], 
    empleados: Empleado[], 
    isEditing: boolean, 
    onDataChange: PlanificacionTabProps['onDataChange'],
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
            />
            <SectionPlanificacion
                sectionKey="man"
                title="MAN"
                dayKey={dayKey}
                dayData={dayData}
                empleados={empleados}
                isEditing={isEditing}
                onDataChange={onDataChange}
            />
            <SectionPlanificacion
                sectionKey="nino"
                title="NIÑO"
                dayKey={dayKey}
                dayData={dayData}
                empleados={empleados}
                isEditing={isEditing}
                onDataChange={onDataChange}
            />
        </div>
    );
};

export function PlanificacionTab({ data, empleados, isEditing, onDataChange, weekId }: PlanificacionTabProps) {
  const [activeSubTab, setActiveSubTab] = useState('lunes');

  if (!data.productividad) return null;
  
  const handleGeneratePDF = () => {
    if (!data || !data.productividad) return;

    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const dayKey = activeSubTab as 'lunes' | 'jueves';
    const dayData = data.productividad[dayKey];
    const dayDate = getDateOfWeek(weekId, dayKey);
    const dateString = dayDate ? format(dayDate, "d 'de' MMMM", { locale: es }) : '';
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 10;
    let currentY = 35;
    
    doc.setFontSize(18);
    doc.text(`PLANIFICACIÓN ${dayKey.toUpperCase()}`, pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`ZARA 1224 - PUERTO VENECIA - ${dateString}`, pageWidth / 2, 26, { align: 'center' });

    const sectionColors = {
        woman: [229, 89, 104], // hsl(355, 71%, 60%)
        man: [82, 126, 204],   // hsl(217, 56%, 60%)
        nino: [115, 175, 165]   // hsl(172, 29%, 57%)
    };

    ['woman', 'man', 'nino'].forEach(section => {
        const sectionKey = section as 'woman' | 'man' | 'nino';
        const sectionData = dayData.productividadPorSeccion[sectionKey];
        const planificacionSeccion = dayData.planificacion.filter(p => p.seccion === sectionKey);
        const confeccionItems = planificacionSeccion.filter(p => p.tarea === 'confeccion');
        const paqueteriaItems = planificacionSeccion.filter(p => p.tarea === 'paqueteria');

        const titleHeight = 10;
        const itemHeight = 12; // Increased height for name + note
        const sectionSpacing = 15;
        
        const contentHeight = Math.max(confeccionItems.length, paqueteriaItems.length) * itemHeight;
        const sectionHeight = titleHeight + contentHeight;
        
        if (currentY + sectionHeight > pageHeight - margin) {
            doc.addPage();
            currentY = margin;
        }
        
        // Section Title
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        const color = sectionColors[sectionKey];
        doc.setTextColor(color[0], color[1], color[2]);
        doc.text(section.toUpperCase(), margin, currentY + titleHeight / 2, { verticalAlign: 'middle' });
        doc.setTextColor(0, 0, 0);
        currentY += titleHeight;

        // Column Titles
        const colWidth = (pageWidth - margin * 2) / 2;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(150, 150, 150);
        doc.text('CONFECCIÓN', margin, currentY + 5);
        doc.text('PAQUETERÍA', margin + colWidth, currentY + 5);
        doc.setTextColor(0, 0, 0);
        currentY += 10;

        // Content
        doc.setFont('helvetica', 'normal');
        for(let i = 0; i < Math.max(confeccionItems.length, paqueteriaItems.length); i++) {
            const baseItemY = currentY + i * itemHeight;
            
            // Confeccion column
            if (confeccionItems[i]) {
                const item = confeccionItems[i];
                doc.setFontSize(9);
                doc.text(item.nombreEmpleado || '--', margin, baseItemY + 4);
                if (item.anotaciones) {
                    doc.setFontSize(8);
                    doc.setTextColor(120, 120, 120);
                    doc.text(item.anotaciones, margin, baseItemY + 9, { maxWidth: colWidth - 5 });
                    doc.setTextColor(0, 0, 0);
                }
            }

            // Paqueteria column
             if (paqueteriaItems[i]) {
                const item = paqueteriaItems[i];
                doc.setFontSize(9);
                doc.text(item.nombreEmpleado || '--', margin + colWidth, baseItemY + 4);
                if (item.anotaciones) {
                    doc.setFontSize(8);
                    doc.setTextColor(120, 120, 120);
                    doc.text(item.anotaciones, margin + colWidth, baseItemY + 9, { maxWidth: colWidth - 5 });
                    doc.setTextColor(0, 0, 0);
                }
            }
        }
        currentY += contentHeight + sectionSpacing;
    });

    doc.output('dataurlnewwindow');
  };


  return (
    <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full font-light">
        <div className="flex justify-between items-center mb-4">
            <div className="grid w-full max-w-sm grid-cols-2 gap-2">
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
             <Button onClick={handleGeneratePDF} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Crear PDF
            </Button>
        </div>

        <TabsContent value="lunes" className="mt-0">
           <DayPlanificacion 
                dayKey="lunes"
                dayData={data.productividad.lunes} 
                empleados={empleados} 
                isEditing={isEditing} 
                onDataChange={onDataChange}
            />
        </TabsContent>
        <TabsContent value="jueves" className="mt-0">
            <DayPlanificacion 
                dayKey="jueves"
                dayData={data.productividad.jueves} 
                empleados={empleados} 
                isEditing={isEditing} 
                onDataChange={onDataChange}
            />
        </TabsContent>
    </Tabs>
  );
}
