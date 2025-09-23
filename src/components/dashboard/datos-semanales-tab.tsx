import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { KpiCard, DatoDoble, DatoSimple } from "./kpi-card";
import { 
  Euro, 
  ChartLine, 
  Receipt,
  ClipboardX,
  Trash2,
  Smartphone,
  Ticket,
  ScanLine,
  RefreshCw,
  Inbox,
  Package,
  PersonStanding,
  Baby,
  Shirt,
  Footprints,
  SprayCan,
  Clock,
  Percent
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type DatosSemanalesTabProps = {
  data: WeeklyData;
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
};

const formatGap = (value: number, unit: '€' | 'Unid.') => {
    const sign = value > 0 ? '+' : '';
    const formattedValue = new Intl.NumberFormat('es-ES').format(value);
    return `${sign}${formattedValue}${unit}`;
}


const TrendIndicator = ({ value }: { value: number }) => {
  const trendColor = value >= 0 ? 'text-green-600' : 'text-red-600';
  const sign = value >= 0 ? '+' : '';
  return (
    <span className={cn("text-xs font-bold", trendColor)}>
      {sign}{value.toLocaleString('es-ES')}%
    </span>
  );
};

type SectionName = keyof WeeklyData["datosPorSeccion"];

const sectionConfig = {
    woman: { title: "WOMAN", icon: <PersonStanding className="h-5 w-5" />, color: "bg-pink-500" },
    man: { title: "MAN", icon: <PersonStanding className="h-5 w-5" />, color: "bg-blue-500" },
    nino: { title: "NIÑO", icon: <Baby className="h-5 w-5" />, color: "bg-primary" }
};

const desgloseIconos: { [key: string]: React.ReactNode } = {
    "Ropa": <Shirt className="h-4 w-4 text-muted-foreground" />,
    "Calzado": <Footprints className="h-4 w-4 text-muted-foreground" />,
    "Perfumería": <SprayCan className="h-4 w-4 text-muted-foreground" />
};

const SectionCard = ({ name, data, isEditing, onInputChange }: { name: SectionName, data: WeeklyData["datosPorSeccion"][SectionName], isEditing: boolean, onInputChange: DatosSemanalesTabProps['onInputChange'] }) => {
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
                <div className="grid grid-cols-2 gap-2 my-2">
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
                                <div className={cn("font-bold text-lg", data.metricasPrincipales.totalEuros < 0 && "text-red-600")}>{formatCurrency(data.metricasPrincipales.totalEuros)}</div>
                                <TrendIndicator value={data.metricasPrincipales.varPorcEuros} />
                            </div>
                            <div className="bg-background rounded-lg p-2 text-center">
                                <div className={cn("font-bold text-lg", data.metricasPrincipales.totalUnidades < 0 && "text-red-600")}>{formatNumber(data.metricasPrincipales.totalUnidades)}</div>
                                <TrendIndicator value={data.metricasPrincipales.varPorcUnidades} />
                            </div>
                        </>
                    )}
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-2 mt-2 text-sm">
                    {data.desglose.map((item, index) => (
                         <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-6 flex-shrink-0">
                                    {desgloseIconos[item.seccion] || <Shirt className="h-4 w-4 text-muted-foreground" />}
                                </div>
                                {isEditing ? (
                                    <Input type="number" inputMode="decimal" defaultValue={item.totalEuros} onChange={(e) => handleDesgloseChange(index, 'totalEuros', e.target.value)} className="font-bold w-24" />
                                ) : (
                                    <div className={cn("font-bold", item.totalEuros < 0 && "text-red-600")}>{formatCurrency(item.totalEuros)}</div>
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


export function DatosSemanalesTab({ data, isEditing, onInputChange }: DatosSemanalesTabProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        {/* Ventas */}
        <KpiCard title="Ventas" icon={<Euro className="h-5 w-5 text-primary" />} className="md:col-span-3">
          <DatoDoble 
            value={formatCurrency(data.ventas.totalEuros)} 
            variation={data.ventas.varPorcEuros} 
            isEditing={isEditing}
            valueId="ventas.totalEuros"
            variationId="ventas.varPorcEuros"
            onInputChange={onInputChange}
          />
          <DatoDoble 
            value={formatNumber(data.ventas.totalUnidades)}
            unit=" Unid."
            variation={data.ventas.varPorcUnidades} 
            isEditing={isEditing}
            valueId="ventas.totalUnidades"
            variationId="ventas.varPorcUnidades"
            onInputChange={onInputChange}
          />
        </KpiCard>

        {/* Rendimiento de Tienda */}
        <KpiCard title="Rendimiento de Tienda" icon={<ChartLine className="h-5 w-5 text-primary" />} className="md:col-span-3">
          <DatoDoble 
            label="Tráfico" 
            value={formatNumber(data.rendimientoTienda.trafico)} 
            variation={data.rendimientoTienda.varPorcTrafico}
            isEditing={isEditing}
            valueId="rendimientoTienda.trafico"
            variationId="rendimientoTienda.varPorcTrafico"
            onInputChange={onInputChange}
          />
          <DatoDoble 
            label="Conversión" 
            value={formatPercentage(data.rendimientoTienda.conversion)} 
            variation={data.rendimientoTienda.varPorcConversion}
            isEditing={isEditing}
            valueId="rendimientoTienda.conversion"
            variationId="rendimientoTienda.varPorcConversion"
            onInputChange={onInputChange}
          />
        </KpiCard>
        
        {/* Fila Central: 6-col Grid */}
        <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-6 gap-2">
          <KpiCard title="GAP" icon={<ClipboardX className="h-5 w-5 text-primary" />} className="md:col-span-2">
              <div className="flex flex-row justify-center items-center gap-4">
                  <DatoSimple 
                      icon={<Euro className="h-5 w-5 text-primary"/>}
                      value={isEditing ? data.perdidas.gap.euros : formatGap(data.perdidas.gap.euros, '€')} 
                      isEditing={isEditing}
                      valueId="perdidas.gap.euros"
                      align="center"
                      unit="€"
                      onInputChange={onInputChange}
                  />
                  <DatoSimple 
                      icon={<Package className="h-5 w-5 text-primary"/>}
                      value={isEditing ? data.perdidas.gap.unidades : formatGap(data.perdidas.gap.unidades, 'Unid.')}
                      isEditing={isEditing}
                      valueId="perdidas.gap.unidades"
                      align="center"
                      unit="Unid."
                      onInputChange={onInputChange}
                  />
              </div>
          </KpiCard>

          <KpiCard title="Merma" icon={<Trash2 className="h-5 w-5 text-primary" />} className="md:col-span-2">
              <div className="flex flex-row justify-center items-center gap-4">
                  <DatoSimple 
                      icon={<Package className="h-5 w-5 text-primary"/>}
                      value={isEditing ? data.perdidas.merma.unidades : `${formatNumber(data.perdidas.merma.unidades)} Unid.`}
                      isEditing={isEditing}
                      valueId="perdidas.merma.unidades"
                      align="center"
                      unit="Unid."
                      onInputChange={onInputChange}
                  />
                  <DatoSimple 
                      icon={<Percent className="h-5 w-5 text-primary"/>}
                      value={isEditing ? data.perdidas.merma.porcentaje : formatPercentage(data.perdidas.merma.porcentaje)}
                      isEditing={isEditing}
                      valueId="perdidas.merma.porcentaje"
                      align="center"
                      unit="%"
                      onInputChange={onInputChange}
                  />
              </div>
          </KpiCard>
          
          <KpiCard title="V. Ipod" icon={<Smartphone className="h-5 w-5 text-primary" />} className="md:col-span-1">
              <DatoSimple value={isEditing ? data.operaciones.ventaIpod : formatNumber(data.operaciones.ventaIpod)} isEditing={isEditing} valueId="operaciones.ventaIpod" align="center" onInputChange={onInputChange}/>
          </KpiCard>

          <KpiCard title="E-Ticket" icon={<Ticket className="h-5 w-5 text-primary" />} className="md:col-span-1">
              <DatoSimple value={isEditing ? data.operaciones.eTicketPorc : formatPercentage(data.operaciones.eTicketPorc)} isEditing={isEditing} valueId="operaciones.eTicketPorc" align="center" onInputChange={onInputChange} unit="%" />
          </KpiCard>

          <KpiCard title="Caja" icon={<Receipt className="h-5 w-5 text-primary" />} className="md:col-span-4">
              <div className="grid grid-cols-3 gap-4">
                  <DatoSimple icon={<Clock />} label="Filas Caja" value={isEditing ? data.operaciones.filasCajaPorc : formatPercentage(data.operaciones.filasCajaPorc)} isEditing={isEditing} valueId="operaciones.filasCajaPorc" align="center" onInputChange={onInputChange} unit="%" />
                  <DatoSimple icon={<ScanLine />} label="ACO" value={isEditing ? data.operaciones.scoPorc : formatPercentage(data.operaciones.scoPorc)} isEditing={isEditing} valueId="operaciones.scoPorc" align="center" onInputChange={onInputChange} unit="%" />
                  <DatoSimple icon={<Inbox />} label="DropOff" value={isEditing ? data.operaciones.dropOffPorc : formatPercentage(data.operaciones.dropOffPorc)} isEditing={isEditing} valueId="operaciones.dropOffPorc" align="center" onInputChange={onInputChange} unit="%" />
              </div>
          </KpiCard>
          
          <KpiCard title="Operaciones" icon={<Package className="h-5 w-5 text-primary" />} className="md:col-span-2">
              <div className="grid grid-cols-2 gap-4">
                  <DatoSimple icon={<Package />} label="SINT" value={isEditing ? data.operaciones.sint : formatNumber(data.operaciones.sint)} isEditing={isEditing} valueId="operaciones.sint" align="center" onInputChange={onInputChange} />
                  <DatoSimple icon={<RefreshCw />} label="Repo" value={isEditing ? data.operaciones.repoPorc : formatPercentage(data.operaciones.repoPorc)} isEditing={isEditing} valueId="operaciones.repoPorc" align="center" onInputChange={onInputChange} unit="%" />
              </div>
          </KpiCard>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SectionCard name="woman" data={data.datosPorSeccion.woman} isEditing={isEditing} onInputChange={onInputChange} />
        <SectionCard name="man" data={data.datosPorSeccion.man} isEditing={isEditing} onInputChange={onInputChange} />
        <SectionCard name="nino" data={data.datosPorSeccion.nino} isEditing={isEditing} onInputChange={onInputChange} />
      </div>
    </div>
  );
}
