import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDecisions, approveTender, rejectTender, requestInfo } from '@/lib/api/decisions';
import { ApprovePayload, RejectPayload, RequestInfoPayload } from '@/lib/types/decision';
import { toast } from 'sonner';

export function useDecisions(params: { status?: string; page?: number; per_page?: number } = {}) {
  return useQuery({
    queryKey: ['decisions', params],
    queryFn: () => fetchDecisions(params),
  });
}

export function useApproveTender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenderId, payload }: { tenderId: string; payload: ApprovePayload }) => approveTender(tenderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      toast.success('Тендер одобрен');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useRejectTender() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenderId, payload }: { tenderId: string; payload: RejectPayload }) => rejectTender(tenderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      toast.success('Тендер отклонен');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useRequestInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenderId, payload }: { tenderId: string; payload: RequestInfoPayload }) => requestInfo(tenderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      toast.success('Запрос отправлен');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}