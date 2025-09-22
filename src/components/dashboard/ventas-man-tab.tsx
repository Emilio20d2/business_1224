import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatPercentage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type VentasManData = WeeklyData["ventasMan"];
type TableData = VentasManData[keyof VentasManData];

const TrendIndicator = ({ value }: { value: number }) => {
  const trendColor = value >= 0 ? 'text-green-600' : 'text-red-600';
  return (
    <span className={cn("text-sm font-bold", trendColor)}>
      {value >= 0 ? '+' : ''}{value.toLocaleString('es-ES')}%
    </span>
  );
};

const DataTable = ({ data, headers }: { data: TableData, headers: string[] }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground mt-8">No hay datos disponibles para esta sección.</p>;
    }
    
    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map((header, i) => (
                            <TableHead key={i} className={i === 1 ? '' : 'text-right'}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="text-right font-medium">{formatPercentage(item.pesoPorc)}</TableCell>
                            <TableCell>{item.nombre}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.totalEuros)}</TableCell>
                            <TableCell className="text-right">
                                <TrendIndicator value={item.varPorc} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

export function VentasManTab({ data }: { data: VentasManData }) {
  return (
    <Tabs defaultValue="pesoComprador" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mx-auto max-w-md mb-4">
        <TabsTrigger value="pesoComprador">Peso Comprador</TabsTrigger>
        <TabsTrigger value="zonaComercial">Zona Comp.</TabsTrigger>
        <TabsTrigger value="agrupacionComercial">Agrup. Com.</TabsTrigger>
      </TabsList>
      <TabsContent value="pesoComprador">
        <DataTable data={data.pesoComprador} headers={['PESO %', 'COMPRADOR', '€', '%']} />
      </TabsContent>
      <TabsContent value="zonaComercial">
        <DataTable data={data.zonaComercial} headers={['PESO %', 'ZONA COMP.', '€', '%']} />
      </TabsContent>
      <TabsContent value="agrupacionComercial">
        <DataTable data={data.agrupacionComercial} headers={['PESO %', 'AGRUP. COM.', '€', '%']} />
      </TabsContent>
    </Tabs>
  );
}
