

"use client";

import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { VentasCompradorNinoCard } from './ventas-comprador-nino-card';

type AqneNinoTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
};

export function AqneNinoTab({ data, isEditing, onInputChange }: AqneNinoTabProps) {
    if (!data || !data.ventasCompradorNino || !data.listas) return null;

    const { ventasCompradorNino, listas } = data;

    // This ensures that even if the data from Firestore is not ordered,
    // we display it in a consistent, forced order.
    const forcedOrder = ["NIÑA", "NIÑO", "KIDS-A", "KIDS-O", "BABY", "ACCESORIOS"];
    const sortedVentasCompradorNino = [...ventasCompradorNino].sort((a, b) => {
        const indexA = forcedOrder.indexOf(a.nombre);
        const indexB = forcedOrder.indexOf(b.nombre);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sortedVentasCompradorNino.map((compradorData, index) => {
                 // Find the original index to make sure we are updating the correct object in the array
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
