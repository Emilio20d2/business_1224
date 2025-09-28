
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
  TableFooter,
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
import { Users, MapPin, ShoppingBasket, Percent, Euro } from 'lucide-react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { OperacionesSubTab } from './operaciones-sub-tab';
import { FocusSemanalTab } from './focus-semanal-tab';


type VentasManTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any) => void;
};

const DataTable = ({ 
    title,
    icon,
    data, 
    list,
    isEditing, 
    dataKey, 
    onInputChange
}: { 
    title: string,
    icon: React.ReactNode,
    data: VentasManItem[] | undefined, 
    list: string[] | undefined,
    isEditing: boolean, 
    dataKey: string, 
    onInputChange: VentasManTabProps['onInputChange']
}) => {
    if (!data || !Array.isArray(data)) {
        return <p className="text-center text-muted-foreground mt-8">No hay datos disponibles.</p>;
    }
    const optionList = list || [];

    const totalEuros = data.reduce((sum, item) => sum + (Number(item.totalEuros) || 0), 0);

    const handleChange = (index: number, field: keyof VentasManItem, value: any) => {
        const path = `${dataKey}.${index}.${field}`;
        onInputChange(path, value);
    };

    return (
        <Card className="h-full overflow-y-auto">
            <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                        <TableHead className="uppercase font-bold w-1/4">
                            <div className="flex items-center gap-2 text-primary">
                                {icon}
                                <span>{title}</span>
                            </div>
                        </TableHead>
                        <TableHead className='text-right w-1/4'><Percent className="h-4 w-4 text-primary inline-block" /></TableHead>
                        <TableHead className='text-right w-1/4'><Euro className="h-4 w-4 text-primary inline-block" /></TableHead>
                        <TableHead className='text-right w-1/4'>Var %</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => {
                        const pesoPorc = totalEuros > 0 ? ((Number(item.totalEuros) || 0) / totalEuros) * 100 : 0;
                        return (
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
                                  {formatPercentage(pesoPorc)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-full ml-auto text-right" defaultValue={item.totalEuros} onChange={(e) => handleChange(index, 'totalEuros', e.target.value)} /> : formatCurrency(item.totalEuros)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-full ml-auto text-right" defaultValue={item.varPorc} onChange={(e) => handleChange(index, 'varPorc', e.target.value)} /> : 
                                     <span className={cn(item.varPorc < 0 ? "text-red-600" : "text-green-600")}>{formatPercentage(item.varPorc)}</span>
                                    }
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
                 <TableFooter>
                    <TableRow className="bg-muted/50 hover:bg-muted/60">
                        <TableHead className="font-bold uppercase">Total</TableHead>
                        <TableHead className="text-right font-bold">{formatPercentage(100)}</TableHead>
                        <TableHead className="text-right font-bold">{formatCurrency(totalEuros)}</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableFooter>
            </Table>
        </Card>
    );
};


export function VentasManTab({ data, isEditing, onInputChange }: VentasManTabProps) {
    const [activeTab, setActiveTab] = React.useState<string>('ventas');
    
    if (!data || !data.ventasMan || !data.listas) return <p>Cargando datos de Ventas Man...</p>;

    const { ventasMan, listas } = data;
    
    const tabButtons = [
        { value: 'ventas', label: 'VENTAS' },
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
            
            <TabsContent value="ventas" className="mt-0">
               <div className="grid gap-4 items-start grid-cols-1">
                   <DataTable
                        title="Ropa"
                        icon={<Users className="h-5 w-5" />}
                        dataKey="ventasMan.pesoComprador"
                        data={ventasMan.pesoComprador}
                        list={listas.compradorMan}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
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
