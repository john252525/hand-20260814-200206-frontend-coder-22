'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSettings, useUpdateSettings } from '@/lib/hooks/use-settings';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { data: settings, isLoading } = useSettings();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState<Record<string, any>>({});

  if (isLoading) return <Skeleton className="h-64" />;

  const handleSave = async (section: string) => {
    try {
      await updateSettings.mutateAsync({ section, data: form[section] || settings?.[section] });
      toast.success('Настройки сохранены');
    } catch { toast.error('Ошибка сохранения'); }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Настройки</h1>
      <Tabs defaultValue="company">
        <TabsList>
          <TabsTrigger value="company">Компания</TabsTrigger>
          <TabsTrigger value="scoring">Скоринг</TabsTrigger>
          <TabsTrigger value="communication">Коммуникации</TabsTrigger>
          <TabsTrigger value="templates">Шаблоны</TabsTrigger>
          <TabsTrigger value="integrations">Интеграции</TabsTrigger>
        </TabsList>

        <TabsContent value="company">
          <Card><CardHeader><CardTitle>Данные компании</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="space-y-2"><Label>Название</Label><Input value={form.company?.legal_name ?? settings?.company?.legal_name ?? ''} onChange={(e) => setForm({ ...form, company: { ...form.company, legal_name: e.target.value } })} /></div>
            <div className="space-y-2"><Label>ИНН</Label><Input value={form.company?.inn ?? settings?.company?.inn ?? ''} onChange={(e) => setForm({ ...form, company: { ...form.company, inn: e.target.value } })} /></div>
            <div className="flex justify-end"><Button onClick={() => handleSave('company')}>Сохранить</Button></div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="scoring">
          <Card><CardHeader><CardTitle>Скоринг</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="space-y-2"><Label>Мин. скор</Label><Input type="number" value={form.scoring?.min_total_score ?? settings?.scoring?.min_total_score ?? 60} onChange={(e) => setForm({ ...form, scoring: { ...form.scoring, min_total_score: Number(e.target.value) } })} /></div>
            <div className="flex justify-end"><Button onClick={() => handleSave('scoring')}>Сохранить</Button></div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="communication">
          <Card><CardHeader><CardTitle>Коммуникации</CardTitle></CardHeader><CardContent className="space-y-4">
            <div className="space-y-2"><Label>Таймаут ответа (часы)</Label><Input type="number" value={form.communication?.response_timeout_hours ?? settings?.communication?.response_timeout_hours ?? 48} onChange={(e) => setForm({ ...form, communication: { ...form.communication, response_timeout_hours: Number(e.target.value) } })} /></div>
            <div className="flex justify-end"><Button onClick={() => handleSave('communication')}>Сохранить</Button></div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card><CardHeader><CardTitle>Шаблоны</CardTitle></CardHeader><CardContent className="space-y-2"><Input placeholder="Тема письма" /><Input placeholder="Шаблон сообщения" /><Button>Сохранить</Button></CardContent></Card>
        </TabsContent>

        <TabsContent value="integrations">
          <Card><CardHeader><CardTitle>Интеграции</CardTitle></CardHeader><CardContent className="space-y-2"><Input placeholder="API ключ" /><Button>Сохранить</Button></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}