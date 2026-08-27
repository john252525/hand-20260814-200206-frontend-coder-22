import apiClient from './client';
import { Supplier, SupplierCreatePayload, SupplierUpdatePayload } from '@/lib/types/supplier';
import { APIResponse } from '@/lib/types/api';

export async function fetchSuppliers(params: {
  search?: string;
  type?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
} = {}): Promise<APIResponse<Supplier[]>> {
  const response = await apiClient.get('/api/v1/suppliers', { params });
  return response.data;
}

export async function fetchSupplier(supplierId: string): Promise<APIResponse<Supplier>> {
  const response = await apiClient.get(`/api/v1/suppliers/${supplierId}`);
  return response.data;
}

export async function createSupplier(data: SupplierCreatePayload): Promise<APIResponse<Supplier>> {
  const response = await apiClient.post('/api/v1/suppliers', data);
  return response.data;
}

export async function updateSupplier(supplierId: string, data: SupplierUpdatePayload): Promise<APIResponse<Supplier>> {
  const response = await apiClient.patch(`/api/v1/suppliers/${supplierId}`, data);
  return response.data;
}

export async function deleteSupplier(supplierId: string): Promise<void> {
  await apiClient.delete(`/api/v1/suppliers/${supplierId}`);
}

export async function searchSuppliers(query: string, limit: number = 10): Promise<APIResponse<Supplier[]>> {
  const response = await apiClient.post('/api/v1/suppliers/search', { query, limit, search_external: true });
  return response.data;
}