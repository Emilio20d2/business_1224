
"use client";

import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { KpiCard, DatoSimple } from "./kpi-card";
import { Trash2, Package, Percent, Target, Euro } from 'lucide-react';

type MermaCardProps = {
  sectionName: string;
  perdidas: any;
  target: number;
  isEditing: boolean;
  onInputChange: any;
  basePath: string;
};

export const MermaCard = ({ sectionName, perdidas, target, isEditing, onInputChange, basePath }: MermaCardProps) => (
    <KpiCard title={`MERMA ${sectionName}`} icon={<Trash2 className="h-5 w-5 text-primary" />}>
        <div className="grid grid-cols-4 justify-center items-center gap-4 h-full">
            <DatoSimple 
                label={<Euro className="h-5 w-5 text-primary"/>}
                value={perdidas.merma.euros}
                isEditing={isEditing}
                valueId={`${basePath}.perdidas.merma.euros`}
                align="center"
                unit="€"
                onInputChange={onInputChange}
            />
            <DatoSimple 
                label={<Package className="h-5 w-5 text-primary"/>}
                value={perdidas.merma.unidades}
                isEditing={isEditing}
                valueId={`${basePath}.perdidas.merma.unidades`}
                align="center"
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
);
