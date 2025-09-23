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
  RefreshCw,
  Inbox
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

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

const ModuloAlmacen = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={cn("flex flex-col text-center gap-2", className)}>
        <h4 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">{title}</h4>
        <div className="flex flex-col gap-3">
            {children}
        </div>
    </div>
);

const ModuloContenidoGrande = ({ icon, value, isEditing, id, onInputChange }: { icon: React.ReactNode, value: number, isEditing?: boolean, id?:string, onInputChange?: (path: string, value: string) => void; }) => (
    <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background h-full">
       <div className="text-primary">{icon}</div>
       {isEditing && id && onInputChange ? 
        <DatoSimple value={value} isEditing={isEditing} valueId={id} onInputChange={onInputChange} align="center"/>
        : <strong className="text-3xl font-bold">{formatNumber(value)}</strong>
       }
    </div>
);

const FilaModulo = ({ icon, label, value, isEditing, id, onInputChange, unit }: { icon: React.ReactNode, label: string, value: number, isEditing?: boolean, id?: string, onInputChange?: (path: string, value: string) => void; unit: string }) => (
     <div className="flex items-center justify-between gap-4 text-md w-40">
        <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <span>{label}</span>
        </div>
         {isEditing && id && onInputChange ? 
            <div className="flex items-center gap-1">
                <Input type="number" inputMode="decimal" defaultValue={value} className="font-bold text-right w-20" id={id} onChange={(e) => onInputChange(id, e.target.value)} />
                <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
            : <div className="font-bold text-right w-14">{unit === '%' ? formatPercentage(value) : formatNumber(value)}</div>
        }
    </div>
)

export function DatosSemanalesTab({ data, isEditing, onInputChange }: DatosSemanalesTabProps) {
  return (
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
        <KpiCard title="GAP" icon={<ClipboardX className="h-5 w-5 text-destructive" />} className="md:col-span-2">
             <div className="flex flex-row justify-center items-center gap-4">
                <DatoSimple 
                    value={isEditing ? data.perdidas.gap.euros : formatGap(data.perdidas.gap.euros, '€')} 
                    isEditing={isEditing}
                    valueId="perdidas.gap.euros"
                    align="center"
                    unit="€"
                    onInputChange={onInputChange}
                />
                <DatoSimple 
                    value={isEditing ? data.perdidas.gap.unidades : formatGap(data.perdidas.gap.unidades, 'Unid.')}
                    isEditing={isEditing}
                    valueId="perdidas.gap.unidades"
                    align="center"
                    unit="Unid."
                    onInputChange={onInputChange}
                />
            </div>
        </KpiCard>

        <KpiCard title="Merma" icon={<Trash2 className="h-5 w-5 text-destructive" />} className="md:col-span-2">
            <div className="flex flex-row justify-center items-center gap-4">
                <DatoSimple 
                    value={isEditing ? data.perdidas.merma.unidades : `${formatNumber(data.perdidas.merma.unidades)} Unid.`}
                    isEditing={isEditing}
                    valueId="perdidas.merma.unidades"
                    align="center"
                    unit="Unid."
                    onInputChange={onInputChange}
                />
                <DatoSimple 
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


       {/* Gestión de Almacén y Logística */}
      <KpiCard title="Gestión de Almacén y Logística" icon={<Warehouse className="h-5 w-5 text-primary" />} className="md:col-span-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1.5fr] gap-6 place-items-start">
          <ModuloAlmacen title="Entradas">
            <ModuloContenidoGrande icon={<Truck className="h-8 w-8"/>} value={data.logistica.entradasSemanales} isEditing={isEditing} id="logistica.entradasSemanales" onInputChange={onInputChange} />
          </ModuloAlmacen>
          <ModuloAlmacen title="Salidas">
            <ModuloContenidoGrande icon={<PackageCheck className="h-8 w-8"/>} value={data.logistica.salidasSemanales} isEditing={isEditing} id="logistica.salidasSemanales" onInputChange={onInputChange} />
          </ModuloAlmacen>
          <ModuloAlmacen title="Ocupación">
            <FilaModulo icon={<Shirt className="h-5 w-5"/>} label="Ropa" value={data.almacenes.ropa.ocupacionPorc} isEditing={isEditing} id="almacenes.ropa.ocupacionPorc" onInputChange={onInputChange} unit="%" />
            <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={data.almacenes.calzado.ocupacionPorc} isEditing={isEditing} id="almacenes.calzado.ocupacionPorc" onInputChange={onInputChange} unit="%" />
            <FilaModulo icon={<SprayCan className="h-5 w-5"/>} label="Perfumería" value={data.almacenes.perfumeria.ocupacionPorc} isEditing={isEditing} id="almacenes.perfumeria.ocupacionPorc" onInputChange={onInputChange} unit="%" />
          </ModuloAlmacen>
          <ModuloAlmacen title="Propuesta Devo." className="justify-start">
             <FilaModulo icon={<Shirt className="h-5 w-5"/>} label="Ropa" value={data.almacenes.ropa.devolucionUnidades as number} isEditing={isEditing} id="almacenes.ropa.devolucionUnidades" onInputChange={onInputChange} unit="Unid."/>
             <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={data.almacenes.calzado.devolucionUnidades as number} isEditing={isEditing} id="almacenes.calzado.devolucionUnidades" onInputChange={onInputChange} unit="Unid."/>
          </ModuloAlmacen>
        </div>
      </KpiCard>
    </div>
  );
}
