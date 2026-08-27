import apiClient from './client';
import { Tender, TenderFilters, TenderStats } from '@/lib/types/tender';
import { APIResponse } from '@/lib/types/api';

export async function fetchTenders(params: TenderFilters = {}): Promise<APIResponse<Tender[]>> {
  const response = await apiClient.get('/api/v1/tenders', { params });
  return response.data;
}

export async function fetchTender(tenderId: string): Promise<APIResponse<Tender>> {
  const response = await apiClient.get(`/api/v1/tenders/${tenderId}`);
  return response.data;
}

export async function createTender(data: Partial<Tender>): Promise<APIResponse<Tender>> {
  const response = await apiClient.post('/api/v1/tenders', data);
  return response.data;
}

export async function updateTender(tenderId: string, data: Partial<Tender>): Promise<APIResponse<Tender>> {
  const response = await apiClient.patch(`/api/v1/tenders/${tenderId}`, data);
  return response.data;
}

export async function reprocessTender(tenderId: string): Promise<void> {
  await apiClient.post(`/api/v1/tenders/${tenderId}/reprocess`);
}

export async function fetchTenderTimeline(tenderId: string): Promise<any> {
  const response = await apiClient.get(`/api/v1/tenders/${tenderId}/timeline`);
  return response.data;
}

export async function fetchTenderStats(): Promise<APIResponse<TenderStats>> {
  const response = await apiClient.get('/api/v1/tenders/stats');
  return response.data;
}

export async function searchSuppliersForTender(tenderId: string, maxSuppliers?: number): Promise<void> {
  await apiClient.post(`/api/v1/tenders/${tenderId}/search-suppliers`, { max_suppliers: maxSuppliers });
}

export async function confirmSupplierSearch(tenderId: string, payload: any): Promise<void> {
  await apiClient.post(`/api/v1/tenders/${tenderId}/supplier-search-results/confirm`, payload);
}

export async function requestCP(tenderId: string, supplierIds: string[]): Promise<void> {
  await apiClient.post(`/api/v1/tenders/${tenderId}/request-cp`, { supplier_ids: supplierIds });
}