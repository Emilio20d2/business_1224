"use client"
import React from 'react';
import type { WeeklyData, VentasManItem as VentasKidsItem } from "@/lib/data";
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercentage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from '../ui/button';
import { ImagePlus, Upload } from 'lucide-react';
import { OperacionesSubTab } from './operaciones-sub-tab';
import { FocusSemanalTab } from './focus-semanal-tab';


type VentasKidsData = WeeklyData['ventasKids'];
type TableDataKey = keyof VentasKidsData;
type TableData = VentasKidsData[TableDataKey];

type VentasKidsTabProps = {
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
    title,
    data, 
    headers, 
    isEditing, 
    dataKey, 
    onInputChange,
}: { 
    title?: string,
    data: TableData, 
    headers: string[], 
    isEditing: boolean, 
    dataKey: string, 
    onInputChange: VentasKidsTabProps['onInputChange'],
}) => {
    if (!data) {
        return <p className="text-center text-muted-foreground mt-8">No hay datos disponibles.</p>;
    }

    const handleChange = (index: number, field: keyof VentasKidsItem, value: any) => {
        const path = `${dataKey}.${index}.${field}`;
        onInputChange(path, value);
    };

    return (
        <Card>
            {title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                </CardHeader>
            )}
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                        {headers.map((header, i) => (
                            <TableHead key={i} className={cn('uppercase font-bold', i === 0 ? '' : 'text-right')}>{header}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow 
                            key={item.nombre + index}
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

const ImageImportCard = ({ selectedRow, isEditing, onImageChange, imagePath }: { selectedRow: VentasKidsItem | null, isEditing: boolean, onImageChange: (path: string, dataUrl: string) => void, imagePath: string | null }) => {
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

const CompradorTab = ({ ventasKidsData, isEditing, onInputChange, onImageChange }: { ventasKidsData: VentasKidsData, isEditing: boolean, onInputChange: VentasKidsTabProps['onInputChange'], onImageChange: VentasKidsTabProps['onImageChange'] }) => {
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(0);

    const handleRowSelect = (index: number) => {
        setSelectedIndex(index);
    };

    const selectedRow = selectedIndex !== null ? ventasKidsData.pesoComprador[selectedIndex] : null;
    const imagePath = selectedIndex !== null ? `ventasKids.pesoComprador.${selectedIndex}.imageUrl` : null;

    return (
         <div className="grid gap-4 items-start grid-cols-1 md:grid-cols-2">
            <Card>
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                            {['COMPRADOR', 'PESO %', '€', '%'].map((header, i) => (
                                <TableHead key={i} className={cn('uppercase font-bold', i === 0 ? '' : 'text-right')}>{header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {ventasKidsData.pesoComprador.map((item, index) => (
                            <TableRow 
                                key={item.nombre + index}
                                onClick={() => handleRowSelect(index)}
                                className={cn(selectedIndex === index && 'bg-muted/50')}
                            >
                                <TableCell>
                                    {item.nombre}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-20 ml-auto text-right" defaultValue={item.pesoPorc} onChange={(e) => onInputChange(`ventasKids.pesoComprador.${index}.pesoPorc`, e.target.value)} /> : formatPercentage(item.pesoPorc)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-24 ml-auto text-right" defaultValue={item.totalEuros} onChange={(e) => onInputChange(`ventasKids.pesoComprador.${index}.totalEuros`, e.target.value)} /> : formatCurrency(item.totalEuros)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-20 ml-auto text-right" defaultValue={item.varPorc} onChange={(e) => onInputChange(`ventasKids.pesoComprador.${index}.varPorc`, e.target.value)} /> : <TrendIndicator value={item.varPorc} />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
            <ImageImportCard
                selectedRow={selectedRow}
                isEditing={isEditing}
                onImageChange={onImageChange}
                imagePath={imagePath}
            />
        </div>
    )
}

export function VentasKidsTab({ data, isEditing, onInputChange, onImageChange }: VentasKidsTabProps) {
    const [activeTab, setActiveTab] = React.useState<string>('comprador');
    
    if (!data) return <p>Cargando datos de Ventas KIDS...</p>;

    const ventasKidsData = data.ventasKids;

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
                <TabsTrigger value="comprador">COMPRADOR</TabsTrigger>
                <TabsTrigger value="zonaYAgrupacion">ZONA Y AGRUPACIÓN</TabsTrigger>
                <TabsTrigger value="operaciones">OPERACIONES</TabsTrigger>
                <TabsTrigger value="focus">FOCUS</TabsTrigger>
            </TabsList>

            <TabsContent value="comprador">
                <CompradorTab 
                    ventasKidsData={ventasKidsData}
                    isEditing={isEditing}
                    onInputChange={onInputChange}
                    onImageChange={onImageChange}
                />
            </TabsContent>

            <TabsContent value="zonaYAgrupacion">
                <div className="grid gap-4 items-start grid-cols-1 md:grid-cols-2">
                    <DataTable
                        title="Zona Comprador"
                        dataKey="ventasKids.zonaComercial"
                        headers={['ZONA COMPRADOR', 'PESO %', '€', '%']}
                        data={ventasKidsData.zonaComercial}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                    />
                    <DataTable
                        title="Agrupación Comercial"
                        dataKey="ventasKids.agrupacionComercial"
                        headers={['Agrupación Comercial', 'PESO %', '€', '%']}
                        data={ventasKidsData.agrupacionComercial.slice(0, 10)}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                    />
                </div>
            </TabsContent>

            <TabsContent value="operaciones">
                <OperacionesSubTab data={data} isEditing={isEditing} onInputChange={onInputChange} />
            </TabsContent>
            
            <TabsContent value="focus">
              <FocusSemanalTab 
                text={data.focusSemanal} 
                isEditing={isEditing} 
                onInputChange={onInputChange} 
              />
            </TabsContent>
        </Tabs>
    );
}
