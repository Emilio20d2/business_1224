
"use client";

import React from 'react';
import type { OperacionesData, PerdidasData } from "@/lib/data";
import { KpiCard, DatoSimple } from "../kpi-card";
import { ClipboardX, Trash2, RefreshCw, Sparkles, Euro, Package, Percent } from 'lucide-react';

type MermaReposicionTabProps = {
  operaciones: OperacionesData;
  perdidas: PerdidasData;
  isEditing: boolean;
  onInputChange: (path: string, value: any, reorder?: boolean) => void;
};

export function MermaReposicionTab({ operaciones, perdidas, isEditing, onInputChange }: MermaReposicionTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <KpiCard title="GAP" icon={<ClipboardX className="h-5 w-5 text-primary" />}>
        <div className="flex flex-row justify-center items-center gap-4 h-full">
          <DatoSimple 
              label={<Euro className="h-5 w-5 text-primary"/>}
              value={perdidas.gap.euros} 
              isEditing={isEditing}
              valueId="general.perdidas.gap.euros"
              align="center"
              onInputChange={onInputChange}
          />
          <DatoSimple 
              label={<Package className="h-5 w-5 text-primary"/>}
              value={perdidas.gap.unidades}
              isEditing={isEditing}
              valueId="general.perdidas.gap.unidades"
              align="center"
              onInputChange={onInputChange}
          />
        </div>
      </KpiCard>

      <KpiCard title="Merma" icon={<Trash2 className="h-5 w-5 text-primary" />}>
        <div className="flex flex-row justify-center items-center gap-4 h-full">
          <DatoSimple 
              label={<Package className="h-5 w-5 text-primary"/>}
              value={perdidas.merma.unidades}
              isEditing={isEditing}
              valueId="general.perdidas.merma.unidades"
              align="center"
              unit="Unid."
              onInputChange={onInputChange}
          />
          <DatoSimple 
              label={<Percent className="h-5 w-5 text-primary"/>}
              value={perdidas.merma.porcentaje}
              isEditing={isEditing}
              valueId="general.perdidas.merma.porcentaje"
              align="center"
              unit="%"
              onInputChange={onInputChange}
          />
        </div>
      </KpiCard>

      <KpiCard title="Operaciones" icon={<RefreshCw className="h-5 w-5 text-primary" />}>
        <div className="grid grid-cols-2 gap-4 h-full">
          <DatoSimple 
              icon={<RefreshCw className="h-5 w-5 text-primary"/>} 
              label="Repo" 
              value={operaciones.repoPorc} 
              isEditing={isEditing} 
              valueId="general.operaciones.repoPorc" 
              align="center" 
              unit="%" 
              onInputChange={onInputChange} 
          />
          <DatoSimple 
              icon={<Sparkles className="h-5 w-5 text-primary"/>} 
              label="Frescura" 
              value={operaciones.frescuraPorc} 
              isEditing={isEditing} 
              valueId="general.operaciones.frescuraPorc" 
              align="center" 
              unit="%" 
              onInputChange={onInputChange} 
          />
        </div>
      </KpiCard>
    </div>
  );
}
