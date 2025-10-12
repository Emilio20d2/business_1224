
import React from 'react';
import type { WeeklyData } from "@/lib/data";
import { formatCurrency, formatPercentage, formatPercentageInt } from "@/lib/format";
import { cn } from "@/lib/utils";
import { KpiCard, DatoDoble } from "./kpi-card";
import { Input } from "@/components/ui/input";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

type AcumuladoData = WeeklyData["acumulado"];
type AcumuladoPeriodoData = AcumuladoData[keyof AcumuladoData];

type AcumuladoTabProps = {
  data: AcumuladoData;
  isEditing: boolean;
  onInputChange: (path: string, value: string | number) => void;
};

const COLORS = {
  'Woman': 'hsl(355, 71%, 60%)',
  'Man': 'hsl(217, 56%, 60%)',
  'Niño': 'hsl(172, 29%, 57%)'
};

const AcumuladoCard = ({ title, data, isEditing, idPrefix, onInputChange }: { title: string, data: AcumuladoPeriodoData, isEditing: boolean, idPrefix: string, onInputChange: AcumuladoTabProps['onInputChange'] }) => {
  const chartData = data.desglose.map(item => ({
    name: item.nombre,
    value: item.pesoPorc
  }));

  const handleChange = (index: number, field: string, value: string) => {
    const path = `acumulado.${idPrefix}.desglose.${index}.${field}`;
    onInputChange(path, value);
  };

  return (
    <KpiCard title={title} icon={<></>} className="flex-1">
      <div className="grid grid-cols-2 gap-4">
        <DatoDoble 
          value={formatCurrency(data.totalEuros)} 
          variation={data.varPorcTotal}
          isEditing={isEditing}
          valueId={`acumulado.${idPrefix}.totalEuros`}
          variationId={`acumulado.${idPrefix}.varPorcTotal`}
          onInputChange={onInputChange}
        />
        <DatoDoble 
          labelRight="Importe Ipod en €"
          value={formatCurrency(data.importeIpod || 0)}
          variation={data.varPorcIpod || 0}
          isEditing={isEditing}
          valueId={`acumulado.${idPrefix}.importeIpod`}
          variationId={`acumulado.${idPrefix}.varPorcIpod`}
          onInputChange={onInputChange}
        />
      </div>
      
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={60}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `${formatPercentageInt(value as number)}`}
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
                borderRadius: 'var(--radius)'
              }}
            />
             <Legend
              iconSize={10}
              layout="vertical"
              verticalAlign="middle"
              align="right"
              wrapperStyle={{ fontSize: '14px' }}
              formatter={(value, entry) => {
                const { color } = entry;
                const item = chartData.find(d => d.name === value);
                return <span style={{ color: 'hsl(var(--foreground))' }}>{value} ({formatPercentageInt(item?.value || 0)})</span>;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Tabla de Desglose */}
      <div className="flex flex-col gap-2 text-sm">
        <div className="grid grid-cols-4 gap-2 font-semibold uppercase text-muted-foreground px-2">
            <div>Sección</div>
            <div className="text-right">Total €</div>
            <div className="text-right">Var %</div>
            <div className="text-right">Peso %</div>
        </div>
        {data.desglose.map((item, index) => (
            <div key={index} className="grid grid-cols-4 gap-2 items-center bg-background/50 p-2 rounded-md">
                 <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[item.nombre as keyof typeof COLORS] }}></span>
                    <span className="font-semibold">{item.nombre}</span>
                </div>

                 {isEditing ? (
                  <>
                    <Input type="number" inputMode="decimal" defaultValue={item.totalEuros} className="w-full text-right" id={`${idPrefix}-desglose-${index}-euros`} onChange={(e) => handleChange(index, 'totalEuros', e.target.value)} />
                    <div className="flex items-center">
                      <Input type="number" inputMode="decimal" step="0.1" defaultValue={item.varPorc} className="w-full text-right" id={`${idPrefix}-desglose-${index}-var`} onChange={(e) => handleChange(index, 'varPorc', e.target.value)} />
                      <span className="ml-1 text-muted-foreground">%</span>
                    </div>
                     <div className="flex items-center">
                      <Input type="number" inputMode="decimal" step="0.1" value={item.pesoPorc} readOnly className="w-full text-right bg-muted" id={`${idPrefix}-desglose-${index}-peso`} />
                       <span className="ml-1 text-muted-foreground">%</span>
                    </div>
                  </>
                 ) : (
                  <>
                    <div className={cn("text-right font-medium", item.totalEuros < 0 && "text-red-600")}>{formatCurrency(item.totalEuros)}</div>
                    <div className={cn("text-right", item.varPorc < 0 && "text-red-600")}>{formatPercentage(item.varPorc)}</div>
                    <div className={cn("text-right", item.pesoPorc < 0 && "text-red-600")}>{formatPercentageInt(item.pesoPorc)}</div>
                  </>
                 )}
            </div>
        ))}

      </div>

    </KpiCard>
  );
};


export function AcumuladoTab({ data, isEditing, onInputChange }: AcumuladoTabProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AcumuladoCard title="Acumulado Mensual" data={data.mensual} isEditing={isEditing} idPrefix="mensual" onInputChange={onInputChange} />
      <AcumuladoCard title="Acumulado Anual" data={data.anual} isEditing={isEditing} idPrefix="anual" onInputChange={onInputChange}/>
    </div>
  );
}
