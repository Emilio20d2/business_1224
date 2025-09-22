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
import { Input } from '@/components/ui/input';

type AqneSemanalTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
};


export function AqneSemanalTab({ data, isEditing, onInputChange }: AqneSemanalTabProps) {
  const handleDailySaleChange = (index: number, field: string, value: string) => {
    onInputChange(`ventasDiariasAQNE.${index}.${field}`, value);
  };

  return (
    <div className="space-y-6">
      <DatosPorSeccionTab data={data.aqneSemanal} isEditing={isEditing} onInputChange={onInputChange} />

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
                        {data.ventasDiariasAQNE.map((venta, index) => (
                            <TableRow key={venta.dia}>
                                <TableCell className="font-medium">{venta.dia}</TableCell>
                                {isEditing ? (
                                    <>
                                        <TableCell><Input type="number" defaultValue={venta.total} onChange={(e) => handleDailySaleChange(index, 'total', e.target.value)} className="w-24 ml-auto text-right" /></TableCell>
                                        <TableCell><Input type="number" defaultValue={venta.woman} onChange={(e) => handleDailySaleChange(index, 'woman', e.target.value)} className="w-24 ml-auto text-right" /></TableCell>
                                        <TableCell><Input type="number" defaultValue={venta.man} onChange={(e) => handleDailySaleChange(index, 'man', e.target.value)} className="w-24 ml-auto text-right" /></TableCell>
                                        <TableCell><Input type="number" defaultValue={venta.nino} onChange={(e) => handleDailySaleChange(index, 'nino', e.target.value)} className="w-24 ml-auto text-right" /></TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell className="text-right font-bold">{formatCurrency(venta.total)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(venta.woman)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(venta.man)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(venta.nino)}</TableCell>
                                    </>
                                )}
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
