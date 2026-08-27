'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TENDER_STATUS_CONFIG } from '@/config/constants';
import { TenderFilters as TenderFiltersType } from '@/lib/types/tender';
import { Filter, X, Search } from 'lucide-react';

interface TenderFiltersProps {
  filters: TenderFiltersType;
  onChange: (filters: TenderFiltersType) => void;
  onReset: () => void;
}

export function TenderFilters({ filters, onChange, onReset }: TenderFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeCount = Object.values(filters).filter(v => v !== undefined && v !== '' && v !== null).length;

  const handleChange = (key: keyof TenderFiltersType, value: any) => {
    onChange({ ...filters, [key]: value });
  };

  const statusKeys = Object.keys(TENDER_STATUS_CONFIG);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
          <Input
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Поиск по названию, заказчику..."
            className="pl-9"
          />
        </div>
        <Button variant={activeCount > 0 ? 'default' : 'outline'} onClick={() => setIsOpen(!isOpen)}>
          <Filter className="h-4 w-4 mr-2" />
          Фильтры
          {activeCount > 0 && <Badge variant="secondary" className="ml-2">{activeCount}</Badge>}
        </Button>
        {activeCount > 0 && (
          <Button variant="ghost" onClick={onReset}>
            <X className="h-4 w-4 mr-1" /> Сброс
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg border">
          <div className="space-y-2">
            <Label>Статус</Label>
            <Select
              value={typeof filters.status === 'string' ? filters.status : 'all'}
              onValueChange={(v) => handleChange('status', v === 'all' ? undefined : v)}
            >
              <SelectTrigger><SelectValue placeholder="Все" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                {statusKeys.map((s) => (
                  <SelectItem key={s} value={s}>{TENDER_STATUS_CONFIG[s as keyof typeof TENDER_STATUS_CONFIG].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>НМЦК от</Label>
            <Input type="number" value={filters.nmck_min || ''} onChange={(e) => handleChange('nmck_min', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div className="space-y-2">
            <Label>НМЦК до</Label>
            <Input type="number" value={filters.nmck_max || ''} onChange={(e) => handleChange('nmck_max', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div className="space-y-2">
            <Label>Дедлайн после</Label>
            <Input type="date" value={filters.deadline_after?.slice(0,10) || ''} onChange={(e) => handleChange('deadline_after', e.target.value ? new Date(e.target.value).toISOString() : undefined)} />
          </div>
          <div className="space-y-2">
            <Label>Дедлайн до</Label>
            <Input type="date" value={filters.deadline_before?.slice(0,10) || ''} onChange={(e) => handleChange('deadline_before', e.target.value ? new Date(e.target.value).toISOString() : undefined)} />
          </div>
          <div className="space-y-2">
            <Label>Скор от</Label>
            <Input type="number" min={0} max={100} value={filters.score_min || ''} onChange={(e) => handleChange('score_min', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div className="space-y-2">
            <Label>Скор до</Label>
            <Input type="number" min={0} max={100} value={filters.score_max || ''} onChange={(e) => handleChange('score_max', e.target.value ? Number(e.target.value) : undefined)} />
          </div>
        </div>
      )}
    </div>
  );
}