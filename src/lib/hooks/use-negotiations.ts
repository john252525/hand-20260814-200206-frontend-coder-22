import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { startNegotiation, fetchNegotiationStatus, NegotiationStatus } from '@/lib/api/negotiations';
import { toast } from 'sonner';

export function useStartNegotiation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tenderId, payload }: { tenderId: string; payload?: any }) => startNegotiation(tenderId, payload),
    onSuccess: (_, { tenderId }) => {
      queryClient.invalidateQueries({ queryKey: ['negotiation-status', tenderId] });
      toast.success('Переговоры запущены');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useNegotiationStatus(tenderId: string) {
  return useQuery<NegotiationStatus>({
    queryKey: ['negotiation-status', tenderId],
    queryFn: async () => {
      const res = await fetchNegotiationStatus(tenderId);
      return res.data;
    },
    enabled: !!tenderId,
  });
}