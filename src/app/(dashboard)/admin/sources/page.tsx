'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useSources, useCreateSource, useDeleteSource } from '@/lib/hooks/use-sources';
import { Plus, Trash } from 'lucide-react';
import type { Source } from '@/lib/types/source';

export default function SourcesPage() {
  const { data: sources, isLoading, refetch } = useSources();
  const create = useCreateSource();
  const remove = useDeleteSource();
  const [form, setForm] = useState({ name: '', type: 'api', api_url: '' });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Источники</h1>
      <Card>
        <CardHeader><CardTitle>Добавить источник</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Input placeholder="Название" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="URL API" value={form.api_url} onChange={(e) => setForm({ ...form, api_url: e.target.value })} />
          <Button onClick={() => create.mutate({ name: form.name, type: form.type, api_url: form.api_url })}><Plus className="h-4 w-4 mr-2" />Добавить</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0 divide-y">
          {sources?.map((src: Source) => (
            <div key={src.id} className="p-4 flex justify-between">
              <div><div className="font-medium">{src.name}</div><div className="text-sm text-neutral-500">{src.type} · {src.api_url}</div><Badge variant={src.is_active ? 'success' : 'secondary'}>{src.is_active ? 'Активен' : 'Неактивен'}</Badge></div>
              <Button variant="ghost" size="icon" onClick={() => remove.mutate(src.id)}><Trash className="h-4 w-4" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}