'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useApproveTender, useRejectTender, useRequestInfo } from '@/lib/hooks/use-decisions';
import { useOffers } from '@/lib/hooks/use-offers';
import { Decision } from '@/lib/types/decision';
import { formatCurrency, formatPercent } from '@/lib/utils/format';
import { Loader2 } from 'lucide-react';

export function DecisionActions({ decision }: { decision: Decision }) {
  const [approveOpen, setApproveOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [rejectComment, setRejectComment] = useState('');
  const [infoInstructions, setInfoInstructions] = useState('');

  const approveMut = useApproveTender();
  const rejectMut = useRejectTender();
  const infoMut = useRequestInfo();

  const { data: offersData, isLoading: offersLoading } = useOffers({ tender_id: decision.tender_id, per_page: 50 });
  const offers = offersData?.data || [];

  const handleApprove = () => {
    if (!selectedOfferId) return;
    const offer = offers.find((o) => o.id === selectedOfferId);
    approveMut.mutate({
      tenderId: decision.tender_id,
      payload: { chosen_supplier_id: offer?.supplier_id || '', chosen_offer_id: selectedOfferId, comment: 'Одобрено через интерфейс' },
    });
    setApproveOpen(false);
  };

  const handleReject = () => {
    rejectMut.mutate({ tenderId: decision.tender_id, payload: { reason: rejectReason || 'manual_rejection', comment: rejectComment } });
    setRejectOpen(false);
  };

  const handleInfo = () => {
    infoMut.mutate({ tenderId: decision.tender_id, payload: { instructions: infoInstructions } });
    setInfoOpen(false);
  };

  return (
    <div className="flex gap-1">
      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogTrigger asChild><Button size="sm" variant="success">Одобрить</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Одобрить тендер</DialogTitle><DialogDescription>Выберите КП для одобрения</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Коммерческое предложение</Label>
              {offersLoading ? <Loader2 className="animate-spin" /> : (
                <Select value={selectedOfferId} onValueChange={setSelectedOfferId}>
                  <SelectTrigger><SelectValue placeholder="Выберите КП" /></SelectTrigger>
                  <SelectContent>
                    {offers.map((offer) => (
                      <SelectItem key={offer.id} value={offer.id}>
                        {offer.supplier_name} — {formatCurrency(offer.total_cost_with_all)} (маржа {offer.margin_percent !== null ? formatPercent(offer.margin_percent) : '—'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>Отмена</Button>
            <Button onClick={handleApprove} disabled={!selectedOfferId || approveMut.isPending}>{approveMut.isPending ? 'Одобрение...' : 'Одобрить'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogTrigger asChild><Button size="sm" variant="danger">Отклонить</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Отклонить тендер</DialogTitle><DialogDescription>Укажите причину</DialogDescription></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Причина</Label>
              <Select value={rejectReason} onValueChange={setRejectReason}>
                <SelectTrigger><SelectValue placeholder="Выберите причину" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low_margin">Низкая маржа</SelectItem>
                  <SelectItem value="high_risk">Высокий риск</SelectItem>
                  <SelectItem value="no_supplier">Нет подходящего поставщика</SelectItem>
                  <SelectItem value="manual_rejection">Ручное отклонение</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Комментарий</Label>
              <Textarea value={rejectComment} onChange={(e) => setRejectComment(e.target.value)} rows={3} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>Отмена</Button>
            <Button variant="danger" onClick={handleReject} disabled={rejectMut.isPending}>{rejectMut.isPending ? 'Отклонение...' : 'Отклонить'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={infoOpen} onOpenChange={setInfoOpen}>
        <DialogTrigger asChild><Button size="sm" variant="outline">Запрос инфо</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Запросить информацию</DialogTitle><DialogDescription>Укажите, что нужно уточнить</DialogDescription></DialogHeader>
          <Textarea value={infoInstructions} onChange={(e) => setInfoInstructions(e.target.value)} rows={4} placeholder="Например: уточнить сроки доставки" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setInfoOpen(false)}>Отмена</Button>
            <Button onClick={handleInfo} disabled={!infoInstructions.trim() || infoMut.isPending}>{infoMut.isPending ? 'Отправка...' : 'Отправить'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}