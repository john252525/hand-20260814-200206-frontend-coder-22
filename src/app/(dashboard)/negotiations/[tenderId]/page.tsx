'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useNegotiationStatus } from '@/lib/hooks/use-negotiations';
import { formatPercent } from '@/lib/utils/format';

export default function NegotiationDetailPage() {
  const params = useParams<{ tenderId: string }>();
  const { data: status, isLoading, error } = useNegotiationStatus(params.tenderId);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8" /><Skeleton className="h-32" /></div>;
  if (error) return <div className="text-center py-12 text-red-500">{error.message}</div>;
  if (!status) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Переговоры: {status.tender_id}</h1>
      <div className="flex gap-2">
        <Badge variant={status.status === 'IN_PROGRESS' ? 'info' : status.status === 'COMPLETED' ? 'success' : 'warning'}>{status.status}</Badge>
        <span className="text-sm text-neutral-500">Циклов: {status.cycles_completed} / {status.max_cycles}</span>
      </div>
      <Card>
        <CardHeader><CardTitle>Поставщики</CardTitle></CardHeader>
        <CardContent>
          {status.suppliers?.length ? (
            <div className="space-y-3">
              {status.suppliers.map((supplier) => (
                <div key={supplier.supplier_id} className="flex justify-between p-3 bg-neutral-50 rounded">
                  <div>
                    <div className="font-medium">{supplier.supplier_name}</div>
                    <div className="text-sm text-neutral-500">Начальная маржа: {formatPercent(supplier.initial_margin_percent)}</div>
                    <div className="text-sm text-neutral-500">Текущая маржа: {formatPercent(supplier.current_margin_percent)}</div>
                    <div className="text-sm text-neutral-500">Улучшение: {supplier.improvement_percent}%</div>
                  </div>
                  <Badge variant={supplier.status === 'IMPROVED' ? 'success' : supplier.status === 'DECLINED' ? 'danger' : 'secondary'}>{supplier.status}</Badge>
                </div>
              ))}
            </div>
          ) : <p className="text-neutral-400">Нет данных</p>}
        </CardContent>
      </Card>
    </div>
  );
}