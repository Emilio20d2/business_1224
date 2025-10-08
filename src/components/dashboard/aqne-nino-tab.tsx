
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
  TableFooter,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

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
    );
};
