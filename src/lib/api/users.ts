import apiClient from './client';
import { User } from '@/lib/types/user';
import { APIResponse } from '@/lib/types/api';

export async function fetchUsers(): Promise<APIResponse<User[]>> {
  const response = await apiClient.get('/api/v1/users'); return response.data;
}