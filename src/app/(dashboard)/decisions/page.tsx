'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/shared/data-table';
import { useDecisions } from '@/lib/hooks/use-decisions';
import type { ColumnDef } from '@tanstack/react-table';
import { Decision } from '@/lib/types/decision';
import { Badge } from '@/components/ui/badge';
import { DecisionActions } from '@/components/decisions/decision-actions';

export default function DecisionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useDecisions({ page, per_page: 20 });
  const decisions = data?.data || [];
  const meta = data?.meta;

  const columns = useMemo<ColumnDef<Decision, unknown>[]>(() => [
    { accessorKey: 'tender_title', header: 'Тендер' },
    { accessorKey: 'best_supplier_name', header: 'Поставщик' },
    { accessorKey: 'risk_level', header: 'Риск', cell: ({ row }) => row.original.risk_level ? <Badge variant={row.original.risk_level === 'HIGH' ? 'danger' : row.original.risk_level === 'MEDIUM' ? 'warning' : 'success'}>{row.original.risk_level}</Badge> : '—' },
    { accessorKey: 'auto_recommendation', header: 'Рекомендация' },
    { id: 'actions', header: 'Действия', cell: ({ row }) => <DecisionActions decision={row.original} /> },
  ], []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Решения</h1>
      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={decisions}
            loading={isLoading}
            error={error as Error}
            onRetry={refetch}
            pagination={meta ? { page: meta.page, perPage: meta.per_page, total: meta.total, pages: meta.pages } : undefined}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}