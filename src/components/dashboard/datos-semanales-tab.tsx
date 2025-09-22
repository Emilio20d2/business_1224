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

const ModuloContenidoGrande = ({ icon, value, isEditing, id, onInputChange }: { icon: React.ReactNode, value: string | number, isEditing?: boolean, id?:string, onInputChange?: (path: string, value: string) => void; }) => (
    <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background h-full">
       <div className="text-primary">{icon}</div>
       {isEditing && id && onInputChange ? 
        <Input type="number" defaultValue={String(value).replace(/[^0-9-]/g, '')} className="text-3xl font-bold w-32 text-center" id={id} onChange={(e) => onInputChange(id, e.target.value)} />
        : <strong className="text-3xl font-bold">{value}</strong>
       }
    </div>
);

const FilaModulo = ({ icon, label, value, isEditing, id, onInputChange }: { icon: React.ReactNode, label: string, value: string | number, isEditing?: boolean, id?: string, onInputChange?: (path: string, value: string) => void; }) => (
     <div className="flex items-center justify-between gap-4 text-md w-40">
        <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <span>{label}</span>
        </div>
         {isEditing && id && onInputChange ? 
            <Input type="number" defaultValue={String(value).replace(/[^0-9-]/g, '')} className="font-bold text-right w-20" id={id} onChange={(e) => onInputChange(id, e.target.value)} />
            : <strong className="font-bold text-right">{value}</strong>
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
      
      {/* Fila Central: 5x2 Grid */}
      <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-5 gap-2">
        <KpiCard title="GAP" icon={<ClipboardX className="h-5 w-5 text-destructive" />} className="md:col-span-2">
             <div className="flex flex-row justify-center items-center gap-4">
                <DatoSimple 
                    value={`${formatGap(data.perdidas.gap.euros, '€')}`} 
                    isEditing={isEditing}
                    valueId="perdidas.gap.euros"
                    align="center"
                    onInputChange={onInputChange}
                />
                <DatoSimple 
                    value={`${formatGap(data.perdidas.gap.unidades, 'Unid.')}`} 
                    isEditing={isEditing}
                    valueId="perdidas.gap.unidades"
                    align="center"
                    onInputChange={onInputChange}
                />
            </div>
        </KpiCard>

        <KpiCard title="Merma" icon={<Trash2 className="h-5 w-5 text-destructive" />} className="md:col-span-2">
            <div className="flex flex-row justify-center items-center gap-4">
                <DatoSimple 
                    value={`${formatNumber(data.perdidas.merma.unidades)} Unid.`}
                    isEditing={isEditing}
                    valueId="perdidas.merma.unidades"
                    align="center"
                    onInputChange={onInputChange}
                />
                <DatoSimple 
                    value={formatPercentage(data.perdidas.merma.porcentaje)}
                    isEditing={isEditing}
                    valueId="perdidas.merma.porcentaje"
                    align="center"
                    onInputChange={onInputChange}
                />
            </div>
        </KpiCard>
        
        <KpiCard title="V. Ipod" icon={<Smartphone className="h-5 w-5 text-primary" />}>
            <DatoSimple value={formatNumber(data.operaciones.ventaIpod)} isEditing={isEditing} valueId="operaciones.ventaIpod" align="center" onInputChange={onInputChange}/>
        </KpiCard>

        <KpiCard title="Caja" icon={<Receipt className="h-5 w-5 text-primary" />} className="md:col-span-2">
            <div className="grid grid-cols-2 gap-4">
                <DatoSimple icon={<Clock />} label="Filas Caja" value={`${formatPercentage(data.operaciones.filasCajaPorc)}`} isEditing={isEditing} valueId="operaciones.filasCajaPorc" align="center" onInputChange={onInputChange} />
                <DatoSimple icon={<ScanLine />} label="ACO" value={`${formatPercentage(data.operaciones.scoPorc)}`} isEditing={isEditing} valueId="operaciones.scoPorc" align="center" onInputChange={onInputChange} />
            </div>
        </KpiCard>
        
        <KpiCard title="Operaciones" icon={<Package className="h-5 w-5 text-primary" />} className="md:col-span-2">
            <div className="grid grid-cols-2 gap-4">
                <DatoSimple icon={<Package />} label="SINT" value={formatNumber(data.operaciones.sint)} isEditing={isEditing} valueId="operaciones.sint" align="center" onInputChange={onInputChange} />
                <DatoSimple icon={<RefreshCw />} label="Repo" value={`${formatPercentage(data.operaciones.repoPorc)}`} isEditing={isEditing} valueId="operaciones.repoPorc" align="center" onInputChange={onInputChange} />
            </div>
        </KpiCard>
        
        <KpiCard title="E-Ticket" icon={<Ticket className="h-5 w-5 text-primary" />}>
            <DatoSimple value={`${formatPercentage(data.operaciones.eTicketPorc)}`} isEditing={isEditing} valueId="operaciones.eTicketPorc" align="center" onInputChange={onInputChange} />
        </KpiCard>
      </div>


       {/* Gestión de Almacén y Logística */}
      <KpiCard title="Gestión de Almacén y Logística" icon={<Warehouse className="h-5 w-5 text-primary" />} className="md:col-span-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1.5fr] gap-6 place-items-center">
          <ModuloAlmacen title="Entradas">
            <ModuloContenidoGrande icon={<Truck className="h-8 w-8"/>} value={formatNumber(data.logistica.entradasSemanales)} isEditing={isEditing} id="logistica.entradasSemanales" onInputChange={onInputChange} />
          </ModuloAlmacen>
          <ModuloAlmacen title="Salidas">
            <ModuloContenidoGrande icon={<PackageCheck className="h-8 w-8"/>} value={formatNumber(data.logistica.salidasSemanales)} isEditing={isEditing} id="logistica.salidasSemanales" onInputChange={onInputChange} />
          </ModuloAlmacen>
          <ModuloAlmacen title="Ocupación">
            <FilaModulo icon={<Shirt className="h-5 w-5"/>} label="Ropa" value={formatPercentage(data.almacenes.ropa.ocupacionPorc)} isEditing={isEditing} id="almacenes.ropa.ocupacionPorc" onInputChange={onInputChange} />
            <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={formatPercentage(data.almacenes.calzado.ocupacionPorc)} isEditing={isEditing} id="almacenes.calzado.ocupacionPorc" onInputChange={onInputChange} />
            <FilaModulo icon={<SprayCan className="h-5 w-5"/>} label="Perfumería" value={formatPercentage(data.almacenes.perfumeria.ocupacionPorc)} isEditing={isEditing} id="almacenes.perfumeria.ocupacionPorc" onInputChange={onInputChange} />
          </ModuloAlmacen>
          <ModuloAlmacen title="Propuesta Devo." className="justify-start">
             <FilaModulo icon={<Shirt className="h-5 w-5"/>} label="Ropa" value={formatNumber(data.almacenes.ropa.devolucionUnidades)} isEditing={isEditing} id="almacenes.ropa.devolucionUnidades" onInputChange={onInputChange} />
             <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={formatNumber(data.almacenes.calzado.devolucionUnidades)} isEditing={isEditing} id="almacenes.calzado.devolucionUnidades" onInputChange={onInputChange} />
          </ModuloAlmacen>
        </div>
      </KpiCard>
    </div>
  );
}

    