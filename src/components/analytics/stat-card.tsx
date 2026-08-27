import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: number | null;
  description?: string;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, description, className }: StatCardProps) {
  const TrendIcon = trend && trend > 0 ? TrendingUp : trend && trend < 0 ? TrendingDown : Minus;
  const trendColor = trend && trend > 0 ? 'text-green-600' : trend && trend < 0 ? 'text-red-600' : 'text-neutral-400';

  return (
    <Card className={cn('transition-shadow hover:shadow-md', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-neutral-500">{title}</p>
            <p className="text-2xl font-semibold">{value}</p>
            {description && <p className="text-xs text-neutral-400">{description}</p>}
          </div>
          <div className="flex items-center gap-1">
            <Icon className="h-5 w-5 text-primary-600" />
            {trend !== null && trend !== undefined && (
              <span className={cn('flex items-center text-xs font-medium', trendColor)}>
                <TrendIcon className="h-3 w-3 mr-0.5" />
                {typeof trend === 'number' ? `${trend > 0 ? '+' : ''}${trend}%` : '—'}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}