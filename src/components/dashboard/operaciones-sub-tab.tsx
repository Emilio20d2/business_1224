

import type { WeeklyData, OperacionesData, PerdidasData, LogisticaData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage, formatGap } from "@/lib/format";
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
  Inbox,
  Percent,
  Sparkles,
  FileInput,
  Repeat,
  Archive,
  Box
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type OperacionesSubTabProps = {
  operaciones: OperacionesData;
  perdidas: PerdidasData;
  logistica: LogisticaData;
  almacenes: WeeklyData['man']['almacenes'];
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
  basePath: 'man' | 'woman' | 'nino' | 'general';
};


export const ModuloAlmacen = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
    <div className={cn("flex flex-col text-center gap-2 w-full", className)}>
        <h4 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase">{title}</h4>
        <div className="flex flex-col gap-3">
            {children}
        </div>
    </div>
);

export const ModuloContenidoGrande = ({ icon, value, isEditing, id, onInputChange }: { icon: React.ReactNode, value: number, isEditing?: boolean, id?:string, onInputChange?: (path: string, value: string | number) => void; }) => (
    <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background h-full">
       <div className="text-primary">{icon}</div>
       {isEditing && id && onInputChange ? 
        <DatoSimple value={value} isEditing={isEditing} valueId={id} onInputChange={onInputChange} align="center"/>
        : <strong className="text-3xl font-bold">{formatNumber(value)}</strong>
       }
    </div>
);

export const FilaModulo = ({ icon, label, value, isEditing, id, onInputChange, unit }: { icon: React.ReactNode, label: string, value: number, isEditing?: boolean, id?: string, onInputChange?: (path: string, value: string | number) => void; unit: string }) => (
     <div className="grid grid-cols-2 items-center gap-4 text-md">
        <div className="flex items-center gap-2 text-primary justify-start">
            {icon}
            <span className="text-muted-foreground">{label}</span>
        </div>
        <div className="flex justify-end items-center text-right w-full">
         {isEditing && id && onInputChange ? 
            <div className="flex items-center justify-end gap-1 w-full">
                <Input type="number" inputMode="decimal" defaultValue={value} className="font-bold text-right w-24" id={id} onChange={(e) => onInputChange(id, e.target.value)} />
                <span className="text-sm text-muted-foreground">{unit}</span>
            </div>
            : <div className="font-bold text-right w-full">{unit === '%' ? formatPercentage(value) : formatNumber(value)}</div>
        }
        </div>
    </div>
)

