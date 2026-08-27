'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useWebhooks, useCreateWebhook, useDeleteWebhook } from '@/lib/hooks/use-webhooks';
import { Switch } from '@/components/ui/switch';
import type { Webhook } from '@/lib/types/webhook';
import { Trash, Plus } from 'lucide-react';

export default function WebhooksPage() {
  const { data: webhooks, isLoading, refetch } = useWebhooks();
  const create = useCreateWebhook();
  const remove = useDeleteWebhook();
  const [url, setUrl] = useState('');
  const [events, setEvents] = useState('');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Вебхуки</h1>
      <Card>
        <CardHeader><CardTitle>Создать</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Input placeholder="URL" value={url} onChange={(e) => setUrl(e.target.value)} />
          <Input placeholder="События (через запятую)" value={events} onChange={(e) => setEvents(e.target.value)} />
          <Button onClick={() => create.mutate({ url, events: events.split(',').map(e => e.trim()).filter(Boolean), is_active: true })}><Plus className="h-4 w-4 mr-2" />Добавить</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0 divide-y">
          {webhooks?.map((wh: Webhook) => (
            <div key={wh.id} className="p-4 flex justify-between">
              <div><div className="font-medium">{wh.url}</div><div className="text-sm text-neutral-500">{wh.events.join(', ')}</div><Badge variant={wh.is_active ? 'success' : 'secondary'}>{wh.is_active ? 'Активен' : 'Неактивен'}</Badge></div>
              <Button variant="ghost" size="icon" onClick={() => remove.mutate(wh.id)}><Trash className="h-4 w-4" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}