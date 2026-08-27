'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DataTable } from '@/components/shared/data-table';
import { useTasks, useCancelTask } from '@/lib/hooks/use-tasks';
import { formatDateTime } from '@/lib/utils/format';
import type { ColumnDef } from '@tanstack/react-table';
import { Task } from '@/lib/types/task';

export default function TasksPage() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, refetch } = useTasks({ page, per_page: 20 });
  const tasks = data?.data || [];
  const meta = data?.meta;
  const cancelTask = useCancelTask();

  const columns: ColumnDef<Task, unknown>[] = [
    { accessorKey: 'task_type', header: 'Тип' },
    { accessorKey: 'status', header: 'Статус', cell: ({ row }) => <Badge variant={row.original.status === 'COMPLETED' ? 'success' : row.original.status === 'FAILED' ? 'danger' : 'warning'}>{row.original.status}</Badge> },
    { accessorKey: 'progress_percent', header: 'Прогресс', cell: ({ row }) => <div className="flex items-center gap-2"><Progress value={row.original.progress_percent} className="w-24" /><span>{row.original.progress_percent}%</span></div> },
    { accessorKey: 'created_at', header: 'Создана', cell: ({ row }) => formatDateTime(row.original.created_at) },
    { id: 'actions', header: '', cell: ({ row }) => row.original.status === 'IN_PROGRESS' || row.original.status === 'PENDING' ? <button className="text-red-600" onClick={() => cancelTask.mutate(row.original.id)}>Отменить</button> : null },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Задачи</h1>
      <Card>
        <CardContent className="p-0">
          <DataTable columns={columns} data={tasks} loading={isLoading} error={error as Error} onRetry={refetch} pagination={meta ? { page: meta.page, perPage: meta.per_page, total: meta.total, pages: meta.pages } : undefined} onPageChange={setPage} />
        </CardContent>
      </Card>
    </div>
  );
}