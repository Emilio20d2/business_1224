
"use client";

import React from 'react';
import type { OperacionesData } from '@/lib/data';
import { KpiCard, DatoSimple } from "./kpi-card";
import { Receipt, Clock, ScanLine, Inbox, Smartphone, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

type CajaCardProps = {
    operaciones: OperacionesData;
    isEditing: boolean;
    onInputChange: (path: string, value: string | number) => void;
    className?: string;
};

export function CajaCard({ operaciones, isEditing, onInputChange, className }: CajaCardProps) {
    if (!operaciones) return null;

    return (
        <KpiCard title="Caja" icon={<Receipt className="h-5 w-5 text-primary" />} className={className}>
            <div className="grid grid-cols-2 md:grid-cols-4 items-center justify-center gap-4 h-full">
                <DatoSimple
                    icon={<Clock className="h-5 w-5 text-primary" />}
                    label="Filas Caja"
                    value={operaciones.filasCajaPorc}
                    isEditing={isEditing}
                    align="center"
                    unit="%"
                    valueId="general.operaciones.filasCajaPorc"
                    onInputChange={onInputChange}
                />
                <DatoSimple
                    icon={<ScanLine className="h-5 w-5 text-primary" />}
                    label="ACO"
                    value={operaciones.scoPorc}
                    isEditing={isEditing}
                    align="center"
                    unit="%"
                    valueId="general.operaciones.scoPorc"
                    onInputChange={onInputChange}
                />
                <DatoSimple
                    icon={<Inbox className="h-5 w-5 text-primary" />}
                    label="DropOff"
                    value={operaciones.dropOffPorc}
                    isEditing={isEditing}
                    align="center"
                    unit="%"
                    valueId="general.operaciones.dropOffPorc"
                    onInputChange={onInputChange}
                />
                <DatoSimple
                    icon={<Ticket className="h-5 w-5 text-primary" />}
                    label="E-Ticket"
                    value={operaciones.eTicketPorc}
                    isEditing={isEditing}
                    align="center"
                    unit="%"
                    valueId="general.operaciones.eTicketPorc"
                    onInputChange={onInputChange}
                />
            </div>
        </KpiCard>
    );
}
