import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { KpiCard, DatoDoble, DatoSimple } from "./kpi-card";
import { 
  Euro, 
  ChartLine, 
  Truck, 
  Receipt,
  Warehouse,
  AlertTriangle,
} from "lucide-react";

type DatosSemanalesTabProps = {
  data: WeeklyData;
  isEditing: boolean;
};

const formatGap = (value: number, unit: '€' | 'Unid.') => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toLocaleString('es-ES')}${unit}`;
}

export function DatosSemanalesTab({ data, isEditing }: DatosSemanalesTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mt-4">
      {/* Ventas */}
      <KpiCard title="Ventas" icon={<Euro className="h-5 w-5 text-blue-500" />} className="lg:col-span-2">
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
      <KpiCard title="Rendimiento de Tienda" icon={<ChartLine className="h-5 w-5 text-blue-500" />} className="lg:col-span-2">
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

      {/* Logística */}
      <KpiCard title="Logística" icon={<Truck className="h-5 w-5 text-blue-500" />} className="lg:col-span-2">
        <DatoSimple label="Entradas" value={formatNumber(data.logistica.entradas)} isEditing={isEditing} valueId="input-logistica-entradas" />
        <DatoSimple label="Salidas" value={formatNumber(data.logistica.salidas)} isEditing={isEditing} valueId="input-logistica-salidas"/>
      </KpiCard>

      {/* Operaciones y Sistema */}
      <KpiCard title="Operaciones y Sistema" icon={<Receipt className="h-5 w-5 text-blue-500" />} className="lg:col-span-3">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-md">
            <DatoSimple label="Filas Caja" value={`${formatPercentage(data.operaciones.filasCajaPorc)}`} isEditing={isEditing} valueId="input-op-filas-caja" />
            <DatoSimple label="SCO" value={`${formatPercentage(data.operaciones.scoPorc)}`} isEditing={isEditing} valueId="input-op-sco" />
            <DatoSimple label="V. Ipod" value={formatNumber(data.operaciones.ventaIpod)} isEditing={isEditing} valueId="input-op-vipod" />
            <DatoSimple label="E-Ticket" value={`${formatPercentage(data.operaciones.eTicketPorc)}`} isEditing={isEditing} valueId="input-op-eticket" />
            <DatoSimple label="SINT" value={formatNumber(data.operaciones.sint)} isEditing={isEditing} valueId="input-op-sint" />
            <DatoSimple label="Repo" value={`${formatPercentage(data.operaciones.repoPorc)}`} isEditing={isEditing} valueId="input-op-repo" />
        </div>
      </KpiCard>
      
      {/* Gestión de Stock */}
      <KpiCard title="Gestión de Stock" icon={<Warehouse className="h-5 w-5 text-blue-500" />} className="lg:col-span-3">
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-slate-700">Ocupación</h4>
            <p className="text-slate-600">
                Valor Sup: <strong className="font-semibold text-slate-800">{formatNumber(data.gestionStock.ocupacion.valorSuperior)}</strong> (<strong className="font-semibold text-slate-800">{formatPercentage(data.gestionStock.ocupacion.porcSuperior)}</strong>) / Valor Inf: <strong className="font-semibold text-slate-800">{formatNumber(data.gestionStock.ocupacion.valorInferior)}</strong> (<strong className="font-semibold text-slate-800">{formatPercentage(data.gestionStock.ocupacion.porcInferior)}</strong>)
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="font-semibold text-slate-700">Propuesta Devolución</h4>
            <p className="text-slate-600">
                Valor Sup: <strong className="font-semibold text-slate-800">{formatNumber(data.gestionStock.propuestaDevolucion.valorSuperior)}</strong> / Valor Inf: <strong className="font-semibold text-slate-800">{formatNumber(data.gestionStock.propuestaDevolucion.valorInferior)}</strong>
            </p>
          </div>
      </KpiCard>

      {/* Pérdidas */}
      <KpiCard title="Pérdidas" icon={<AlertTriangle className="h-5 w-5 text-red-500" />} className="lg:col-span-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DatoSimple 
                label="GAP" 
                value={`${formatGap(data.perdidas.gap.euros, '€')} / ${formatGap(data.perdidas.gap.unidades, 'Unid.')}`} 
                isEditing={isEditing}
                valueId="input-perdidas-gap"
            />
            <DatoSimple 
                label="Merma" 
                value={`${formatNumber(data.perdidas.merma.unidades)} Unid. (${formatPercentage(data.perdidas.merma.porcentaje)})`}
                isEditing={isEditing}
                valueId="input-perdidas-merma"
            />
        </div>
      </KpiCard>
    </div>
  );
}
