import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTenders, fetchTender, createTender, updateTender, reprocessTender, fetchTenderStats } from '@/lib/api/tenders';
import { Tender, TenderFilters, TenderStats } from '@/lib/types/tender';
import { toast } from 'sonner';

export function useTenders(params: TenderFilters = {}) {
  return useQuery({
    queryKey: ['tenders', params],
    queryFn: () => fetchTenders(params),
    staleTime: 5 * 60 * 1000,
    select: (data) => data.data,
  });
}

export function useTender(tenderId: string) {
  return useQuery({
    queryKey: ['tender', tenderId],
    queryFn: () => fetchTender(tenderId),
    enabled: !!tenderId,
    select: (data) => data.data,
  });
}

export function useTenderStats() {
  return useQuery<TenderStats>({
    queryKey: ['tender-stats'],
    queryFn: async () => {
      const res = await fetchTenderStats();
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useCreateTender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTender,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      toast.success('Тендер создан');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateTender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenderId, data }: { tenderId: string; data: Partial<Tender> }) =>
      updateTender(tenderId, data),
    onSuccess: (_, { tenderId }) => {
      queryClient.invalidateQueries({ queryKey: ['tenders'] });
      queryClient.invalidateQueries({ queryKey: ['tender', tenderId] });
      toast.success('Тендер обновлен');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useReprocessTender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reprocessTender,
    onSuccess: (_, tenderId) => {
      queryClient.invalidateQueries({ queryKey: ['tender', tenderId] });
      toast.success('Перезапуск обработки запущен');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}