import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchFiles, uploadFile, deleteFile, downloadFile, FileRecord } from '@/lib/api/files';
import { toast } from 'sonner';

export function useFiles(entityType?: string, entityId?: string) {
  return useQuery({ queryKey: ['files', entityType, entityId], queryFn: () => fetchFiles(entityType, entityId), select: (data) => data.data });
}

export function useUploadFile() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ({ file, entityType, entityId }: { file: File; entityType?: string; entityId?: string }) => uploadFile(file, entityType, entityId), onSuccess: () => { qc.invalidateQueries({ queryKey: ['files'] }); toast.success('Файл загружен'); }, onError: (e: Error) => toast.error(e.message) });
}

export function useDeleteFile() {
  const qc = useQueryClient();
  return useMutation({ mutationFn: deleteFile, onSuccess: () => { qc.invalidateQueries({ queryKey: ['files'] }); toast.success('Файл удалён'); }, onError: (e: Error) => toast.error(e.message) });
}

export function useDownloadFile() {
  return useMutation({ mutationFn: downloadFile, onSuccess: (blob, fileId) => { const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = fileId; a.click(); URL.revokeObjectURL(url); }, onError: (e: Error) => toast.error(e.message) });
}