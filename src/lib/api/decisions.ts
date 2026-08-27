import apiClient from './client';
import { Decision, ApprovePayload, RejectPayload, RequestInfoPayload } from '@/lib/types/decision';
import { APIResponse } from '@/lib/types/api';

export async function fetchDecisions(params: { status?: string; page?: number; per_page?: number } = {}): Promise<APIResponse<Decision[]>> {
  const response = await apiClient.get('/api/v1/decisions', { params });
  return response.data;
}

export async function approveTender(tenderId: string, payload: ApprovePayload): Promise<void> {
  await apiClient.post(`/api/v1/decisions/${tenderId}/approve`, payload);
}

export async function rejectTender(tenderId: string, payload: RejectPayload): Promise<void> {
  await apiClient.post(`/api/v1/decisions/${tenderId}/reject`, payload);
}

export async function requestInfo(tenderId: string, payload: RequestInfoPayload): Promise<void> {
  await apiClient.post(`/api/v1/decisions/${tenderId}/request-info`, payload);
}