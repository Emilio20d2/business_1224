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
import { Upload, ImagePlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type VentasManData = WeeklyData["ventasMan"];
type TableData = VentasManData[keyof VentasManData];

type VentasManTabProps = {
  data: VentasManData;
  isEditing: boolean;
};

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

const ImageImportCard = ({ isEditing }: { isEditing: boolean }) => {
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);
    const [imageFile, setImageFile] = React.useState<File | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSelectImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImportClick = () => {
        // Logic to upload/process the imageFile
        console.log("Importing image:", imageFile?.name);
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Upload className="h-5 w-5" />
                    Análisis Visual
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center gap-4 text-center">
                 <div className="w-full h-48 bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Previsualización" className="h-full w-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <ImagePlus className="h-10 w-10" />
                            <p className="text-sm">Previsualización de imagen</p>
                        </div>
                    )}
                </div>
                <div className="w-full flex flex-col gap-2">
                    <Input id="picture" type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                    {isEditing && (
                        <>
                            <Button variant="outline" onClick={handleSelectImageClick}>
                                Seleccionar Imagen
                            </Button>
                            {imageFile && <Button onClick={handleImportClick}>Importar Imagen</Button>}
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};


const SubTabContent = ({ data, headers, isEditing }: { data: TableData, headers: string[], isEditing: boolean }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DataTable data={data} headers={headers} />
        <ImageImportCard isEditing={isEditing} />
    </div>
);


export function VentasManTab({ data, isEditing }: VentasManTabProps) {
  return (
    <Tabs defaultValue="pesoComprador" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mx-auto max-w-md mb-4">
        <TabsTrigger value="pesoComprador">Peso Comprador</TabsTrigger>
        <TabsTrigger value="zonaComercial">Zona Comp.</TabsTrigger>
        <TabsTrigger value="agrupacionComercial">Agrup. Com.</TabsTrigger>
      </TabsList>
      <TabsContent value="pesoComprador">
         <SubTabContent data={data.pesoComprador} headers={['PESO %', 'COMPRADOR', '€', '%']} isEditing={isEditing} />
      </TabsContent>
      <TabsContent value="zonaComercial">
        <SubTabContent data={data.zonaComercial} headers={['PESO %', 'ZONA COMP.', '€', '%']} isEditing={isEditing} />
      </TabsContent>
      <TabsContent value="agrupacionComercial">
         <SubTabContent data={data.agrupacionComercial} headers={['PESO %', 'AGRUP. COM.', '€', '%']} isEditing={isEditing} />
      </TabsContent>
    </Tabs>
  );
}
