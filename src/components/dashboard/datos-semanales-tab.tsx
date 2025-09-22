import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { KpiCard, DatoDoble, DatoSimple } from "./kpi-card";
import { 
  Euro, 
  ChartLine, 
  Receipt,
  Warehouse,
  ClipboardX,
  Trash2,
  Shirt,
  Footprints,
  SprayCan,
  Truck,
  PackageCheck,
  Package,
  Clock,
  Smartphone,
  Ticket,
  ScanLine,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type DatosSemanalesTabProps = {
  data: WeeklyData;
  isEditing: boolean;
};

const formatGap = (value: number, unit: '€' | 'Unid.') => {
    const sign = value > 0 ? '+' : '';
    const formattedValue = new Intl.NumberFormat('es-ES').format(value);
    return `${sign}${formattedValue}${unit}`;
}

const ModuloAlmacen = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={cn("flex flex-col text-center gap-2", className)}>
        <h4 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">{title}</h4>
        <div className="flex flex-col gap-3">
            {children}
        </div>
    </div>
);

const ModuloContenidoGrande = ({ icon, value, isEditing, id }: { icon: React.ReactNode, value: string | number, isEditing?: boolean, id?:string }) => (
    <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background h-full">
       <div className="text-primary">{icon}</div>
       {isEditing ? 
        <Input type="number" defaultValue={String(value).replace(/[^0-9]/g, '')} className="text-3xl font-bold w-32 text-center" id={id} />
        : <strong className="text-3xl font-bold">{value}</strong>
       }
    </div>
);

const FilaModulo = ({ icon, label, value, isEditing, id }: { icon: React.ReactNode, label: string, value: string | number, isEditing?: boolean, id?: string }) => (
     <div className="flex items-center justify-between gap-4 text-md w-40">
        <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <span>{label}</span>
        </div>
         {isEditing ? 
            <Input type="number" defaultValue={String(value).replace(/[^0-9]/g, '')} className="font-bold text-right w-20" id={id} />
            : <strong className="font-bold text-right">{value}</strong>
        }
    </div>
)

