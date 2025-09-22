import { datosSemanales, type WeeklyData } from "@/lib/data";
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/format";
import { TrendIndicator } from "@/components/dashboard/trend-indicator";
import { 
  Euro,
  ChartLine, 
  Truck, 
  Receipt,
  Warehouse,
  AlertTriangle
} from "lucide-react";

export default function Home() {
  const data: WeeklyData = datosSemanales;

  const formatGap = (value: number) => {
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toLocaleString('es-ES')}`
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 p-4 sm:p-6">
      <header className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-slate-800">
          Dashboard Semanal
        </h1>
        <h2 id="periodo-informe" className="text-xl text-slate-600">
          {data.periodo}
        </h2>
      </header>

      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Ventas */}
        <div className="flex flex-col gap-4 rounded-xl border-none bg-white p-5 shadow-lg shadow-slate-900/5">
            <h3 className="flex items-center gap-3 text-base font-semibold leading-none tracking-tight text-slate-800 -m-5 mb-0 border-b border-slate-200 p-5"><Euro className="h-5 w-5 text-blue-500" /> Ventas</h3>
            <div className="flex justify-between items-baseline">
                <div className="text-3xl font-bold">{formatCurrency(data.ventas.totalEuros)}</div>
                <TrendIndicator value={data.ventas.varPorcEuros} />
            </div>
            <div className="flex justify-between items-baseline">
                <div className="text-lg">{formatNumber(data.ventas.totalUnidades)} Unid.</div>
                <TrendIndicator value={data.ventas.varPorcUnidades} />
            </div>
        </div>

        {/* Rendimiento de Tienda */}
        <div className="flex flex-col gap-4 rounded-xl border-none bg-white p-5 shadow-lg shadow-slate-900/5">
            <h3 className="flex items-center gap-3 text-base font-semibold leading-none tracking-tight text-slate-800 -m-5 mb-0 border-b border-slate-200 p-5"><ChartLine className="h-5 w-5 text-blue-500" /> Rendimiento de Tienda</h3>
            <div className="flex items-baseline justify-between">
                <span className="text-lg text-slate-600">Tráfico:</span>
                <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-semibold">{formatNumber(data.rendimientoTienda.trafico)}</div>
                    <TrendIndicator value={data.rendimientoTienda.varPorcTrafico} />
                </div>
            </div>
            <div className="flex items-baseline justify-between">
                <span className="text-lg text-slate-600">Conversión:</span>
                <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-semibold">{formatPercentage(data.rendimientoTienda.conversion)}</div>
                    <TrendIndicator value={data.rendimientoTienda.varPorcConversion} />
                </div>
            </div>
        </div>

        {/* Logística */}
        <div className="flex flex-col gap-4 rounded-xl border-none bg-white p-5 shadow-lg shadow-slate-900/5">
            <h3 className="flex items-center gap-3 text-base font-semibold leading-none tracking-tight text-slate-800 -m-5 mb-0 border-b border-slate-200 p-5"><Truck className="h-5 w-5 text-blue-500" /> Logística</h3>
            <div className="flex justify-between text-lg">
              <span>Entradas:</span>
              <strong className="font-semibold">{formatNumber(data.logistica.entradas)}</strong>
            </div>
            <div className="flex justify-between text-lg">
              <span>Salidas:</span>
              <strong className="font-semibold">{formatNumber(data.logistica.salidas)}</strong>
            </div>
        </div>

        {/* Operaciones y Sistema */}
        <div className="lg:col-span-3 flex flex-col gap-4 rounded-xl border-none bg-white p-5 shadow-lg shadow-slate-900/5">
            <h3 className="flex items-center gap-3 text-base font-semibold leading-none tracking-tight text-slate-800 -m-5 mb-0 border-b border-slate-200 p-5"><Receipt className="h-5 w-5 text-blue-500" /> Operaciones y Sistema</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-md sm:grid-cols-3">
              <div className="flex justify-between"><span>Filas Caja:</span> <strong className="font-semibold">{formatPercentage(data.operaciones.filasCajaPorc)}</strong></div>
              <div className="flex justify-between"><span>SCO:</span> <strong className="font-semibold">{formatPercentage(data.operaciones.scoPorc)}</strong></div>
              <div className="flex justify-between"><span>V. Ipod:</span> <strong className="font-semibold">{formatNumber(data.operaciones.ventaIpod)}</strong></div>
              <div className="flex justify-between"><span>E-Ticket:</span> <strong className="font-semibold">{formatPercentage(data.operaciones.eTicketPorc)}</strong></div>
              <div className="flex justify-between"><span>SINT:</span> <strong className="font-semibold">{formatNumber(data.operaciones.sint)}</strong></div>
              <div className="flex justify-between"><span>Repo:</span> <strong className="font-semibold">{formatPercentage(data.operaciones.repoPorc)}</strong></div>
            </div>
        </div>

        {/* Gestión de Stock */}
        <div className="lg:col-span-2 flex flex-col gap-4 rounded-xl border-none bg-white p-5 shadow-lg shadow-slate-900/5">
            <h3 className="flex items-center gap-3 text-base font-semibold leading-none tracking-tight text-slate-800 -m-5 mb-0 border-b border-slate-200 p-5"><Warehouse className="h-5 w-5 text-blue-500" /> Gestión de Stock</h3>
            <div>
              <h4 className="font-semibold text-slate-700">Ocupación</h4>
              <p className="text-slate-600">
                Valor Sup: <strong className="font-semibold text-slate-800">{formatNumber(data.gestionStock.ocupacion.valorSuperior)}</strong> (<strong className="font-semibold text-slate-800">{formatPercentage(data.gestionStock.ocupacion.porcSuperior)}</strong>) / Valor Inf: <strong className="font-semibold text-slate-800">{formatNumber(data.gestionStock.ocupacion.valorInferior)}</strong> (<strong className="font-semibold text-slate-800">{formatPercentage(data.gestionStock.ocupacion.porcInferior)}</strong>)
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-700">Propuesta Devolución</h4>
              <p className="text-slate-600">
                Valor Sup: <strong className="font-semibold text-slate-800">{formatNumber(data.gestionStock.propuestaDevolucion.valorSuperior)}</strong> / Valor Inf: <strong className="font-semibold text-slate-800">{formatNumber(data.gestionStock.propuestaDevolucion.valorInferior)}</strong>
              </p>
            </div>
        </div>

        {/* Pérdidas */}
        <div className="flex flex-col gap-4 rounded-xl border-none bg-white p-5 shadow-lg shadow-slate-900/5">
            <h3 className="flex items-center gap-3 text-base font-semibold leading-none tracking-tight text-slate-800 -m-5 mb-0 border-b border-slate-200 p-5"><AlertTriangle className="h-5 w-5 text-blue-500" /> Pérdidas</h3>
            <div className="flex justify-between text-lg">
              <span>GAP:</span> 
              <span className="font-semibold">
                <span className={data.perdidas.gap.euros > 0 ? "text-green-600" : "text-red-600"}>{formatGap(data.perdidas.gap.euros)}</span>€ / <span className={data.perdidas.gap.unidades > 0 ? "text-green-600" : "text-red-600"}>{formatGap(data.perdidas.gap.unidades)}</span> Unid.
              </span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Merma:</span>
              <span className="font-semibold">
                {formatNumber(data.perdidas.merma.unidades)} Unid. ({formatPercentage(data.perdidas.merma.porcentaje)})
              </span>
            </div>
        </div>
      </main>
    </div>
  );
}
