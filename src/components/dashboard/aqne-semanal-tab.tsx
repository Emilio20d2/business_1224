import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatNumber } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatosPorSeccionTab } from "./datos-por-seccion-tab";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


type AqneSemanalTabProps = {
  data: WeeklyData;
};


export function AqneSemanalTab({ data }: AqneSemanalTabProps) {

  return (
    <div className="space-y-6">
      <DatosPorSeccionTab data={data.aqneSemanal} />

      <Separator />

      <div className="grid grid-cols-1 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Ventas Diarias AQNE</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Día</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right text-pink-500">Woman</TableHead>
                            <TableHead className="text-right text-blue-500">Man</TableHead>
                            <TableHead className="text-right text-primary">Niño</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.ventasDiariasAQNE.map((venta) => (
                            <TableRow key={venta.dia}>
                                <TableCell className="font-medium">{venta.dia}</TableCell>
                                <TableCell className="text-right font-bold">{formatCurrency(venta.total)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(venta.woman)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(venta.man)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(venta.nino)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
