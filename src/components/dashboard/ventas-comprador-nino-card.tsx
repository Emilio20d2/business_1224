
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency, formatNumber } from "@/lib/format";
import type { VentasCompradorNinoItem, WeeklyData } from "@/lib/data";

type VentasCompradorNinoCardProps = {
  compradorData: VentasCompradorNinoItem;
  listas: WeeklyData['listas'];
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
};

export function VentasCompradorNinoCard({ compradorData, listas, isEditing, onInputChange }: VentasCompradorNinoCardProps) {

  const handleZonaChange = (zonaIndex: number, field: 'totalEuros' | 'totalUnidades', value: string) => {
    onInputChange(`zonas.${zonaIndex}.${field}`, value);
  };

  const handleFamiliaChange = (familiaIndex: number, value: string) => {
    onInputChange(`mejoresFamilias.${familiaIndex}`, value === 'ninguna' ? '' : value);
  };
  
  const sortedFamilias = [...(listas.agrupacionComercialNino || [])].sort((a,b) => a.localeCompare(b));

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna 1: Comprador */}
          <div className="flex flex-col justify-center items-center gap-4">
            <h3 className="font-bold text-3xl text-center">{compradorData.nombre}</h3>
            <div className="flex flex-col items-center gap-2">
              <label className="text-base font-medium text-muted-foreground">Total €</label>
              {isEditing ? (
                <Input
                  type="number"
                  inputMode="decimal"
                  value={compradorData.totalEuros}
                  className="w-28 text-center text-xl font-bold bg-muted"
                  readOnly
                />
              ) : (
                <span className="font-bold text-xl">{formatCurrency(compradorData.totalEuros)}</span>
              )}
            </div>
            <div className="flex flex-col items-center gap-2">
              <label className="text-base font-medium text-muted-foreground">Total Unidades</label>
               {isEditing ? (
                 <Input
                  type="number"
                  inputMode="decimal"
                  value={compradorData.totalUnidades}
                  className="w-28 text-center text-xl font-bold bg-muted"
                  readOnly
                />
              ) : (
                <span className="font-bold text-xl">{formatNumber(compradorData.totalUnidades)}</span>
              )}
            </div>
          </div>

          {/* Columna 2: Zona */}
          <div className="flex flex-col justify-center">
            <div className="space-y-4">
              <h3 className="font-bold text-xl text-center text-primary">ZONA</h3>
              {compradorData.zonas.map((zona, zonaIndex) => (
                <div key={zona.nombre} className="flex flex-col items-center justify-center">
                  <span className="font-bold text-lg">{zona.nombre}</span>
                  <div className="flex items-center gap-4 mt-1">
                      {isEditing ? (
                      <>
                          <Input
                          type="number"
                          inputMode="decimal"
                          defaultValue={zona.totalEuros}
                          onBlur={(e) => handleZonaChange(zonaIndex, 'totalEuros', e.target.value)}
                          className="w-24 text-right text-base"
                          placeholder="€"
                          />
                          <Input
                          type="number"
                          inputMode="decimal"
                          defaultValue={zona.totalUnidades}
                          onBlur={(e) => handleZonaChange(zonaIndex, 'totalUnidades', e.target.value)}
                          className="w-20 text-right text-base"
                          placeholder="Uds."
                          />
                      </>
                      ) : (
                      <>
                          <span className="font-medium text-base text-right w-24">{formatCurrency(zona.totalEuros)}</span>
                          <span className="font-medium text-base text-right w-20">{formatNumber(zona.totalUnidades)}</span>
                      </>
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Columna 3: Mejores Familias */}
          <div className="flex flex-col justify-center">
            <div className="space-y-2">
              <h3 className="font-bold text-xl text-center text-primary">MEJORES FAMILIAS</h3>
              {compradorData.mejoresFamilias.map((familia, familiaIndex) => (
                <div key={familiaIndex}>
                  {isEditing ? (
                    <Select value={familia || 'ninguna'} onValueChange={(value) => handleFamiliaChange(familiaIndex, value)}>
                      <SelectTrigger className="text-base">
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
                    <p className="font-medium text-base text-center p-2 border rounded-md bg-muted/50 h-10 flex items-center justify-center">
                      {familia || <span className="text-muted-foreground">--</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
