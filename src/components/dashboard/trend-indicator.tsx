import { cn } from "@/lib/utils";
import { ArrowUp, ArrowDown } from "lucide-react";

type TrendIndicatorProps = {
  value: number;
};

export function TrendIndicator({ value }: TrendIndicatorProps) {
  const isPositive = value >= 0;
  const color = isPositive ? "text-green-600" : "text-red-600";
  const Icon = isPositive ? ArrowUp : ArrowDown;

  return (
    <span className={cn("flex items-center font-semibold", color)}>
      <Icon className="mr-1 h-4 w-4" />
      {value.toLocaleString("es-ES")}%
    </span>
  );
}
