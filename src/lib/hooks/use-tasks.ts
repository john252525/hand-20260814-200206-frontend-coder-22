import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasks, cancelTask } from '@/lib/api/tasks';
import { toast } from 'sonner';

export function useTasks(params: any = {}) {
  return useQuery({ queryKey: ['tasks', params], queryFn: () => fetchTasks(params) });
}

export function useCancelTask() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: cancelTask, onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['tasks'] }); toast.success('Задача отменена'); }, onError: (e: Error) => toast.error(e.message) });
}