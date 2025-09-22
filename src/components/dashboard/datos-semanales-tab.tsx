import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { KpiCard, DatoDoble, DatoSimple } from "./kpi-card";
import { 
  Euro, 
  ChartLine, 
  Receipt,
  Warehouse,
  AlertTriangle,
  ArrowDown,
  ArrowUp
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
      <KpiCard title="Ventas" icon={<Euro className="h-5 w-5 text-primary" />} className="lg:col-span-2">
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
      <KpiCard title="Rendimiento de Tienda" icon={<ChartLine className="h-5 w-5 text-primary" />} className="lg:col-span-2">
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

      {/* Operaciones y Sistema */}
      <KpiCard title="Operaciones y Sistema" icon={<Receipt className="h-5 w-5 text-primary" />} className="lg:col-span-2">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <DatoSimple label="Filas Caja" value={`${formatPercentage(data.operaciones.filasCajaPorc)}`} isEditing={isEditing} valueId="input-op-filas-caja" />
            <DatoSimple label="SCO" value={`${formatPercentage(data.operaciones.scoPorc)}`} isEditing={isEditing} valueId="input-op-sco" />
            <DatoSimple label="V. Ipod" value={formatNumber(data.operaciones.ventaIpod)} isEditing={isEditing} valueId="input-op-vipod" />
            <DatoSimple label="E-Ticket" value={`${formatPercentage(data.operaciones.eTicketPorc)}`} isEditing={isEditing} valueId="input-op-eticket" />
            <DatoSimple label="SINT" value={formatNumber(data.operaciones.sint)} isEditing={isEditing} valueId="input-op-sint" />
            <DatoSimple label="Repo" value={`${formatPercentage(data.operaciones.repoPorc)}`} isEditing={isEditing} valueId="input-op-repo" />
        </div>
      </KpiCard>
      
      {/* Gestión de Almacén y Logística */}
      <KpiCard title="Gestión de Almacén y Logística" icon={<Warehouse className="h-5 w-5 text-primary" />} className="lg:col-span-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-card-foreground">Logística Semanal</h4>
              <DatoSimple label="Entradas Totales" value={formatNumber(data.logistica.entradas)} isEditing={isEditing} valueId="total-entradas" icon={<ArrowDown className="h-4 w-4 text-green-500" />} />
              <DatoSimple label="Salidas Totales" value={formatNumber(data.logistica.salidas)} isEditing={isEditing} valueId="total-salidas" icon={<ArrowUp className="h-4 w-4 text-red-500" />} />
          </div>
           <div className="flex flex-col gap-4">
              <h4 className="font-semibold text-card-foreground">Ocupación y Devoluciones</h4>
               <Table>
                <TableHeader>
                    <TableRow>
                      <TableHead>Almacén</TableHead>
                      <TableHead className="text-right">Ocupación</TableHead>
                      <TableHead className="text-right">Prop. Devolución</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                      <TableCell>Ropa</TableCell>
                      <TableCell className="text-right">{formatPercentage(data.almacenes.ropa.ocupacionPorc)}</TableCell>
                      <TableCell className="text-right">{formatNumber(data.almacenes.ropa.devolucionUnidades)}</TableCell>
                    </TableRow>
                     <TableRow>
                      <TableCell>Calzado</TableCell>
                      <TableCell className="text-right">{formatPercentage(data.almacenes.calzado.ocupacionPorc)}</TableCell>
                      <TableCell className="text-right">{formatNumber(data.almacenes.calzado.devolucionUnidades)}</TableCell>
                    </TableRow>
                     <TableRow>
                      <TableCell>Perfumería</TableCell>
                      <TableCell className="text-right">{formatPercentage(data.almacenes.perfumeria.ocupacionPorc)}</TableCell>
                      <TableCell className="text-right">{formatNumber(data.almacenes.perfumeria.devolucionUnidades)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
          </div>
        </div>
      </KpiCard>

      {/* Pérdidas */}
      <KpiCard title="Pérdidas" icon={<AlertTriangle className="h-5 w-5 text-destructive" />} className="lg:col-span-2">
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
      </KpiCard>
    </div>
  );
}
