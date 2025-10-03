
"use client";

import React from 'react';
import type { CoberturaHora } from "@/lib/data";
import { KpiCard, DatoSimple } from "../kpi-card";
import { Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

type CoberturaCardProps = {
  data: CoberturaHora[];
  isEditing: boolean;
  onInputChange: (path: string, value: any) => void;
  basePath: string;
};

export function CoberturaCard({ data, isEditing, onInputChange, basePath }: CoberturaCardProps) {
    if (!data) return null;

    const totalPersonas = data.reduce((sum, item) => sum + (item.personas || 0), 0);

    return (
        <KpiCard title="COBERTURA" icon={<Users className="h-5 w-5 text-primary" />}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3 space-y-2">
                    <div className="grid grid-cols-7 text-center text-sm font-semibold text-muted-foreground">
                        {data.map(item => <div key={item.hora}>{item.hora}</div>)}
                    </div>
                    <div className="grid grid-cols-7 text-center">
                        {data.map((item, index) => (
                             <DatoSimple
                                key={item.hora}
                                value={item.personas}
                                isEditing={isEditing}
                                onInputChange={onInputChange}
                                valueId={`${basePath}.${index}.personas`}
                                align="center"
                            />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center space-y-2 border-l pl-4">
                    <span className="text-sm font-semibold text-muted-foreground">TOTAL</span>
                    <span className="text-3xl font-bold">{totalPersonas}</span>
                </div>
            </div>
        </KpiCard>
    );
}
