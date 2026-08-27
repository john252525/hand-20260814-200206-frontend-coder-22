import apiClient from './client';
import { Source } from '@/lib/types/source';
import { APIResponse } from '@/lib/types/api';

export async function fetchSources(): Promise<APIResponse<Source[]>> {
  const response = await apiClient.get('/api/v1/tender-sources'); return response.data;
}

export async function createSource(data: { name: string; type: string; api_url: string }): Promise<APIResponse<Source>> {
  const response = await apiClient.post('/api/v1/tender-sources', data); return response.data;
}

export async function deleteSource(sourceId: string): Promise<void> {
  await apiClient.delete(`/api/v1/tender-sources/${sourceId}`);
}