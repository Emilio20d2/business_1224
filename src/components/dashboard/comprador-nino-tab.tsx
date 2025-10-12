
"use client";

import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { VentasCompradorNinoCard } from './ventas-comprador-nino-card';

type CompradorNinoTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
};

export function CompradorNinoTab({ data, isEditing, onInputChange }: CompradorNinoTabProps) {
    if (!data || !data.ventasCompradorNino) return null;

    const { ventasCompradorNino, listas } = data;

    // --- FORCE ORDER ---
    const forcedOrder = ["NIÑA", "NIÑO", "KIDS-A", "KIDS-O", "BABY", "ACCESORIOS"];
    const sortedVentasCompradorNino = ventasCompradorNino ? [...ventasCompradorNino].sort((a, b) => {
        const indexA = forcedOrder.indexOf(a.nombre);
        const indexB = forcedOrder.indexOf(b.nombre);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    }) : [];

    return (
        <div className="space-y-4">
            {sortedVentasCompradorNino.map((compradorData, index) => {
                 // Find the original index before sorting to post updates correctly
                const originalIndex = ventasCompradorNino.findIndex(item => item.nombre === compradorData.nombre);
                return (
                    <VentasCompradorNinoCard
                        key={compradorData.nombre}
                        compradorData={compradorData}
                        listas={listas}
                        isEditing={isEditing}
                        onInputChange={(path, value) => onInputChange(`ventasCompradorNino.${originalIndex}.${path}`, value)}
                    />
                );
            })}
        </div>
    );
};
