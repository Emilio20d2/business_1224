
"use client"

import React from 'react';
import type { AcumuladoSeccionMes } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { formatCurrency, formatNumber, formatPercentage } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Euro, Package, TrendingUp } from 'lucide-react';

type AcumuladoSeccionCardProps = {
  title: string;
  data: AcumuladoSeccionMes[];
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
  sectionKey: 'woman' | 'man' | 'nino';
  color: string;
};

export const AcumuladoSeccionCard = ({ title, data, isEditing, onInputChange, sectionKey, color }: AcumuladoSeccionCardProps) => {

  const handleInputChange = (mesIndex: number, field: keyof AcumuladoSeccionMes, value: string) => {
    onInputChange(`acumuladoSeccion.${sectionKey}.${mesIndex}.${field}`, value);
  };

  const totalImporte = data.reduce((sum, mes) => sum + (mes.importe || 0), 0);
  const totalUnidades = data.reduce((sum, mes) => sum + (mes.unidades || 0), 0);
  
  const avgVarImporte = data.reduce((sum, mes) => sum + (mes.importe || 0) * (mes.varImporte || 0), 0) / (totalImporte || 1);
  const avgVarUnidades = data.reduce((sum, mes) => sum + (mes.unidades || 0) * (mes.varUnidades || 0), 0) / (totalUnidades || 1);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-lg" style={{color}}>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="grid grid-cols-2 gap-4 text-center mb-4">
            <div className="p-2 bg-muted rounded-md">
                <p className="text-sm font-semibold text-muted-foreground">Total Importe</p>
                <p className="text-xl font-bold">{formatCurrency(totalImporte)}</p>
            </div>
            <div className="p-2 bg-muted rounded-md">
                <p className="text-sm font-semibold text-muted-foreground">Total Unidades</p>
                <p className="text-xl font-bold">{formatNumber(totalUnidades)}</p>
            </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/3">Mes</TableHead>
              <TableHead className="text-right">Importe</TableHead>
              <TableHead className="text-right">Unidades</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((mes, index) => (
              <TableRow key={mes.mes}>
                <TableCell className="font-medium">{mes.mes}</TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <div className="flex flex-col gap-1 items-end">
                      <Input
                        type="number"
                        inputMode="decimal"
                        defaultValue={mes.importe}
                        onBlur={(e) => handleInputChange(index, 'importe', e.target.value)}
                        className="h-7 text-xs text-right w-24"
                      />
                      <Input
                        type="number"
                        inputMode="decimal"
                        defaultValue={mes.varImporte}
                        onBlur={(e) => handleInputChange(index, 'varImporte', e.target.value)}
                        className="h-7 text-xs text-right w-16"
                        placeholder="%"
                      />
                    </div>
                  ) : (
                    <div>
                      <div>{formatCurrency(mes.importe)}</div>
                      <div className={cn("text-xs", mes.varImporte >= 0 ? "text-green-600" : "text-red-600")}>
                        {formatPercentage(mes.varImporte, true)}
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {isEditing ? (
                    <div className="flex flex-col gap-1 items-end">
                      <Input
                        type="number"
                        inputMode="decimal"
                        defaultValue={mes.unidades}
                        onBlur={(e) => handleInputChange(index, 'unidades', e.target.value)}
                        className="h-7 text-xs text-right w-24"
                      />
                       <Input
                        type="number"
                        inputMode="decimal"
                        defaultValue={mes.varUnidades}
                        onBlur={(e) => handleInputChange(index, 'varUnidades', e.target.value)}
                        className="h-7 text-xs text-right w-16"
                        placeholder="%"
                      />
                    </div>
                  ) : (
                    <div>
                      <div>{formatNumber(mes.unidades)}</div>
                       <div className={cn("text-xs", mes.varUnidades >= 0 ? "text-green-600" : "text-red-600")}>
                        {formatPercentage(mes.varUnidades, true)}
                      </div>
                    </div>
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
