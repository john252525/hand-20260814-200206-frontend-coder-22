'use client';

import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useOffers } from '@/lib/hooks/use-offers';
import { formatCurrency, formatPercent } from '@/lib/utils/format';
import { Check, X } from 'lucide-react';

interface OfferComparisonProps {
  tenderId: string;
}

export function OfferComparison({ tenderId }: OfferComparisonProps) {
  const { data, isLoading, error } = useOffers({ tender_id: tenderId, per_page: 50 });
  const offers = data?.data || [];
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (isLoading) return <div className="p-4 text-sm text-neutral-500">Загрузка...</div>;
  if (error) return <div className="p-4 text-sm text-red-500">Ошибка загрузки КП</div>;

  const offersToCompare = selectedIds.length > 0 ? offers.filter(o => selectedIds.includes(o.id)) : offers.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {offers.map((offer) => (
          <Button
            key={offer.id}
            size="sm"
            variant={selectedIds.includes(offer.id) ? 'default' : 'outline'}
            onClick={() => toggle(offer.id)}
          >
            {offer.supplier_name}
          </Button>
        ))}
      </div>
      {offersToCompare.length === 0 ? (
        <p className="text-sm text-neutral-400">Нет КП для сравнения</p>
      ) : (
        <Card>
          <CardHeader><CardTitle>Сравнение</CardTitle></CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Критерий</th>
                  {offersToCompare.map((o) => <th key={o.id} className="p-2">{o.supplier_name}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-2">Покрытие</td>{offersToCompare.map((o) => <td key={o.id} className="p-2">{o.coverage}%</td>)}</tr>
                <tr><td className="p-2">Итого с обеспечением</td>{offersToCompare.map((o) => <td key={o.id} className="p-2">{formatCurrency(o.total_cost_with_all)}</td>)}</tr>
                <tr><td className="p-2">Маржа</td>{offersToCompare.map((o) => <td key={o.id} className="p-2">{o.margin_percent !== null ? formatPercent(o.margin_percent) : '—'}</td>)}</tr>
                <tr><td className="p-2">Требует уточнения</td>{offersToCompare.map((o) => <td key={o.id} className="p-2">{o.clarification_needed ? <X className="h-4 w-4 text-red-500" /> : <Check className="h-4 w-4 text-green-500" />}</td>)}</tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}