export function DatosSemanalesTab({ data, isEditing }: DatosSemanalesTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
      {/* Ventas */}
      <KpiCard title="Ventas" icon={<Euro className="h-5 w-5 text-primary" />} className="md:col-span-3">
        <DatoDoble 
          value={formatCurrency(data.ventas.totalEuros)} 
          variation={data.ventas.varPorcEuros} 
          isEditing={isEditing}
          valueId="ventas-total-euros"
          variationId="ventas-var-euros"
        />
        <DatoDoble 
          value={formatNumber(data.ventas.totalUnidades)}
          unit=" Unid."
          variation={data.ventas.varPorcUnidades} 
          isEditing={isEditing}
          valueId="ventas-total-unidades"
          variationId="ventas-var-unidades"
        />
      </KpiCard>

      {/* Rendimiento de Tienda */}
      <KpiCard title="Rendimiento de Tienda" icon={<ChartLine className="h-5 w-5 text-primary" />} className="md:col-span-3">
         <DatoDoble 
          label="Tráfico" 
          value={formatNumber(data.rendimientoTienda.trafico)} 
          variation={data.rendimientoTienda.varPorcTrafico}
          isEditing={isEditing}
          valueId="rendimiento-trafico"
          variationId="rendimiento-var-trafico"
        />
        <DatoDoble 
          label="Conversión" 
          value={formatPercentage(data.rendimientoTienda.conversion)} 
          variation={data.rendimientoTienda.varPorcConversion}
          isEditing={isEditing}
          valueId="rendimiento-conversion"
          variationId="rendimiento-var-conversion"
        />
      </KpiCard>
      
      {/* Fila Central: 5x2 Grid */}
      <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-5 gap-2">
        <KpiCard title="GAP" icon={<ClipboardX className="h-5 w-5 text-destructive" />} className="md:col-span-2">
             <div className="flex flex-row justify-center items-center gap-4">
                <DatoSimple 
                    value={`${formatGap(data.perdidas.gap.euros, '€')}`} 
                    isEditing={isEditing}
                    valueId="perdidas-gap-euros"
                    align="center"
                />
                <DatoSimple 
                    value={`${formatGap(data.perdidas.gap.unidades, 'Unid.')}`} 
                    isEditing={isEditing}
                    valueId="perdidas-gap-unidades"
                    align="center"
                />
            </div>
        </KpiCard>

        <KpiCard title="Merma" icon={<Trash2 className="h-5 w-5 text-destructive" />} className="md:col-span-2">
            <div className="flex flex-row justify-center items-center gap-4">
                <DatoSimple 
                    value={`${formatNumber(data.perdidas.merma.unidades)} Unid.`}
                    isEditing={isEditing}
                    valueId="perdidas-merma-unidades"
                    align="center"
                />
                <DatoSimple 
                    value={formatPercentage(data.perdidas.merma.porcentaje)}
                    isEditing={isEditing}
                    valueId="perdidas-merma-porcentaje"
                    align="center"
                />
            </div>
        </KpiCard>
        
        <KpiCard title="V. Ipod" icon={<Smartphone className="h-5 w-5 text-primary" />}>
            <DatoSimple value={formatNumber(data.operaciones.ventaIpod)} isEditing={isEditing} valueId="op-vipod" align="center"/>
        </KpiCard>

        <KpiCard title="Caja" icon={<Receipt className="h-5 w-5 text-primary" />} className="md:col-span-2">
            <div className="grid grid-cols-2 gap-4">
                <DatoSimple icon={<Clock />} label="Filas Caja" value={`${formatPercentage(data.operaciones.filasCajaPorc)}`} isEditing={isEditing} valueId="op-filas-caja" align="center" />
                <DatoSimple icon={<ScanLine />} label="ACO" value={`${formatPercentage(data.operaciones.scoPorc)}`} isEditing={isEditing} valueId="op-sco" align="center" />
            </div>
        </KpiCard>
        
        <KpiCard title="Operaciones" icon={<Package className="h-5 w-5 text-primary" />} className="md:col-span-2">
            <div className="grid grid-cols-2 gap-4">
                <DatoSimple icon={<Package />} label="SINT" value={formatNumber(data.operaciones.sint)} isEditing={isEditing} valueId="op-sint" align="center" />
                <DatoSimple icon={<RefreshCw />} label="Repo" value={`${formatPercentage(data.operaciones.repoPorc)}`} isEditing={isEditing} valueId="op-repo" align="center" />
            </div>
        </KpiCard>
        
        <KpiCard title="E-Ticket" icon={<Ticket className="h-5 w-5 text-primary" />}>
            <DatoSimple value={`${formatPercentage(data.operaciones.eTicketPorc)}`} isEditing={isEditing} valueId="op-eticket" align="center" />
        </KpiCard>
      </div>


       {/* Gestión de Almacén y Logística */}
      <KpiCard title="Gestión de Almacén y Logística" icon={<Warehouse className="h-5 w-5 text-primary" />} className="md:col-span-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1.5fr] gap-6 place-items-center">
          <ModuloAlmacen title="Entradas">
            <ModuloContenidoGrande icon={<Truck className="h-8 w-8"/>} value={formatNumber(data.logistica.entradasSemanales)} isEditing={isEditing} id="logistica-entradas" />
          </ModuloAlmacen>
          <ModuloAlmacen title="Salidas">
            <ModuloContenidoGrande icon={<PackageCheck className="h-8 w-8"/>} value={formatNumber(data.logistica.salidasSemanales)} isEditing={isEditing} id="logistica-salidas" />
          </ModuloAlmacen>
          <ModuloAlmacen title="Ocupación">
            <FilaModulo icon={<Shirt className="h-5 w-5"/>} label="Ropa" value={formatPercentage(data.almacenes.ropa.ocupacionPorc)} isEditing={isEditing} id="almacen-ropa-ocupacion" />
            <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={formatPercentage(data.almacenes.calzado.ocupacionPorc)} isEditing={isEditing} id="almacen-calzado-ocupacion" />
            <FilaModulo icon={<SprayCan className="h-5 w-5"/>} label="Perfumería" value={formatPercentage(data.almacenes.perfumeria.ocupacionPorc)} isEditing={isEditing} id="almacen-perfumeria-ocupacion" />
          </ModuloAlmacen>
          <ModuloAlmacen title="Propuesta Devo." className="justify-start">
             <FilaModulo icon={<Shirt className="h-5 w-5"/>} label="Ropa" value={formatNumber(data.almacenes.ropa.devolucionUnidades)} isEditing={isEditing} id="almacen-ropa-devolucion" />
             <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={formatNumber(data.almacenes.calzado.devolucionUnidades)} isEditing={isEditing} id="almacen-calzado-devolucion" />
          </ModuloAlmacen>
        </div>
      </KpiCard>
    </div>
  );
}
