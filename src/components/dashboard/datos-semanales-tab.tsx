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
  Server,
  CaseUpper,
  Clock,
  Smartphone,
  Ticket,
  ScanLine,
  RefreshCw
} from "lucide-react";

type DatosSemanalesTabProps = {
  data: WeeklyData;
  isEditing: boolean;
};

const formatGap = (value: number, unit: '€' | 'Unid.') => {
    const sign = value > 0 ? '+' : '';
    const formattedValue = new Intl.NumberFormat('es-ES').format(value);
    return `${sign}${formattedValue}${unit}`;
}

const ModuloAlmacen = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="flex flex-col text-center gap-2">
        <h4 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">{title}</h4>
        <div className="flex flex-col gap-3">
            {children}
        </div>
    </div>
);

const ModuloContenidoGrande = ({ icon, value }: { icon: React.ReactNode, value: string | number }) => (
    <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background h-full">
       <div className="text-primary">{icon}</div>
        <strong className="text-3xl font-bold">{value}</strong>
    </div>
);

const FilaModulo = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string | number }) => (
     <div className="flex items-center justify-between gap-4 text-md w-40">
        <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <span>{label}</span>
        </div>
        <strong className="font-bold text-right">{value}</strong>
    </div>
)

export function DatosSemanalesTab({ data, isEditing }: DatosSemanalesTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
      {/* Ventas */}
      <KpiCard title="Ventas" icon={<Euro className="h-5 w-5 text-primary" />} className="md:col-span-3">
        <DatoDoble 
          value={formatCurrency(data.ventas.totalEuros)} 
          variation={data.ventas.varPorcEuros} 
          isEditing={isEditing}
          valueId="input-ventas-euros"
        />
        <DatoDoble 
          value={formatNumber(data.ventas.totalUnidades)}
          unit=" Unid."
          variation={data.ventas.varPorcUnidades} 
          isEditing={isEditing}
          valueId="input-ventas-unid"
        />
      </KpiCard>

      {/* Rendimiento de Tienda */}
      <KpiCard title="Rendimiento de Tienda" icon={<ChartLine className="h-5 w-5 text-primary" />} className="md:col-span-3">
         <DatoDoble 
          label="Tráfico" 
          value={formatNumber(data.rendimientoTienda.trafico)} 
          variation={data.rendimientoTienda.varPorcTrafico}
          isEditing={isEditing}
          valueId="input-rendimiento-trafico"
        />
        <DatoDoble 
          label="Conversión" 
          value={formatPercentage(data.rendimientoTienda.conversion)} 
          variation={data.rendimientoTienda.varPorcConversion}
          isEditing={isEditing}
          valueId="input-rendimiento-conv"
        />
      </KpiCard>
      
       {/* Fila Central: 3x2 Grid */}
      <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="Caja" icon={<Receipt className="h-5 w-5 text-primary" />}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <DatoSimple icon={<Clock />} label="Filas Caja" value={`${formatPercentage(data.operaciones.filasCajaPorc)}`} isEditing={isEditing} valueId="input-op-filas-caja" />
                <DatoSimple icon={<ScanLine />} label="ACO" value={`${formatPercentage(data.operaciones.scoPorc)}`} isEditing={isEditing} valueId="input-op-sco" />
            </div>
        </KpiCard>
        
        <KpiCard title="GAP" icon={<ClipboardX className="h-5 w-5 text-destructive" />}>
          <DatoSimple 
              value={`${formatGap(data.perdidas.gap.euros, '€')} / ${formatGap(data.perdidas.gap.unidades, 'Unid.')}`} 
              isEditing={isEditing}
              valueId="input-perdidas-gap"
              align="center"
          />
        </KpiCard>

        <KpiCard title="Merma" icon={<Trash2 className="h-5 w-5 text-destructive" />}>
          <DatoSimple 
              value={`${formatNumber(data.perdidas.merma.unidades)} Unid. (${formatPercentage(data.perdidas.merma.porcentaje)})`}
              isEditing={isEditing}
              valueId="input-perdidas-merma"
              align="center"
          />
        </KpiCard>

        <KpiCard title="V. Ipod" icon={<Smartphone className="h-5 w-5 text-primary" />}>
            <DatoSimple value={formatNumber(data.operaciones.ventaIpod)} isEditing={isEditing} valueId="input-op-vipod" align="center"/>
        </KpiCard>

        <KpiCard title="E-Ticket" icon={<Ticket className="h-5 w-5 text-primary" />}>
            <DatoSimple value={`${formatPercentage(data.operaciones.eTicketPorc)}`} isEditing={isEditing} valueId="input-op-eticket" align="center" />
        </KpiCard>

        <KpiCard title="Operaciones" icon={<Server className="h-5 w-5 text-primary" />}>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                <DatoSimple icon={<CaseUpper />} label="SINT" value={formatNumber(data.operaciones.sint)} isEditing={isEditing} valueId="input-op-sint" />
                <DatoSimple icon={<RefreshCw />} label="Repo" value={`${formatPercentage(data.operaciones.repoPorc)}`} isEditing={isEditing} valueId="input-op-repo" />
            </div>
        </KpiCard>
      </div>


       {/* Gestión de Almacén y Logística */}
      <KpiCard title="Gestión de Almacén y Logística" icon={<Warehouse className="h-5 w-5 text-primary" />} className="md:col-span-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 place-items-center">
          <ModuloAlmacen title="Entradas">
            <ModuloContenidoGrande icon={<Truck className="h-8 w-8"/>} value={formatNumber(data.logistica.entradasSemanales)} />
          </ModuloAlmacen>
          <ModuloAlmacen title="Salidas">
            <ModuloContenidoGrande icon={<PackageCheck className="h-8 w-8"/>} value={formatNumber(data.logistica.salidasSemanales)} />
          </ModuloAlmacen>
          <ModuloAlmacen title="Ocupación">
            <FilaModulo icon={<Shirt className="h-5 w-5"/>} label="Ropa" value={formatPercentage(data.almacenes.ropa.ocupacionPorc)} />
            <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={formatPercentage(data.almacenes.calzado.ocupacionPorc)} />
            <FilaModulo icon={<SprayCan className="h-5 w-5"/>} label="Perfumería" value={formatPercentage(data.almacenes.perfumeria.ocupacionPorc)} />
          </ModuloAlmacen>
          <ModuloAlmacen title="Propuesta Devo.">
             <FilaModulo icon={<Shirt className="h-5 w-5"/>} label="Ropa" value={formatNumber(data.almacenes.ropa.devolucionUnidades)} />
             <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={formatNumber(data.almacenes.calzado.devolucionUnidades)} />
             <div className="h-7"></div>
          </ModuloAlmacen>
        </div>
      </KpiCard>
    </div>
  );
}
