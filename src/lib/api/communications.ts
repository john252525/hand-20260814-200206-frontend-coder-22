import apiClient from './client';
import { APIResponse } from '@/lib/types/api';

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

export async function fetchThreads(params: {
  search?: string;
  filter?: string;
  page?: number;
  per_page?: number;
} = {}): Promise<APIResponse<Thread[]>> {
  try {
    const tendersResponse = await apiClient.get('/api/v1/tenders', { params: { per_page: 100 } });
    const tenders = tendersResponse.data?.data || [];
    const threads: Thread[] = [];

    for (const tender of tenders) {
      const messagesResponse = await apiClient.get(`/api/v1/communications/by-tender/${tender.id}`);
      const messages = messagesResponse.data?.data || [];
      const grouped = new Map<string, Message[]>();

      for (const m of messages) {
        if (!grouped.has(m.lot_supplier_id)) {
          grouped.set(m.lot_supplier_id, []);
        }
        grouped.get(m.lot_supplier_id)!.push(m);
      }

      for (const [lotSupplierId, msgs] of grouped) {
        const last = msgs[msgs.length - 1];
        const incoming = msgs.find(m => m.direction === 'incoming');
        threads.push({
          lot_supplier_id: lotSupplierId,
          supplier_name: incoming ? `Поставщик ${lotSupplierId.slice(0, 8)}` : `Поставщик ${lotSupplierId.slice(0, 8)}`,
          tender_id: tender.id,
          tender_title: tender.title,
          last_message: last.body_text,
          last_message_at: last.created_at,
          unread_count: 0,
        });
      }
    }

    return {
      data: threads,
      meta: { page: params.page || 1, per_page: params.per_page || 100, total: threads.length, pages: 1 },
    };
  } catch (error) {
    console.error('Failed to fetch threads', error);
    return { data: [], meta: { page: 1, per_page: 20, total: 0, pages: 0 } };
  }
}