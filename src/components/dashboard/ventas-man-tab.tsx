
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
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from '../ui/button';
import { Users, MapPin, ShoppingBasket, Percent, Euro, Shirt, Footprints, SprayCan, Package } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { OperacionesSubTab } from './operaciones-sub-tab';
import { FocusSemanalTab } from './focus-semanal-tab';
import { DatoSimple } from './kpi-card';


type VentasManTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any, reorder?: boolean) => void;
};

const DataTable = ({ 
    title,
    icon,
    data, 
    list,
    isEditing, 
    dataKey, 
    onInputChange,
    showFooter = false,
    totalEurosOverride,
    totalVarPorcOverride,
    totalPesoPorcOverride,
    showVarPorc = true,
}: { 
    title: string,
    icon: React.ReactNode,
    data: VentasManItem[] | undefined, 
    list: string[] | undefined,
    isEditing: boolean, 
    dataKey: string, 
    onInputChange: VentasManTabProps['onInputChange'],
    showFooter?: boolean,
    totalEurosOverride?: number,
    totalVarPorcOverride?: number,
    totalPesoPorcOverride?: number,
    showVarPorc?: boolean
}) => {
    if (!data || !Array.isArray(data)) {
        return <p className="text-center text-muted-foreground mt-8">No hay datos disponibles.</p>;
    }
    const optionList = list || [];

    const totalEuros = data.reduce((sum, item) => sum + (Number(item.totalEuros) || 0), 0);
    
    const weightedVarPorc = totalEuros > 0 
        ? data.reduce((sum, item) => sum + (Number(item.totalEuros) || 0) * (Number(item.varPorc) || 0), 0) / totalEuros
        : 0;

    const finalTotalEuros = totalEurosOverride !== undefined ? totalEurosOverride : totalEuros;
    const finalWeightedVarPorc = totalVarPorcOverride !== undefined ? totalVarPorcOverride : weightedVarPorc;
    const finalTotalPesoPorc = totalPesoPorcOverride !== undefined ? totalPesoPorcOverride : data.reduce((sum, item) => sum + (Number(item.pesoPorc) || 0), 0);


    const handleChange = (index: number, field: keyof VentasManItem, value: any) => {
        const path = `${dataKey}.${index}.${field}`;
        const numericValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
        const reorder = field === 'totalEuros';
        onInputChange(path, isNaN(numericValue) ? "" : numericValue, reorder);
    };

    return (
        <Card className="h-full overflow-y-auto">
            <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                    <TableRow>
                        <TableHead className="uppercase font-bold w-[40%]">
                            <div className="flex items-center gap-2 text-primary">
                                {icon}
                                <span>{title}</span>
                            </div>
                        </TableHead>
                        <TableHead className='text-right w-[20%] uppercase font-bold text-primary'><Percent className="h-4 w-4 inline-block" /></TableHead>
                        <TableHead className='text-right w-[20%] uppercase font-bold text-primary'><Euro className="h-4 w-4 inline-block" /></TableHead>
                        {showVarPorc && <TableHead className='text-right w-[20%] uppercase font-bold text-primary'>Var %</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => {
                        return (
                            <TableRow 
                                key={item.nombre + index}
                            >
                                <TableCell>
                                    {item.nombre}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatPercentage(item.pesoPorc)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-full ml-auto text-right" defaultValue={item.totalEuros} onBlur={(e) => handleChange(index, 'totalEuros', e.target.value)} /> : formatCurrency(item.totalEuros)}
                                </TableCell>
                                {showVarPorc && (
                                    <TableCell className="text-right font-medium">
                                        {isEditing ? <Input type="number" inputMode="decimal" className="w-full ml-auto text-right" defaultValue={item.varPorc} onBlur={(e) => handleChange(index, 'varPorc', e.target.value)} /> : 
                                        <span className={cn(item.varPorc < 0 ? "text-red-600" : "text-green-600")}>{formatPercentage(item.varPorc)}</span>
                                        }
                                    </TableCell>
                                )}
                            </TableRow>
                        )
                    })}
                </TableBody>
                 {showFooter && (
                    <TableFooter>
                        <TableRow className="bg-muted/50 hover:bg-muted/60">
                            <TableHead className="font-bold uppercase">Total</TableHead>
                            <TableHead className="text-right font-bold">{formatPercentage(finalTotalPesoPorc)}</TableHead>
                            <TableHead className="text-right font-bold">{formatCurrency(finalTotalEuros)}</TableHead>
                            {showVarPorc && (
                                <TableHead className={cn("text-right font-bold", finalWeightedVarPorc < 0 ? "text-red-600" : "text-green-600")}>
                                    {formatPercentage(finalWeightedVarPorc)}
                                </TableHead>
                            )}
                        </TableRow>
                    </TableFooter>
                )}
            </Table>
        </Card>
    );
};


