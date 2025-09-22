import { cn } from "@/lib/utils";

type TrendIndicatorProps = {
  value: number;
};

export function TrendIndicator({ value }: TrendIndicatorProps) {
  const isPositive = value >= 0;
  const colorClass = isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

  return (
    <span className={cn("rounded-md px-2 py-1 text-sm font-bold", colorClass)}>
      {isPositive ? '+' : ''}{value.toLocaleString("es-ES")}%
    </span>
  );
}
