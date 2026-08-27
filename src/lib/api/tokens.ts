import apiClient from './client';
import { Token } from '@/lib/types/token';
import { APIResponse } from '@/lib/types/api';

export async function fetchTokens(): Promise<APIResponse<Token[]>> {
  const response = await apiClient.get('/api/v1/tokens'); return response.data;
}

export async function createToken(data: { description: string; rate_limit_per_minute: number }): Promise<APIResponse<Token>> {
  const response = await apiClient.post('/api/v1/tokens', data); return response.data;
}

export async function deleteToken(tokenId: string): Promise<void> {
  await apiClient.delete(`/api/v1/tokens/${tokenId}`);
}