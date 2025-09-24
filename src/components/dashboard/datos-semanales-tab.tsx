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
  User,
  Footprints,
  SprayCan,
  Clock,
  Percent,
  Sparkles,
  Shirt,
  Baby
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type DatosSemanalesTabProps = {
  ventas: WeeklyData['ventas'];
  rendimientoTienda: WeeklyData['rendimientoTienda'];
  operaciones: WeeklyData['operaciones'];
  perdidas: WeeklyData['perdidas'];
  datosPorSeccion: WeeklyData['datosPorSeccion'];
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
    woman: { title: "WOMAN", icon: <Shirt className="h-5 w-5 text-primary" />, color: "bg-pink-500" },
    man: { title: "MAN", icon: <User className="h-5 w-5 text-primary" />, color: "bg-blue-500" },
    nino: { title: "NIÑO", icon: <Baby className="h-5 w-5 text-primary" />, color: "bg-primary" },
};

const desgloseIconos: { [key: string]: React.ReactNode } = {
    "Ropa": <User className="h-4 w-4 text-primary" />,
    "Calzado": <Footprints className="h-4 w-4 text-primary" />,
    "Perfumería": <SprayCan className="h-4 w-4 text-primary" />
};

const SectionCard = ({ name, data, isEditing, onInputChange }: { name: SectionName, data: WeeklyData["datosPorSeccion"][SectionName], isEditing: boolean, onInputChange: DatosSemanalesTabProps['onInputChange'] }) => {
    if (!data) return null;
    const config = sectionConfig[name];

    const handleDesgloseChange = (index: number, field: string, value: string) => {
        onInputChange(`datosPorSeccion.${name}.desglose.${index}.${field}`, value);
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
                    <div className="bg-background rounded-lg p-2 text-center">
                        <div className={cn("font-bold text-lg", data.metricasPrincipales.totalEuros < 0 && "text-red-600")}>{formatCurrency(data.metricasPrincipales.totalEuros)}</div>
                        <TrendIndicator value={data.metricasPrincipales.varPorcEuros} />
                    </div>
                    <div className="bg-background rounded-lg p-2 text-center">
                        <div className={cn("font-bold text-lg", data.metricasPrincipales.totalUnidades < 0 && "text-red-600")}>{formatNumber(data.metricasPrincipales.totalUnidades)}</div>
                        <TrendIndicator value={data.metricasPrincipales.varPorcUnidades} />
                    </div>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-2 mt-2 text-sm">
                    {data.desglose.map((item, index) => (
                         <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-6 flex-shrink-0">
                                    {desgloseIconos[item.seccion] || <User className="h-4 w-4 text-muted-foreground" />}
                                </div>
                                {isEditing ? (
                                    <Input type="number" inputMode="decimal" defaultValue={item.totalEuros} onChange={(e) => handleDesgloseChange(index, 'totalEuros', e.target.value)} className="font-bold w-24" />
                                ) : (
                                    <div className={cn("font-bold", item.totalEuros < 0 && "text-red-600")}>{formatCurrency(item.totalEuros)}</div>
                                )}
                            </div>
                            <div>
                                <TrendIndicator value={item.varPorc} />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};


export function DatosSemanalesTab({ ventas, rendimientoTienda, operaciones, perdidas, datosPorSeccion, isEditing, onInputChange }: DatosSemanalesTabProps) {
  
  if (!ventas || !rendimientoTienda || !operaciones || !perdidas || !datosPorSeccion) return <p>Cargando datos...</p>;
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        {/* Ventas */}
        <KpiCard title="Ventas" icon={<Euro className="h-5 w-5 text-primary" />} className="md:col-span-3">
           <DatoDoble 
            label="Importes"
            value={formatCurrency(ventas.totalEuros)} 
            variation={ventas.varPorcEuros} 
            isEditing={false}
          />
          <DatoDoble 
            label="Unidades"
            value={formatNumber(ventas.totalUnidades)}
            variation={ventas.varPorcUnidades} 
            isEditing={false}
          />
        </KpiCard>

        {/* Rendimiento de Tienda */}
        <KpiCard title="Rendimiento de Tienda" icon={<ChartLine className="h-5 w-5 text-primary" />} className="md:col-span-3">
          <DatoDoble 
            label="Tráfico" 
            value={formatNumber(rendimientoTienda.trafico)} 
            variation={rendimientoTienda.varPorcTrafico}
            isEditing={isEditing}
            valueId="rendimientoTienda.trafico"
            variationId="rendimientoTienda.varPorcTrafico"
            onInputChange={onInputChange}
          />
          <DatoDoble 
            label="Conversión" 
            value={formatPercentage(rendimientoTienda.conversion)} 
            variation={rendimientoTienda.varPorcConversion}
            isEditing={isEditing}
            valueId="rendimientoTienda.conversion"
            variationId="rendimientoTienda.varPorcConversion"
            onInputChange={onInputChange}
          />
        </KpiCard>
        
        {/* Fila Central: 6-col Grid */}
        <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-6 gap-2">
          <KpiCard title="GAP" icon={<ClipboardX className="h-5 w-5 text-primary" />} className="md:col-span-2">
              <div className="flex flex-row justify-around items-center gap-4 h-full">
                  <DatoSimple 
                      icon={<Euro className="h-5 w-5 text-primary"/>}
                      value={isEditing ? perdidas.gap.euros : formatGap(perdidas.gap.euros, '€')} 
                      isEditing={isEditing}
                      valueId="perdidas.gap.euros"
                      align="center"
                      unit="€"
                      onInputChange={onInputChange}
                  />
                  <DatoSimple 
                      icon={<Package className="h-5 w-5 text-primary"/>}
                      value={isEditing ? perdidas.gap.unidades : formatGap(perdidas.gap.unidades, 'Unid.')}
                      isEditing={isEditing}
                      valueId="perdidas.gap.unidades"
                      align="center"
                      unit="Unid."
                      onInputChange={onInputChange}
                  />
              </div>
          </KpiCard>

          <KpiCard title="Merma" icon={<Trash2 className="h-5 w-5 text-primary" />} className="md:col-span-2">
              <div className="flex flex-row justify-around items-center gap-4 h-full">
                  <DatoSimple 
                      icon={<Package className="h-5 w-5 text-primary"/>}
                      value={isEditing ? perdidas.merma.unidades : `${formatNumber(perdidas.merma.unidades)} Unid.`}
                      isEditing={isEditing}
                      valueId="perdidas.merma.unidades"
                      align="center"
                      unit="Unid."
                      onInputChange={onInputChange}
                  />
                  <DatoSimple 
                      icon={<Percent className="h-5 w-5 text-primary"/>}
                      value={isEditing ? perdidas.merma.porcentaje : formatPercentage(perdidas.merma.porcentaje)}
                      isEditing={isEditing}
                      valueId="perdidas.merma.porcentaje"
                      align="center"
                      unit="%"
                      onInputChange={onInputChange}
                  />
              </div>
          </KpiCard>
          
          <KpiCard title="Operaciones" icon={<RefreshCw className="h-5 w-5 text-primary" />} className="md:col-span-2 h-full">
              <div className="grid grid-cols-2 gap-4 h-full">
                  <DatoSimple label="Repo" value={isEditing ? operaciones.repoPorc : formatPercentage(operaciones.repoPorc)} isEditing={isEditing} valueId="operaciones.repoPorc" align="center" unit="%" icon={<RefreshCw className="h-5 w-5 text-primary"/>} />
                  <DatoSimple label="Frescura" value={isEditing ? operaciones.frescuraPorc : formatPercentage(operaciones.frescuraPorc)} isEditing={isEditing} valueId="operaciones.frescuraPorc" align="center" unit="%" icon={<Sparkles className="h-5 w-5 text-primary"/>} onInputChange={onInputChange} />
              </div>
          </KpiCard>


          <KpiCard title="Caja" icon={<Receipt className="h-5 w-5 text-primary" />} className="md:col-span-4">
              <div className="grid grid-cols-3 items-center justify-center gap-4 h-full">
                  <DatoSimple icon={<Clock className="h-5 w-5 text-primary"/>} label="Filas Caja" value={formatPercentage(operaciones.filasCajaPorc)} isEditing={false} valueId="operaciones.filasCajaPorc" align="center" unit="%" />
                  <DatoSimple icon={<ScanLine className="h-5 w-5 text-primary"/>} label="ACO" value={formatPercentage(operaciones.scoPorc)} isEditing={false} valueId="operaciones.scoPorc" align="center" unit="%" />
                  <DatoSimple icon={<Inbox className="h-5 w-5 text-primary"/>} label="DropOff" value={formatPercentage(operaciones.dropOffPorc)} isEditing={false} valueId="operaciones.dropOffPorc" align="center" unit="%" />
              </div>
          </KpiCard>
          
          <KpiCard title="V. Ipod" icon={<Smartphone className="h-5 w-5 text-primary" />} className="md:col-span-1">
              <DatoSimple value={formatNumber(operaciones.ventaIpod)} isEditing={false} valueId="operaciones.ventaIpod" align="center" />
          </KpiCard>

          <KpiCard title="E-Ticket" icon={<Ticket className="h-5 w-5 text-primary" />} className="md:col-span-1">
              <DatoSimple value={formatPercentage(operaciones.eTicketPorc)} isEditing={false} valueId="operaciones.eTicketPorc" align="center" unit="%" />
          </KpiCard>

        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SectionCard name="woman" data={datosPorSeccion.woman} isEditing={isEditing} onInputChange={onInputChange} />
        <SectionCard name="man" data={datosPorSeccion.man} isEditing={isEditing} onInputChange={onInputChange} />
        <SectionCard name="nino" data={datosPorSeccion.nino} isEditing={isEditing} onInputChange={onInputChange} />
      </div>
    </div>
  );
}
