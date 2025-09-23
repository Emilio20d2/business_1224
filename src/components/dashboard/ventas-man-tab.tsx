import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatPercentage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ImagePlus, Upload } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';


type VentasManData = WeeklyData["ventasMan"];
type TableDataKey = 'pesoComprador' | 'zonaComercial' | 'agrupacionComercial';
type TableData = VentasManData[TableDataKey];
type TableItem = TableData[number];

type ListOptions = {
    comprador: string[];
    zonaComercial: string[];
    agrupacionComercial: string[];
}

type VentasManTabProps = {
  data: VentasManData;
  isEditing: boolean;
  listOptions: ListOptions;
  onInputChange: (path: string, value: string | number) => void;
};

const TrendIndicator = ({ value }: { value: number }) => {
  const trendColor = value >= 0 ? 'text-green-600' : 'text-red-600';
  return (
    <span className={cn("text-sm font-bold", trendColor)}>
      {value >= 0 ? '+' : ''}{value.toLocaleString('es-ES')}%
    </span>
  );
};

const DataTable = ({ data, headers, isEditing, allItems, onRowClick, dataKey, onInputChange, selectedIndex }: { data: TableData, headers: string[], isEditing: boolean, allItems: string[], onRowClick: (index: number) => void, dataKey: TableDataKey, onInputChange: VentasManTabProps['onInputChange'], selectedIndex: number | null }) => {
    if (!data || data.length === 0) {
        return <p className="text-center text-muted-foreground mt-8">No hay datos disponibles para esta sección.</p>;
    }

    const handleChange = (index: number, field: keyof TableItem, value: any) => {
        const path = `ventasMan.${dataKey}.${index}.${field}`;
        onInputChange(path, value);
    };
    
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
                        <TableRow 
                            key={index} 
                            onClick={() => onRowClick(index)}
                            className={cn("cursor-pointer", selectedIndex === index && 'bg-muted/50')}
                        >
                            <TableCell>
                                {isEditing ? (
                                    <Select defaultValue={item.nombre} onValueChange={(value) => handleChange(index, 'nombre', value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {allItems.map(option => (
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

const ImageImportCard = ({ selectedRow, isEditing, onImageChange }: { selectedRow: TableItem | null, isEditing: boolean, onImageChange: (dataUrl: string) => void }) => {
    const displayImage = selectedRow?.imageUrl;
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                onImageChange(e.target?.result as string);
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


const SubTabContent = ({ data, headers, isEditing, allItems, dataKey, onInputChange, showImage }: { data: TableData, headers: string[], isEditing: boolean, allItems: string[], dataKey: TableDataKey, onInputChange: VentasManTabProps['onInputChange'], showImage: boolean }) => {
    const [selectedIndex, setSelectedIndex] = React.useState<number | null>(data.length > 0 ? 0 : null);

    React.useEffect(() => {
        if (data.length > 0 && selectedIndex === null) {
            setSelectedIndex(0);
        } else if (data.length === 0) {
            setSelectedIndex(null);
        } else if (selectedIndex !== null && selectedIndex >= data.length) {
            setSelectedIndex(data.length -1);
        }
    }, [data, selectedIndex]);


    const handleRowClick = (index: number) => {
        setSelectedIndex(index);
    };

    const handleImageChange = (dataUrl: string) => {
        if (selectedIndex !== null) {
            const path = `ventasMan.${dataKey}.${selectedIndex}.imageUrl`;
            onInputChange(path, dataUrl);
        }
    };
    
    const selectedRow = selectedIndex !== null && data[selectedIndex] ? data[selectedIndex] : null;
    
    return (
        <div className={cn("grid gap-4 items-start", showImage ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1")}>
             <DataTable data={data} headers={headers} isEditing={isEditing} allItems={allItems} onRowClick={handleRowClick} dataKey={dataKey} onInputChange={onInputChange} selectedIndex={selectedIndex} />
             {showImage && <ImageImportCard selectedRow={selectedRow} isEditing={isEditing} onImageChange={handleImageChange} />}
        </div>
    );
}


export function VentasManTab({ data, isEditing, listOptions, onInputChange }: VentasManTabProps) {
    
  return (
    <Tabs defaultValue="comprador" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mx-auto max-w-md mb-4">
        <TabsTrigger value="comprador">Comprador</TabsTrigger>
        <TabsTrigger value="zonaComercial">Zona Comprador</TabsTrigger>
        <TabsTrigger value="agrupacionComercial">Agrupación Comercial</TabsTrigger>
      </TabsList>
      <TabsContent value="comprador">
        <SubTabContent data={data.pesoComprador} headers={['COMPRADOR', 'PESO %', '€', '%']} isEditing={isEditing} allItems={listOptions.comprador} dataKey="pesoComprador" onInputChange={onInputChange} showImage={true} />
      </TabsContent>
      <TabsContent value="zonaComercial">
        <SubTabContent data={data.zonaComercial} headers={['ZONA COMPRADOR', 'PESO %', '€', '%']} isEditing={isEditing} allItems={listOptions.zonaComercial} dataKey="zonaComercial" onInputChange={onInputChange} showImage={false} />
      </TabsContent>
      <TabsContent value="agrupacionComercial">
         <SubTabContent data={data.agrupacionComercial} headers={['Agrupación Comercial', 'PESO %', '€', '%']} isEditing={isEditing} allItems={listOptions.agrupacionComercial} dataKey="agrupacionComercial" onInputChange={onInputChange} showImage={false} />
      </TabsContent>
    </Tabs>
  );
}
