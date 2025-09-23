import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Shirt, 
  Footprints, 
  SprayCan,
  PersonStanding
} from 'lucide-react';
import { Input } from '@/components/ui/input';

type SectionData = WeeklyData["datosPorSeccion"];
type SectionName = keyof SectionData;
type DatosPorSeccionTabProps = {
    data: SectionData;
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

const TrendIndicator = ({ value }: { value: number }) => {
  const trendColor = value >= 0 ? 'text-green-600' : 'text-red-600';
  return (
    <span className={cn("text-xs font-bold", trendColor)}>
      {value >= 0 ? '+' : ''}{value.toLocaleString('es-ES')}%
    </span>
  );
};


const SectionCard = ({ name, data, isEditing, onInputChange }: { name: SectionName, data: SectionData[SectionName], isEditing: boolean, onInputChange: DatosPorSeccionTabProps['onInputChange'] }) => {
    const config = sectionConfig[name];

    const handleMetricChange = (field: string, value: string) => {
        onInputChange(`datosPorSeccion.${name}.metricasPrincipales.${field}`, value);
    };

    const handleDesgloseChange = (index: number, field: string, value: string) => {
        onInputChange(`datosPorSeccion.${name}.desglose.${index}.${field}`, value);
    };
    
    const handlePesoChange = (value: string) => {
        onInputChange(`datosPorSeccion.${name}.pesoPorc`, value);
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
                                <Input type="number" inputMode="decimal" defaultValue={data.metricasPrincipales.varPorcEuros} onChange={(e) => handleMetricChange('varPorcEuros', e.target.value)} className="text-xs font-bold w-full text-center mt-1" />
                            </div>
                            <div className="bg-background rounded-lg p-2 text-center">
                                <Input type="number" inputMode="decimal" defaultValue={data.metricasPrincipales.totalUnidades} onChange={(e) => handleMetricChange('totalUnidades', e.target.value)} className="font-bold text-lg w-full text-center" />
                                <Input type="number" inputMode="decimal" defaultValue={data.metricasPrincipales.varPorcUnidades} onChange={(e) => handleMetricChange('varPorcUnidades', e.target.value)} className="text-xs font-bold w-full text-center mt-1" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="bg-background rounded-lg p-2 text-center">
                                <div className="font-bold text-lg">{formatCurrency(data.metricasPrincipales.totalEuros)}</div>
                                <TrendIndicator value={data.metricasPrincipales.varPorcEuros} />
                            </div>
                            <div className="bg-background rounded-lg p-2 text-center">
                                <div className="font-bold text-lg">{formatNumber(data.metricasPrincipales.totalUnidades)}</div>
                                <TrendIndicator value={data.metricasPrincipales.varPorcUnidades} />
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
                            <div>
                                {isEditing ? (
                                    <Input type="number" inputMode="decimal" defaultValue={item.varPorc} onChange={(e) => handleDesgloseChange(index, 'varPorc', e.target.value)} className="text-xs font-bold w-16 text-right" />
                                ) : (
                                    <TrendIndicator value={item.varPorc} />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};


export function DatosPorSeccionTab({ data, isEditing, onInputChange }: DatosPorSeccionTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SectionCard name="woman" data={data.woman} isEditing={isEditing} onInputChange={onInputChange} />
      <SectionCard name="man" data={data.man} isEditing={isEditing} onInputChange={onInputChange} />
      <SectionCard name="nino" data={data.nino} isEditing={isEditing} onInputChange={onInputChange} />
    </div>
  );
}
