'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/shared/data-table';
import { SupplierCard } from '@/components/suppliers/supplier-card';
import { useSuppliers } from '@/lib/hooks/use-suppliers';
import { formatCurrency } from '@/lib/utils/format';
import { Plus, Search, LayoutGrid, List, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { Supplier } from '@/lib/types/supplier';

export default function SuppliersPage() {
  const router = useRouter();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useSuppliers({ search, page, per_page: 20 });
  const suppliers = data?.data || [];
  const meta = data?.meta;

  const columns = useMemo<ColumnDef<Supplier, any>[]>(() => [
    { accessorKey: 'name', header: 'Название' },
    { accessorKey: 'type', header: 'Тип' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'phone', header: 'Телефон' },
    { accessorKey: 'successful_deals', header: 'Сделок' },
    { accessorKey: 'total_volume_rub', header: 'Объем', cell: ({ row }) => formatCurrency(row.original.total_volume_rub) },
  ], []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Поставщики</h1>
          <p className="text-neutral-500 mt-1">Всего: {meta?.total ?? 0}</p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-neutral-100 rounded-lg p-1">
            <Button variant={view === 'grid' ? 'default' : 'ghost'} size="sm" onClick={() => setView('grid')}><LayoutGrid className="h-4 w-4" /></Button>
            <Button variant={view === 'list' ? 'default' : 'ghost'} size="sm" onClick={() => setView('list')}><List className="h-4 w-4" /></Button>
          </div>
          <Button onClick={() => router.push('/suppliers/create')}><Plus className="h-4 w-4 mr-2" /> Добавить</Button>
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Поиск поставщиков..." className="pl-9" />
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {suppliers.map((s) => <SupplierCard key={s.id} supplier={s} onClick={() => router.push(`/suppliers/${s.id}`)} />)}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={suppliers}
              loading={isLoading}
              error={error as Error}
              onRetry={refetch}
              onRowClick={(row) => router.push(`/suppliers/${row.id}`)}
              pagination={meta ? { page: meta.page, perPage: meta.per_page, total: meta.total, pages: meta.pages } : undefined}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>
      )}

      {view === 'grid' && meta && meta.pages > 1 && (
        <div className="flex justify-center gap-2">
          <Button variant="outline" disabled={page <= 1} onClick={() => setPage(p => p-1)}><ChevronLeft className="h-4 w-4" /> Назад</Button>
          <span className="py-2 text-sm">{page} / {meta.pages}</span>
          <Button variant="outline" disabled={page >= meta.pages} onClick={() => setPage(p => p+1)}>Вперед <ChevronRight className="h-4 w-4" /></Button>
        </div>
      )}
    </div>
  );
}