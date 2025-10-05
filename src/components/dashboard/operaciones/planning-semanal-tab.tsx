
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

const sectionColors: { [key: string]: string } = {
    'woman': 'hsl(0, 84%, 60%)', // rojo
    'man': 'hsl(217, 56%, 60%)',   // azul
    'nino': 'hsl(172, 29%, 57%)',   // verde
    'sint': 'hsl(0, 0%, 0%)', // negro
    '': 'hsl(var(--muted))'
};

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
                } else if (field === 'seccion') {
                    dayItems[itemIndex].seccion = value === 'ninguna' ? '' : value;
                }
                
                else {
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
                seccion: '',
                notas: '',
                hora: '07:00'
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
    
    const timeOptions = [];
    for (let h = 7; h <= 22; h++) {
        for (let m = 0; m < 60; m += 30) {
            if (h === 22 && m > 0) continue;
            const hour = String(h).padStart(2, '0');
            const minute = String(m).padStart(2, '0');
            timeOptions.push(`${hour}:${minute}`);
        }
    }


    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {dayData.map(item => (
                    <div key={item.id} className="space-y-2 border-b pb-4">
                        <div className="flex items-center gap-2">
                             <div 
                                className="h-4 w-4 rounded-full flex-shrink-0" 
                                style={{ backgroundColor: sectionColors[item.seccion || ''] }}
                            />
                            {isEditing ? (
                                <Select value={item.idEmpleado || 'VACIO'} onValueChange={(value) => handleItemChange(item.id, 'idEmpleado', value === 'VACIO' ? '' : value)}>
                                    <SelectTrigger><SelectValue placeholder="Seleccionar Empleado..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="VACIO">-- Vacío --</SelectItem>
                                        {empleados.map(e => <SelectItem key={e.id} value={e.id}>{e.nombre}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="font-semibold flex-grow">{item.nombreEmpleado || <span className="text-muted-foreground">-- Sin Asignar --</span>}</p>
                            )}
                             {isEditing ? (
                                <Select value={item.hora || '07:00'} onValueChange={(value) => handleItemChange(item.id, 'hora', value)}>
                                    <SelectTrigger className="w-28"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {timeOptions.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                             ) : (
                                 <p className="font-semibold text-sm text-muted-foreground">{item.hora}</p>
                             )}
                             {isEditing && (
                                <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                             )}
                        </div>
                         {isEditing ? (
                            <>
                                <Select value={item.seccion || 'ninguna'} onValueChange={(value) => handleItemChange(item.id, 'seccion', value)}>
                                    <SelectTrigger><SelectValue placeholder="Sección..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ninguna">-- Sección --</SelectItem>
                                        <SelectItem value="woman">Señora</SelectItem>
                                        <SelectItem value="man">Caballero</SelectItem>
                                        <SelectItem value="nino">Niño</SelectItem>
                                        <SelectItem value="sint">SINT</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Textarea
                                    value={item.notas}
                                    onChange={(e) => handleItemChange(item.id, 'notas', e.target.value)}
                                    placeholder="Notas de tareas..."
                                    rows={3}
                                />
                            </>
                         ) : (
                             <p className="text-sm text-muted-foreground whitespace-pre-wrap pl-6">{item.notas || "Sin notas"}</p>
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
        let currentY = 15;

        doc.setFontSize(18);
        doc.text("PLANNING SEMANAL ALMACEN", pageWidth / 2, currentY, { align: 'center' });
        currentY += 7;
        doc.setFontSize(12);
        doc.text(`SEMANA ${formatWeekIdToDateRange(weekId)}`, pageWidth / 2, currentY, { align: 'center' });
        currentY += 10;

        // Draw Legend
        const legendItems = [
            { label: 'Señora', color: sectionColors['woman'] },
            { label: 'Caballero', color: sectionColors['man'] },
            { label: 'Niño', color: sectionColors['nino'] },
            { label: 'SINT', color: sectionColors['sint'] },
        ];
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');

        // Calculate total legend width to center it
        const legendItemWidths = legendItems.map(item => {
            const circleWidth = 5; // 2 for radius + 2 for padding
            const textWidth = doc.getStringUnitWidth(item.label) * doc.getFontSize() / doc.internal.scaleFactor;
            return circleWidth + textWidth + 5; // 5 for padding between items
        });
        const totalLegendWidth = legendItemWidths.reduce((a, b) => a + b, 0) - 5; // Remove last padding
        
        let legendX = (pageWidth - totalLegendWidth) / 2;

        legendItems.forEach(item => {
            const rgbString = item.color.replace('hsl(', '').replace(')', '').replace(/%/g, '');
            const [h, s, l] = rgbString.split(',').map(parseFloat);
            
            // For simplicity, converting HSL to RGB is complex. Let's use hardcoded RGB values from the HSL.
            let rgb = [0,0,0];
            if (item.label === 'Señora') rgb = [229, 89, 104];
            if (item.label === 'Caballero') rgb = [82, 126, 204];
            if (item.label === 'Niño') rgb = [115, 175, 165];
            if (item.label === 'SINT') rgb = [0, 0, 0];

            doc.setFillColor(rgb[0], rgb[1], rgb[2]);
            doc.circle(legendX + 2, currentY - 1.5, 2, 'F');
            doc.text(item.label, legendX + 6, currentY);
            legendX += doc.getStringUnitWidth(item.label) * doc.getFontSize() / doc.internal.scaleFactor + 15;
        });

        currentY += 10;
        
        const cardPadding = 5;
        const cardWidth = (pageWidth - margin * 3) / 2;
        let cardX = margin;
        let maxHeightInRow = 0;

        days.forEach((day, index) => {
            const dayData = data.planningSemanal[day.key];
            if (!dayData || dayData.length === 0) return;
            
            const isLeftColumn = index % 2 === 0;

            // Calculate card height
            let cardHeight = cardPadding * 2 + 8; // Padding + Title
            dayData.forEach(item => {
                cardHeight += 6; // For employee name + circle
                if (item.notas) {
                    const notesLines = doc.splitTextToSize(item.notas, cardWidth - cardPadding * 2 - 5); // 5 for circle margin
                    cardHeight += notesLines.length * 4;
                }
                cardHeight += 3; // Spacing
            });

            if (currentY + cardHeight > pageHeight - margin) {
                if (isLeftColumn) {
                    doc.addPage();
                    currentY = margin;
                } else {
                    // This case is tricky, for now we just let it overflow or we add a new page and reset x
                    doc.addPage();
                    currentY = margin;
                    cardX = margin; // Reset to left column
                }
            }
             if (!isLeftColumn && currentY + Math.max(maxHeightInRow, cardHeight) > pageHeight - margin) {
                 doc.addPage();
                 currentY = margin;
                 maxHeightInRow = 0;
            }
             if (isLeftColumn && currentY + cardHeight > pageHeight - margin) {
                doc.addPage();
                currentY = margin;
             }

            cardX = isLeftColumn ? margin : margin * 2 + cardWidth;
            
            // Draw card
            doc.setDrawColor(224, 224, 224); // border color
            doc.setFillColor(253, 253, 253); // background color
            doc.roundedRect(cardX, currentY, cardWidth, cardHeight, 3, 3, 'FD');

            let cardContentY = currentY + cardPadding + 5;

            // Card Title
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(day.title, cardX + cardWidth / 2, cardContentY, { align: 'center' });
            cardContentY += 8;

            // Card Content
            doc.setFontSize(9);
            dayData.forEach(item => {
                const sectionColor = sectionColors[item.seccion || ''];
                const rgbString = sectionColor.replace('hsl(', '').replace(')', '').replace(/%/g, '');
                const [h, s, l] = rgbString.split(',').map(parseFloat);
                
                let rgb = [0,0,0];
                if (item.seccion === 'woman') rgb = [229, 89, 104];
                if (item.seccion === 'man') rgb = [82, 126, 204];
                if (item.seccion === 'nino') rgb = [115, 175, 165];
                if (item.seccion === 'sint') rgb = [0, 0, 0];

                if (item.seccion) {
                    doc.setFillColor(rgb[0], rgb[1], rgb[2]);
                    doc.circle(cardX + cardPadding + 2, cardContentY - 1.5, 2, 'F');
                }
                
                doc.setFont('helvetica', 'bold');
                const employeeText = `${item.nombreEmpleado || "-- Sin Asignar --"}`;
                doc.text(employeeText, cardX + cardPadding + 6, cardContentY);

                const timeText = item.hora || '';
                const employeeTextWidth = doc.getStringUnitWidth(employeeText) * doc.getFontSize() / doc.internal.scaleFactor;
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(128, 128, 128);
                doc.text(timeText, cardX + cardWidth - margin - doc.getStringUnitWidth(timeText) * doc.getFontSize() / doc.internal.scaleFactor, cardContentY);
                doc.setTextColor(0, 0, 0);

                cardContentY += 5;

                if (item.notas) {
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(128, 128, 128); // muted-foreground
                    const notesLines = doc.splitTextToSize(item.notas, cardWidth - cardPadding * 2 - 6);
                    doc.text(notesLines, cardX + cardPadding + 6, cardContentY);
                    cardContentY += notesLines.length * 4;
                    doc.setTextColor(0, 0, 0);
                }
                cardContentY += 3; // spacing
            });

            maxHeightInRow = Math.max(maxHeightInRow, cardHeight);
            if (!isLeftColumn) {
                currentY += maxHeightInRow + margin;
                maxHeightInRow = 0;
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
