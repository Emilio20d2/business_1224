

"use client";

import React from 'react';
import type { WeeklyData, CoberturaHora, ProductividadData } from "@/lib/data";
import { KpiCard, DatoDoble, DatoSimple } from "../kpi-card";
import { Zap, Users, Box, Printer, AlertCircle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatNumber, getDateOfWeek } from '@/lib/format';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FocusSemanalTab } from '../focus-semanal-tab';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


type ProductividadTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any, reorder?: boolean) => void;
};

const roundToHalf = (value: number) => {
    if (isNaN(value) || !isFinite(value)) return '0.00';
    return (Math.round(value * 2) / 2).toFixed(2);
}


const DayProductividad = ({ dayData, dayKey, ratios, isEditing, onInputChange }: { dayData: ProductividadData, dayKey: 'lunes' | 'jueves', ratios: WeeklyData['listas']['productividadRatio'], isEditing: boolean, onInputChange: any }) => {
    if (!dayData || !dayData.productividadPorSeccion) return null;

    const ratioConfeccion = ratios?.confeccion || 120;
    const ratioPerchado = ratios?.perchado || 80;
    const ratioPicking = ratios?.picking || 400;
    const porcentajePerchado = (ratios?.porcentajePerchado || 40) / 100;
    const porcentajePicking = (ratios?.porcentajePicking || 60) / 100;

    const sections = [
        { key: 'woman', title: 'WOMAN' },
        { key: 'man', title: 'MAN' },
        { key: 'nino', title: 'NIÑO' },
    ] as const;

    const productividadData = sections.map(sec => {
        const sectionData = dayData.productividadPorSeccion[sec.key];
        const unidadesConfeccion = sectionData?.unidadesConfeccion || 0;
        const unidadesPaqueteria = sectionData?.unidadesPaqueteria || 0;
        const hora = sectionData?.hora || '';

        const horasConfeccion = unidadesConfeccion / ratioConfeccion;
        
        const unidadesPerchado = unidadesPaqueteria * porcentajePerchado;
        const horasPerchado = unidadesPerchado / ratioPerchado;
        
        const unidadesPicking = unidadesPaqueteria * porcentajePicking;
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
            hora,
        };
    });

    const timeOptions = [''];
    for (let h = 8; h <= 22; h++) {
        for (let m = 0; m < 60; m += 30) {
            if (h === 22 && m > 0) continue;
            const hour = String(h).padStart(2, '0');
            const minute = String(m).padStart(2, '0');
            timeOptions.push(`${hour}:${minute}`);
        }
    }
    
    const totalHorasConfeccion = productividadData.reduce((sum, d) => sum + d.horasConfeccion, 0);
    const totalHorasPerchado = productividadData.reduce((sum, d) => sum + d.horasPerchado, 0);
    const totalHorasPicking = productividadData.reduce((sum, d) => sum + d.horasPicking, 0);
    const horasProductividadRequeridas = totalHorasConfeccion + totalHorasPerchado + totalHorasPicking;

    const handleTimeChange = (sectionKey: 'woman' | 'man' | 'nino', value: string) => {
        const path = `productividad.${dayKey}.productividadPorSeccion.${sectionKey}.hora`;
        onInputChange(path, value === 'ninguna' ? '' : value);
    };

    return (
        <div className="space-y-4 font-light">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {productividadData.map(sec => (
                    <KpiCard key={sec.key} title={
                        <div className="flex justify-between items-center w-full">
                            <span>{sec.title}</span>
                            {isEditing ? (
                                <Select value={sec.hora || 'ninguna'} onValueChange={(value) => handleTimeChange(sec.key, value)}>
                                    <SelectTrigger className="w-32 h-8 text-xs">
                                        <SelectValue placeholder="Hora" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ninguna">-- Hora --</SelectItem>
                                        {timeOptions.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            ) : (
                                sec.hora && <span className="text-sm font-medium text-muted-foreground">{sec.hora}</span>
                            )}
                        </div>
                    } icon={<Box className="h-5 w-5 text-primary"/>}>
                        <div className="flex flex-col gap-2 p-2">
                           <DatoDoble 
                             label="Un. Confección"
                             value={formatNumber(sec.unidadesConfeccion)}
                             isEditing={isEditing}
                             onInputChange={onInputChange}
                             valueId={`productividad.${dayKey}.productividadPorSeccion.${sec.key}.unidadesConfeccion`}
                           />
                           <DatoDoble 
                             label="Un. Paquetería"
                             value={formatNumber(sec.unidadesPaqueteria)}
                             isEditing={isEditing}
                             onInputChange={onInputChange}
                             valueId={`productividad.${dayKey}.productividadPorSeccion.${sec.key}.unidadesPaqueteria`}
                           />
                        </div>
                    </KpiCard>
                ))}
             </div>


             <KpiCard title="Desglose de Productividad" icon={<Zap className="h-5 w-5 text-primary" />} >
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left w-[25%] font-bold">Sección</TableHead>
                            <TableHead className="text-left w-[25%] font-bold">Tarea</TableHead>
                            <TableHead className="text-center w-[15%] font-bold">Unidades</TableHead>
                            <TableHead className="text-center w-[15%] font-bold">Productividad</TableHead>
                            <TableHead className="text-right w-[20%] font-bold">Horas Requeridas</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productividadData.map((sec, secIndex) => (
                            <React.Fragment key={sec.key}>
                                <TableRow>
                                    <TableCell rowSpan={3} className="font-bold align-top pt-4 text-base">{sec.title}</TableCell>
                                    <TableCell className="font-medium text-muted-foreground">Confección</TableCell>
                                    <TableCell className="text-center">{formatNumber(sec.unidadesConfeccion)}</TableCell>
                                    <TableCell className="text-center text-muted-foreground">{ratioConfeccion} u/h</TableCell>
                                    <TableCell className="text-right font-medium">{roundToHalf(sec.horasConfeccion)} h</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-medium text-muted-foreground">Paquetería (Perchado)</TableCell>
                                     <TableCell className="text-center">{formatNumber(sec.unidadesPerchado)}</TableCell>
                                    <TableCell className="text-center text-muted-foreground">{ratioPerchado} u/h</TableCell>
                                    <TableCell className="text-right font-medium">{roundToHalf(sec.horasPerchado)} h</TableCell>
                                </TableRow>
                                <TableRow className={secIndex < sections.length - 1 ? 'border-b-4' : ''}>
                                    <TableCell className="font-medium text-muted-foreground">Paquetería (Picking)</TableCell>
                                    <TableCell className="text-center">{formatNumber(sec.unidadesPicking)}</TableCell>
                                    <TableCell className="text-center text-muted-foreground">{ratioPicking} u/h</TableCell>
                                    <TableCell className="text-right font-medium">{roundToHalf(sec.horasPicking)} h</TableCell>
                                </TableRow>
                            </React.Fragment>
                        ))}
                         <TableRow className="bg-muted/50 font-bold text-base">
                            <TableCell colSpan={4}>TOTAL HORAS PRODUCTIVIDAD REQUERIDAS</TableCell>
                            <TableCell className="text-right text-lg">{roundToHalf(horasProductividadRequeridas)} h</TableCell>
                        </TableRow>
                    </TableBody>
                 </Table>
            </KpiCard>

            <FocusSemanalTab 
                title="Incidencias"
                icon={<AlertCircle className="h-5 w-5 text-primary" />}
                text={dayData.incidencias || ""} 
                isEditing={isEditing} 
                onTextChange={(val) => onInputChange(`productividad.${dayKey}.incidencias`, val)} 
                placeholder="Escribe aquí las incidencias del día..."
            />
        </div>
    );
}

