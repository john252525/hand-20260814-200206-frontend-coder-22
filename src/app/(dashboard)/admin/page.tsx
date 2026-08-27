'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DataTable } from '@/components/shared/data-table';
import { useCategories, useCreateCategory, useDeleteCategory } from '@/lib/hooks/use-categories';
import type { ColumnDef } from '@tanstack/react-table';
import { Category } from '@/lib/types/category';
import { Plus, Trash } from 'lucide-react';

export default function AdminPage() {
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const { data: categories, isLoading, refetch } = useCategories();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const columns: ColumnDef<Category, unknown>[] = [
    { accessorKey: 'name', header: 'Название' },
    { accessorKey: 'description', header: 'Описание' },
    { accessorKey: 'keywords', header: 'Ключевые слова', cell: ({ row }) => (row.original.keywords || []).join(', ') },
    { id: 'actions', header: 'Действия', cell: ({ row }) => <Button variant="ghost" size="icon" onClick={() => deleteCategory.mutate(row.original.id)}><Trash className="h-4 w-4" /></Button> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Администрирование</h1>
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <CardTitle>Категории</CardTitle>
          <div className="flex gap-2">
            <Input placeholder="Название" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} />
            <Input placeholder="Описание" value={newCategory.description} onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })} />
            <Button size="sm" onClick={() => createCategory.mutate({ name: newCategory.name, description: newCategory.description })}><Plus className="h-4 w-4 mr-2" /> Добавить</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable columns={columns} data={categories || []} loading={isLoading} onRetry={refetch} />
        </CardContent>
      </Card>
    </div>
  );
}