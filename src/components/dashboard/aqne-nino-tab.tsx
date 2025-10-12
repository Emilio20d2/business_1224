
"use client";

import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { VentasCompradorNinoCard } from './ventas-comprador-nino-card';

type AqneNinoTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
  nextWeekDateRange: string;
};

export function AqneNinoTab({ data, isEditing, onInputChange, nextWeekDateRange }: AqneNinoTabProps) {
    if (!data || !data.aqneNino) return null;

    const { aqneNino, ventasCompradorNino, listas } = data;
    const { metricasPrincipales, desglose } = aqneNino || { metricasPrincipales: {}, desglose: [] };

    const handleDesgloseChange = (index: number, field: string, value: string) => {
        onInputChange(`aqneNino.desglose.${index}.${field}`, value);
    };

    // --- FORCE ORDER ---
    const forcedOrder = ["NIÑA", "NIÑO", "KIDS-A", "KIDS-O", "BABY", "ACCESORIOS"];
    const sortedVentasCompradorNino = ventasCompradorNino ? [...ventasCompradorNino].sort((a, b) => {
        const indexA = forcedOrder.indexOf(a.nombre);
        const indexB = forcedOrder.indexOf(b.nombre);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    }) : [];

    return (
        <div className="space-y-4">
            <Card className="flex-1">
                <CardHeader className="p-4">
                    <CardTitle className="text-lg font-bold uppercase">
                        {`AQNE SEMANA ${nextWeekDateRange.toUpperCase()}`}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Sección</TableHead>
                                <TableHead className="text-right">Total Euros</TableHead>
                                <TableHead className="text-right">Unidades</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {(desglose || []).map((item, index) => (
                                <TableRow key={item.seccion}>
                                    <TableCell>{item.seccion}</TableCell>
                                    <TableCell className="text-right">
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                inputMode="decimal"
                                                defaultValue={item.totalEuros}
                                                onBlur={(e) => handleDesgloseChange(index, 'totalEuros', e.target.value)}
                                                className="w-24 ml-auto text-right"
                                            />
                                        ) : (
                                            formatCurrency(item.totalEuros)
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {isEditing ? (
                                            <Input
                                                type="number"
                                                inputMode="decimal"
                                                defaultValue={item.unidades}
                                                onBlur={(e) => handleDesgloseChange(index, 'unidades', e.target.value)}
                                                className="w-24 ml-auto text-right"
                                            />
                                        ) : (
                                            formatNumber(item.unidades)
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableHead>Total</TableHead>
                                <TableHead className="text-right font-bold">
                                    {isEditing ? (
                                        <Input
                                            type="text"
                                            readOnly
                                            value={formatCurrency(metricasPrincipales.totalEuros)}
                                            className="w-24 ml-auto text-right bg-muted"
                                        />
                                    ) : (
                                        formatCurrency(metricasPrincipales.totalEuros)
                                    )}
                                </TableHead>
                                <TableHead className="text-right font-bold">
                                    {isEditing ? (
                                        <Input
                                            type="text"
                                            readOnly
                                            value={formatNumber(metricasPrincipales.totalUnidades)}
                                            className="w-24 ml-auto text-right bg-muted"
                                        />
                                    ) : (
                                        formatNumber(metricasPrincipales.totalUnidades)
                                    )}
                                </TableHead>
                            </TableRow>
                        </TableFooter>
                    </Table>
                </CardContent>
            </Card>
            {sortedVentasCompradorNino && sortedVentasCompradorNino.map((compradorData, index) => (
                <VentasCompradorNinoCard
                    key={compradorData.nombre}
                    compradorData={compradorData}
                    listas={listas}
                    isEditing={isEditing}
                    onInputChange={(path, value) => onInputChange(`ventasCompradorNino.${index}.${path}`, value)}
                />
            ))}
        </div>
    );
};
