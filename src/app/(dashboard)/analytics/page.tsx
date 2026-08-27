'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/analytics/stat-card';
import { useTenderStats } from '@/lib/hooks/use-tenders';
import { formatCurrency, formatPercent } from '@/lib/utils/format';
import { Download, FileSpreadsheet, FileText, File as FileCsv } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#0284c7', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6', '#64748b'];

export default function AnalyticsPage() {
  const { data: stats, isLoading } = useTenderStats();

  const pieData = useMemo(() => stats ? Object.entries(stats.by_status || {}).map(([name, value]) => ({ name, value })) : [], [stats]);
  const lineData = useMemo(() => stats?.over_time || [], [stats]);

  const handleExport = (format: 'excel' | 'pdf' | 'csv') => {
    // TODO: реализовать экспорт через utils
  };

  if (isLoading) return <div>Загрузка...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Аналитика</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('excel')}><FileSpreadsheet className="h-4 w-4 mr-2" />Excel</Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}><FileText className="h-4 w-4 mr-2" />PDF</Button>
          <Button variant="outline" onClick={() => handleExport('csv')}><FileCsv className="h-4 w-4 mr-2" />CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Конверсия" value={formatPercent(stats?.approval_rate_percent)} icon={() => null} />
        <StatCard title="Средняя маржа" value={formatPercent(stats?.avg_margin_percent)} icon={() => null} />
        <StatCard title="Время обработки" value={`${stats?.avg_processing_time_minutes || 0} мин`} icon={() => null} />
        <StatCard title="Объем одобренных" value={formatCurrency(stats?.total_approved_volume_rub)} icon={() => null} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle>Тендеры по статусам</CardTitle></CardHeader><CardContent className="h-80">{pieData.length > 0 && <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>{pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer>}</CardContent></Card>
        <Card><CardHeader><CardTitle>Динамика</CardTitle></CardHeader><CardContent className="h-80">{lineData.length > 0 && <ResponsiveContainer width="100%" height="100%"><LineChart data={lineData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip /><Legend /><Line type="monotone" dataKey="count" stroke="#0284c7" /></LineChart></ResponsiveContainer>}</CardContent></Card>
      </div>
    </div>
  );
}