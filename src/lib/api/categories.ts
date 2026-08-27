import apiClient from './client';
import { Category } from '@/lib/types/category';
import { APIResponse } from '@/lib/types/api';

export async function fetchCategories(params: { search?: string; is_active?: boolean; page?: number; per_page?: number } = {}): Promise<APIResponse<Category[]>> {
  const response = await apiClient.get('/api/v1/categories', { params });
  return response.data;
}

export async function createCategory(data: { name: string; description: string }): Promise<APIResponse<Category>> {
  const response = await apiClient.post('/api/v1/categories', data);
  return response.data;
}

export async function deleteCategory(categoryId: string): Promise<void> {
  await apiClient.delete(`/api/v1/categories/${categoryId}`);
}