import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tender } from '@/lib/types/tender';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Users, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

interface TenderListProps {
  tenders: Tender[];
  loading?: boolean;
  compact?: boolean;
}

export function TenderList({ tenders, loading, compact = false }: TenderListProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16" />
        ))}
      </div>
    );
  }

  if (!tenders?.length) {
    return (
      <div className="text-center py-8 text-neutral-400">
        <p>Нет тендеров</p>
      </div>
    );
  }

  return (
    <div className={cn('divide-y divide-neutral-100', compact && 'divide-y-0 space-y-2')}>
      {tenders.slice(0, compact ? 5 : undefined).map((tender) => (
        <div
          key={tender.id}
          className={cn(
            'flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors',
            'hover:bg-neutral-50'
          )}
          onClick={() => router.push(`/tenders/${tender.id}`)}
        >
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate">{tender.title}</p>
            <div className="flex items-center gap-3 text-sm text-neutral-500 mt-0.5">
              <span>{formatCurrency(tender.nmck)}</span>
              <span>{formatDate(tender.deadline_at)}</span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {tender.suppliers_count ?? 0}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={tender.status} size="sm" />
            <ArrowRight className="h-4 w-4 text-neutral-300" />
          </div>
        </div>
      ))}
    </div>
  );
}