
"use client";

import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { KpiCard, DatoSimple } from "../kpi-card";
import { RefreshCw, Sparkles, Users, FileQuestion, StickyNote } from 'lucide-react';
import { MermaCard } from '../merma-card';
import { FocusSemanalTab } from '../focus-semanal-tab';


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
    <KpiCard title={`OPERACIONES ${sectionName}`} icon={<RefreshCw className="h-5 w-5 text-primary" />}>
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
);

export function MermaReposicionTab({ data, isEditing, onInputChange }: MermaReposicionTabProps) {
  if (!data.listas.mermaTarget) {
      data.listas.mermaTarget = { general: 0, woman: 0, man: 0, nino: 0 };
  }
  const { mermaTarget } = data.listas;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
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
            <FocusSemanalTab
                title="Notas Merma"
                icon={<StickyNote className="h-5 w-5 text-primary" />}
                text={data.notasMerma || ""}
                isEditing={isEditing}
                onTextChange={(value) => onInputChange('notasMerma', value)}
                placeholder="Añadir notas sobre merma..."
            />
        </div>

        <div className="space-y-4">
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
            <FocusSemanalTab
                title="Notas Reposición"
                icon={<StickyNote className="h-5 w-5 text-primary" />}
                text={data.notasReposicion || ""}
                isEditing={isEditing}
                onTextChange={(value) => onInputChange('notasReposicion', value)}
                placeholder="Añadir notas sobre reposición..."
            />
        </div>
    </div>
  );
}
