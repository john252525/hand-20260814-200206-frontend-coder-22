'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { useDecisions, useApproveTender, useRejectTender, useRequestInfo } from '@/lib/hooks/use-decisions';
import type { ColumnDef } from '@tanstack/react-table';
import { Decision } from '@/lib/types/decision';
import { Badge } from '@/components/ui/badge';

export default function DecisionsPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useDecisions({ page, per_page: 20 });
  const decisions = data?.data || [];
  const meta = data?.meta;

  const approveMutation = useApproveTender();
  const rejectMutation = useRejectTender();
  const requestInfoMutation = useRequestInfo();

  const columns = useMemo<ColumnDef<Decision, any>[]>(() => [
    { accessorKey: 'tender_title', header: 'Тендер' },
    { accessorKey: 'best_supplier_name', header: 'Поставщик' },
    { accessorKey: 'risk_level', header: 'Риск', cell: ({ row }) => row.original.risk_level ? <Badge variant={row.original.risk_level === 'HIGH' ? 'danger' : row.original.risk_level === 'MEDIUM' ? 'warning' : 'success'}>{row.original.risk_level}</Badge> : '—' },
    { accessorKey: 'auto_recommendation', header: 'Рекомендация' },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="success"
            onClick={() => {
              const offerId = window.prompt('ID КП');
              const supplierId = window.prompt('ID поставщика');
              if (offerId && supplierId) {
                approveMutation.mutate({ tenderId: row.original.tender_id, payload: { chosen_offer_id: offerId, chosen_supplier_id: supplierId } });
              }
            }}
          >
            Одобрить
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              const reason = window.prompt('Причина отклонения') || '';
              const comment = window.prompt('Комментарий') || '';
              rejectMutation.mutate({ tenderId: row.original.tender_id, payload: { reason, comment } });
            }}
          >
            Отклонить
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              const instructions = window.prompt('Инструкции') || '';
              requestInfoMutation.mutate({ tenderId: row.original.tender_id, payload: { instructions } });
            }}
          >
            Инфо
          </Button>
        </div>
      ),
    },
  ], [approveMutation, rejectMutation, requestInfoMutation]);

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