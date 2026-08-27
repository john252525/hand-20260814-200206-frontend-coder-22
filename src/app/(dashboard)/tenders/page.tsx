'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/shared/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { TenderFilters } from '@/components/tenders/tender-filters';
import { useTenders } from '@/lib/hooks/use-tenders';
import { Tender, TenderFilters as TenderFiltersType } from '@/lib/types/tender';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { Plus } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export default function TendersPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<TenderFiltersType>({});
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useTenders({ ...filters, page, per_page: 20 });

  const tenders = data?.data || [];
  const meta = data?.meta;

  const columns = useMemo<ColumnDef<Tender, unknown>[]>(() => [
    {
      accessorKey: 'title',
      header: 'Название',
      cell: ({ row }) => (
        <div className="max-w-md truncate">
          <div className="font-medium">{row.original.title}</div>
          <div className="text-sm text-neutral-500">{row.original.customer_name || '—'}</div>
        </div>
      ),
    },
    {
      accessorKey: 'nmck',
      header: 'НМЦК',
      cell: ({ row }) => <span className="font-medium whitespace-nowrap">{formatCurrency(row.original.nmck)}</span>,
    },
    {
      accessorKey: 'deadline_at',
      header: 'Дедлайн',
      cell: ({ row }) => formatDate(row.original.deadline_at),
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'score',
      header: 'Скор',
      cell: ({ row }) => row.original.score ?? '—',
    },
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Тендеры</h1>
          <p className="text-neutral-500 mt-1">Всего: {meta?.total ?? 0}</p>
        </div>
        <Button onClick={() => router.push('/tenders/create')}>
          <Plus className="h-4 w-4 mr-2" /> Создать
        </Button>
      </div>

      <TenderFilters
        filters={filters}
        onChange={(newFilters) => { setFilters(newFilters); setPage(1); }}
        onReset={() => { setFilters({}); setPage(1); }}
      />

      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={tenders}
            loading={isLoading}
            error={error as Error}
            onRetry={refetch}
            onRowClick={(row) => router.push(`/tenders/${row.id}`)}
            pagination={meta ? { page: meta.page, perPage: meta.per_page, total: meta.total, pages: meta.pages } : undefined}
            onPageChange={setPage}
            emptyState={{ title: 'Нет тендеров', description: 'Создайте первый тендер' }}
          />
        </CardContent>
      </Card>
    </div>
  );
}