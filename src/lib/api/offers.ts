import apiClient from './client';
import { CommercialOffer } from '@/lib/types/offer';
import { APIResponse } from '@/lib/types/api';

export async function fetchOffers(params: {
  tender_id?: string;
  supplier_id?: string;
  status?: string;
  page?: number;
  per_page?: number;
} = {}): Promise<APIResponse<CommercialOffer[]>> {
  const response = await apiClient.get('/api/v1/commercial-offers', { params });
  return response.data;
}

export async function fetchOffer(offerId: string): Promise<APIResponse<CommercialOffer>> {
  const response = await apiClient.get(`/api/v1/commercial-offers/${offerId}`);
  return response.data;
}