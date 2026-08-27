// Добавляем вкладку 'offers' со сравнением КП
'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useTender } from '@/lib/hooks/use-tenders';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils/format';
import { ArrowLeft, RefreshCw, FileText, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OfferComparison } from '@/components/offers/offer-comparison';

export default function TenderDetailPage({ params }: { params: { tenderId: string } }) {
  const router = useRouter();
  const { data: tender, isLoading, error, refetch } = useTender(params.tenderId);

  if (isLoading) return <div className="space-y-4"><Skeleton className="h-8" /><Skeleton className="h-32" /></div>;
  if (error) return <div className="text-center py-12 text-red-500">{error.message}</div>;
  if (!tender) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div>
            <h1 className="text-2xl font-semibold">{tender.title}</h1>
            <p className="text-neutral-500">{tender.customer_name || 'Без заказчика'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={tender.status} />
          <Button variant="outline" size="icon" onClick={() => refetch()}><RefreshCw className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500">НМЦК</div><div className="text-2xl font-semibold">{formatCurrency(tender.nmck)}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500">Дедлайн</div><div className="text-2xl font-semibold">{formatDate(tender.deadline_at)}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500">Поставщиков</div><div className="text-2xl font-semibold">{tender.suppliers_count || 0}</div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-sm text-neutral-500">Скор</div><div className="text-2xl font-semibold">{tender.score ?? '—'}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="description">
        <TabsList>
          <TabsTrigger value="description">Описание</TabsTrigger>
          <TabsTrigger value="timeline">Таймлайн</TabsTrigger>
          <TabsTrigger value="documents">Документы</TabsTrigger>
          <TabsTrigger value="positions">Позиции</TabsTrigger>
          <TabsTrigger value="offers">Сравнение КП</TabsTrigger>
        </TabsList>

        <TabsContent value="description">
          <Card><CardHeader><CardTitle>Описание</CardTitle></CardHeader><CardContent><p className="whitespace-pre-wrap">{tender.description || 'Нет описания'}</p></CardContent></Card>
        </TabsContent>

        <TabsContent value="timeline">
          <Card><CardHeader><CardTitle>Таймлайн</CardTitle></CardHeader><CardContent>
            {tender.timeline?.length ? (
              <ol className="relative border-l border-neutral-200 ml-3">{tender.timeline.map((item) => (
                <li key={item.id} className="mb-6 ml-4"><div className="absolute w-3 h-3 bg-primary-600 rounded-full -left-1.5 mt-1.5" /><StatusBadge status={item.status} size="sm" /><div className="text-sm text-neutral-500 mt-1">{item.details}</div><time className="text-xs text-neutral-400">{formatDateTime(item.timestamp)}</time></li>
              ))}</ol>
            ) : <p className="text-neutral-400">Нет данных</p>}
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card><CardHeader><CardTitle>Документы</CardTitle></CardHeader><CardContent>{tender.documents?.length ? <div>{tender.documents.map((doc) => <div key={doc.id} className="flex items-center gap-2 p-2 bg-neutral-50 rounded"><FileText className="h-4 w-4 text-neutral-400" /><span className="text-sm">{doc.filename}</span></div>)}</div> : <p className="text-neutral-400">Нет документов</p>}</CardContent></Card>
        </TabsContent>

        <TabsContent value="positions">
          <Card><CardHeader><CardTitle>Позиции</CardTitle></CardHeader><CardContent>{tender.positions?.length ? <table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left p-2">Название</th><th className="text-right p-2">Кол-во</th><th className="text-right p-2">Цена</th></tr></thead><tbody>{tender.positions.map((pos) => <tr key={pos.id} className="border-b"><td className="p-2">{pos.name}</td><td className="text-right p-2">{pos.quantity} {pos.unit}</td><td className="text-right p-2">{formatCurrency(pos.total)}</td></tr>)}</tbody></table> : <p className="text-neutral-400">Нет позиций</p>}</CardContent></Card>
        </TabsContent>

        <TabsContent value="offers">
          <OfferComparison tenderId={params.tenderId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}