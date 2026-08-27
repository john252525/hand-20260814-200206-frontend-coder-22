import apiClient from './client';
import { Task } from '@/lib/types/task';
import { APIResponse } from '@/lib/types/api';

export async function fetchTasks(params: { status?: string; task_type?: string; page?: number; per_page?: number } = {}): Promise<APIResponse<Task[]>> {
  const response = await apiClient.get('/api/v1/tasks', { params });
  return response.data;
}

export async function cancelTask(taskId: string): Promise<void> {
  await apiClient.post(`/api/v1/tasks/${taskId}/cancel`);
}