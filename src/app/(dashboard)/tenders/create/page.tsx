'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCreateTender } from '@/lib/hooks/use-tenders';

const emptyForm = {
  title: '',
  description: '',
  nmck: '',
  customer_name: '',
  source_tender_id: '',
};

export default function CreateTenderPage() {
  const router = useRouter();
  const createTender = useCreateTender();
  const [form, setForm] = useState(emptyForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTender.mutateAsync({
      title: form.title,
      description: form.description,
      nmck: form.nmck ? Number(form.nmck) : null,
      customer_name: form.customer_name,
      source_tender_id: form.source_tender_id,
    });
    router.push('/tenders');
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Создание тендера</h1>
      <Card>
        <CardHeader><CardTitle>Основная информация</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Название *</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Идентификатор источника</Label>
              <Input value={form.source_tender_id} onChange={(e) => setForm({ ...form, source_tender_id: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>НМЦК</Label>
              <Input type="number" value={form.nmck} onChange={(e) => setForm({ ...form, nmck: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Заказчик</Label>
              <Input value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Описание</Label>
              <Textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <Button type="submit" disabled={createTender.isPending}>
              {createTender.isPending ? 'Создание...' : 'Создать'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}