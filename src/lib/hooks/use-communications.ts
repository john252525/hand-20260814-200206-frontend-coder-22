import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchThreads, fetchMessages, fetchMessagesByTender, sendMessage } from '@/lib/api/communications';
import { useWebSocket } from '@/lib/hooks/use-websocket';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useThreads(params: { search?: string; filter?: string; page?: number; per_page?: number } = {}) {
  return useQuery({
    queryKey: ['threads', params],
    queryFn: () => fetchThreads(params),
    select: (data) => data.data,
  });
}

export function useMessages(lotSupplierId: string, tenderId: string) {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['messages', lotSupplierId],
    queryFn: () => fetchMessages(lotSupplierId, tenderId),
    enabled: !!lotSupplierId && !!tenderId,
    select: (data) => data.data,
  });

  // WebSocket: подписка на новые сообщения
  const { subscribe } = useWebSocket();
  useEffect(() => {
    if (!subscribe || !lotSupplierId) return;
    const unsubscribe = subscribe('message:new', (message) => {
      if (message.lot_supplier_id === lotSupplierId) {
        queryClient.setQueryData(['messages', lotSupplierId], (old: Message[] | undefined) => {
          return old ? [...old, message] : [message];
        });
      }
    });
    return unsubscribe;
  }, [subscribe, lotSupplierId, queryClient]);

  return query;
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.lot_supplier_id] });
      toast.success('Сообщение отправлено');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}