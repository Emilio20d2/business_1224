

"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import type { VentasCompradorNinoItem, WeeklyData } from "@/lib/data";
import { cn } from '@/lib/utils';

type VentasCompradorNinoCardProps = {
  compradorData: VentasCompradorNinoItem;
  listas: WeeklyData['listas'];
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
};

export function VentasCompradorNinoCard({ compradorData, listas, isEditing, onInputChange }: VentasCompradorNinoCardProps) {

  const handleFamiliaChange = (familiaIndex: number, field: 'nombre' | 'totalEuros' | 'varPorc' | 'zona', value: string) => {
    onInputChange(`mejoresFamilias.${familiaIndex}.${field}`, value);
  };
  
  const sortedFamilias = [...(listas.agrupacionComercialNino || [])].sort((a,b) => a.localeCompare(b));
  const zonasNino = ["NIÑA", "NIÑO", "MINI"];


  return (
    <Card>
      <CardContent className="p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Columna 1: Comprador */}
          <div className="flex flex-col justify-center items-center gap-2 py-2">
            <h3 className="font-bold text-xl text-center">{compradorData.nombre}</h3>
            <div className="flex flex-col items-center gap-1">
              <label className="text-sm font-medium text-muted-foreground">Total €</label>
              {isEditing ? (
                <Input
                  type="number"
                  inputMode="decimal"
                  defaultValue={compradorData.totalEuros}
                  className="w-28 text-center text-lg font-bold"
                  onBlur={(e) => onInputChange('totalEuros', e.target.value)}
                />
              ) : (
                <span className="font-bold text-lg">{formatCurrency(compradorData.totalEuros)}</span>
              )}
            </div>
             <div className="flex flex-col items-center gap-1">
                 <label className="text-sm font-medium text-muted-foreground">Var %</label>
                {isEditing ? (
                    <Input
                        type="number"
                        inputMode="decimal"
                        defaultValue={compradorData.varPorcTotal}
                        className="w-28 text-center text-lg font-bold"
                        onBlur={(e) => onInputChange('varPorcTotal', e.target.value)}
                    />
                ) : (
                    <span className={cn("font-bold text-lg", compradorData.varPorcTotal < 0 ? "text-red-600" : "text-green-600")}>
                        {formatPercentage(compradorData.varPorcTotal)}
                    </span>
                )}
            </div>
          </div>

          {/* Columna 2: Mejores Familias */}
          <div className="flex flex-col">
            <h3 className="font-bold text-lg text-center text-primary mb-2">MEJORES FAMILIAS</h3>
            <div className="flex-grow flex flex-col justify-center">
              <div className="space-y-1">
                {compradorData.mejoresFamilias.map((familia, familiaIndex) => (
                  <div key={familiaIndex} className="grid grid-cols-[1fr_auto_auto_auto] gap-1 items-center">
                    {isEditing ? (
                        <>
                            <Select value={familia.nombre || 'ninguna'} onValueChange={(value) => handleFamiliaChange(familiaIndex, 'nombre', value === 'ninguna' ? '' : value)}>
                                <SelectTrigger className="text-xs h-8">
                                <SelectValue placeholder="Familia..." />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="ninguna">-- Ninguna --</SelectItem>
                                {sortedFamilias.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                             <Select value={familia.zona || 'ninguna'} onValueChange={(value) => handleFamiliaChange(familiaIndex, 'zona', value === 'ninguna' ? '' : value)}>
                                <SelectTrigger className="text-xs h-8 w-24">
                                <SelectValue placeholder="Zona..." />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="ninguna">-- Zona --</SelectItem>
                                {zonasNino.map(option => (
                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                ))}
                                </SelectContent>
                            </Select>
                            <Input
                                type="number"
                                inputMode="decimal"
                                defaultValue={familia.totalEuros}
                                onBlur={(e) => handleFamiliaChange(familiaIndex, 'totalEuros', e.target.value)}
                                className="w-20 text-right h-8"
                                placeholder="€"
                            />
                             <Input
                                type="number"
                                inputMode="decimal"
                                defaultValue={familia.varPorc}
                                onBlur={(e) => handleFamiliaChange(familiaIndex, 'varPorc', e.target.value)}
                                className="w-16 text-right h-8"
                                placeholder="%"
                            />
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-xs text-left p-1 h-8 flex items-center justify-start">
                          {familia.nombre || <span className="text-muted-foreground">--</span>}
                        </p>
                        <span className="font-medium text-xs text-center w-24">{familia.zona}</span>
                        <span className="font-medium text-xs text-right w-20">{formatCurrency(familia.totalEuros)}</span>
                        <span className={cn("font-medium text-xs text-right w-16", familia.varPorc < 0 ? "text-red-600" : "text-green-600")}>{formatPercentage(familia.varPorc)}</span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
