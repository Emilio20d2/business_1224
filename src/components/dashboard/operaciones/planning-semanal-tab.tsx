
"use client";

import React from 'react';
import type { WeeklyData, Empleado, PlanningSemanalItem } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Printer } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatWeekIdToDateRange } from '@/lib/format';

type PlanningSemanalTabProps = {
  data: WeeklyData;
  empleados: Empleado[];
  isEditing: boolean;
  onDataChange: React.Dispatch<React.SetStateAction<WeeklyData | null>>;
  weekId: string;
};

type DayKey = keyof WeeklyData['planningSemanal'];

const DayColumn = ({
    dayKey,
    title,
    dayData,
    empleados,
    isEditing,
    onDataChange,
}: {
    dayKey: DayKey;
    title: string;
    dayData: PlanningSemanalItem[];
    empleados: Empleado[];
    isEditing: boolean;
    onDataChange: PlanningSemanalTabProps['onDataChange'];
}) => {

    const handleItemChange = (itemId: string, field: keyof Omit<PlanningSemanalItem, 'id'>, value: any) => {
        onDataChange(prevData => {
            if (!prevData) return null;
            const newData = JSON.parse(JSON.stringify(prevData));
            const dayItems = newData.planningSemanal[dayKey] as PlanningSemanalItem[];
            const itemIndex = dayItems.findIndex(p => p.id === itemId);

            if (itemIndex > -1) {
                if (field === 'idEmpleado') {
                    const empleado = empleados.find(e => e.id === value);
                    dayItems[itemIndex].idEmpleado = value;
                    dayItems[itemIndex].nombreEmpleado = empleado?.nombre || '';
                } else {
                    (dayItems[itemIndex] as any)[field] = value;
                }
            }
            return newData;
        });
    };

    const handleAddItem = () => {
        onDataChange(prevData => {
            if (!prevData) return null;
            const newData = { ...prevData };
            const newItem: PlanningSemanalItem = {
                id: uuidv4(),
                idEmpleado: '',
                nombreEmpleado: '',
                notas: '',
            };
            (newData.planningSemanal[dayKey] as PlanningSemanalItem[]).push(newItem);
            return newData;
        });
    };

    const handleRemoveItem = (itemId: string) => {
        onDataChange(prevData => {
            if (!prevData) return null;
            const newData = { ...prevData };
            newData.planningSemanal[dayKey] = newData.planningSemanal[dayKey].filter(p => p.id !== itemId);
            return newData;
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {dayData.map(item => (
                    <div key={item.id} className="space-y-2 border-b pb-4">
                        {isEditing ? (
                            <>
                                <div className="flex items-center gap-2">
                                     <Select value={item.idEmpleado || 'VACIO'} onValueChange={(value) => handleItemChange(item.id, 'idEmpleado', value === 'VACIO' ? '' : value)}>
                                        <SelectTrigger><SelectValue placeholder="Seleccionar Empleado..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="VACIO">-- Vacío --</SelectItem>
                                            {empleados.map(e => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                                <Textarea
                                    value={item.notas}
                                    onChange={(e) => handleItemChange(item.id, 'notas', e.target.value)}
                                    placeholder="Notas de tareas..."
                                    rows={3}
                                />
                            </>
                        ) : (
                            <div>
                                <p className="font-semibold">{item.nombreEmpleado || <span className="text-muted-foreground">-- Sin Asignar --</span>}</p>
                                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.notas || "Sin notas"}</p>
                            </div>
                        )}
                    </div>
                ))}
                {isEditing && (
                    <Button variant="outline" className="w-full" onClick={handleAddItem}>
                        <Plus className="mr-2 h-4 w-4" /> Añadir Empleado
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export function PlanningSemanalTab({ data, empleados, isEditing, onDataChange, weekId }: PlanningSemanalTabProps) {
    if (!data.planningSemanal) return null;

    const days: { key: DayKey, title: string }[] = [
        { key: 'lunes', title: 'Lunes' },
        { key: 'martes', title: 'Martes' },
        { key: 'miercoles', title: 'Miércoles' },
        { key: 'jueves', title: 'Jueves' },
        { key: 'viernes', title: 'Viernes' },
        { key: 'sabado', title: 'Sábado' },
    ];

    const handleGeneratePDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;
        const margin = 10;
        let currentY = 30;

        doc.setFontSize(18);
        doc.text("Planning Semanal", pageWidth / 2, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text(formatWeekIdToDateRange(weekId), pageWidth / 2, 22, { align: 'center' });
        
        const tableData = data.planningSemanal;
        const body: (string | null)[][] = [];

        const maxRows = Math.max(...days.map(day => tableData[day.key].length));

        for (let i = 0; i < maxRows; i++) {
            const row: (string|null)[] = [];
            days.forEach(day => {
                const item = tableData[day.key][i];
                if (item) {
                    row.push(`${item.nombreEmpleado}\n${item.notas}`);
                } else {
                    row.push(null);
                }
            });
            body.push(row);
        }

        (doc as any).autoTable({
            head: [days.map(d => d.title)],
            body: body,
            startY: currentY,
            theme: 'grid',
            styles: {
                valign: 'top',
                cellPadding: 2,
                overflow: 'linebreak'
            },
            headStyles: {
                fillColor: [115, 175, 165], // primary color
                textColor: 255,
                fontStyle: 'bold'
            },
        });


        doc.save('planning-semanal.pdf');
    };

    return (
        <div className="space-y-4">
             <div className="flex justify-end">
                <Button onClick={handleGeneratePDF} variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Crear PDF
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {days.map(day => (
                    <DayColumn
                        key={day.key}
                        dayKey={day.key}
                        title={day.title}
                        dayData={data.planningSemanal[day.key]}
                        empleados={empleados}
                        isEditing={isEditing}
                        onDataChange={onDataChange}
                    />
                ))}
            </div>
        </div>
    );
}
