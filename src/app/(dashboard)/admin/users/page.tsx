'use client';

import { Card, CardContent } from '@/components/ui/card';
import { DataTable } from '@/components/shared/data-table';
import { useUsers } from '@/lib/hooks/use-users';
import type { ColumnDef } from '@tanstack/react-table';
import { User } from '@/lib/types/user';
import { Badge } from '@/components/ui/badge';

export default function UsersPage() {
  const { data, isLoading, error, refetch } = useUsers();
  const users = data?.data || [];

  const columns: ColumnDef<User, unknown>[] = [
    { accessorKey: 'name', header: 'Имя' },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Роль', cell: ({ row }) => <Badge variant={row.original.role === 'admin' ? 'warning' : 'secondary'}>{row.original.role}</Badge> },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Пользователи</h1>
      <Card><CardContent className="p-0"><DataTable columns={columns} data={users} loading={isLoading} error={error as Error} onRetry={refetch} /></CardContent></Card>
    </div>
  );
}