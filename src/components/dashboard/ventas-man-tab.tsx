"use client"
import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercentage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from '../ui/button';
import { ImagePlus, Upload, ChevronDown } from 'lucide-react';
import { OperacionesSubTab } from './operaciones-sub-tab';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


type VentasManData = WeeklyData['ventasMan'];
type TableDataKey = keyof VentasManData;
type TableData = VentasManData[TableDataKey];
type TableItem = TableData[number];

type VentasManTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any) => void;
  onImageChange: (path: string, dataUrl: string) => void;
};


const TrendIndicator = ({ value }: { value: number }) => {
  const trendColor = value >= 0 ? 'text-green-600' : 'text-red-600';
  const sign = value >= 0 ? '+' : '';
  return (
    <span className={cn("text-sm font-bold", trendColor)}>
      {sign}{value.toLocaleString('es-ES')}%
    </span>
  );
};

const DataTable = ({ 
    data, 
    headers, 
    isEditing, 
    dataKey, 
    onInputChange,
    onRowSelect,
    selectedIndex,
}: { 
    data: TableData, 
    headers: string[], 
    isEditing: boolean, 
    dataKey: TableDataKey, 
    onInputChange: VentasManTabProps['onInputChange'],
    onRowSelect: (index: number) => void,
    selectedIndex: number | null,
}) => {
    if (!data) {
        return <p className="text-center text-muted-foreground mt-8">No hay datos disponibles.</p>;
    }

    const handleChange = (index: number, field: keyof TableItem, value: any) => {
        const path = `ventasMan.${dataKey}.${index}.${field}`;
        onInputChange(path, value);
    };

    return (
        <Card>
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        {headers.map((header, i) => (
                            <TableHead key={i} className={i === 0 ? '' : 'text-right'}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow 
                            key={item.nombre + index}
                            onClick={() => onRowSelect(index)}
                            className={cn(selectedIndex === index && 'bg-muted/50')}
                        >
                            <TableCell>
                                {item.nombre}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {isEditing ? <Input type="number" inputMode="decimal" className="w-20 ml-auto text-right" defaultValue={item.pesoPorc} onChange={(e) => handleChange(index, 'pesoPorc', e.target.value)} /> : formatPercentage(item.pesoPorc)}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                                {isEditing ? <Input type="number" inputMode="decimal" className="w-24 ml-auto text-right" defaultValue={item.totalEuros} onChange={(e) => handleChange(index, 'totalEuros', e.target.value)} /> : formatCurrency(item.totalEuros)}
                            </TableCell>
                            <TableCell className="text-right">
                                {isEditing ? <Input type="number" inputMode="decimal" className="w-20 ml-auto text-right" defaultValue={item.varPorc} onChange={(e) => handleChange(index, 'varPorc', e.target.value)} /> : <TrendIndicator value={item.varPorc} />}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

const ImageImportCard = ({ selectedRow, isEditing, onImageChange, imagePath }: { selectedRow: TableItem | null, isEditing: boolean, onImageChange: (path: string, dataUrl: string) => void, imagePath: string | null }) => {
    const displayImage = selectedRow?.imageUrl;
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && imagePath) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onImageChange(imagePath, e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card className="relative overflow-hidden p-0 gap-0 w-full aspect-[16/9]">
            <CardContent className="p-0 h-full">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    {displayImage ? (
                        <img src={displayImage} alt={selectedRow?.nombre || 'Análisis Visual'} className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <ImagePlus className="h-12 w-12" />
                            <p className="text-sm font-medium">Análisis Visual</p>
                            <p className="text-xs text-center">Selecciona una fila para ver o cambiar la imagen.</p>
                        </div>
                    )}
                </div>
                {isEditing && selectedRow && (
                     <div className="absolute bottom-2 right-2">
                        <Input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                        />
                        <Button onClick={handleButtonClick} variant="secondary">
                            <Upload className="mr-2 h-4 w-4" />
                            Cambiar Imagen
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};


const analisisVentasLabels: Record<TableDataKey, string> = {
    pesoComprador: "COMPRADOR",
    zonaComercial: "ZONA COMPRADOR",
    agrupacionComercial: "AGRUPACIÓN COMERCIAL",
};


export function VentasManTab({ data, isEditing, onInputChange, onImageChange }: VentasManTabProps) {
    const [activeMainTab, setActiveMainTab] = React.useState("analisisVentas");
    const [activeAnalysisTab, setActiveAnalysisTab] = React.useState<TableDataKey>('pesoComprador');
    const [selectedIndexes, setSelectedIndexes] = React.useState<{ [key in TableDataKey]?: number | null }>({
        pesoComprador: 0,
        zonaComercial: 0,
        agrupacionComercial: 0,
    });
    
    if (!data) return <p>Cargando datos de Ventas Man...</p>;

    const handleRowSelect = (tab: TableDataKey, index: number) => {
        setSelectedIndexes(prev => ({ ...prev, [tab]: index }));
    };

    const getSelectedRow = (tab: TableDataKey) => {
        const index = selectedIndexes[tab];
        if (data.ventasMan[tab] && index != null) {
            return data.ventasMan[tab][index];
        }
        return null;
    }

    const getImagePath = (tab: TableDataKey) => {
        const index = selectedIndexes[tab];
        if (index != null) {
            return `ventasMan.${tab}.${index}.imageUrl`;
        }
        return null;
    }

    const ventasManData = data.ventasMan;

    return (
        <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
             <div className="mb-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full md:w-auto">
                            {activeMainTab === 'analisisVentas' ? 'ANÁLISIS DE VENTAS' : 'OPERACIONES'}
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                        <DropdownMenuRadioGroup value={activeMainTab} onValueChange={setActiveMainTab}>
                            <DropdownMenuRadioItem value="analisisVentas">ANÁLISIS DE VENTAS</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="operaciones">OPERACIONES</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <TabsContent value="analisisVentas">
                <Tabs value={activeAnalysisTab} onValueChange={(value) => setActiveAnalysisTab(value as TableDataKey)} className="w-full">
                    <div className="mb-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="w-full md:w-auto">
                                    {analisisVentasLabels[activeAnalysisTab]}
                                    <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                <DropdownMenuRadioGroup value={activeAnalysisTab} onValueChange={(value) => setActiveAnalysisTab(value as TableDataKey)}>
                                    <DropdownMenuRadioItem value="pesoComprador">COMPRADOR</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="zonaComercial">ZONA COMPRADOR</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="agrupacionComercial">AGRUPACIÓN COMERCIAL</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <TabsContent value="pesoComprador">
                        <div className="grid gap-4 items-start grid-cols-1 md:grid-cols-2">
                            <DataTable
                                dataKey="pesoComprador"
                                headers={['COMPRADOR', 'PESO %', '€', '%']}
                                data={ventasManData.pesoComprador}
                                isEditing={isEditing}
                                onInputChange={onInputChange}
                                onRowSelect={(index) => handleRowSelect('pesoComprador', index)}
                                selectedIndex={selectedIndexes.pesoComprador ?? null}
                            />
                            <ImageImportCard
                                selectedRow={getSelectedRow('pesoComprador')}
                                isEditing={isEditing}
                                onImageChange={onImageChange}
                                imagePath={getImagePath('pesoComprador')}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="zonaComercial">
                        <div className="grid gap-4 items-start grid-cols-1">
                            <DataTable
                                dataKey="zonaComercial"
                                headers={['ZONA COMPRADOR', 'PESO %', '€', '%']}
                                data={ventasManData.zonaComercial}
                                isEditing={isEditing}
                                onInputChange={onInputChange}
                                onRowSelect={(index) => handleRowSelect('zonaComercial', index)}
                                selectedIndex={selectedIndexes.zonaComercial ?? null}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="agrupacionComercial">
                        <div className="grid gap-4 items-start grid-cols-1">
                            <DataTable
                                dataKey="agrupacionComercial"
                                headers={['Agrupación Comercial', 'PESO %', '€', '%']}
                                data={ventasManData.agrupacionComercial}
                                isEditing={isEditing}
                                onInputChange={onInputChange}
                                onRowSelect={(index) => handleRowSelect('agrupacionComercial', index)}
                                selectedIndex={selectedIndexes.agrupacionComercial ?? null}
                            />
                        </div>
                    </TabsContent>
                </Tabs>
            </TabsContent>

            <TabsContent value="operaciones">
                <OperacionesSubTab data={data} isEditing={isEditing} onInputChange={onInputChange} />
            </TabsContent>
        </Tabs>
    );
}
