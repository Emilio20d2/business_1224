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
import { ImagePlus, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";


type VentasManData = WeeklyData["ventasMan"];
type TableDataKey = keyof VentasManData;
type TableData = VentasManData[TableDataKey];
type TableItem = TableData[number];

type VisibilityConfig = {
    comprador: Record<string, boolean>;
    zonaComercial: Record<string, boolean>;
    agrupacionComercial: Record<string, boolean>;
}

type VentasManTabProps = {
  data: VentasManData;
  isEditing: boolean;
  visibilityConfig: VisibilityConfig;
};

const TrendIndicator = ({ value }: { value: number }) => {
  const trendColor = value >= 0 ? 'text-green-600' : 'text-red-600';
  return (
    <span className={cn("text-sm font-bold", trendColor)}>
      {value >= 0 ? '+' : ''}{value.toLocaleString('es-ES')}%
    </span>
  );
};

const DataTable = ({ data, headers, isEditing, allItems, onRowClick }: { data: TableData, headers: string[], isEditing: boolean, allItems: TableItem[], onRowClick: (item: TableItem) => void }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground mt-8">No hay datos disponibles para esta sección.</p>;
    }
    
    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted hover:bg-muted">
                        {headers.map((header, i) => (
                            <TableHead key={i} className={i === 0 ? '' : 'text-right'}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index} className="relative cursor-pointer hover:bg-muted/50">
                            {!isEditing && (
                                <div 
                                    className="absolute inset-0 z-10"
                                    onClick={() => onRowClick(item)}
                                    role="button"
                                    aria-label={`Ver detalles de ${item.nombre}`}
                                />
                            )}
                            <TableCell>
                                {isEditing ? (
                                    <Select defaultValue={item.nombre}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allItems.map(option => (
                                                <SelectItem key={option.nombre} value={option.nombre}>{option.nombre}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    item.nombre
                                )}
                            </TableCell>
                            <TableCell className="text-right font-medium">{formatPercentage(item.pesoPorc)}</TableCell>
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

const ImageImportCard = ({ selectedRow }: { selectedRow: TableItem | null }) => {
    const displayImage = selectedRow?.imageUrl;

    return (
        <Card className="relative overflow-hidden p-0 gap-0 w-full aspect-[5/4]">
            <CardContent className="p-0 h-full">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    {displayImage ? (
                        <img src={displayImage} alt={selectedRow?.nombre} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <ImagePlus className="h-12 w-12" />
                            <p className="text-sm font-medium">Análisis Visual</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};


const SubTabContent = ({ data, headers, isEditing, categoryKey, allItems }: { data: TableData, headers: string[], isEditing: boolean, categoryKey: keyof VisibilityConfig, allItems: TableItem[] }) => {
    const [selectedRow, setSelectedRow] = React.useState<TableItem | null>(null);

    const handleRowClick = (item: TableItem) => {
        if (!isEditing) {
            setSelectedRow(item);
        }
    };
    
    return (
        <div className={cn("grid gap-4 items-start", isEditing ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2")}>
             <DataTable data={data} headers={headers} isEditing={isEditing} allItems={allItems} onRowClick={handleRowClick} />
             {!isEditing && <ImageImportCard selectedRow={selectedRow}/>}
        </div>
    );
}


export function VentasManTab({ data, isEditing, visibilityConfig }: VentasManTabProps) {
    
  const filteredCompradorData = data.pesoComprador.filter(item => visibilityConfig.comprador[item.nombre]);
  const filteredZonaData = data.zonaComercial.filter(item => visibilityConfig.zonaComercial[item.nombre]);
  const filteredAgrupacionData = data.agrupacionComercial.filter(item => visibilityConfig.agrupacionComercial[item.nombre]);

  return (
    <Tabs defaultValue="comprador" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mx-auto max-w-md mb-4">
        <TabsTrigger value="comprador">Comprador</TabsTrigger>
        <TabsTrigger value="zonaComercial">Zona Comprador</TabsTrigger>
        <TabsTrigger value="agrupacionComercial">Agrup. Com.</TabsTrigger>
      </TabsList>
      <TabsContent value="comprador">
         <SubTabContent data={filteredCompradorData} headers={['COMPRADOR', 'PESO %', '€', '%']} isEditing={isEditing} categoryKey="comprador" allItems={data.pesoComprador} />
      </TabsContent>
      <TabsContent value="zonaComercial">
        <SubTabContent data={filteredZonaData} headers={['ZONA COMPRADOR', 'PESO %', '€', '%']} isEditing={isEditing} categoryKey="zonaComercial" allItems={data.zonaComercial} />
      </TabsContent>
      <TabsContent value="agrupacionComercial">
         <SubTabContent data={filteredAgrupacionData} headers={['AGRUP. COM.', 'PESO %', '€', '%']} isEditing={isEditing} categoryKey="agrupacionComercial" allItems={data.agrupacionComercial} />
      </TabsContent>
    </Tabs>
  );
}
