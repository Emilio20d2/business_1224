import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage, formatGap } from "@/lib/format";
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
  Footprints,
  SprayCan,
  Clock,
  Percent,
  Sparkles
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


type SectionName = keyof WeeklyData["datosPorSeccion"];

const WomanIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M12 5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3"/><path d="M18.37 13.57a6.03 6.03 0 0 0-1.3-4.57l-2.07-2.07a1 1 0 0 0-1.41 0l-2.07 2.07a6.03 6.03 0 0 0-1.3 4.57"/><path d="M6 21a2 2 0 0 0 2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2"/></svg>;
const ManIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M12 5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3"/><path d="M7 14a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v7h-4v-4h-2v4H7v-7Z"/></svg>;
const NinoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-primary"><path d="M12 6.5c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3"/><path d="m5.6 21.5 1.5-6a2 2 0 0 1 2-1.5h5.8a2 2 0 0 1 2 1.5l1.5 6"/><path d="M12 14v-2.5"/><path d="M10 16c.5 1.33 1 2 2 2s1.5-.67 2-2"/></svg>;
const RopaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-primary"><path d="m21.21 15.89-1.42-1.42a2 2 0 0 0-2.82 0L12 19.41l-5.96-5.96a2 2 0 0 0-2.82 0L1.79 15.89a2 2 0 0 0 0 2.82l1.42 1.42a2 2 0 0 0 2.82 0L12 14.2l5.96 5.96a2 2 0 0 0 2.82 0l1.42-1.42a2 2 0 0 0 0-2.82z"/><path d="M7.24 2.24 9 4l2.8-2.8L14 3l2.45-2.45L18.3 3 20 1.24 22 4l-1.8 1.8L22 7.64l-2.4-2.4-1.83 1.83L15.31 5l-2.46 2.46L10.4 5l-1.83 1.83-2.4-2.4L4.4 5.8 2.55 4l1.8-1.8L6 4l1.24-1.76z"/></svg>;


const sectionConfig = {
    woman: { title: "WOMAN", icon: <WomanIcon />, color: "bg-pink-500" },
    man: { title: "MAN", icon: <ManIcon />, color: "bg-blue-500" },
    nino: { title: "NIÑO", icon: <NinoIcon />, color: "bg-primary" },
};

