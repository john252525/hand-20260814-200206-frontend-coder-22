import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTenders, fetchTender, createTender, updateTender, reprocessTender, fetchTenderStats, searchSuppliersForTender, confirmSupplierSearch, requestCP } from '@/lib/api/tenders';
import { Tender, TenderFilters, TenderStats } from '@/lib/types/tender';
import { toast } from 'sonner';

export function useTenders(params: TenderFilters = {}) {
  return useQuery({ queryKey: ['tenders', params], queryFn: () => fetchTenders(params), staleTime: 5 * 60 * 1000 });
}

export function useTender(tenderId: string) {
  return useQuery({ queryKey: ['tender', tenderId], queryFn: () => fetchTender(tenderId), enabled: !!tenderId, select: (data) => data.data });
}

export function useTenderStats() {
  return useQuery<TenderStats>({ queryKey: ['tender-stats'], queryFn: async () => { const res = await fetchTenderStats(); return res.data; }, staleTime: 10 * 60 * 1000 });
}

export function useCreateTender() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: createTender, onSuccess: () => { qc.invalidateQueries({ queryKey: ['tenders'] }); toast.success('Тендер создан'); }, onError: (e: Error) => toast.error(e.message) });
}

export function useUpdateTender() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ tenderId, data }: { tenderId: string; data: Partial<Tender> }) => updateTender(tenderId, data), onSuccess: (_, { tenderId }) => { qc.invalidateQueries({ queryKey: ['tenders'] }); qc.invalidateQueries({ queryKey: ['tender', tenderId] }); toast.success('Тендер обновлен'); }, onError: (e: Error) => toast.error(e.message) });
}

export function useReprocessTender() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: reprocessTender, onSuccess: (_, tenderId) => { qc.invalidateQueries({ queryKey: ['tender', tenderId] }); toast.success('Перезапуск обработки запущен'); }, onError: (e: Error) => toast.error(e.message) });
}

export function useSearchSuppliersForTender() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ tenderId, maxSuppliers }: { tenderId: string; maxSuppliers?: number }) => searchSuppliersForTender(tenderId, maxSuppliers), onSuccess: (_, { tenderId }) => { qc.invalidateQueries({ queryKey: ['tender', tenderId] }); toast.success('Поиск поставщиков запущен'); }, onError: (e: Error) => toast.error(e.message) });
}

export function useConfirmSupplierSearch() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ tenderId, payload }: { tenderId: string; payload: any }) => confirmSupplierSearch(tenderId, payload), onSuccess: (_, { tenderId }) => { qc.invalidateQueries({ queryKey: ['tender', tenderId] }); toast.success('Поставщики подтверждены'); }, onError: (e: Error) => toast.error(e.message) });
}

export function useRequestCp() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ tenderId, supplierIds }: { tenderId: string; supplierIds: string[] }) => requestCP(tenderId, supplierIds), onSuccess: (_, { tenderId }) => { qc.invalidateQueries({ queryKey: ['tender', tenderId] }); toast.success('Запрос КП отправлен'); }, onError: (e: Error) => toast.error(e.message) });
}