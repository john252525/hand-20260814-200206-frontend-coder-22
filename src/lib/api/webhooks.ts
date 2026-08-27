import apiClient from './client';
import { Webhook } from '@/lib/types/webhook';
import { APIResponse } from '@/lib/types/api';

export async function fetchWebhooks(): Promise<APIResponse<Webhook[]>> {
  const response = await apiClient.get('/api/v1/webhooks'); return response.data;
}

export async function createWebhook(data: { url: string; events: string[]; is_active: boolean }): Promise<APIResponse<Webhook>> {
  const response = await apiClient.post('/api/v1/webhooks', data); return response.data;
}

export async function deleteWebhook(webhookId: string): Promise<void> {
  await apiClient.delete(`/api/v1/webhooks/${webhookId}`);
}