export function OperacionesSubTab({ operaciones, perdidas, logistica, almacenes, isEditing, onInputChange, basePath }: OperacionesSubTabProps) {
  const balance = (logistica?.entradasSemanales || 0) - (logistica?.sintSemanales || 0);
  
  const safeAlmacenes = almacenes || {};
  const paqueteria = safeAlmacenes.paqueteria || { ocupacionPorc: 0, devolucionUnidades: 0, entradas: 0, salidas: 0 };
  const confeccion = safeAlmacenes.confeccion || { ocupacionPorc: 0, devolucionUnidades: 0, entradas: 0, salidas: 0 };
  const calzado = safeAlmacenes.calzado || { ocupacionPorc: 0, devolucionUnidades: 0, entradas: 0, salidas: 0 };
  const perfumeria = safeAlmacenes.perfumeria || { ocupacionPorc: 0, devolucionUnidades: null, entradas: 0, salidas: 0 };

  return (
    <div className="space-y-4">
      {/* ALMACENES */}
      <KpiCard title="ALMACENES" icon={<Warehouse className="h-5 w-5 text-primary" />} className="md:col-span-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_1fr_1.5fr_1.5fr] gap-6 place-items-start">
          <ModuloAlmacen title="Entradas">
            <ModuloContenidoGrande icon={<Truck className="h-8 w-8 text-primary"/>} value={logistica?.entradasSemanales || 0} isEditing={isEditing} id={`${basePath}.logistica.entradasSemanales`} onInputChange={onInputChange} />
          </ModuloAlmacen>
          <ModuloAlmacen title="Salidas">
            <ModuloContenidoGrande icon={<PackageCheck className="h-8 w-8 text-primary"/>} value={logistica?.sintSemanales || 0} isEditing={isEditing} id={`${basePath}.logistica.sintSemanales`} onInputChange={onInputChange} />
          </ModuloAlmacen>
          <ModuloAlmacen title="Balance">
             <div className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg bg-background h-full">
               <div className="text-primary"><Repeat className="h-8 w-8 text-primary"/></div>
               <strong className="text-3xl font-bold">{formatNumber(balance)}</strong>
            </div>
          </ModuloAlmacen>
          <ModuloAlmacen title="Destocaje">
            <ModuloContenidoGrande icon={<FileInput className="h-8 w-8 text-primary"/>} value={logistica?.salidasSemanales || 0} isEditing={isEditing} id={`${basePath}.logistica.salidasSemanales`} onInputChange={onInputChange} />
          </ModuloAlmacen>
          <ModuloAlmacen title="Ocupación" className="w-full">
            <FilaModulo icon={<Archive className="h-5 w-5"/>} label="Paque." value={paqueteria.ocupacionPorc} isEditing={isEditing} id={`${basePath}.almacenes.paqueteria.ocupacionPorc`} onInputChange={onInputChange} unit="%" />
            <FilaModulo icon={<Box className="h-5 w-5"/>} label="Confe." value={confeccion.ocupacionPorc} isEditing={isEditing} id={`${basePath}.almacenes.confeccion.ocupacionPorc`} onInputChange={onInputChange} unit="%" />
            <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={calzado.ocupacionPorc} isEditing={isEditing} id={`${basePath}.almacenes.calzado.ocupacionPorc`} onInputChange={onInputChange} unit="%" />
            <FilaModulo icon={<SprayCan className="h-5 w-5"/>} label="Perfu." value={perfumeria.ocupacionPorc} isEditing={isEditing} id={`${basePath}.almacenes.perfumeria.ocupacionPorc`} onInputChange={onInputChange} unit="%" />
          </ModuloAlmacen>
          <ModuloAlmacen title="Propuesta Devo." className="w-full">
             <FilaModulo icon={<Archive className="h-5 w-5"/>} label="Paque." value={paqueteria.devolucionUnidades as number} isEditing={isEditing} id={`${basePath}.almacenes.paqueteria.devolucionUnidades`} onInputChange={onInputChange} unit="Unid."/>
             <FilaModulo icon={<Box className="h-5 w-5"/>} label="Confe." value={confeccion.devolucionUnidades as number} isEditing={isEditing} id={`${basePath}.almacenes.confeccion.devolucionUnidades`} onInputChange={onInputChange} unit="Unid."/>
             <FilaModulo icon={<Footprints className="h-5 w-5"/>} label="Calzado" value={calzado.devolucionUnidades as number} isEditing={isEditing} id={`${basePath}.almacenes.calzado.devolucionUnidades`} onInputChange={onInputChange} unit="Unid."/>
          </ModuloAlmacen>
        </div>
      </KpiCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard title="GAP" icon={<ClipboardX className="h-5 w-5 text-primary" />}>
             <div className="flex flex-row justify-center items-center gap-4">
                <DatoSimple 
                    label={<Euro className="h-5 w-5 text-primary"/>}
                    value={perdidas?.gap?.euros || 0} 
                    isEditing={isEditing}
                    valueId={`${basePath}.perdidas.gap.euros`}
                    align="center"
                    onInputChange={onInputChange}
                />
                <DatoSimple 
                    label={<Package className="h-5 w-5 text-primary"/>}
                    value={perdidas?.gap?.unidades || 0}
                    isEditing={isEditing}
                    valueId={`${basePath}.perdidas.gap.unidades`}
                    align="center"
                    onInputChange={onInputChange}
                />
            </div>
        </KpiCard>

        <KpiCard title="Merma" icon={<Trash2 className="h-5 w-5 text-primary" />}>
            <div className="flex flex-row justify-center items-center gap-4">
                <DatoSimple 
                    label={<Package className="h-5 w-5 text-primary"/>}
                    value={perdidas?.merma?.unidades || 0}
                    isEditing={isEditing}
                    valueId={`${basePath}.perdidas.merma.unidades`}
                    align="center"
                    unit="Unid."
                    onInputChange={onInputChange}
                />
                <DatoSimple 
                    label={<Percent className="h-5 w-5 text-primary"/>}
                    value={perdidas?.merma?.porcentaje || 0}
                    isEditing={isEditing}
                    valueId={`${basePath}.perdidas.merma.porcentaje`}
                    align="center"
                    unit="%"
                    onInputChange={onInputChange}
                />
            </div>
        </KpiCard>
        
        <KpiCard title="Operaciones" icon={<RefreshCw className="h-5 w-5 text-primary" />}>
             <div className="grid grid-cols-2 gap-4 h-full">
                <DatoSimple 
                    icon={<RefreshCw className="h-5 w-5 text-primary"/>} 
                    label="Repo" 
                    value={operaciones?.repoPorc || 0} 
                    isEditing={isEditing} 
                    valueId={`${basePath}.operaciones.repoPorc`} 
                    align="center" 
                    unit="%" 
                    onInputChange={onInputChange} 
                />
                <DatoSimple 
                    icon={<Sparkles className="h-5 w-5 text-primary"/>} 
                    label="Frescura" 
                    value={operaciones?.frescuraPorc || 0} 
                    isEditing={isEditing} 
                    valueId={`${basePath}.operaciones.frescuraPorc`} 
                    align="center" 
                    unit="%" 
                    onInputChange={onInputChange} 
                />
            </div>
        </KpiCard>
      </div>
    </div>
  );
}
