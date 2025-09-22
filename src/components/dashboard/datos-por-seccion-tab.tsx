import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Shirt, 
  Footprints, 
  SprayCan 
} from 'lucide-react';

type SectionData = WeeklyData["datosPorSeccion"];
type SectionName = keyof SectionData;

const WomanIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5.5V14.5"/>
    <path d="M12 14.5L9 11.5"/>
    <path d="M12 14.5L15 11.5"/>
    <circle cx="12" cy="3" r="2.5"/>
    <path d="M9 14.5h6l-1 7H10l-1-7z"/>
  </svg>
);

const ManIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5.5V14.5"/>
    <path d="M12 14.5L9 11.5"/>
    <path d="M12 14.5L15 11.5"/>
    <circle cx="12" cy="3" r="2.5"/>
    <path d="M9 14.5h6v7H9v-7z"/>
  </svg>
);

const ChildIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 16.5V12.5"/>
    <path d="M10 12.5L8 10.5"/>
    <path d="M10 12.5L12 10.5"/>
    <circle cx="10" cy="4" r="2"/>
    <path d="M8 12.5h4v4H8v-4z"/>
  </svg>
);

const sectionConfig = {
    woman: { title: "WOMAN", icon: <WomanIcon className="h-5 w-5" />, color: "bg-pink-500" },
    man: { title: "MAN", icon: <ManIcon className="h-5 w-5" />, color: "bg-blue-500" },
    nino: { title: "NIÑO", icon: <ChildIcon className="h-5 w-5" />, color: "bg-primary" }
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


const SectionCard = ({ name, data }: { name: SectionName, data: SectionData[SectionName] }) => {
    const config = sectionConfig[name];

    return (
        <Card className="flex-1">
            <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-center text-lg font-bold">
                    <div className="flex items-center gap-2">
                        {config.icon}
                        {config.title}
                    </div>
                    <span className={cn(
                        "text-sm font-bold text-white rounded-md px-2 py-1",
                        config.color
                    )}>
                        {formatPercentage(data.pesoPorc)}
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2 my-4">
                    <div className="bg-background rounded-lg p-2 text-center">
                        <div className="font-bold text-lg">{formatCurrency(data.metricasPrincipales.totalEuros)}</div>
                        <TrendIndicator value={data.metricasPrincipales.varPorcEuros} />
                    </div>
                    <div className="bg-background rounded-lg p-2 text-center">
                        <div className="font-bold text-lg">{formatNumber(data.metricasPrincipales.totalUnidades)}</div>
                        <TrendIndicator value={data.metricasPrincipales.varPorcUnidades} />
                    </div>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-2 mt-4 text-sm">
                    {data.desglose.map((item, index) => (
                        <div key={index} className="grid grid-cols-[auto_1fr_auto] items-center">
                           <div className="w-8 flex-shrink-0">
                                {desgloseIconos[item.seccion] || <Shirt className="h-4 w-4 text-muted-foreground" />}
                           </div>
                            <div className="text-right font-bold">{formatCurrency(item.totalEuros)}</div>
                            <div className="text-right">
                                <TrendIndicator value={item.varPorc} />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};


export function DatosPorSeccionTab({ data }: { data: SectionData }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <SectionCard name="woman" data={data.woman} />
      <SectionCard name="man" data={data.man} />
      <SectionCard name="nino" data={data.nino} />
    </div>
  );
}
