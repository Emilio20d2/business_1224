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
import { Card } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from '../ui/button';
import { ImagePlus, Loader2, Upload, Users, MapPin, ShoppingBasket, Percent, Euro, TrendingUp, ArrowUp, ArrowDown } from 'lucide-react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { OperacionesSubTab } from './operaciones-sub-tab';
import { FocusSemanalTab } from './focus-semanal-tab';


type VentasManTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any) => void;
  onImageChange: (compradorName: string, file: File, onUploadComplete: (success: boolean, previewUrl: string) => void) => void;
};


const TrendIndicator = ({ value }: { value: number }) => {
  if (isNaN(value)) return null;
  const isPositive = value >= 0;
  const trendColor = isPositive ? 'text-green-600' : 'text-red-600';
  const Icon = isPositive ? ArrowUp : ArrowDown;
  
  return (
    <span className={cn("text-sm font-bold flex items-center justify-end gap-1", trendColor)}>
      <Icon className="h-4 w-4" />
    </span>
  );
};

const DataTable = ({ 
    title,
    icon,
    data, 
    list,
    isEditing, 
    dataKey, 
    onInputChange,
    onRowClick,
    selectedIndex
}: { 
    title: string,
    icon: React.ReactNode,
    data: VentasManItem[] | undefined, 
    list: string[] | undefined,
    isEditing: boolean, 
    dataKey: string, 
    onInputChange: VentasManTabProps['onInputChange'],
    onRowClick?: (index: number) => void,
    selectedIndex?: number
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
        <Card className="h-full overflow-y-auto">
            <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                        <TableHead className="uppercase font-bold">
                            <div className="flex items-center gap-2 text-primary">
                                {icon}
                                <span>{title}</span>
                            </div>
                        </TableHead>
                        <TableHead className='text-right'><Percent className="h-4 w-4 text-primary inline-block" /></TableHead>
                        <TableHead className='text-right'><Euro className="h-4 w-4 text-primary inline-block" /></TableHead>
                        <TableHead className='text-right'><TrendingUp className="h-4 w-4 text-primary inline-block" /></TableHead>
                        <TableHead className='text-right'><Percent className="h-4 w-4 text-primary inline-block" /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow 
                            key={item.nombre + index}
                            onClick={() => onRowClick?.(index)}
                            className={cn(onRowClick && 'cursor-pointer', selectedIndex === index && 'bg-muted/50')}
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
                            <TableCell className="text-right font-medium">
                                 <TrendIndicator value={item.varPorc} />
                            </TableCell>
                            <TableCell className="text-right">
                                {isEditing ? <Input type="number" inputMode="decimal" className="w-20 ml-auto text-right" defaultValue={item.varPorc} onChange={(e) => handleChange(index, 'varPorc', e.target.value)} /> : formatPercentage(item.varPorc)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Card>
    );
};

const ImageImportCard = ({ selectedRow, isEditing, onImageChange, initialImageUrl }: { selectedRow: VentasManItem | null, isEditing: boolean, onImageChange: (file: File, onUploadComplete: (success: boolean, previewUrl: string) => void) => void, initialImageUrl: string | null }) => {
    const [isUploading, setIsUploading] = React.useState(false);
    const [preview, setPreview] = React.useState<string | null>(null);

    React.useEffect(() => {
        setPreview(initialImageUrl);
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [initialImageUrl]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && selectedRow) {
            setIsUploading(true);
            onImageChange(file, (success, previewUrl) => {
                if (success) {
                    setPreview(previewUrl);
                }
                setIsUploading(false);
            });
        }
        event.target.value = '';
    };

    const imageUrl = preview;

    return (
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
    );
};


export function VentasManTab({ data, isEditing, onInputChange, onImageChange }: VentasManTabProps) {
    const [activeTab, setActiveTab] = React.useState<string>('comprador');
    const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
    
    if (!data || !data.ventasMan || !data.listas) return <p>Cargando datos de Ventas Man...</p>;

    const { ventasMan, listas, imagenesComprador } = data;
    const selectedRow = ventasMan.pesoComprador?.[selectedIndex];
    const imageUrl = selectedRow ? (imagenesComprador?.[selectedRow.nombre] || selectedRow.imageUrl) : null;

    const handleImageChangeWrapper = (file: File, onUploadComplete: (success: boolean, previewUrl: string) => void) => {
        if (!selectedRow) {
            onUploadComplete(false, '');
            return;
        }
        onImageChange(selectedRow.nombre, file, onUploadComplete);
    };
    
    const tabButtons = [
        { value: 'comprador', label: 'COMPRADOR' },
        { value: 'zonaYAgrupacion', label: 'ZONA Y AGRUPACIÓN' },
        { value: 'operaciones', label: 'OPERACIONES' },
        { value: 'focus', label: 'FOCUS' },
    ];

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-4 grid w-full grid-cols-2 md:grid-cols-4 gap-2">
                {tabButtons.map(tab => (
                    <Button
                        key={tab.value}
                        variant={activeTab === tab.value ? 'default' : 'outline'}
                        onClick={() => setActiveTab(tab.value)}
                        className="w-full"
                    >
                        {tab.label}
                    </Button>
                ))}
            </div>
            
            <TabsContent value="comprador" className="mt-0">
               <div className="grid gap-4 items-start grid-cols-1 lg:grid-cols-2">
                   <DataTable
                        title="Comprador"
                        icon={<Users className="h-5 w-5" />}
                        dataKey="ventasMan.pesoComprador"
                        data={ventasMan.pesoComprador}
                        list={listas.compradorMan}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        onRowClick={setSelectedIndex}
                        selectedIndex={selectedIndex}
                    />
                    <ImageImportCard 
                        selectedRow={selectedRow}
                        isEditing={isEditing}
                        onImageChange={handleImageChangeWrapper}
                        initialImageUrl={imageUrl}
                    />
               </div>
            </TabsContent>

            <TabsContent value="zonaYAgrupacion" className="mt-0">
                <div className="grid gap-4 items-start grid-cols-1 md:grid-cols-2">
                    <DataTable
                        title="Zona Comprador"
                        icon={<MapPin className="h-5 w-5" />}
                        dataKey="ventasMan.zonaComercial"
                        data={ventasMan.zonaComercial}
                        list={listas.zonaComercialMan}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                    />
                    <DataTable
                        title="Agrupación Comercial"
                        icon={<ShoppingBasket className="h-5 w-5" />}
                        dataKey="ventasMan.agrupacionComercial"
                        data={ventasMan.agrupacionComercial}
                        list={listas.agrupacionComercialMan}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                    />
                </div>
            </TabsContent>

            <TabsContent value="operaciones" className="mt-0">
                <OperacionesSubTab data={data} isEditing={isEditing} onInputChange={onInputChange} />
            </TabsContent>
            
            <TabsContent value="focus" className="mt-0">
              <FocusSemanalTab 
                text={data.focusSemanal} 
                isEditing={isEditing} 
                onInputChange={onInputChange} 
              />
            </TabsContent>
        </Tabs>
    );
}
