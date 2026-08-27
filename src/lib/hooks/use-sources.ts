import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSources, createSource, deleteSource } from '@/lib/api/sources';
import { toast } from 'sonner';

export function useSources() { return useQuery({ queryKey: ['sources'], queryFn: fetchSources, select: (data) => data.data }); }
export function useCreateSource() { const qc = useQueryClient(); return useMutation({ mutationFn: createSource, onSuccess: () => { qc.invalidateQueries({ queryKey: ['sources'] }); toast.success('Источник добавлен'); }, onError: (e: Error) => toast.error(e.message) }); }
export function useDeleteSource() { const qc = useQueryClient(); return useMutation({ mutationFn: deleteSource, onSuccess: () => { qc.invalidateQueries({ queryKey: ['sources'] }); toast.success('Источник удалён'); }, onError: (e: Error) => toast.error(e.message) }); }