export function ProductividadTab({ data, isEditing, onInputChange }: ProductividadTabProps) {
  const [activeSubTab, setActiveSubTab] = React.useState('lunes');
  
  const subTabButtons = [
    { value: 'lunes', label: 'LUNES' },
    { value: 'jueves', label: 'JUEVES' },
  ];
  
  const handleGeneratePDF = () => {
    if (!data || !data.productividad || !data.listas || !data.listas.productividadRatio) return;

    const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
    const dayKey = activeSubTab as 'lunes' | 'jueves';
    const dayData = data.productividad[dayKey];
    const ratios = data.listas.productividadRatio;
    const pageWidth = doc.internal.pageSize.width;
    
    const dayDate = getDateOfWeek(data.periodo, dayKey);
    const dateString = dayDate ? format(dayDate, "EEEE, d 'de' MMMM", { locale: es }) : '';
    
    doc.setFontSize(18);
    doc.text(`PRODUCTIVIDAD`, pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`ZARA 1224 - PUERTO VENECIA - ${dateString.toUpperCase()}`, pageWidth / 2, 26, { align: 'center' });
    
    const ratioConfeccion = ratios.confeccion || 120;
    const ratioPerchado = ratios.perchado || 80;
    const ratioPicking = ratios.picking || 400;
    const porcentajePerchado = (ratios.porcentajePerchado || 40) / 100;
    const porcentajePicking = (ratios.porcentajePicking || 60) / 100;

    const sections = ['woman', 'man', 'nino'] as const;

    const productividadData = sections.map(sec => {
        const sectionData = dayData.productividadPorSeccion[sec];
        const unidadesConfeccion = sectionData?.unidadesConfeccion || 0;
        const unidadesPaqueteria = sectionData?.unidadesPaqueteria || 0;
        const horasConfeccion = unidadesConfeccion / ratioConfeccion;
        const unidadesPerchado = unidadesPaqueteria * porcentajePerchado;
        const horasPerchado = unidadesPerchado / ratioPerchado;
        const unidadesPicking = unidadesPaqueteria * porcentajePicking;
        const horasPicking = unidadesPicking / ratioPicking;
        const hora = sectionData?.hora || '';

        return { 
            title: `${sec.toUpperCase()}${hora ? ` (${hora})` : ''}`,
            unidadesConfeccion, horasConfeccion, unidadesPaqueteria, unidadesPerchado, horasPerchado, unidadesPicking, horasPicking 
        };
    });

    const bodyData = productividadData.flatMap(sec => [
        { section: sec.title, tarea: 'Confección', unidades: formatNumber(sec.unidadesConfeccion), ratio: `${ratioConfeccion} u/h`, horas: `${roundToHalf(sec.horasConfeccion)} h` },
        { section: '', tarea: 'Paquetería (Perchado)', unidades: formatNumber(sec.unidadesPerchado), ratio: `${ratioPerchado} u/h`, horas: `${roundToHalf(sec.horasPerchado)} h` },
        { section: '', tarea: 'Paquetería (Picking)', unidades: formatNumber(sec.unidadesPicking), ratio: `${ratioPicking} u/h`, horas: `${roundToHalf(sec.horasPicking)} h` },
    ]);

    const horasProductividadRequeridas = productividadData.reduce((sum, d) => sum + d.horasConfeccion + d.horasPerchado + d.horasPicking, 0);

    autoTable(doc, {
        startY: 35,
        head: [['Sección', 'Tarea', 'Unidades', 'Productividad', 'Horas Req.']],
        body: bodyData.map(d => [d.section, d.tarea, d.unidades, d.ratio, d.horas]),
        theme: 'plain',
        styles: {
            valign: 'middle',
            lineWidth: { top: 0, right: 0, bottom: 0.1, left: 0 },
            lineColor: [200, 200, 200],
        },
        headStyles: { 
            fillColor: false,
            textColor: [73, 175, 165],
            fontStyle: 'bold',
            lineWidth: { bottom: 0.3 },
            lineColor: [120, 120, 120]
        },
        foot: [['TOTAL HORAS PRODUCTIVIDAD REQUERIDAS', '', '', '', `${roundToHalf(horasProductividadRequeridas)} h`]],
        footStyles: { 
            fillColor: [230, 230, 230], 
            textColor: 20, 
            fontStyle: 'bold',
            lineWidth: { top: 0.2, right: 0, bottom: 0, left: 0 },
            lineColor: [150,150,150]
        },
        didParseCell: function (data) {
            if (data.row.index % 3 === 2 && data.section === 'body') {
                data.cell.styles.lineWidth = { ...data.cell.styles.lineWidth, bottom: 0.3 };
                 data.cell.styles.lineColor = [120, 120, 120];
            }
        },
         willDrawCell: function (data) {
            if (data.column.index === 0 && data.section === 'body' && data.row.index % 3 === 0) {
                doc.setFontSize(10);
                doc.setFont('helvetica', 'bold');
            }
             if (data.column.index === 0 && data.section === 'body' && data.row.index % 3 !== 0) {
                // This will effectively hide the "WOMAN", "MAN", "NINO" text on the 2nd and 3rd row of each group
                data.cell.text = [''];
            }
        }
    });

    doc.save('productividad.pdf');
  };


  return (
     <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full font-light">
        <div className="flex justify-between items-center mb-4">
            <div className="grid w-full max-w-sm grid-cols-2 gap-2">
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
             <Button onClick={handleGeneratePDF} variant="outline" disabled={!data || !data.periodo}>
                <Printer className="mr-2 h-4 w-4" />
                Crear PDF
            </Button>
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
