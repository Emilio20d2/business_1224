

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
import { formatCurrency, formatPercentage, formatNumber, formatPercentageInt } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from '../ui/button';
import { Users, MapPin, ShoppingBasket, Percent, Euro, Shirt, Footprints, SprayCan, Package } from 'lucide-react';
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { OperacionesSubTab } from './operaciones-sub-tab';
import { FocusSemanalTab } from './focus-semanal-tab';
import { DatoSimple } from './kpi-card';
import { PlanningSemanalTab } from './operaciones/planning-semanal-tab';
import { AqneNinoTab } from './aqne-nino-tab';


type VentasNinoTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: any, reorder?: boolean) => void;
  onTextChange: (value: string) => void;
  onDataChange: React.Dispatch<React.SetStateAction<WeeklyData | null>>;
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

    const displayedData = title === "Ropa" ? data.slice(0, 11) : data;

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
                    {displayedData.map((item, index) => {
                        const originalIndex = data.findIndex(d => d.nombre === item.nombre);
                        return (
                            <TableRow 
                                key={item.nombre + index}
                            >
                                <TableCell>
                                    {item.nombre}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatPercentageInt(item.pesoPorc)}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {isEditing ? <Input type="number" inputMode="decimal" className="w-full ml-auto text-right" defaultValue={item.totalEuros} onBlur={(e) => handleChange(originalIndex, 'totalEuros', e.target.value)} /> : formatCurrency(item.totalEuros)}
                                </TableCell>
                                {showVarPorc && (
                                    <TableCell className="text-right font-medium">
                                        {isEditing ? <Input type="number" inputMode="decimal" className="w-full ml-auto text-right" defaultValue={item.varPorc} onBlur={(e) => handleChange(originalIndex, 'varPorc', e.target.value)} /> : 
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
                            <TableHead className="text-right font-bold">{formatPercentageInt(finalTotalPesoPorc)}</TableHead>
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


export function VentasNinoTab({ data, isEditing, onInputChange, onTextChange, onDataChange }: VentasNinoTabProps) {
    const [activeTab, setActiveTab] = React.useState<string>('ventas');
    
    if (!data || !data.ventasNino || !data.listas) return <p>Cargando datos de Ventas Niño...</p>;

    const { ventasNino, listas, datosPorSeccion, nino, focusSemanal, planningSemanal, aqneNino } = data;
    
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
    }] : [];
    
    const perfumeriaTableData: VentasManItem[] = perfumeriaData ? [{
        nombre: 'Perfumeria',
        pesoPorc: grandTotalEuros > 0 ? (perfumeriaTotalEuros / grandTotalEuros) * 100 : 0,
        totalEuros: perfumeriaTotalEuros,
        varPorc: perfumeriaData.varPorc,
    }] : [];

    const ropaPesoPorcTotal = grandTotalEuros > 0 ? Math.round((ropaTotalEuros / grandTotalEuros) * 100) : 0;
    const ropaVarPorcTotal = datosPorSeccion.nino.metricasPrincipales.varPorcEuros;

    const tabButtons = [
        { value: 'ventas', label: 'VENTAS' },
        { value: 'aqne', label: 'AQNE' },
        { value: 'operaciones', label: 'OPERACIONES' },
        { value: 'planificacion', label: 'PLANIFICACIÓN' },
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
                        data={ventasNino.pesoComprador}
                        list={listas.compradorNino}
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
                        dataKey="datosPorSeccion.nino.desglose"
                        data={calzadoTableData}
                        list={undefined}
                        isEditing={isEditing}
                        onInputChange={onInputChange}
                        showFooter={false}
                    />
                    <DataTable
                        title="Perfumería"
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
              {aqneNino && <AqneNinoTab data={aqneNino} isEditing={isEditing} onInputChange={onInputChange} />}
            </TabsContent>

            <TabsContent value="operaciones" className="mt-0">
                <OperacionesSubTab 
                    operaciones={nino.operaciones} 
                    perdidas={nino.perdidas}
                    logistica={nino.logistica}
                    almacenes={nino.almacenes}
                    mermaTarget={data.listas.mermaTarget.nino}
                    isEditing={isEditing} 
                    onInputChange={onInputChange}
                    basePath="nino"
                />
            </TabsContent>

            <TabsContent value="planificacion" className="mt-0">
                 {data.planningSemanal && (
                    <PlanningSemanalTab
                        data={data}
                        empleados={data.listas.empleados || []}
                        isEditing={isEditing}
                        onDataChange={onDataChange}
                        weekId={data.periodo}
                    />
                 )}
            </TabsContent>
            
            <TabsContent value="focus" className="mt-0">
              <FocusSemanalTab 
                text={focusSemanal.nino} 
                isEditing={isEditing} 
                onTextChange={onTextChange} 
              />
            </TabsContent>
        </Tabs>
    );
}
