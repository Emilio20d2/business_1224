
"use client";

import React from 'react';
import type { SeccionAqneNinoData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { DatoDoble } from './kpi-card';

type AqneNinoTabProps = {
  data: SeccionAqneNinoData;
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
};

export function AqneNinoTab({ data, isEditing, onInputChange }: AqneNinoTabProps) {
    if (!data) return null;

    const { metricasPrincipales, desglose } = data;

    const handleDesgloseChange = (index: number, field: string, value: string) => {
        onInputChange(`aqneNino.desglose.${index}.${field}`, value);
    };

    return (
        <Card className="flex-1">
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center text-lg font-bold">
                    AQNE NIÑO
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <DatoDoble
                        label="Total Euros"
                        value={formatCurrency(metricasPrincipales.totalEuros)}
                        variation={metricasPrincipales.varPorcEuros}
                        isEditing={isEditing}
                        valueId="aqneNino.metricasPrincipales.totalEuros"
                        variationId="aqneNino.metricasPrincipales.varPorcEuros"
                        onInputChange={onInputChange}
                    />
                    <DatoDoble
                        label="Total Unidades"
                        value={formatNumber(metricasPrincipales.totalUnidades)}
                        variation={metricasPrincipales.varPorcUnidades}
                        isEditing={isEditing}
                        valueId="aqneNino.metricasPrincipales.totalUnidades"
                        variationId="aqneNino.metricasPrincipales.varPorcUnidades"
                        onInputChange={onInputChange}
                    />
                </div>
                
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Sección</TableHead>
                            <TableHead className="text-right">Total Euros</TableHead>
                            <TableHead className="text-right">Unidades</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {desglose.map((item, index) => (
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
                </Table>
            </CardContent>
        </Card>
    );
};
