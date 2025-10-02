
"use client";

import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { KpiCard, DatoSimple } from "../kpi-card";
import { Trash2, RefreshCw, Sparkles, Package, Percent, Target, Users } from 'lucide-react';

type MermaReposicionTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any, reorder?: boolean) => void;
};

const SectionMerma = ({ 
    sectionName, 
    perdidas,
    target,
    isEditing, 
    onInputChange, 
    basePath 
}: { 
    sectionName: string, 
    perdidas: any,
    target: number,
    isEditing: boolean, 
    onInputChange: any, 
    basePath: string 
}) => (
    <div>
        <h2 className="text-xl font-bold mb-2">{sectionName}</h2>
        <KpiCard title="Merma" icon={<Trash2 className="h-5 w-5 text-primary" />}>
            <div className="grid grid-cols-3 justify-center items-center gap-4 h-full">
                <DatoSimple 
                    label={<Package className="h-5 w-5 text-primary"/>}
                    value={perdidas.merma.unidades}
                    isEditing={isEditing}
                    valueId={`${basePath}.perdidas.merma.unidades`}
                    align="center"
                    unit="Unid."
                    onInputChange={onInputChange}
                />
                <DatoSimple 
                    label={<Percent className="h-5 w-5 text-primary"/>}
                    value={perdidas.merma.porcentaje}
                    isEditing={isEditing}
                    valueId={`${basePath}.perdidas.merma.porcentaje`}
                    align="center"
                    unit="%"
                    onInputChange={onInputChange}
                />
                 <DatoSimple 
                    label={<Target className="h-5 w-5 text-primary"/>}
                    value={target}
                    isEditing={isEditing}
                    valueId={`listas.mermaTarget.${basePath}`}
                    align="center"
                    unit="%"
                    onInputChange={onInputChange}
                />
            </div>
        </KpiCard>
    </div>
);

const SectionOperaciones = ({ 
    operaciones, 
    isEditing, 
    onInputChange, 
    basePath 
}: { 
    operaciones: any, 
    isEditing: boolean, 
    onInputChange: any, 
    basePath: string 
}) => (
     <div>
        <div className="h-8 mb-2"></div>
        <KpiCard title="Operaciones" icon={<RefreshCw className="h-5 w-5 text-primary" />}>
            <div className="grid grid-cols-3 gap-4 h-full">
            <DatoSimple 
                icon={<RefreshCw className="h-5 w-5 text-primary"/>} 
                label="Repo" 
                value={operaciones.repoPorc} 
                isEditing={isEditing} 
                valueId={`${basePath}.operaciones.repoPorc`}
                align="center" 
                unit="%" 
                onInputChange={onInputChange} 
            />
            <DatoSimple 
                icon={<Sparkles className="h-5 w-5 text-primary"/>} 
                label="Frescura" 
                value={operaciones.frescuraPorc} 
                isEditing={isEditing} 
                valueId={`${basePath}.operaciones.frescuraPorc`}
                align="center" 
                unit="%" 
                onInputChange={onInputChange} 
            />
            <DatoSimple
                icon={<Users className="h-5 w-5 text-primary"/>}
                label="Cobertura"
                value={operaciones.coberturaPorc}
                isEditing={isEditing}
                valueId={`${basePath}.operaciones.coberturaPorc`}
                align="center"
                unit="%"
                onInputChange={onInputChange}
            />
            </div>
        </KpiCard>
    </div>
);

export function MermaReposicionTab({ data, isEditing, onInputChange }: MermaReposicionTabProps) {
  if (!data.listas.mermaTarget) {
      data.listas.mermaTarget = { general: 0, woman: 0, man: 0, nino: 0 };
  }
  const { mermaTarget } = data.listas;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-2">
            <SectionMerma
                sectionName="GENERAL"
                perdidas={data.general.perdidas}
                target={mermaTarget.general}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="general"
            />
             <SectionMerma
                sectionName="WOMAN"
                perdidas={data.woman.perdidas}
                target={mermaTarget.woman}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="woman"
            />
             <SectionMerma
                sectionName="MAN"
                perdidas={data.man.perdidas}
                target={mermaTarget.man}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="man"
            />
             <SectionMerma
                sectionName="NIÑO"
                perdidas={data.nino.perdidas}
                target={mermaTarget.nino}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="nino"
            />
        </div>

        <div className="space-y-2">
            <SectionOperaciones
                operaciones={data.general.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="general"
            />
            <SectionOperaciones
                operaciones={data.woman.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="woman"
            />
            <SectionOperaciones
                operaciones={data.man.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="man"
            />
            <SectionOperaciones
                operaciones={data.nino.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="nino"
            />
        </div>
    </div>
  );
}
