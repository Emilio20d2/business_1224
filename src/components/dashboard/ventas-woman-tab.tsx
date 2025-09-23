"use client"
import React from 'react';
import type { WeeklyData, VentasManItem as VentasWomanItem } from "@/lib/data";
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatPercentage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from '../ui/button';
import { ImagePlus, Loader2, Upload } from 'lucide-react';
import { OperacionesSubTab } from './operaciones-sub-tab';
import { FocusSemanalTab } from './focus-semanal-tab';


type VentasWomanData = WeeklyData['ventasWoman'];
type TableDataKey = 'pesoComprador' | 'zonaComercial' | 'agrupacionComercial';
type TableData = VentasWomanItem[];
type ListKey = 'compradorWoman' | 'zonaComercialWoman' | 'agrupacionComercialWoman';

type VentasWomanTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any) => void;
  onImageChange: (path: string, file: File, onUploadComplete: (success: boolean) => void) => void;
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
    list,
    headers, 
    isEditing, 
    dataKey, 
    onInputChange,
}: { 
    title?: string,
    data: TableData | undefined,
    list: string[] | undefined,
    headers: string[], 
    isEditing: boolean, 
    dataKey: string, 
    onInputChange: VentasWomanTabProps['onInputChange'],
}) => {
    if (!data || !Array.isArray(data)) {
        return <p className="text-center text-muted-foreground mt-8">No hay datos disponibles.</p>;
    }
    const optionList = list || [];


    const handleChange = (index: number, field: keyof VentasWomanItem, value: any) => {
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
                                {isEditing ? (
                                    <Select
                                        value={item.nombre}
                                        onValueChange={(value) => handleChange(index, 'nombre', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {optionList.map(option => (
                                                <SelectItem key={option} value={option}>{option}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                ) : (
                                    item.nombre
                                )}
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

const ImageImportCard = ({ selectedRow, isEditing, onImageChange, imagePath, imageUrl }: { selectedRow: VentasWomanItem | null, isEditing: boolean, onImageChange: VentasWomanTabProps['onImageChange'], imagePath: string | null, imageUrl?: string | null }) => {
    const [isUploading, setIsUploading] = React.useState(false);
    const displayImage = imageUrl ?? selectedRow?.imageUrl;

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && imagePath) {
            setIsUploading(true);
            onImageChange(imagePath, file, (success) => {
                setIsUploading(false);
            });
        }
         // Reset file input value to allow re-uploading the same file
        event.target.value = '';
    };

    return (
        <Card className="relative overflow-hidden p-0 gap-0 w-full aspect-[16/9]">
            <CardContent className="p-0 h-full">
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    {isUploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                            <Loader2 className="h-12 w-12 text-white animate-spin" />
                        </div>
                    )}
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
                     <div className="absolute bottom-2 right-2 z-20">
                        <Button asChild variant="secondary" disabled={isUploading}>
                          <label htmlFor="file-upload-woman">
                            <Upload className="mr-2 h-4 w-4" />
                            Cambiar Imagen
                             <input
                                id="file-upload-woman"
                                type="file"
                                onChange={handleImageUpload}
                                className="sr-only"
                                accept="image/*"
                                disabled={isUploading}
                            />
                          </label>
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const CompradorTab = ({ data, isEditing, onInputChange, onImageChange }: { data: WeeklyData, isEditing: boolean, onInputChange: VentasWomanTabProps['onInputChange'], onImageChange: VentasWomanTabProps['onImageChange'] }) => {
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(0);
    const ventasWomanData = data?.ventasWoman;

    if (!ventasWomanData || !Array.isArray(ventasWomanData.pesoComprador)) {
        return <p className="text-center text-muted-foreground mt-8">No hay datos de comprador disponibles.</p>;
    }
    
    const handleRowSelect = (index: number) => {
        setSelectedIndex(index);
    };

    const selectedRow = selectedIndex !== null ? ventasWomanData.pesoComprador[selectedIndex] : null;
    const imagePath = selectedIndex !== null ? `ventasWoman.pesoComprador.${selectedIndex}.imageUrl` : null;
    const imageUrl = selectedIndex !== null ? data.ventasWoman.pesoComprador[selectedIndex]?.imageUrl : null;
    const optionList = data.listas?.compradorWoman || [];

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
                        {ventasWomanData.pesoComprador.map((item, index) => (
                            <TableRow 
                                key={item.nombre + index}
                                onClick={() => handleRowSelect(index)}
                                className={cn('cursor-pointer', selectedIndex === index && 'bg-muted/50')}
                            >
                                <TableCell>
                                    {isEditing ? (
                                        <Select
                                            value={item.nombre}
                                            onValueChange={(value) => onInputChange(`ventasWoman.pesoComprador.${index}.nombre`, value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {optionList.map(option => (
                                                    <SelectItem key={option} value={option}>{option}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        item.nombre
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-20 ml-auto text-right" defaultValue={item.pesoPorc} onChange={(e) => onInputChange(`ventasWoman.pesoComprador.${index}.pesoPorc`, e.target.value)} /> : formatPercentage(item.pesoPorc)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-24 ml-auto text-right" defaultValue={item.totalEuros} onChange={(e) => onInputChange(`ventasWoman.pesoComprador.${index}.totalEuros`, e.target.value)} /> : formatCurrency(item.totalEuros)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-20 ml-auto text-right" defaultValue={item.varPorc} onChange={(e) => onInputChange(`ventasWoman.pesoComprador.${index}.varPorc`, e.target.value)} /> : <TrendIndicator value={item.varPorc} />}
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
                imageUrl={imageUrl}
            />
        </div>
    )
}

export function VentasWomanTab({ data, isEditing, onInputChange, onImageChange }: VentasWomanTabProps) {
    const [activeTab, setActiveTab] = React.useState<string>('comprador');
    
    if (!data || !data.ventasWoman) return <p>Cargando datos de Ventas Woman...</p>;

    const ventasWomanData = data.ventasWoman;

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
                    data={data}
                    isEditing={isEditing}
                    onInputChange={onInputChange}
                    onImageChange={onImageChange}
                />
            </TabsContent>

            <TabsContent value="zonaYAgrupacion">
                <div className="grid gap-4 items-start grid-cols-1 md:grid-cols-2">
                    <DataTable
                        title="Zona Comprador"
                        dataKey="ventasWoman.zonaComercial"
                        headers={['ZONA COMPRADOR', 'PESO %', '€', '%']}
                        data={ventasWomanData?.zonaComercial}
                        list={data.listas?.zonaComercialWoman}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                    />
                    <DataTable
                        title="Agrupación Comercial"
                        dataKey="ventasWoman.agrupacionComercial"
                        headers={['Agrupación Comercial', 'PESO %', '€', '%']}
                        data={ventasWomanData?.agrupacionComercial}
                        list={data.listas?.agrupacionComercialWoman}
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
