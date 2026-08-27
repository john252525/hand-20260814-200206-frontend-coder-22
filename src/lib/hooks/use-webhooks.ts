import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchWebhooks, createWebhook, deleteWebhook } from '@/lib/api/webhooks';
import { toast } from 'sonner';

export function useWebhooks() { return useQuery({ queryKey: ['webhooks'], queryFn: fetchWebhooks, select: (data) => data.data }); }
export function useCreateWebhook() { const qc = useQueryClient(); return useMutation({ mutationFn: createWebhook, onSuccess: () => { qc.invalidateQueries({ queryKey: ['webhooks'] }); toast.success('Вебхук создан'); }, onError: (e: Error) => toast.error(e.message) }); }
export function useDeleteWebhook() { const qc = useQueryClient(); return useMutation({ mutationFn: deleteWebhook, onSuccess: () => { qc.invalidateQueries({ queryKey: ['webhooks'] }); toast.success('Вебхук удалён'); }, onError: (e: Error) => toast.error(e.message) }); }