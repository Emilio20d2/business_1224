import React from 'react';
import type { WeeklyData, Almacen } from "@/lib/data";
import { formatNumber, formatPercentage } from "@/lib/format";
import { KpiCard } from "./kpi-card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Warehouse } from 'lucide-react';

type AlmacenTabProps = {
  data: WeeklyData["almacenes"];
  isEditing: boolean;
};

const AlmacenRow = ({ name, almacen, isEditing }: { name: string, almacen: Almacen, isEditing: boolean }) => {
  return (
    <TableRow>
      <TableCell className="font-medium">{name}</TableCell>
      <TableCell className="text-right">
        {isEditing ? <Input type="number" inputMode="decimal" defaultValue={almacen.ocupacionPorc} className="w-20 ml-auto" /> : formatPercentage(almacen.ocupacionPorc)}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? <Input type="number" inputMode="decimal" defaultValue={almacen.devolucionUnidades ?? ''} className="w-20 ml-auto" /> : formatNumber(almacen.devolucionUnidades)}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? <Input type="number" inputMode="decimal" defaultValue={almacen.entradas} className="w-20 ml-auto" /> : formatNumber(almacen.entradas)}
      </TableCell>
      <TableCell className="text-right">
        {isEditing ? <Input type="number" inputMode="decimal" defaultValue={almacen.salidas} className="w-20 ml-auto" /> : formatNumber(almacen.salidas)}
      </TableCell>
    </TableRow>
  );
};


export function AlmacenTab({ data, isEditing }: AlmacenTabProps) {
  return (
    <div className="mt-4">
       <KpiCard title="Detalle de Almacenes" icon={<Warehouse className="h-5 w-5 text-primary" />} className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead>Sección</TableHead>
                      <TableHead className="text-right">Ocup.</TableHead>
                      <TableHead className="text-right">Devol.</TableHead>
                      <TableHead className="text-right">Entradas</TableHead>
                      <TableHead className="text-right">Salidas</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <AlmacenRow name="Ropa" almacen={data.ropa} isEditing={isEditing} />
                    <AlmacenRow name="Calzado" almacen={data.calzado} isEditing={isEditing} />
                    <AlmacenRow name="Perfumería" almacen={data.perfumeria} isEditing={isEditing} />
                </TableBody>
            </Table>
       </KpiCard>
    </div>
  );
}
