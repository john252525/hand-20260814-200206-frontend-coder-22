'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSupplier, useDeleteSupplier } from '@/lib/hooks/use-suppliers';
import { formatCurrency, formatDate } from '@/lib/utils/format';
import { ArrowLeft, Pencil, Trash, Mail, Phone, Globe } from 'lucide-react';
import Link from 'next/link';

export default function SupplierDetailPage() {
  const params = useParams<{ supplierId: string }>();
  const router = useRouter();
  const supplierId = params.supplierId;
  const { data: supplier, isLoading, error } = useSupplier(supplierId);
  const deleteSupplier = useDeleteSupplier();

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8" /><Skeleton className="h-32" /></div>;
  if (error) return <div className="text-center py-12 text-red-500">{error.message}</div>;
  if (!supplier) return null;

  const handleDelete = () => {
    if (confirm('Удалить поставщика?')) {
      deleteSupplier.mutate(supplierId, { onSuccess: () => router.push('/suppliers') });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-semibold">{supplier.name}</h1>
            <div className="text-sm text-neutral-500">{supplier.type}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/suppliers/${supplierId}/edit`}><Button variant="outline"><Pencil className="h-4 w-4 mr-2" />Редактировать</Button></Link>
          <Button variant="danger" onClick={handleDelete}><Trash className="h-4 w-4 mr-2" />Удалить</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500">Email</div><div className="flex items-center gap-1"><Mail className="h-4 w-4" />{supplier.email || '—'}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500">Телефон</div><div className="flex items-center gap-1"><Phone className="h-4 w-4" />{supplier.phone || '—'}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500">Сайт</div><div className="flex items-center gap-1"><Globe className="h-4 w-4" />{supplier.website || '—'}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500">Объем сделок</div><div className="text-lg font-semibold">{formatCurrency(supplier.total_volume_rub)}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Информация</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div><b>ИНН:</b> {supplier.inn || '—'}</div>
          <div><b>КПП:</b> {supplier.kpp || '—'}</div>
          <div><b>ОГРН:</b> {supplier.ogrn || '—'}</div>
          <div><b>Адрес:</b> {supplier.legal_address || '—'}</div>
          <div><b>Дата создания:</b> {formatDate(supplier.created_at)}</div>
          {supplier.tags?.length > 0 && <div><b>Теги:</b> {supplier.tags.join(', ')}</div>}
        </CardContent>
      </Card>
    </div>
  );
}