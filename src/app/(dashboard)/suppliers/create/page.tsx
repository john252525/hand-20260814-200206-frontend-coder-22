'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCreateSupplier } from '@/lib/hooks/use-suppliers';
import { SupplierType } from '@/lib/types/supplier';
import { AlertCircle } from 'lucide-react';

const emptyForm = {
  name: '',
  type: 'unknown' as SupplierType,
  website: '',
  email: '',
  phone: '',
  telegram: '',
  whatsapp: '',
  inn: '',
  legal_address: '',
  tags: '',
  notes: '',
};

export default function CreateSupplierPage() {
  const router = useRouter();
  const createSupplier = useCreateSupplier();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      await createSupplier.mutateAsync({
        name: form.name,
        type: form.type,
        website: form.website || undefined,
        email: form.email || undefined,
        phone: form.phone || undefined,
        telegram: form.telegram || undefined,
        whatsapp: form.whatsapp || undefined,
        inn: form.inn || undefined,
        legal_address: form.legal_address || undefined,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        notes: form.notes || undefined,
      });
      router.push('/suppliers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка создания');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Новый поставщик</h1>
      <Card>
        <CardHeader><CardTitle>Основная информация</CardTitle></CardHeader>
        <CardContent>
          {error && <Alert variant="destructive" className="mb-4"><AlertCircle className="h-4 w-4" /><AlertDescription>{error}</AlertDescription></Alert>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Название *</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Тип</Label><select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as SupplierType })} className="w-full p-2 border rounded-md"><option value="manufacturer">Производитель</option><option value="distributor">Дистрибьютор</option><option value="wholesaler">Оптовик</option><option value="retail">Розница</option><option value="unknown">Неизвестно</option></select></div>
              <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
              <div className="space-y-2"><Label>Телефон</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
              <div className="space-y-2"><Label>ИНН</Label><Input value={form.inn} onChange={(e) => setForm({ ...form, inn: e.target.value })} /></div>
              <div className="space-y-2"><Label>Сайт</Label><Input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></div>
            </div>
            <div className="space-y-2"><Label>Теги (через запятую)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></div>
            <div className="space-y-2"><Label>Заметки</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
            <Button type="submit" disabled={createSupplier.isPending}>{createSupplier.isPending ? 'Сохранение...' : 'Создать'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}