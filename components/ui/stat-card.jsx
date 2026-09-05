import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

function StatCard({ label, value, change, icon: Icon, className }) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#94A3B8]">{label}</p>
            <p className="text-2xl font-bold text-[#F8FAFC]">{value}</p>
            {typeof change === "number" && (
              <div className={cn("flex items-center gap-1 text-xs font-medium", isPositive && "text-emerald-400", isNegative && "text-red-400", !isPositive && !isNegative && "text-[#94A3B8]")}>
                {isPositive && <TrendingUp className="h-3 w-3" />}
                {isNegative && <TrendingDown className="h-3 w-3" />}
                <span>{isPositive ? "+" : ""}{change}%</span>
              </div>
            )}
          </div>
          {Icon && (
            <div className="rounded-lg bg-[#22D3EE]/10 p-2.5">
              <Icon className="h-5 w-5 text-[#22D3EE]" />
            </div>
          )}
        </div>
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-[#22D3EE]/5 to-[#8B5CF6]/5" />
      </CardContent>
    </Card>
  );
}

export { StatCard };
