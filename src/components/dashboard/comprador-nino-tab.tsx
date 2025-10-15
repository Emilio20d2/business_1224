
"use client";

import React from 'react';
import type { WeeklyData, VentasCompradorNinoItem, MejorFamiliaNino } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { cn } from '@/lib/utils';
import { Euro, Package, Percent } from 'lucide-react';

type CompradorNinoTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
};

const CompradorTable = ({
  compradorData,
  ropaData,
  listas,
  isEditing,
  onInputChange,
  compradorIndex,
  ropaDataIndex,
}: {
  compradorData: VentasCompradorNinoItem;
  ropaData: WeeklyData['ventasNino']['pesoComprador'][0] | undefined,
  listas: WeeklyData['listas'];
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
  compradorIndex: number;
  ropaDataIndex: number | undefined;
}) => {
  const handleFamiliaChange = (familiaIndex: number, field: keyof MejorFamiliaNino, value: string) => {
    onInputChange(`ventasCompradorNino.${compradorIndex}.mejoresFamilias.${familiaIndex}.${field}`, value);
  };
  
  const handleHeaderChange = (field: 'totalEuros' | 'varPorc', value: string) => {
      onInputChange(`ventasCompradorNino.${compradorIndex}.${field === 'totalEuros' ? 'totalEuros' : 'varPorcTotal'}`, value);
  };

  const sortedFamilias = [...(listas.agrupacionComercialNino || [])].sort((a,b) => a.localeCompare(b));

  const totalEuros = compradorData?.totalEuros || 0;
  const varPorcTotal = compradorData?.varPorcTotal || 0;


  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{compradorData.nombre}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Familia</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <Euro className="h-4 w-4 text-primary" />
                    <span>Importe</span>
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-1">
                    <Percent className="h-4 w-4 text-primary" />
                    <span>Var %</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {compradorData.mejoresFamilias.map((familia, familiaIndex) => (
              <TableRow key={familiaIndex}>
                <TableCell>
                  {isEditing ? (
                    <Select value={familia.nombre || 'ninguna'} onValueChange={(value) => handleFamiliaChange(familiaIndex, 'nombre', value === 'ninguna' ? '' : value)}>
                      <SelectTrigger className="text-xs h-8">
                        <SelectValue placeholder="Seleccionar familia..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ninguna">-- Ninguna --</SelectItem>
                        {sortedFamilias.map(option => (
                          <SelectItem key={option} value={option}>{option}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    familia.nombre || <span className="text-muted-foreground">--</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      inputMode="decimal"
                      defaultValue={familia.totalEuros}
                      onBlur={(e) => handleFamiliaChange(familiaIndex, 'totalEuros', e.target.value)}
                      className="w-24 text-right h-8 ml-auto"
                      placeholder="€"
                    />
                  ) : (
                    <span className="font-medium text-xs text-right w-24 block ml-auto">{formatCurrency(familia.totalEuros)}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <Input
                      type="number"
                      inputMode="decimal"
                      defaultValue={familia.varPorc}
                      onBlur={(e) => handleFamiliaChange(familiaIndex, 'varPorc', e.target.value)}
                      className="w-20 text-right h-8 ml-auto"
                      placeholder="%"
                    />
                  ) : (
                    <span className={cn("font-medium text-xs text-right w-20 block ml-auto", familia.varPorc < 0 ? "text-red-600" : "text-green-600")}>{formatPercentage(familia.varPorc)}</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-muted/50">
                <TableHead>
                    <div className="flex items-center gap-4">
                        <span className="font-bold">TOTAL</span>
                    </div>
                </TableHead>
                <TableHead className="text-right font-bold">
                    {isEditing ? (
                        <Input
                            type="number"
                            inputMode="decimal"
                            defaultValue={totalEuros}
                            className="w-24 text-right h-8 ml-auto"
                            onBlur={(e) => handleHeaderChange('totalEuros', e.target.value)}
                        />
                    ) : (
                        formatCurrency(totalEuros)
                    )}
                </TableHead>
                <TableHead className="text-right font-bold">
                     {isEditing ? (
                         <div className="flex items-center justify-end">
                            <Input
                                type="number"
                                inputMode="decimal"
                                defaultValue={varPorcTotal}
                                className="w-20 text-center h-8"
                                onBlur={(e) => handleHeaderChange('varPorc', e.target.value)}
                            />
                            <span className="ml-1">%</span>
                        </div>
                    ) : (
                        <span className={cn("font-bold text-sm", varPorcTotal < 0 ? "text-red-600" : "text-green-600")}>
                            {formatPercentage(varPorcTotal)}
                        </span>
                    )}
                </TableHead>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
};


export function CompradorNinoTab({ data, isEditing, onInputChange }: CompradorNinoTabProps) {
    if (!data || !data.ventasCompradorNino || !data.ventasNino) return null;

    const { ventasCompradorNino, ventasNino, listas } = data;

    const forcedOrder = ["NIÑA", "NIÑO", "KIDS-A", "KIDS-O", "BABY", "ACCESORIOS"];
    const sortedVentasCompradorNino = ventasCompradorNino ? [...ventasCompradorNino].sort((a, b) => {
        const indexA = forcedOrder.indexOf(a.nombre);
        const indexB = forcedOrder.indexOf(b.nombre);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    }) : [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedVentasCompradorNino.map((compradorData) => {
                const originalIndex = ventasCompradorNino.findIndex(item => item.nombre === compradorData.nombre);
                const ropaData = ventasNino.pesoComprador.find(item => item.nombre === compradorData.nombre);
                const ropaDataIndex = ventasNino.pesoComprador.findIndex(item => item.nombre === compradorData.nombre);

                return (
                    <CompradorTable
                        key={compradorData.nombre}
                        compradorData={compradorData}
                        ropaData={ropaData}
                        listas={listas}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        compradorIndex={originalIndex}
                        ropaDataIndex={ropaDataIndex !== -1 ? ropaDataIndex : undefined}
                    />
                );
            })}
        </div>
    );
};
