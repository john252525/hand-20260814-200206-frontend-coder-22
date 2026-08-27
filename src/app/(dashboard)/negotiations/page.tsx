'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTenders } from '@/lib/hooks/use-tenders';
import { useStartNegotiation } from '@/lib/hooks/use-negotiations';
import { formatCurrency } from '@/lib/utils/format';
import { Handshake, ArrowRight } from 'lucide-react';

export default function NegotiationsPage() {
  const { data, isLoading, error, refetch } = useTenders({ per_page: 20, status: 'AWAITING_CP' });
  const startNegotiation = useStartNegotiation();
  const tenders = data?.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Переговоры</h1>
      <Card>
        <CardContent className="p-4">
          {isLoading && <div className="text-sm text-neutral-500">Загрузка...</div>}
          {error && <div className="text-sm text-red-500">Ошибка: {error.message}</div>}
          {!isLoading && !error && tenders.length === 0 && <div className="text-sm text-neutral-400">Нет тендеров для переговоров</div>}
          <div className="divide-y">
            {tenders.map((tender) => (
              <div key={tender.id} className="py-3 flex justify-between items-center">
                <div>
                  <div className="font-medium">{tender.title}</div>
                  <div className="text-sm text-neutral-500">{formatCurrency(tender.nmck)}</div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => startNegotiation.mutate({ tenderId: tender.id })}>
                    <Handshake className="h-4 w-4 mr-2" /> Начать переговоры
                  </Button>
                  <Link href={`/negotiations/${tender.id}`} className="inline-flex items-center">
                    <Button size="sm" variant="outline">Статус <ArrowRight className="h-4 w-4 ml-1" /></Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}