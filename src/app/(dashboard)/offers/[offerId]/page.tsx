'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useOffer } from '@/lib/hooks/use-offers';
import { formatCurrency, formatPercent, formatDate } from '@/lib/utils/format';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { useParams } from 'next/navigation';
import apiClient from '@/lib/api/client';
import { toast } from 'sonner';

export default function OfferDetailPage() {
  const router = useRouter();
  const params = useParams<{ offerId: string }>();
  const offerId = params.offerId;
  const { data: offer, isLoading, error, refetch } = useOffer(offerId);

  const handleReparse = async () => {
    try {
      await apiClient.post(`/api/v1/commercial-offers/${offerId}/reparse`);
      toast.success('Запущен репарсинг КП');
    } catch (e) {
      toast.error('Ошибка репарсинга');
    }
  };

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8" /><Skeleton className="h-32" /></div>;
  if (error) return <div className="text-center py-12 text-red-500">{error.message}</div>;
  if (!offer) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-semibold">КП от {offer.supplier_name}</h1>
            <p className="text-neutral-500">Тендер: {offer.tender_id}</p>
          </div>
        </div>
        <Button variant="outline" onClick={handleReparse}><RefreshCw className="h-4 w-4 mr-2" /> Репарсить</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500">Итого с обеспечением</div><div className="text-2xl font-semibold">{formatCurrency(offer.total_cost_with_all)}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500">Маржа</div><div className="text-2xl font-semibold text-green-600">{offer.margin_percent !== null ? formatPercent(offer.margin_percent) : '—'}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500">Покрытие</div><div className="text-2xl font-semibold">{offer.coverage}%</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500">Статус</div><div className="text-2xl font-semibold">{offer.status}</div></CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Позиции</CardTitle></CardHeader>
        <CardContent>
          {offer.positions?.length ? (
            <table className="w-full text-sm">
              <thead><tr className="border-b"><th className="text-left p-2">Название</th><th className="text-right p-2">Кол-во</th><th className="text-right p-2">Цена</th></tr></thead>
              <tbody>
                {offer.positions.map((pos) => (
                  <tr key={pos.id} className="border-b">
                    <td className="p-2">{pos.name}</td>
                    <td className="text-right p-2">{pos.quantity} {pos.unit}</td>
                    <td className="text-right p-2">{formatCurrency(pos.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="text-neutral-400">Нет позиций</p>}
        </CardContent>
      </Card>
    </div>
  );
}