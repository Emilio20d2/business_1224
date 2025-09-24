import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Woman, 
  Footprints, 
  SprayCan,
  User,
  Baby
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


const sectionConfig = {
    woman: { title: "WOMAN", icon: <Woman className="h-5 w-5 text-primary" />, color: "bg-pink-500" },
    man: { title: "MAN", icon: <User className="h-5 w-5 text-primary" />, color: "bg-blue-500" },
    nino: { title: "NIÑO", icon: <Baby className="h-5 w-5 text-primary" />, color: "bg-primary" }
};

const desgloseIconos: { [key: string]: React.ReactNode } = {
    "Ropa": <Woman className="h-4 w-4 text-primary" />,
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
                <div className="grid grid-cols-2 gap-2">
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
                <Separator className="my-2" />
                <div className="flex flex-col gap-2 mt-2 text-sm">
                    {data.desglose.map((item, index) => (
                         <div key={index} className="grid grid-cols-[1fr_auto_auto] justify-between items-center gap-2">
                            <div className="flex items-center gap-2 text-left">
                                <div className="w-6 flex-shrink-0">
                                    {desgloseIconos[item.seccion] || <User className="h-4 w-4 text-muted-foreground" />}
                                </div>
                                <span>{item.seccion}</span>
                            </div>
                            
                            {isEditing ? (
                                <>
                                    <Input type="number" inputMode="decimal" defaultValue={item.totalEuros} onChange={(e) => handleDesgloseChange(index, 'totalEuros', e.target.value)} className="font-bold w-20 text-right" placeholder="€" />
                                    <div className="w-20 flex justify-end">
                                      <DatoSimple 
                                          value=""
                                          variation={item.varPorc} 
                                          isEditing={isEditing}
                                          alwaysShowVariation 
                                          align="right" 
                                          unit="%"
                                          variationId={`aqneSemanal.${name}.desglose.${index}.varPorc`}
                                          onInputChange={onInputChange}
                                      />
                                    </div>
                                </>
                            ) : (
                                <>
                                  <div className={cn("font-bold text-right", item.totalEuros < 0 && "text-red-600")}>{formatCurrency(item.totalEuros)}</div>
                                  <div className="w-20 flex justify-end">
                                      <DatoSimple 
                                          value=""
                                          variation={item.varPorc} 
                                          isEditing={false}
                                          alwaysShowVariation 
                                          align="right" 
                                          unit="%"
                                      />
                                  </div>
                                </>
                            )}
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
