import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSuppliers, fetchSupplier, createSupplier, updateSupplier, deleteSupplier, searchSuppliers } from '@/lib/api/suppliers';
import { SupplierCreatePayload, SupplierUpdatePayload } from '@/lib/types/supplier';
import { toast } from 'sonner';

export function useSuppliers(params: {
  search?: string;
  type?: string;
  is_active?: boolean;
  page?: number;
  per_page?: number;
} = {}) {
  return useQuery({
    queryKey: ['suppliers', params],
    queryFn: () => fetchSuppliers(params),
    select: (data) => data, // возвращаем полный ответ, чтобы использовать meta
  });
}

export function useSupplier(supplierId: string) {
  return useQuery({
    queryKey: ['supplier', supplierId],
    queryFn: () => fetchSupplier(supplierId),
    enabled: !!supplierId,
    select: (data) => data.data,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Поставщик создан');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ supplierId, data }: { supplierId: string; data: SupplierUpdatePayload }) =>
      updateSupplier(supplierId, data),
    onSuccess: (_, { supplierId }) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['supplier', supplierId] });
      toast.success('Поставщик обновлен');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useDeleteSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSupplier,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Поставщик удален');
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useSearchSuppliers() {
  return useMutation({
    mutationFn: ({ query, limit }: { query: string; limit?: number }) =>
      searchSuppliers(query, limit),
  });
}