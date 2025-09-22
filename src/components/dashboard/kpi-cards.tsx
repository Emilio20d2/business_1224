import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage } from "@/lib/format";
import type { WeeklyData } from "@/lib/data";
import { TrendIndicator } from "./trend-indicator";
import { Euro, ArrowRightLeft, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

type CardProps = {
  data: WeeklyData;
};

export function TotalEurosCard({ data }: CardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase">Total €</CardTitle>
        <Euro className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex items-baseline justify-between">
        <div className="text-2xl font-bold">{formatCurrency(data.totalEuros)}</div>
        <TrendIndicator value={data.varPorcEuros} />
      </CardContent>
    </Card>
  );
}

type GapCardProps = {
  data: WeeklyData["gap"];
};

export function GapCard({ data }: GapCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase">GAP</CardTitle>
        <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex justify-around pt-4">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">€</p>
          <p className={cn(
              "text-xl font-bold",
              data.euros >= 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {formatPercentage(data.euros)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-muted-foreground">Unid.</p>
          <p className={cn(
              "text-xl font-bold",
              data.unidades >= 0 ? "text-green-600" : "text-red-600"
            )}
          >
            {formatPercentage(data.unidades)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

type AcoCardProps = {
  value: number;
};

export function AcoCard({ value }: AcoCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase">ACO</CardTitle>
        <Receipt className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatPercentage(value)}</div>
      </CardContent>
    </Card>
  );
}