const desgloseIconos: { [key: string]: React.ReactNode } = {
    "Ropa": <RopaIcon />,
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
                    <div className="bg-background rounded-lg p-3 text-center flex flex-col justify-center items-center gap-1">
                        <div className={cn("font-bold text-lg", data.metricasPrincipales.totalEuros < 0 && "text-red-600")}>{formatCurrency(data.metricasPrincipales.totalEuros)}</div>
                        <DatoSimple
                            value=""
                            variation={data.metricasPrincipales.varPorcEuros}
                            isEditing={isEditing}
                            alwaysShowVariation
                            align="center"
                            unit="%"
                            variationId={`datosPorSeccion.${name}.metricasPrincipales.varPorcEuros`}
                            onInputChange={onInputChange}
                        />
                    </div>
                     <div className="bg-background rounded-lg p-3 text-center flex flex-col justify-center items-center gap-1">
                         <DatoSimple 
                            value={data.metricasPrincipales.totalUnidades}
                            isEditing={isEditing}
                            valueId={`datosPorSeccion.${name}.metricasPrincipales.totalUnidades`}
                            onInputChange={onInputChange}
                            align="center"
                         />
                        <DatoSimple
                            value=""
                            variation={data.metricasPrincipales.varPorcUnidades}
                            isEditing={isEditing}
                            alwaysShowVariation
                            align="center"
                            unit="%"
                            variationId={`datosPorSeccion.${name}.metricasPrincipales.varPorcUnidades`}
                            onInputChange={onInputChange}
                        />
                    </div>
                </div>
                <Separator className="my-2" />
                <div className="flex flex-col gap-2 mt-2 text-sm">
                    {data.desglose.map((item, index) => (
                         <div key={index} className="grid grid-cols-[1fr_auto_auto] justify-between items-center gap-2">
                            <div className="flex items-center gap-2 text-left">
                                <div className="w-6 flex-shrink-0">
                                    {desgloseIconos[item.seccion] || <RopaIcon />}
                                </div>
                                <span>{item.seccion}</span>
                            </div>
                            
                            <div className="text-right">
                                {isEditing ? (
                                    <Input type="number" inputMode="decimal" defaultValue={item.totalEuros} onChange={(e) => handleDesgloseChange(index, 'totalEuros', e.target.value)} className="font-bold w-20 text-right" placeholder="€" />
                                ) : (
                                    <div className={cn("font-bold text-right", item.totalEuros < 0 && "text-red-600")}>{formatCurrency(item.totalEuros)}</div>
                                )}
                            </div>

                             <div className="w-20 flex justify-end">
                                <DatoSimple 
                                    value=""
                                    variation={item.varPorc} 
                                    isEditing={isEditing}
                                    alwaysShowVariation 
                                    align="right" 
                                    unit="%"
                                    variationId={`datosPorSeccion.${name}.desglose.${index}.varPorc`}
                                    onInputChange={onInputChange}
                                />
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
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
        {/* Ventas */}
        <KpiCard title="Ventas" icon={<Euro className="h-5 w-5 text-primary" />} className="md:col-span-3">
           <DatoDoble 
            label="Importes"
            value={formatCurrency(ventas.totalEuros)} 
            variation={ventas.varPorcEuros} 
            isEditing={isEditing}
            variationId="ventas.varPorcEuros"
            onInputChange={onInputChange}
          />
          <DatoDoble 
            label="Unidades"
            value={formatNumber(ventas.totalUnidades)}
            variation={ventas.varPorcUnidades} 
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
                      label={<Euro className="h-5 w-5 text-primary"/>}
                      value={isEditing ? perdidas.gap.euros : formatGap(perdidas.gap.euros)} 
                      isEditing={isEditing}
                      valueId="perdidas.gap.euros"
                      align="center"
                      onInputChange={onInputChange}
                  />
                  <DatoSimple 
                      label={<Package className="h-5 w-5 text-primary"/>}
                      value={isEditing ? perdidas.gap.unidades : formatGap(perdidas.gap.unidades)}
                      isEditing={isEditing}
                      valueId="perdidas.gap.unidades"
                      align="center"
                      onInputChange={onInputChange}
                  />
              </div>
          </KpiCard>

          <KpiCard title="Merma" icon={<Trash2 className="h-5 w-5 text-primary" />} className="md:col-span-2">
              <div className="flex flex-row justify-around items-center gap-4 h-full">
                  <DatoSimple 
                      label={<Package className="h-5 w-5 text-primary"/>}
                      value={isEditing ? perdidas.merma.unidades : formatNumber(perdidas.merma.unidades)}
                      isEditing={isEditing}
                      valueId="perdidas.merma.unidades"
                      align="center"
                      onInputChange={onInputChange}
                  />
                   <DatoSimple 
                      label={<Percent className="h-5 w-5 text-primary"/>}
                      value={isEditing ? perdidas.merma.porcentaje : formatPercentage(perdidas.merma.porcentaje)}
                      variation={perdidas.merma.varPorcPorcentaje}
                      isEditing={isEditing}
                      valueId="perdidas.merma.porcentaje"
                      variationId="perdidas.merma.varPorcPorcentaje"
                      align="center"
                      unit="%"
                      onInputChange={onInputChange}
                      trendDirection="down"
                  />
              </div>
          </KpiCard>
          
          <KpiCard title="Operaciones" icon={<RefreshCw className="h-5 w-5 text-primary" />} className="md:col-span-2 h-full">
              <div className="grid grid-cols-2 gap-4 h-full">
                   <DatoSimple 
                    label="Repo" 
                    value={formatPercentage(operaciones.repoPorc)} 
                    variation={operaciones.varPorcRepo}
                    isEditing={isEditing}
                    align="center" 
                    unit="%" 
                    icon={<RefreshCw className="h-5 w-5 text-primary"/>} 
                    trendDirection="down"
                  />
                  <DatoSimple 
                    label="Frescura" 
                    value={formatPercentage(operaciones.frescuraPorc)} 
                    variation={operaciones.varPorcFrescura}
                    isEditing={isEditing}
                    align="center" unit="%" 
                    icon={<Sparkles className="h-5 w-5 text-primary"/>} 
                  />
              </div>
          </KpiCard>


          <KpiCard title="Caja" icon={<Receipt className="h-5 w-5 text-primary" />} className="md:col-span-4">
              <div className="grid grid-cols-3 items-center justify-center gap-4 h-full">
                   <DatoSimple 
                    icon={<Clock className="h-5 w-5 text-primary"/>} 
                    label="Filas Caja" 
                    value={formatPercentage(operaciones.filasCajaPorc)}
                    variation={operaciones.varPorcFilasCaja}
                    isEditing={isEditing}
                    align="center" 
                    unit="%"
                    trendDirection="down"
                   />
                  <DatoSimple 
                    icon={<ScanLine className="h-5 w-5 text-primary"/>} 
                    label="ACO" 
                    value={formatPercentage(operaciones.scoPorc)}
                    variation={operaciones.varPorcSco}
                    isEditing={isEditing}
                    align="center" 
                    unit="%"
                  />
                  <DatoSimple 
                    icon={<Inbox className="h-5 w-5 text-primary"/>} 
                    label="DropOff" 
                    value={formatPercentage(operaciones.dropOffPorc)} 
                    variation={operaciones.varPorcDropOff}
                    isEditing={isEditing}
                    align="center" 
                    unit="%"
                  />
              </div>
          </KpiCard>
          
           <KpiCard title="V. Ipod" icon={<Smartphone className="h-5 w-5 text-primary" />} className="md:col-span-1">
              <DatoSimple 
                value={formatNumber(operaciones.ventaIpod)} 
                variation={operaciones.varPorcVentaIpod}
                isEditing={isEditing}
                align="center"
              />
          </KpiCard>

          <KpiCard title="E-Ticket" icon={<Ticket className="h-5 w-5 text-primary" />} className="md:col-span-1">
              <DatoSimple 
                value={formatPercentage(operaciones.eTicketPorc)} 
                variation={operaciones.varPorcETicket}
                isEditing={isEditing}
                align="center" 
                unit="%"
              />
          </KpiCard>

        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <SectionCard name="woman" data={datosPorSeccion.woman} isEditing={isEditing} onInputChange={onInputChange} />
        <SectionCard name="man" data={datosPorSeccion.man} isEditing={isEditing} onInputChange={onInputChange} />
        <SectionCard name="nino" data={datosPorSeccion.nino} isEditing={isEditing} onInputChange={onInputChange} />
      </div>
    </div>
  );
}
