import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export const StatisticsCard8 = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  trendValue, 
  variant = "default" 
}) => {
  const variants = {
    default: "border-stone-800 bg-stone-900/50",
    total: "border-amber-500/20 bg-amber-500/5",
    open: "border-amber-400/20 bg-amber-400/5",
    active: "border-amber-600/20 bg-amber-600/5",
    resolved: "border-amber-700/20 bg-amber-700/5",
  };

  const accentColors = {
    default: "text-stone-500",
    total: "text-amber-500",
    open: "text-amber-400",
    active: "text-amber-600",
    resolved: "text-amber-700",
  };


  return (
    <Card className={cn(
      "relative overflow-hidden border p-6 transition-all hover:border-stone-700 hover:shadow-2xl hover:shadow-stone-950/50",
      variants[variant]
    )}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-stone-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold tracking-tight text-stone-100">{value}</h2>
            {trendValue && (
              <span className={cn(
                "flex items-center text-xs font-medium",
                trend === "up" ? "text-green-500" : "text-red-500"
              )}>
                {trend === "up" ? <TrendingUp className="mr-1 h-3 w-3" /> : <TrendingDown className="mr-1 h-3 w-3" />}
                {trendValue}
              </span>
            )}
          </div>
        </div>
        {Icon && (
          <div className={cn(
            "rounded-xl border border-white/5 bg-white/5 p-3 shadow-inner",
            accentColors[variant]
          )}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
      
      {description && (
        <p className="mt-4 text-xs text-stone-500">
          {description}
        </p>
      )}

      {/* Subtle background glow */}
      <div className={cn(
        "absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl opacity-10",
        variant === "total" ? "bg-amber-500" : 
        variant === "open" ? "bg-amber-400" : 
        variant === "active" ? "bg-amber-600" : 
        variant === "resolved" ? "bg-amber-700" : "bg-stone-700"
      )} />
    </Card>
  );
};

