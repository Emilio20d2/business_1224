import { datosSemanales, type WeeklyData } from "@/lib/data";
import {
  TotalEurosCard,
  TotalUnidadesCard,
  TraficoCard,
  VentaIpodCard,
  ETicketCard,
  ConversionCard,
  FilasCajaCard,
  AcoCard,
  GapCard,
  SintCard,
  RepoCard,
  MermaCard,
} from "./kpi-cards";
import { AlmacenesCard } from "./almacenes-card";
import { AIAnalysis } from "./ai-analysis";

export function WeeklyDataTab() {
  const data: WeeklyData = datosSemanales;

  const aiInput = {
    varPorcEuros: data.varPorcEuros,
    varPorcUnidades: data.varPorcUnidades,
    varPorcTrafico: data.varPorcTrafico,
    varPorcConversion: data.varPorcConversion,
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <TotalEurosCard data={data} />
        <TotalUnidadesCard data={data} />
        <TraficoCard data={data} />
        <VentaIpodCard value={data.ventaIpod} />
        <ETicketCard value={data.eTicketPorc} />
        <ConversionCard data={data} />
        <FilasCajaCard value={data.filasCajaPorc} />
        <AcoCard value={data.acoPorc} />
        <GapCard data={data.gap} />
        <SintCard value={data.sint} />
        <RepoCard value={data.repoPorc} />
        <MermaCard data={data.merma} />
        <AlmacenesCard data={data.almacenes} className="sm:col-span-2 md:col-span-3 lg:col-span-4 xl:col-span-6" />
      </div>

      <AIAnalysis input={aiInput} />
    </div>
  );
}
