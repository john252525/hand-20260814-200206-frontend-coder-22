'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTokens, useCreateToken, useDeleteToken } from '@/lib/hooks/use-tokens';
import { Plus, Trash } from 'lucide-react';
import type { Token } from '@/lib/types/token';

export default function TokensPage() {
  const { data: tokens, isLoading, refetch } = useTokens();
  const create = useCreateToken();
  const remove = useDeleteToken();
  const [desc, setDesc] = useState('');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">API Токены</h1>
      <Card>
        <CardHeader><CardTitle>Создать токен</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Input placeholder="Описание" value={desc} onChange={(e) => setDesc(e.target.value)} />
          <Button onClick={() => create.mutate({ description: desc, rate_limit_per_minute: 60 })}><Plus className="h-4 w-4 mr-2" />Создать</Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0 divide-y">
          {tokens?.map((token: Token) => (
            <div key={token.id} className="p-4 flex justify-between">
              <div><div className="font-medium">{token.description}</div><div className="text-sm text-neutral-500">Rate limit: {token.rate_limit_per_minute}</div><Badge variant={token.is_active ? 'success' : 'secondary'}>{token.is_active ? 'Активен' : 'Неактивен'}</Badge></div>
              <Button variant="ghost" size="icon" onClick={() => remove.mutate(token.id)}><Trash className="h-4 w-4" /></Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}