"use client"
import React from 'react';
import type { WeeklyData, VentasManItem } from "@/lib/data";
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
import { Button, buttonVariants } from '../ui/button';
import { ImagePlus, Loader2, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { OperacionesSubTab } from './operaciones-sub-tab';
import { FocusSemanalTab } from './focus-semanal-tab';


type VentasManTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any) => void;
  onImageChange: (path: string, file: File, onUploadComplete: (success: boolean, downloadURL?: string) => void) => void;
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
    data: VentasManItem[] | undefined, 
    list: string[] | undefined,
    headers: string[], 
    isEditing: boolean, 
    dataKey: string, 
    onInputChange: VentasManTabProps['onInputChange'],
}) => {
    if (!data || !Array.isArray(data)) {
        return <p className="text-center text-muted-foreground mt-8">No hay datos disponibles.</p>;
    }
    const optionList = list || [];

    const handleChange = (index: number, field: keyof VentasManItem, value: any) => {
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

const CompradorTab = ({ data, isEditing, onInputChange, onImageChange }: VentasManTabProps) => {
    const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
    const [isUploading, setIsUploading] = React.useState(false);
    
    if (!data.ventasMan || !data.listas) {
        return <p>Cargando datos de comprador...</p>;
    }
    
    const tableData = data.ventasMan.pesoComprador;
    const selectedRow = tableData && selectedIndex < tableData.length ? tableData[selectedIndex] : null;
    const imageUrl = selectedRow?.imageUrl || null;

    const handleLocalInputChange = (index: number, field: keyof VentasManItem, value: any) => {
        const path = `ventasMan.pesoComprador.${index}.${field}`;
        onInputChange(path, value);
    };
    
    const handleLocalImageChange = (file: File) => {
        if (selectedIndex === null) return;
        
        setIsUploading(true);
        const path = `ventasMan.pesoComprador.${selectedIndex}.imageUrl`;
        onImageChange(path, file, (success, downloadURL) => {
             setIsUploading(false);
             if (success && downloadURL) {
                // The dashboard's handleImageChange already updates the state
             }
        });
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleLocalImageChange(file);
        }
        event.target.value = ''; // Reset file input
    };

    const SemanaAnteriorIndicator = ({ current, previous }: { current: number, previous: number }) => {
        if (current > previous) {
            return <ArrowUp className="h-5 w-5 text-green-600" />;
        }
        if (current < previous) {
            return <ArrowDown className="h-5 w-5 text-red-600" />;
        }
        return <span className="h-5 w-5 flex items-center justify-center">-</span>;
    };

    return (
        <div className="grid gap-4 items-start grid-cols-1 lg:grid-cols-2">
            <Card className="h-full overflow-y-auto">
                <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                        <TableRow>
                            {['COMPRADOR', 'PESO %', '€', 'SEMANA ANTERIOR', '%'].map((header, i) => (
                                <TableHead key={i} className={cn('uppercase font-bold', i === 0 ? '' : 'text-right')}>{header}</TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tableData.map((item, index) => (
                            <TableRow
                                key={item.nombre + index}
                                onClick={() => setSelectedIndex(index)}
                                className={cn('cursor-pointer', selectedIndex === index && 'bg-muted/50')}
                            >
                                <TableCell className="font-medium">
                                    {isEditing ? (
                                        <Select
                                            value={item.nombre}
                                            onValueChange={(value) => handleLocalInputChange(index, 'nombre', value)}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                {data.listas.compradorMan.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        item.nombre
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-20 ml-auto text-right" defaultValue={item.pesoPorc} onChange={(e) => handleLocalInputChange(index, 'pesoPorc', e.target.value)} /> : formatPercentage(item.pesoPorc)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-24 ml-auto text-right" defaultValue={item.totalEuros} onChange={(e) => handleLocalInputChange(index, 'totalEuros', e.target.value)} /> : formatCurrency(item.totalEuros)}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isEditing ? (
                                        <Input type="number" inputMode="decimal" className="w-24 ml-auto text-right" defaultValue={item.totalEurosSemanaAnterior} onChange={(e) => handleLocalInputChange(index, 'totalEurosSemanaAnterior', e.target.value)} />
                                    ) : (
                                        <div className="flex justify-end">
                                          <SemanaAnteriorIndicator current={item.totalEuros} previous={item.totalEurosSemanaAnterior} />
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="text-right">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-20 ml-auto text-right" defaultValue={item.varPorc} onChange={(e) => handleLocalInputChange(index, 'varPorc', e.target.value)} /> : <TrendIndicator value={item.varPorc} />}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
            <div className="flex items-start">
                 <Card className="relative overflow-hidden p-0 gap-0 w-full aspect-[16/9]">
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                        {isUploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                                <Loader2 className="h-12 w-12 text-white animate-spin" />
                            </div>
                        )}
                        {imageUrl ? (
                            <img src={imageUrl} alt={selectedRow?.nombre || 'Análisis Visual'} className="h-full w-full object-cover" />
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
                                <label htmlFor="file-upload-comprador">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Cambiar Imagen
                                    <input id="file-upload-comprador" type="file" onChange={handleImageUpload} className="sr-only" accept="image/*" disabled={isUploading} />
                                </label>
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};


export function VentasManTab({ data, isEditing, onInputChange, onImageChange }: VentasManTabProps) {
    const [activeTab, setActiveTab] = React.useState<string>('comprador');
    
    if (!data || !data.ventasMan || !data.listas) return <p>Cargando datos de Ventas Man...</p>;

    const ventasManData = data.ventasMan;
    

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
             <TabsList className="mb-4 gap-2 bg-transparent p-0 h-auto">
                <TabsTrigger value="comprador" className={cn(buttonVariants({ variant: 'outline' }), "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-primary")}>COMPRADOR</TabsTrigger>
                <TabsTrigger value="zonaYAgrupacion" className={cn(buttonVariants({ variant: 'outline' }), "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-primary")}>ZONA Y AGRUPACIÓN</TabsTrigger>
                <TabsTrigger value="operaciones" className={cn(buttonVariants({ variant: 'outline' }), "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-primary")}>OPERACIONES</TabsTrigger>
                <TabsTrigger value="focus" className={cn(buttonVariants({ variant: 'outline' }), "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:text-primary")}>FOCUS</TabsTrigger>
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
                        dataKey="ventasMan.zonaComercial"
                        headers={['ZONA COMPRADOR', 'PESO %', '€', '%']}
                        data={ventasManData?.zonaComercial}
                        list={data.listas?.zonaComercialMan}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                    />
                    <DataTable
                        title="Agrupación Comercial"
                        dataKey="ventasMan.agrupacionComercial"
                        headers={['Agrupación Comercial', 'PESO %', '€', '%']}
                        data={ventasManData?.agrupacionComercial}
                        list={data.listas?.agrupacionComercialMan}
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
