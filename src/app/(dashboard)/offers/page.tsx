'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/shared/data-table';
import { useOffers } from '@/lib/hooks/use-offers';
import { formatCurrency, formatPercent } from '@/lib/utils/format';
import { Link2 } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { CommercialOffer } from '@/lib/types/offer';
import { OfferComparison } from '@/components/offers/offer-comparison';

export default function OffersPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useOffers({ page, per_page: 20 });
  const offers = data?.data || [];
  const meta = data?.meta;

  const columns = useMemo<ColumnDef<CommercialOffer, unknown>[]>(() => [
    { accessorKey: 'tender_title', header: 'Тендер' },
    { accessorKey: 'supplier_name', header: 'Поставщик' },
    { accessorKey: 'coverage', header: 'Покрытие %' },
    { accessorKey: 'total_cost_with_all', header: 'Итого', cell: ({ row }) => formatCurrency(row.original.total_cost_with_all) },
    { accessorKey: 'margin_percent', header: 'Маржа %', cell: ({ row }) => row.original.margin_percent !== null ? formatPercent(row.original.margin_percent) : '—' },
    { id: 'link', header: '', cell: ({ row }) => <a href={`/offers/${row.original.id}`} className="inline-flex"><Link2 className="h-4 w-4" /></a> },
  ], []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Коммерческие предложения</h1>
      <Card>
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={offers}
            loading={isLoading}
            error={error as Error}
            onRetry={refetch}
            onRowClick={(row) => window.location.href = `/offers/${row.id}`}
            pagination={meta ? { page: meta.page, perPage: meta.per_page, total: meta.total, pages: meta.pages } : undefined}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>

      {offers.length > 0 && <OfferComparison tenderId={offers[0].tender_id} />}
    </div>
  );
}