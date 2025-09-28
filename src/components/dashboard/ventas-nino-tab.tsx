
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { OperacionesSubTab } from './operaciones-sub-tab';
import { FocusSemanalTab } from './focus-semanal-tab';
import { DatoSimple } from './kpi-card';


type VentasNinoTabProps = {
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
    onInputChange: VentasNinoTabProps['onInputChange'],
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
        onInputChange(path, isNaN(numericValue) ? "" : numericValue);
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
                                    {isEditing && list && list.length > 0 ? (
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
                                    {formatPercentage(item.pesoPorc)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-full ml-auto text-right" defaultValue={item.totalEuros} onChange={(e) => handleChange(index, 'totalEuros', e.target.value)} /> : formatCurrency(item.totalEuros)}
                                </TableCell>
                                {showVarPorc && (
                                    <TableCell className="text-right font-medium">
                                        {isEditing ? <Input type="number" inputMode="decimal" className="w-full ml-auto text-right" defaultValue={item.varPorc} onChange={(e) => handleChange(index, 'varPorc', e.target.value)} /> : 
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


export function VentasNinoTab({ data, isEditing, onInputChange }: VentasNinoTabProps) {
    const [activeTab, setActiveTab] = React.useState<string>('ventas');
    
    if (!data || !data.ventasNino || !data.listas) return <p>Cargando datos de Ventas Niño...</p>;

    const { ventasNino, listas, datosPorSeccion } = data;
    
    const ropaTotalEuros = ventasNino.pesoComprador.reduce((sum, item) => sum + (Number(item.totalEuros) || 0), 0);
    const calzadoData = datosPorSeccion.nino.desglose.find(d => d.seccion === 'Calzado');
    const perfumeriaData = datosPorSeccion.nino.desglose.find(d => d.seccion === 'Perfumería');

    const calzadoTotalEuros = calzadoData?.totalEuros || 0;
    const perfumeriaTotalEuros = perfumeriaData?.totalEuros || 0;

    const grandTotalEuros = ropaTotalEuros + calzadoTotalEuros + perfumeriaTotalEuros;

    const calzadoTableData: VentasManItem[] = calzadoData ? [{
        nombre: 'Calzado',
        pesoPorc: grandTotalEuros > 0 ? (calzadoTotalEuros / grandTotalEuros) * 100 : 0,
        totalEuros: calzadoTotalEuros,
        varPorc: calzadoData.varPorc,
        totalEurosSemanaAnterior: 0
    }] : [];
    
    const perfumeriaTableData: VentasManItem[] = perfumeriaData ? [{
        nombre: 'Perfumeria',
        pesoPorc: grandTotalEuros > 0 ? (perfumeriaTotalEuros / grandTotalEuros) * 100 : 0,
        totalEuros: perfumeriaTotalEuros,
        varPorc: perfumeriaData.varPorc,
        totalEurosSemanaAnterior: 0
    }] : [];

    const ropaPesoPorcTotal = grandTotalEuros > 0 ? (ropaTotalEuros / grandTotalEuros) * 100 : 0;
    const ropaWeightedVarPorc = ropaTotalEuros > 0
        ? ventasNino.pesoComprador.reduce((sum, item) => sum + (Number(item.totalEuros) || 0) * (Number(item.varPorc) || 0), 0) / ropaTotalEuros
        : 0;

    const tabButtons = [
        { value: 'ventas', label: 'VENTAS' },
        { value: 'aqne', label: 'AQNE' },
        { value: 'zonaYAgrupacion', label: 'ZONA Y AGRUPACIÓN' },
        { value: 'operaciones', label: 'OPERACIONES' },
        { value: 'focus', label: 'FOCUS' },
    ];

    return (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-4 grid w-full grid-cols-2 md:grid-cols-5 gap-2">
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
                        dataKey="ventasNino.pesoComprador"
                        data={ventasNino.pesoComprador.sort((a, b) => (b.totalEuros || 0) - (a.totalEuros || 0)).map(item => ({
                            ...item,
                            pesoPorc: grandTotalEuros > 0 ? ((Number(item.totalEuros) || 0) / grandTotalEuros) * 100 : 0
                        }))}
                        list={listas.compradorNino}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        showFooter={true}
                        totalEurosOverride={ropaTotalEuros}
                        totalVarPorcOverride={ropaWeightedVarPorc}
                        totalPesoPorcOverride={ropaPesoPorcTotal}
                    />
                    <DataTable
                        title="Calzado"
                        icon={<Footprints className="h-5 w-5" />}
                        dataKey="datosPorSeccion.nino.desglose"
                        data={calzadoTableData}
                        list={undefined}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        showFooter={false}
                    />
                    <DataTable
                        title="Perfumeria"
                        icon={<SprayCan className="h-5 w-5" />}
                        dataKey="datosPorSeccion.nino.desglose"
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
                                        {formatNumber(datosPorSeccion.nino.metricasPrincipales.totalUnidades)}
                                    </TableCell>
                                    <TableCell className={cn("text-right font-medium", datosPorSeccion.nino.metricasPrincipales.varPorcUnidades < 0 ? "text-red-600" : "text-green-600")}>
                                        {formatPercentage(datosPorSeccion.nino.metricasPrincipales.varPorcUnidades)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </Card>
               </div>
            </TabsContent>

            <TabsContent value="aqne" className="mt-0">
                 <div className="grid gap-4 items-start grid-cols-1">
                   <DataTable
                        title="Ropa"
                        icon={<Shirt className="h-5 w-5" />}
                        dataKey="ventasNino.pesoComprador"
                        data={ventasNino.pesoComprador.sort((a, b) => (b.totalEuros || 0) - (a.totalEuros || 0)).map(item => ({
                            ...item,
                            pesoPorc: grandTotalEuros > 0 ? ((Number(item.totalEuros) || 0) / grandTotalEuros) * 100 : 0
                        }))}
                        list={listas.compradorNino}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        showFooter={true}
                        totalEurosOverride={ropaTotalEuros}
                        totalPesoPorcOverride={ropaPesoPorcTotal}
                        showVarPorc={false}
                    />
                    <DataTable
                        title="Calzado"
                        icon={<Footprints className="h-5 w-5" />}
                        dataKey="datosPorSeccion.nino.desglose"
                        data={calzadoTableData}
                        list={undefined}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        showFooter={false}
                        showVarPorc={false}
                    />
                    <DataTable
                        title="Perfumeria"
                        icon={<SprayCan className="h-5 w-5" />}
                        dataKey="datosPorSeccion.nino.desglose"
                        data={perfumeriaTableData}
                        list={undefined}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        showFooter={false}
                        showVarPorc={false}
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-bold uppercase">Total</TableCell>
                                    <TableCell></TableCell>
                                    <TableCell className="text-right font-medium">
                                        {formatNumber(datosPorSeccion.nino.metricasPrincipales.totalUnidades)}
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
                        dataKey="ventasNino.zonaComercial"
                        data={ventasNino.zonaComercial}
                        list={listas.zonaComercialNino}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        showFooter
                    />
                    <DataTable
                        title="Agrupación Comercial"
                        icon={<ShoppingBasket className="h-5 w-5" />}
                        dataKey="ventasNino.agrupacionComercial"
                        data={ventasNino.agrupacionComercial}
                        list={listas.agrupacionComercialNino}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        showFooter
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
