import apiClient from './client';
import { APIResponse } from '@/lib/types/api';

export interface NegotiationStatus {
  tender_id: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  cycles_completed: number;
  max_cycles: number;
  suppliers: Array<{
    supplier_id: string;
    supplier_name: string;
    initial_margin_percent: number;
    current_margin_percent: number;
    improvement_percent: number;
    status: 'IN_PROGRESS' | 'IMPROVED' | 'DECLINED';
    last_action: string;
  }>;
}

export async function startNegotiation(tenderId: string, payload: { action?: string; target_supplier_ids?: string[]; custom_instructions?: string } = {}): Promise<APIResponse<NegotiationStatus>> {
  const response = await apiClient.post(`/api/v1/negotiations/tenders/${tenderId}/negotiate`, {
    action: payload.action || 'request_clarification',
    target_supplier_ids: payload.target_supplier_ids || [],
    custom_instructions: payload.custom_instructions || null,
  });
  return response.data;
}

export async function fetchNegotiationStatus(tenderId: string): Promise<APIResponse<NegotiationStatus>> {
  const response = await apiClient.get(`/api/v1/negotiations/status`, { params: { tender_id: tenderId } });
  return response.data;
}