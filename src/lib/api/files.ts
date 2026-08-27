import apiClient from './client';
import { APIResponse } from '@/lib/types/api';
import { mockFiles } from '@/lib/mocks/files';

export interface FileRecord {
  id: string;
  filename: string;
  file_size: number;
  content_type: string;
  upload_date: string;
  entity_type?: string;
  entity_id?: string;
}

// В Swagger нет GET /files, поэтому используем мок-данные
export async function fetchFiles(entityType?: string, entityId?: string): Promise<APIResponse<FileRecord[]>> {
  await apiClient.get('/api/v1/health'); // для проверки сети
  let files = mockFiles as unknown as FileRecord[];
  if (entityType) files = files.filter(f => f.entity_type === entityType);
  if (entityId) files = files.filter(f => f.entity_id === entityId);
  return { data: files, meta: { page: 1, per_page: files.length, total: files.length, pages: 1 } };
}

export async function uploadFile(file: File, entityType: string = 'tender', entityId?: string): Promise<APIResponse<FileRecord>> {
  const formData = new FormData();
  formData.append('file', file);
  const response = await apiClient.post('/api/v1/files/upload', formData, {
    params: { entity_type: entityType, entity_id: entityId },
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}

export async function deleteFile(fileId: string): Promise<void> {
  await apiClient.delete(`/api/v1/files/${fileId}`);
}

export async function downloadFile(fileId: string): Promise<Blob> {
  const response = await apiClient.get(`/api/v1/files/${fileId}/download`, { responseType: 'blob' });
  return response.data;
}