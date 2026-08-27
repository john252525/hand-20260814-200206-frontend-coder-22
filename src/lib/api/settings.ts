import apiClient from './client';
import { APIResponse } from '@/lib/types/api';

export async function fetchSettings(): Promise<APIResponse<Record<string, any>>> {
  const response = await apiClient.get('/api/v1/settings');
  return response.data;
}

export async function updateSettings(section: string, data: Record<string, any>): Promise<APIResponse<any>> {
  const response = await apiClient.patch(`/api/v1/settings/${section}`, data);
  return response.data;
}