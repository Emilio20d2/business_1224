import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Warehouse } from "lucide-react";
import type { WarehouseData, WarehouseSectionData } from "@/lib/data";
import { formatNumber, formatPercentage } from "@/lib/format";
import { cn } from "@/lib/utils";

type AlmacenesCardProps = {
  data: WarehouseData;
  className?: string;
};

export function AlmacenesCard({ data, className }: AlmacenesCardProps) {
  const sections = Object.entries(data);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase">Almacenes</CardTitle>
        <Warehouse className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-grow pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Sección</TableHead>
              <TableHead className="text-right">Ocup.</TableHead>
              <TableHead className="text-right">Devol.</TableHead>
              <TableHead className="text-right">Entradas</TableHead>
              <TableHead className="text-right">Salidas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sections.map(([name, sectionData]) => (
              <AlmacenRow key={name} name={name} data={sectionData as WarehouseSectionData} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

type AlmacenRowProps = {
    name: string;
    data: WarehouseSectionData;
}

function AlmacenRow({name, data}: AlmacenRowProps) {
    return (
        <TableRow>
            <TableCell className="font-medium uppercase">{name}</TableCell>
            <TableCell className="text-right font-bold">{formatPercentage(data.ocupacionPorc)}</TableCell>
            <TableCell className="text-right">{formatNumber(data.devolucionUnidades)}</TableCell>
            <TableCell className="text-right text-green-600">{formatNumber(data.entradas)}</TableCell>
            <TableCell className="text-right text-red-600">{formatNumber(data.salidas)}</TableCell>
        </TableRow>
    )
}
