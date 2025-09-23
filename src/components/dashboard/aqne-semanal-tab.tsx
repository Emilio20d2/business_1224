import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Shirt, 
  Footprints, 
  SprayCan,
  PersonStanding
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


type AqneData = WeeklyData["aqneSemanal"];
type SectionName = keyof AqneData;

type AqneSemanalTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
};


const sectionConfig = {
    woman: { title: "WOMAN", icon: <PersonStanding className="h-5 w-5" />, color: "bg-pink-500" },
    man: { title: "MAN", icon: <PersonStanding className="h-5 w-5" />, color: "bg-blue-500" },
    nino: { title: "NIÑO", icon: <PersonStanding className="h-5 w-5" />, color: "bg-primary" }
};

const desgloseIconos: { [key: string]: React.ReactNode } = {
    "Ropa": <Shirt className="h-4 w-4 text-muted-foreground" />,
    "Calzado": <Footprints className="h-4 w-4 text-muted-foreground" />,
    "Perfumería": <SprayCan className="h-4 w-4 text-muted-foreground" />
};

const AqneSectionCard = ({ name, data, isEditing, onInputChange }: { name: SectionName, data: AqneData[SectionName], isEditing: boolean, onInputChange: AqneSemanalTabProps['onInputChange'] }) => {
    const config = sectionConfig[name];

    const handleMetricChange = (field: string, value: string) => {
        onInputChange(`aqneSemanal.${name}.metricasPrincipales.${field}`, value);
    };

    const handleDesgloseChange = (index: number, field: string, value: string) => {
        onInputChange(`aqneSemanal.${name}.desglose.${index}.${field}`, value);
    };
    
    const handlePesoChange = (value: string) => {
        onInputChange(`aqneSemanal.${name}.pesoPorc`, value);
    };

    return (
        <Card className="flex-1">
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center text-lg font-bold">
                    <div className="flex items-center gap-2">
                        {config.icon}
                        {config.title}
                    </div>
                     {isEditing ? (
                        <div className="flex items-center gap-1">
                            <Input type="number" inputMode="decimal" defaultValue={data.pesoPorc} onChange={(e) => handlePesoChange(e.target.value)} className="w-16 h-8 text-right" />
                            <span className="text-sm font-bold text-muted-foreground">%</span>
                        </div>
                    ) : (
                        <span className={cn("text-sm font-bold text-white rounded-md px-2 py-1", config.color)}>
                            {formatPercentage(data.pesoPorc)}
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2 my-4">
                    {isEditing ? (
                        <>
                            <div className="bg-background rounded-lg p-2 text-center">
                                <Input type="number" inputMode="decimal" defaultValue={data.metricasPrincipales.totalEuros} onChange={(e) => handleMetricChange('totalEuros', e.target.value)} className="font-bold text-lg w-full text-center" />
                                <span className="text-xs">Total €</span>
                            </div>
                            <div className="bg-background rounded-lg p-2 text-center">
                                <Input type="number" inputMode="decimal" defaultValue={data.metricasPrincipales.totalUnidades} onChange={(e) => handleMetricChange('totalUnidades', e.target.value)} className="font-bold text-lg w-full text-center" />
                                 <span className="text-xs">Total Unid.</span>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-background rounded-lg p-2 text-center">
                                <div className="font-bold text-lg">{formatCurrency(data.metricasPrincipales.totalEuros)}</div>
                                <span className="text-xs">Total €</span>
                            </div>
                            <div className="bg-background rounded-lg p-2 text-center">
                                <div className="font-bold text-lg">{formatNumber(data.metricasPrincipales.totalUnidades)}</div>
                                <span className="text-xs">Total Unid.</span>
                            </div>
                        </>
                    )}
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-2 mt-4 text-sm">
                    {data.desglose.map((item, index) => (
                         <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-6 flex-shrink-0">
                                    {desgloseIconos[item.seccion] || <Shirt className="h-4 w-4 text-muted-foreground" />}
                                </div>
                                {isEditing ? (
                                    <Input type="number" inputMode="decimal" defaultValue={item.totalEuros} onChange={(e) => handleDesgloseChange(index, 'totalEuros', e.target.value)} className="font-bold w-24" />
                                ) : (
                                    <div className="font-bold">{formatCurrency(item.totalEuros)}</div>
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <AqneSectionCard name="woman" data={aqneData.woman} isEditing={isEditing} onInputChange={onInputChange} />
        <AqneSectionCard name="man" data={aqneData.man} isEditing={isEditing} onInputChange={onInputChange} />
        <AqneSectionCard name="nino" data={aqneData.nino} isEditing={isEditing} onInputChange={onInputChange} />
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6">
        <Card>
            <CardHeader>
                <CardTitle>Ventas Diarias AQNE</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="uppercase font-bold">Día</TableHead>
                            <TableHead className="text-right uppercase font-bold">Total</TableHead>
                            <TableHead className="text-right uppercase font-bold text-pink-500">Woman</TableHead>
                            <TableHead className="text-right uppercase font-bold text-blue-500">Man</TableHead>
                            <TableHead className="text-right uppercase font-bold text-primary">Niño</TableHead>
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

    