import apiClient from './client';
import { APIResponse } from '@/lib/types/api';
import { mockThreads } from '@/lib/mocks/threads';

export interface Thread {
  lot_supplier_id: string;
  supplier_name: string;
  tender_id: string;
  tender_title: string;
  last_message: string;
  last_message_at: string;
  unread_count: number;
}

export interface Message {
  id: string;
  lot_supplier_id: string;
  direction: 'outgoing' | 'incoming';
  channel: 'email' | 'telegram' | 'whatsapp' | 'web_form';
  subject: string;
  body_text: string;
  message_type: string;
  created_at: string;
}

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS === 'true';

export async function fetchThreads(params: {
  search?: string;
  filter?: string;
  page?: number;
  per_page?: number;
} = {}): Promise<APIResponse<Thread[]>> {
  if (USE_MOCKS) {
    let data = mockThreads as unknown as Thread[];
    if (params.search) {
      const q = params.search.toLowerCase();
      data = data.filter(t => t.supplier_name.toLowerCase().includes(q) || t.tender_title.toLowerCase().includes(q));
    }
    return { data, meta: { page: 1, per_page: data.length, total: data.length, pages: 1 } };
  }
  // TODO: заменить на реальный эндпоинт /threads, когда он появится на бэкенде
  const response = await apiClient.get('/api/v1/communications/threads', { params });
  return response.data;
}

export async function fetchMessagesByTender(tenderId: string): Promise<APIResponse<Message[]>> {
  const response = await apiClient.get(`/api/v1/communications/by-tender/${tenderId}`);
  return response.data;
}

export async function fetchMessages(lotSupplierId: string, tenderId: string): Promise<APIResponse<Message[]>> {
  const response = await apiClient.get(`/api/v1/communications/by-tender/${tenderId}`);
  const messages = (response.data?.data || []).filter((m: Message) => m.lot_supplier_id === lotSupplierId);
  return { ...response.data, data: messages };
}

export async function sendMessage(data: {
  lot_supplier_id: string;
  direction?: 'outgoing';
  channel?: string;
  subject?: string;
  body_text: string;
  message_type?: string;
}): Promise<APIResponse<Message>> {
  const response = await apiClient.post('/api/v1/communications', data);
  return response.data;
}