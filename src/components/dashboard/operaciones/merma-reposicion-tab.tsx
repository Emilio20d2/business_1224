
"use client";

import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { KpiCard, DatoSimple } from "../kpi-card";
import { ClipboardX, Trash2, RefreshCw, Sparkles, Euro, Package, Percent } from 'lucide-react';

type MermaReposicionTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any, reorder?: boolean) => void;
};

const SectionMermaOperaciones = ({ 
    sectionName, 
    perdidas, 
    operaciones, 
    isEditing, 
    onInputChange, 
    basePath 
}: { 
    sectionName: string, 
    perdidas: any, 
    operaciones: any, 
    isEditing: boolean, 
    onInputChange: any, 
    basePath: string 
}) => (
    <div className="space-y-4">
        <h2 className="text-xl font-bold">{sectionName}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <KpiCard title="GAP" icon={<ClipboardX className="h-5 w-5 text-primary" />}>
                <div className="flex flex-row justify-center items-center gap-4 h-full">
                <DatoSimple 
                    label={<Euro className="h-5 w-5 text-primary"/>}
                    value={perdidas.gap.euros} 
                    isEditing={isEditing}
                    valueId={`${basePath}.perdidas.gap.euros`}
                    align="center"
                    onInputChange={onInputChange}
                />
                <DatoSimple 
                    label={<Package className="h-5 w-5 text-primary"/>}
                    value={perdidas.gap.unidades}
                    isEditing={isEditing}
                    valueId={`${basePath}.perdidas.gap.unidades`}
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
                </div>
            </KpiCard>
        </div>
    </div>
);

const SectionOperaciones = ({ 
    sectionName, 
    operaciones, 
    isEditing, 
    onInputChange, 
    basePath 
}: { 
    sectionName: string, 
    operaciones: any, 
    isEditing: boolean, 
    onInputChange: any, 
    basePath: string 
}) => (
     <div className="space-y-4">
        <h2 className="text-xl font-bold">{sectionName}</h2>
        <KpiCard title="Operaciones" icon={<RefreshCw className="h-5 w-5 text-primary" />}>
            <div className="grid grid-cols-2 gap-4 h-full">
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
            </div>
        </KpiCard>
    </div>
);

export function MermaReposicionTab({ data, isEditing, onInputChange }: MermaReposicionTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Columna de Mermas */}
        <div className="space-y-6">
            <SectionMermaOperaciones 
                sectionName="GENERAL"
                perdidas={data.general.perdidas}
                operaciones={data.general.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="general"
            />
             <SectionMermaOperaciones 
                sectionName="WOMAN"
                perdidas={data.woman.perdidas}
                operaciones={data.woman.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="woman"
            />
             <SectionMermaOperaciones 
                sectionName="MAN"
                perdidas={data.man.perdidas}
                operaciones={data.man.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="man"
            />
             <SectionMermaOperaciones 
                sectionName="NIÑO"
                perdidas={data.nino.perdidas}
                operaciones={data.nino.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="nino"
            />
        </div>

        {/* Columna de Operaciones */}
        <div className="space-y-6">
            <SectionOperaciones
                sectionName="GENERAL"
                operaciones={data.general.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="general"
            />
            <SectionOperaciones
                sectionName="WOMAN"
                operaciones={data.woman.operaciones}
                isEditing={isEditing}
                onInputChange={onInputChange}
                basePath="woman"
            />
            <SectionOperaciones
                sectionName="MAN"
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
