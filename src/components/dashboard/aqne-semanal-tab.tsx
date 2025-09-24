import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Footprints, 
  SprayCan
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { DatoSimple } from './kpi-card';


type AqneData = WeeklyData["aqneSemanal"];
type SectionName = keyof AqneData;

type AqneSemanalTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
};


const WomanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M12 5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3"/><path d="M18.37 13.57a6.03 6.03 0 0 0-1.3-4.57l-2.07-2.07a1 1 0 0 0-1.41 0l-2.07 2.07a6.03 6.03 0 0 0-1.3 4.57"/><path d="M6 21a2 2 0 0 0 2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2"/></svg>;
const ManIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M12 5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3"/><path d="M7 14a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v7h-4v-4h-2v4H7v-7Z"/></svg>;
const NinoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M12 6.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3"/><path d="m5.6 21.5 1.5-6a2 2 0 0 1 2-1.5h5.8a2 2 0 0 1 2 1.5l1.5 6"/><path d="M12 14v-2.5"/><path d="M10 16c.5 1.33 1 2 2 2s1.5-.67 2-2"/></svg>;
const RopaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary"><path d="m21.21 15.89-1.42-1.42a2 2 0 0 0-2.82 0L12 19.41l-5.96-5.96a2 2 0 0 0-2.82 0L1.79 15.89a2 2 0 0 0 0 2.82l1.42 1.42a2 2 0 0 0 2.82 0L12 14.2l5.96 5.96a2 2 0 0 0 2.82 0l1.42-1.42a2 2 0 0 0 0-2.82z"/><path d="M7.24 2.24 9 4l2.8-2.8L14 3l2.45-2.45L18.3 3 20 1.24 22 4l-1.8 1.8L22 7.64l-2.4-2.4-1.83 1.83L15.31 5l-2.46 2.46L10.4 5l-1.83 1.83-2.4-2.4L4.4 5.8 2.55 4l1.8-1.8L6 4l1.24-1.76z"/></svg>;


const sectionConfig = {
    woman: { title: "WOMAN", icon: <WomanIcon />, color: "bg-pink-500" },
    man: { title: "MAN", icon: <ManIcon />, color: "bg-blue-500" },
    nino: { title: "NIÑO", icon: <NinoIcon />, color: "bg-primary" }
};

const desgloseIconos: { [key: string]: React.ReactNode } = {
    "Ropa": <RopaIcon />,
    "Calzado": <Footprints className="h-4 w-4 text-primary" />,
    "Perfumería": <SprayCan className="h-4 w-4 text-primary" />
};

const AqneSectionCard = ({ name, data, isEditing, onInputChange }: { name: SectionName, data: AqneData[SectionName], isEditing: boolean, onInputChange: AqneSemanalTabProps['onInputChange'] }) => {
    if (!data) return null;
    const config = sectionConfig[name];

    const handleDesgloseChange = (index: number, field: string, value: string) => {
        onInputChange(`aqneSemanal.${name}.desglose.${index}.${field}`, value);
    };

    return (
        <Card className="flex-1">
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center text-lg font-bold">
                    <div className="flex items-center gap-2">
                        {config.icon}
                        {config.title}
                    </div>
                    <span className={cn("text-sm font-bold text-white rounded-md px-2 py-1", config.color)}>
                        {formatPercentage(data.pesoPorc)}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-1 text-right">
                    <div className="bg-background rounded-lg p-3 text-center flex flex-col justify-center items-center">
                        <div className={cn("font-bold text-lg", data.metricasPrincipales.totalEuros < 0 && "text-red-600")}>{formatCurrency(data.metricasPrincipales.totalEuros)}</div>
                    </div>
                    <div className="bg-background rounded-lg p-3 text-center flex flex-col justify-center items-center">
                         <DatoSimple 
                            value={data.metricasPrincipales.totalUnidades}
                            isEditing={isEditing}
                            valueId={`aqneSemanal.${name}.metricasPrincipales.totalUnidades`}
                            onInputChange={onInputChange}
                            align="center"
                        />
                    </div>
                </div>
                <Separator className="my-1" />
                <div className="flex flex-col gap-1 mt-1 text-sm">
                    {data.desglose.map((item, index) => (
                         <div key={index} className="grid grid-cols-2 justify-between items-center gap-2">
                            <div className="flex items-center gap-2 text-left">
                                <div className="w-6 flex-shrink-0">
                                    {desgloseIconos[item.seccion] || <RopaIcon />}
                                </div>
                                <span>{item.seccion}</span>
                            </div>
                            
                            <div className="text-right">
                                {isEditing ? (
                                    <Input type="number" inputMode="decimal" defaultValue={item.totalEuros} onChange={(e) => handleDesgloseChange(index, 'totalEuros', e.target.value)} className="font-bold w-20 text-right ml-auto" placeholder="€" />
                                ) : (
                                    <div className={cn("font-bold text-right", item.totalEuros < 0 && "text-red-600")}>{formatCurrency(item.totalEuros)}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};


export function AqneSemanalTab({ data, isEditing, onInputChange }: AqneSemanalTabProps) {
  const handleDailySaleChange = (index: number, field: string, value: string) => {
    onInputChange(`ventasDiariasAQNE.${index}.${field}`, value);
  };

  const aqneData = data.aqneSemanal;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <AqneSectionCard name="woman" data={aqneData.woman} isEditing={isEditing} onInputChange={onInputChange} />
        <AqneSectionCard name="man" data={aqneData.man} isEditing={isEditing} onInputChange={onInputChange} />
        <AqneSectionCard name="nino" data={aqneData.nino} isEditing={isEditing} onInputChange={onInputChange} />
      </div>

      <div className="grid grid-cols-1 gap-6 pt-2">
        <Card>
            <CardHeader>
                <CardTitle className="uppercase font-bold">Ventas Diarias AQNE</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="uppercase font-bold">Día</TableHead>
                            <TableHead className="text-right uppercase font-bold">Total</TableHead>
                            <TableHead className="text-right uppercase font-bold text-pink-500">Woman</TableHead>
                            <TableHead className="text-right uppercase font-bold text-blue-500">Man</TableHead>
                            <TableHead className="text-right uppercase font-bold text-primary">NIÑO</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.ventasDiariasAQNE.map((venta, index) => (
                            <TableRow key={venta.dia}>
                                <TableCell className="font-medium">{venta.dia}</TableCell>
                                {isEditing ? (
                                    <>
                                        <TableCell><Input type="number" inputMode="decimal" value={venta.total} readOnly className="w-24 ml-auto text-right bg-muted" /></TableCell>
                                        <TableCell><Input type="number" inputMode="decimal" defaultValue={venta.woman} onChange={(e) => handleDailySaleChange(index, 'woman', e.target.value)} className="w-24 ml-auto text-right" /></TableCell>
                                        <TableCell><Input type="number" inputMode="decimal" defaultValue={venta.man} onChange={(e) => handleDailySaleChange(index, 'man', e.target.value)} className="w-24 ml-auto text-right" /></TableCell>
                                        <TableCell><Input type="number" inputMode="decimal" defaultValue={venta.nino} onChange={(e) => handleDailySaleChange(index, 'nino', e.target.value)} className="w-24 ml-auto text-right" /></TableCell>
                                    </>
                                ) : (
                                    <>
                                        <TableCell className="text-right font-bold">{formatCurrency(venta.total)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(venta.woman)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(venta.man)}</TableCell>
                                        <TableCell className="text-right">{formatCurrency(venta.nino)}</TableCell>
                                    </>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
