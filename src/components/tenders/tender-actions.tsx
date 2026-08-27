'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQueryClient } from '@tanstack/react-query';
import { useReprocessTender, useTender, useSearchSuppliersForTender, useRequestCp } from '@/lib/hooks/use-tenders';
import { useStartNegotiation } from '@/lib/hooks/use-negotiations';
import { useWebSocket } from '@/lib/hooks/use-websocket';
import { RefreshCw, Search, FileText, Handshake, Loader2 } from 'lucide-react';

export function TenderActions({ tenderId }: { tenderId: string }) {
  const [cpDialogOpen, setCpDialogOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const reprocess = useReprocessTender();
  const searchSuppliers = useSearchSuppliersForTender();
  const requestCp = useRequestCp();
  const startNegotiation = useStartNegotiation();
  const { data: tender } = useTender(tenderId);
  const { subscribe } = useWebSocket();
  const queryClient = useQueryClient();

  const suppliers = tender?.suppliers || [];

  const handleRequestCp = () => {
    if (!selectedSupplierId) return;
    requestCp.mutate({ tenderId, supplierIds: [selectedSupplierId] });
    setCpDialogOpen(false);
    setSelectedSupplierId('');
  };

  useEffect(() => {
    if (!subscribe || !tenderId) return;
    const unsubscribe = subscribe('tender:status_changed', (data) => {
      if (data.tender_id === tenderId) {
        queryClient.invalidateQueries({ queryKey: ['tender', tenderId] });
        queryClient.invalidateQueries({ queryKey: ['tenders'] });
      }
    });
    const unsubscribeTask = subscribe('task:completed', (data) => {
      if (data.entity_id === tenderId) {
        queryClient.invalidateQueries({ queryKey: ['tender', tenderId] });
      }
    });
    return () => {
      unsubscribe();
      unsubscribeTask();
    };
  }, [subscribe, tenderId, queryClient]);

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() => reprocess.mutate(tenderId)} disabled={reprocess.isPending}>
        {reprocess.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
        Перезапустить
      </Button>
      <Button size="sm" variant="outline" onClick={() => searchSuppliers.mutate({ tenderId, maxSuppliers: 10 })} disabled={searchSuppliers.isPending}>
        {searchSuppliers.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
        Поиск поставщиков
      </Button>
      <Dialog open={cpDialogOpen} onOpenChange={setCpDialogOpen}>
        <DialogTrigger asChild><Button size="sm" variant="outline"><FileText className="h-4 w-4 mr-2" />Запросить КП</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Запрос КП</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Поставщик</Label>
              {suppliers.length === 0 ? (
                <p className="text-sm text-neutral-500">Сначала выполните поиск поставщиков.</p>
              ) : (
                <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                  <SelectTrigger><SelectValue placeholder="Выберите поставщика" /></SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier: any) => (
                      <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCpDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleRequestCp} disabled={!selectedSupplierId || requestCp.isPending}>{requestCp.isPending ? 'Запрос...' : 'Отправить'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Button size="sm" variant="outline" onClick={() => startNegotiation.mutate({ tenderId })} disabled={startNegotiation.isPending}>
        {startNegotiation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Handshake className="h-4 w-4 mr-2" />}
        Начать переговоры
      </Button>
    </div>
  );
}