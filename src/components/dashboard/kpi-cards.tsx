import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercentage, formatNumber } from "@/lib/format";
import type { WeeklyData } from "@/lib/data";
import { TrendIndicator } from "./trend-indicator";
import { Euro, ArrowRightLeft, Receipt, ShoppingCart, Users, Smartphone, Ticket, Percent, Grip, Tags, RefreshCw, AlertTriangle } from "lucide-react";
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

export function TotalUnidadesCard({ data }: CardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase">Total Unid</CardTitle>
        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex items-baseline justify-between">
        <div className="text-2xl font-bold">{formatNumber(data.totalUnidades)}</div>
        <TrendIndicator value={data.varPorcUnidades} />
      </CardContent>
    </Card>
  );
}

export function TraficoCard({ data }: CardProps) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium uppercase">Tráfico</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="flex items-baseline justify-between">
          <div className="text-2xl font-bold">{formatNumber(data.trafico)}</div>
          <TrendIndicator value={data.varPorcTrafico} />
        </CardContent>
      </Card>
    );
  }

type SingleValueCardProps = {
    value: number;
}

export function VentaIpodCard({ value }: SingleValueCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium uppercase">V. Ipod</CardTitle>
                <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatNumber(value)}</div>
            </CardContent>
        </Card>
    )
}

export function ETicketCard({ value }: SingleValueCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium uppercase">E-Ticket</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(value)}</div>
            </CardContent>
        </Card>
    )
}

export function ConversionCard({ data }: CardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium uppercase">R. Conv.</CardTitle>
                <Percent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex items-baseline justify-between">
                <div className="text-2xl font-bold">{formatPercentage(data.conversion)}</div>
                <TrendIndicator value={data.varPorcConversion} />
            </CardContent>
        </Card>
    );
}

export function FilasCajaCard({ value }: SingleValueCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium uppercase">Filas Caja</CardTitle>
                <Grip className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(value)}</div>
            </CardContent>
        </Card>
    )
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

export function SintCard({ value }: SingleValueCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium uppercase">SINT</CardTitle>
                <Tags className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatNumber(value)}</div>
            </CardContent>
        </Card>
    );
}

export function RepoCard({ value }: SingleValueCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium uppercase">Repo.</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{formatPercentage(value)}</div>
            </CardContent>
        </Card>
    );
}

type MermaCardProps = {
    data: WeeklyData["merma"];
}

export function MermaCard({ data }: MermaCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium uppercase">Merma</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-2">
                <div className="text-lg font-bold">{formatNumber(data.unidades)} unid.</div>
                <p className="text-xs text-muted-foreground">{formatPercentage(data.porcentaje)}</p>
            </CardContent>
        </Card>
    );
}
