'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateTender } from '@/lib/hooks/use-tenders';
import { AlertCircle } from 'lucide-react';

const emptyForm = {
  source_id: '',
  source_tender_id: '',
  title: '',
  description: '',
  nmck: '',
  customer_name: '',
};

export default function CreateTenderPage() {
  const router = useRouter();
  const createTender = useCreateTender();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await createTender.mutateAsync({
        source_id: form.source_id,
        source_tender_id: form.source_tender_id,
        title: form.title,
        description: form.description,
        nmck: form.nmck ? Number(form.nmck) : null,
        customer_name: form.customer_name,
      });
      router.push('/tenders');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания тендера');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Создание тендера</h1>
      <Card>
        <CardHeader><CardTitle>Основная информация</CardTitle></CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>ID источника (source_id) *</Label>
              <Input required value={form.source_id} onChange={(e) => setForm({ ...form, source_id: e.target.value })} placeholder="UUID источника" />
            </div>
            <div className="space-y-2">
              <Label>Идентификатор источника (source_tender_id) *</Label>
              <Input required value={form.source_tender_id} onChange={(e) => setForm({ ...form, source_tender_id: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Название *</Label>
              <Input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
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