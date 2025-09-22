import { datosSemanales, type WeeklyData } from "@/lib/data";
import { TotalEurosCard, GapCard, AcoCard } from "./kpi-cards";
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
      <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-3 md:grid-flow-row-dense">
        <TotalEurosCard data={data} />
        <AlmacenesCard data={data.almacenes} className="md:col-span-2 md:row-span-2" />
        <GapCard data={data.gap} />
        <AcoCard value={data.acoPorc} />
      </div>

      <AIAnalysis input={aiInput} />
    </div>
  );
}
