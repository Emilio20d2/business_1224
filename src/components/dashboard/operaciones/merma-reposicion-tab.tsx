
"use client";

import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { KpiCard, DatoSimple } from "../kpi-card";
import { RefreshCw, Sparkles, Users, FileQuestion } from 'lucide-react';
import { MermaCard } from '../merma-card';

type MermaReposicionTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any, reorder?: boolean) => void;
};


const SectionOperaciones = ({ 
    operaciones, 
    isEditing, 
    onInputChange, 
    basePath,
    sectionName
}: { 
    operaciones: any, 
    isEditing: boolean, 
    onInputChange: any, 
    basePath: string ,
    sectionName: string
}) => (
     <div>
        <h2 className="text-xl font-bold mb-2">{sectionName}</h2>
        <KpiCard title="Operaciones" icon={<RefreshCw className="h-5 w-5 text-primary" />}>
            <div className="grid grid-cols-4 gap-4 h-full">
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
            <DatoSimple
                icon={<FileQuestion className="h-5 w-5 text-primary"/>}
                label="Sin Posi."
                value={operaciones.sinUbicacion}
                isEditing={isEditing}
                valueId={`${basePath}.operaciones.sinUbicacion`}
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
            <MermaCard
                sectionName="GENERAL"
                perdidas={data.general.perdidas}
                target={mermaTarget.general}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="general"
            />
             <MermaCard
                sectionName="SEÑORA"
                perdidas={data.woman.perdidas}
                target={mermaTarget.woman}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="woman"
            />
             <MermaCard
                sectionName="CABALLERO"
                perdidas={data.man.perdidas}
                target={mermaTarget.man}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="man"
            />
             <MermaCard
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
                sectionName="GENERAL"
                operaciones={data.general.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="general"
            />
            <SectionOperaciones
                sectionName="SEÑORA"
                operaciones={data.woman.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="woman"
            />
            <SectionOperaciones
                sectionName="CABALLERO"
                operaciones={data.man.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="man"
            />
            <SectionOperaciones
                sectionName="NIÑO"
                operaciones={data.nino.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="nino"
            />
        </div>
    </div>
  );
}
