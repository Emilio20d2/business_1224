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
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 10;
        const cardPadding = 5;
        const cardWidth = (pageWidth - margin * 3) / 2;

        let currentY = 30;

        doc.setFontSize(18);
        doc.text("Planning Semanal de Almacén", pageWidth / 2, 15, { align: 'center' });
        doc.setFontSize(12);
        doc.text(formatWeekIdToDateRange(weekId), pageWidth / 2, 22, { align: 'center' });

        days.forEach((day, index) => {
            const dayData = data.planningSemanal[day.key];
            if (!dayData || dayData.length === 0) return;

            const isLeftColumn = index % 2 === 0;
            const x = isLeftColumn ? margin : margin * 2 + cardWidth;

            // Calculate card height
            let cardHeight = cardPadding * 2 + 8; // Padding + Title
            dayData.forEach(item => {
                cardHeight += 5; // For employee name
                if (item.notas) {
                    const notesLines = doc.splitTextToSize(item.notas, cardWidth - cardPadding * 2);
                    cardHeight += notesLines.length * 4; // Approx height for notes
                }
                cardHeight += 3; // Spacing
            });

            if (currentY + cardHeight > pageHeight - margin) {
                doc.addPage();
                currentY = margin;
            }
            
            // Draw card
            doc.setDrawColor(224, 224, 224); // border color
            doc.setFillColor(253, 253, 253); // background color
            doc.roundedRect(x, currentY, cardWidth, cardHeight, 3, 3, 'FD');

            let cardContentY = currentY + cardPadding + 5;

            // Card Title
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(day.title, x + cardWidth / 2, cardContentY, { align: 'center' });
            cardContentY += 8;

            // Card Content
            doc.setFontSize(9);
            dayData.forEach(item => {
                doc.setFont('helvetica', 'bold');
                doc.text(item.nombreEmpleado || "-- Sin Asignar --", x + cardPadding, cardContentY);
                cardContentY += 5;

                if (item.notas) {
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(128, 128, 128); // muted-foreground
                    const notesLines = doc.splitTextToSize(item.notas, cardWidth - cardPadding * 2);
                    doc.text(notesLines, x + cardPadding, cardContentY);
                    cardContentY += notesLines.length * 4;
                    doc.setTextColor(0, 0, 0);
                }
                cardContentY += 3; // spacing
            });

            if (!isLeftColumn) {
                currentY += cardHeight + margin;
            }
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
