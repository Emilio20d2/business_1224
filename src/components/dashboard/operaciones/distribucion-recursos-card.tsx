
"use client";

import React from 'react';
import type { ProductividadData } from "@/lib/data";
import { KpiCard } from "../kpi-card";
import { Users, Scissors, Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type DistribucionRecursosCardProps = {
  dayData: ProductividadData;
};

const roundToQuarter = (value: number) => {
    return (Math.round(value * 4) / 4).toFixed(2);
}

export function DistribucionRecursosCard({ dayData }: DistribucionRecursosCardProps) {
  if (!dayData || !dayData.productividadPorSeccion) return null;

  const sections = [
    { key: 'woman', title: 'WOMAN' },
    { key: 'man', title: 'MAN' },
    { key: 'nino', title: 'NIÑO' },
  ] as const;

  const confeccionData = sections.map(sec => ({
    title: sec.title,
    unidades: dayData.productividadPorSeccion[sec.key]?.unidadesConfeccion || 0,
    horas: (dayData.productividadPorSeccion[sec.key]?.unidadesConfeccion || 0) / 120,
  }));

  const paqueteriaData = sections.map(sec => ({
    title: sec.title,
    unidades: dayData.productividadPorSeccion[sec.key]?.unidadesPaqueteria || 0,
    horas: (dayData.productividadPorSeccion[sec.key]?.unidadesPaqueteria || 0) / 80,
  }));
  
  const totalHorasConfeccion = confeccionData.reduce((sum, item) => sum + item.horas, 0);
  const totalHorasPaqueteria = paqueteriaData.reduce((sum, item) => sum + item.horas, 0);
  const totalHorasProductividad = totalHorasConfeccion + totalHorasPaqueteria;
  const personasNecesarias = Math.ceil(totalHorasProductividad / 3);

  return (
    <KpiCard title="Distribución de Recursos" icon={<Users className="h-5 w-5 text-primary" />}>
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Confección */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Scissors className="h-4 w-4" />
              CONFECCIÓN
            </h4>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Sección</TableHead>
                        <TableHead className="text-right">Unidades</TableHead>
                        <TableHead className="text-right">Horas</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {confeccionData.map(item => (
                        <TableRow key={item.title}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell className="text-right">{item.unidades}</TableCell>
                            <TableCell className="text-right">{roundToQuarter(item.horas)}h</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </div>
          {/* Paquetería */}
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Package className="h-4 w-4" />
              PAQUETERÍA
            </h4>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Sección</TableHead>
                        <TableHead className="text-right">Unidades</TableHead>
                        <TableHead className="text-right">Horas</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paqueteriaData.map(item => (
                        <TableRow key={item.title}>
                            <TableCell>{item.title}</TableCell>
                            <TableCell className="text-right">{item.unidades}</TableCell>
                            <TableCell className="text-right">{roundToQuarter(item.horas)}h</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center text-center p-2 rounded-lg bg-background">
            <div>
                <div className="text-sm text-muted-foreground">Horas Totales</div>
                <div className="text-2xl font-bold">{roundToQuarter(totalHorasProductividad)}h</div>
            </div>
             <div>
                <div className="text-sm text-muted-foreground">Personas Necesarias (7-10h)</div>
                <div className="text-2xl font-bold">{personasNecesarias}</div>
            </div>
        </div>
      </div>
    </KpiCard>
  );
}
