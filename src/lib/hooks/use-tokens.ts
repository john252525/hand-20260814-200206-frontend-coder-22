import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTokens, createToken, deleteToken } from '@/lib/api/tokens';
import { toast } from 'sonner';

export function useTokens() { return useQuery({ queryKey: ['tokens'], queryFn: fetchTokens, select: (data) => data.data }); }
export function useCreateToken() { const qc = useQueryClient(); return useMutation({ mutationFn: createToken, onSuccess: () => { qc.invalidateQueries({ queryKey: ['tokens'] }); toast.success('Токен создан'); }, onError: (e: Error) => toast.error(e.message) }); }
export function useDeleteToken() { const qc = useQueryClient(); return useMutation({ mutationFn: deleteToken, onSuccess: () => { qc.invalidateQueries({ queryKey: ['tokens'] }); toast.success('Токен удалён'); }, onError: (e: Error) => toast.error(e.message) }); }