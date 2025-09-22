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
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartStyle
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';


type AqneSemanalTabProps = {
  data: WeeklyData;
};

const DailySalesChart = ({ data }: { data: WeeklyData['ventasDiariasAQNE'] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="dia" />
        <YAxis tickFormatter={(value) => formatCurrency(Number(value) / 1000) + 'k'} />
        <Tooltip
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))', 
            borderColor: 'hsl(var(--border))' 
          }}
          formatter={(value: number) => formatCurrency(value)}
        />
        <Legend />
        <Bar dataKey="woman" stackId="a" fill="hsl(var(--chart-1))" name="Woman" />
        <Bar dataKey="man" stackId="a" fill="hsl(var(--chart-2))" name="Man" />
        <Bar dataKey="nino" stackId="a" fill="hsl(var(--chart-3))" name="Niño" />
      </BarChart>
    </ResponsiveContainer>
  );
};


export function AqneSemanalTab({ data }: AqneSemanalTabProps) {

  return (
    <div className="space-y-6">
      <DatosPorSeccionTab data={data.aqneSemanal} />

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Ventas Diarias AQNE</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Día</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                            <TableHead className="text-right">Woman</TableHead>
                            <TableHead className="text-right">Man</TableHead>
                            <TableHead className="text-right">Niño</TableHead>
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

        <Card className="lg:col-span-3">
             <CardHeader>
                <CardTitle>Gráfico de Ventas Diarias</CardTitle>
            </CardHeader>
            <CardContent>
                <DailySalesChart data={data.ventasDiariasAQNE} />
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