export function VentasManTab({ data, isEditing, onInputChange }: VentasManTabProps) {
    const [activeTab, setActiveTab] = React.useState<string>('ventas');
    
    if (!data || !data.ventasMan || !data.listas) return <p>Cargando datos de Ventas Man...</p>;

    const { ventasMan, listas, datosPorSeccion, man, logistica, almacenes } = data;
    
    const ropaTotalEuros = ventasMan.pesoComprador.reduce((sum, item) => sum + (Number(item.totalEuros) || 0), 0);
    const calzadoData = datosPorSeccion.man.desglose.find(d => d.seccion === 'Calzado');
    const perfumeriaData = datosPorSeccion.man.desglose.find(d => d.seccion === 'Perfumería');

    const calzadoTotalEuros = calzadoData?.totalEuros || 0;
    const perfumeriaTotalEuros = perfumeriaData?.totalEuros || 0;

    const grandTotalEuros = ropaTotalEuros + calzadoTotalEuros + perfumeriaTotalEuros;

    const calzadoTableData: VentasManItem[] = calzadoData ? [{
        nombre: 'Calzado',
        pesoPorc: grandTotalEuros > 0 ? (calzadoTotalEuros / grandTotalEuros) * 100 : 0,
        totalEuros: calzadoTotalEuros,
        varPorc: calzadoData.varPorc,
    }] : [];
    
    const perfumeriaTableData: VentasManItem[] = perfumeriaData ? [{
        nombre: 'Perfumeria',
        pesoPorc: grandTotalEuros > 0 ? (perfumeriaTotalEuros / grandTotalEuros) * 100 : 0,
        totalEuros: perfumeriaTotalEuros,
        varPorc: perfumeriaData.varPorc,
    }] : [];

    const ropaPesoPorcTotal = grandTotalEuros > 0 ? (ropaTotalEuros / grandTotalEuros) * 100 : 0;
    
    // Use the varPorc from the main section data, not a weighted average
    const ropaVarPorcTotal = datosPorSeccion.man.metricasPrincipales.varPorcEuros;


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
                        icon={<Shirt className="h-5 w-5" />}
                        dataKey="ventasMan.pesoComprador"
                        data={ventasMan.pesoComprador}
                        list={listas.compradorMan}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        showFooter={true}
                        totalEurosOverride={ropaTotalEuros}
                        totalVarPorcOverride={ropaVarPorcTotal}
                        totalPesoPorcOverride={ropaPesoPorcTotal}
                    />
                    <DataTable
                        title="Calzado"
                        icon={<Footprints className="h-5 w-5" />}
                        dataKey="datosPorSeccion.man.desglose"
                        data={calzadoTableData}
                        list={undefined}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        showFooter={false}
                    />
                    <DataTable
                        title="Perfumeria"
                        icon={<SprayCan className="h-5 w-5" />}
                        dataKey="datosPorSeccion.man.desglose"
                        data={perfumeriaTableData}
                        list={undefined}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        showFooter={false}
                    />
                     <Card className="h-full overflow-y-auto">
                        <Table>
                           <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%] uppercase font-bold text-primary">
                                        <div className="flex items-center gap-2">
                                            <Package className="h-4 w-4" />
                                            <span>Unidades</span>
                                        </div>
                                    </TableHead>
                                    <TableHead className="w-[20%]"></TableHead>
                                    <TableHead className='text-right w-[20%] uppercase font-bold text-primary'>UNIDADES</TableHead>
                                    <TableHead className="text-right w-[20%] uppercase font-bold text-primary">Var %</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-bold uppercase">Total</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatNumber(datosPorSeccion.man.metricasPrincipales.totalUnidades)}
                                    </TableCell>
                                    <TableCell className={cn("text-right font-medium", datosPorSeccion.man.metricasPrincipales.varPorcUnidades < 0 ? "text-red-600" : "text-green-600")}>
                                        {formatPercentage(datosPorSeccion.man.metricasPrincipales.varPorcUnidades)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>
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
                        showFooter
                    />
                    <DataTable
                        title="Agrupación Comercial"
                        icon={<ShoppingBasket className="h-5 w-5" />}
                        dataKey="ventasMan.agrupacionComercial"
                        data={ventasMan.agrupacionComercial}
                        list={listas.agrupacionComercialMan}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        showFooter
                    />
                </div>
            </TabsContent>

            <TabsContent value="operaciones" className="mt-0">
                <OperacionesSubTab 
                    operaciones={man.operaciones} 
                    perdidas={man.perdidas}
                    logistica={logistica}
                    almacenes={almacenes}
                    isEditing={isEditing} 
                    onInputChange={onInputChange}
                    basePath="man"
                />
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


    

    