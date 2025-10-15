

"use client";

import React from 'react';
import type { WeeklyData, VentasManItem, SeccionAqneNinoData } from "@/lib/data";
import { VentasCompradorNinoCard } from './ventas-comprador-nino-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatNumber, getNextWeekId, formatWeekIdToDateRange } from '@/lib/format';

type AqneNinoTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
  weekId: string;
};

const AqneResumenCard = ({ data, isEditing, onInputChange, weekId }: { data: SeccionAqneNinoData, isEditing: boolean, onInputChange: (path: string, value: string | number) => void, weekId: string }) => {
    if (!data) return null;

    const nextWeekId = getNextWeekId(weekId);
    const nextWeekDateRange = formatWeekIdToDateRange(nextWeekId);

    const handleDesgloseChange = (index: number, field: string, value: string) => {
        onInputChange(`aqneNino.desglose.${index}.${field}`, value);
    };

    const handleMetricasChange = (field: string, value: string) => {
        onInputChange(`aqneNino.metricasPrincipales.${field}`, value);
    }
    
    const totalUnidades = data.desglose.reduce((sum, item) => sum + (item.unidades || 0), 0);
    const totalEuros = data.desglose.reduce((sum, item) => sum + (item.totalEuros || 0), 0);


    return (
        <Card>
            <CardHeader>
                <CardTitle className="uppercase font-bold text-base">
                    PLANNING SEMANAL - {nextWeekDateRange}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="uppercase font-bold">Sección</TableHead>
                            <TableHead className="text-right uppercase font-bold">Unidades</TableHead>
                            <TableHead className="text-right uppercase font-bold">Importe (€)</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.desglose.map((item, index) => (
                            <TableRow key={item.seccion}>
                                <TableCell className="font-medium">{item.seccion}</TableCell>
                                <TableCell className="text-right">
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            inputMode="decimal"
                                            defaultValue={item.unidades}
                                            onChange={(e) => handleDesgloseChange(index, 'unidades', e.target.value)}
                                            className="w-24 ml-auto text-right"
                                        />
                                    ) : (
                                        formatNumber(item.unidades)
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            inputMode="decimal"
                                            defaultValue={item.totalEuros}
                                            onChange={(e) => handleDesgloseChange(index, 'totalEuros', e.target.value)}
                                            className="w-24 ml-auto text-right"
                                        />
                                    ) : (
                                        formatCurrency(item.totalEuros)
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                     <TableFooter>
                        <TableRow className="bg-muted/50 font-bold">
                            <TableHead>TOTALES</TableHead>
                            <TableHead className="text-right">{formatNumber(totalUnidades)}</TableHead>
                            <TableHead className="text-right">{formatCurrency(totalEuros)}</TableHead>
                        </TableRow>
                    </TableFooter>
                </Table>
            </CardContent>
        </Card>
    );
};


export function AqneNinoTab({ data, isEditing, onInputChange, weekId }: AqneNinoTabProps) {
    if (!data || !data.aqneNino || !data.ventasCompradorNino || !data.listas) return null;

    const { aqneNino, ventasCompradorNino, listas } = data;
    
    const forcedOrder = ["NIÑA", "NIÑO", "KIDS-A", "KIDS-O", "BABY", "ACCESORIOS"];
    const sortedVentasCompradorNino = [...ventasCompradorNino].sort((a, b) => {
        const indexA = forcedOrder.indexOf(a.nombre);
        const indexB = forcedOrder.indexOf(b.nombre);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return (
        <div className="space-y-4">
            <AqneResumenCard data={aqneNino} isEditing={isEditing} onInputChange={onInputChange} weekId={weekId} />
            <div className="grid grid-cols-1 gap-4">
                {sortedVentasCompradorNino.map((compradorData, index) => {
                     const originalIndex = ventasCompradorNino.findIndex(item => item.nombre === compradorData.nombre);
                     
                     return (
                        <VentasCompradorNinoCard
                            key={`${compradorData.nombre}-${index}`}
                            compradorData={compradorData}
                            listas={listas}
                            isEditing={isEditing}
                            onInputChange={(path, value) => onInputChange(`ventasCompradorNino.${originalIndex}.${path}`, value)}
                        />
                    );
                })}
            </div>
        </div>
    );
};
