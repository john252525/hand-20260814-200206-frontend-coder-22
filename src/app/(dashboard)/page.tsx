import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/analytics/stat-card';
import { TenderList } from '@/components/tenders/tender-list';
import { useTenderStats, useTenders } from '@/lib/hooks/use-tenders';
import { formatCurrency, formatNumber, formatPercent } from '@/lib/utils/format';
import { FileText, Loader, ClipboardCheck, TrendingUp, Target, Banknote, Plus, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#0284c7', '#f59e0b', '#22c55e', '#ef4444', '#8b5cf6', '#64748b'];

export default function DashboardPage() {
  const router = useRouter();
  const { data: stats, isLoading: statsLoading } = useTenderStats();
  const { data: recentTendersData, isLoading: tendersLoading } = useTenders({ per_page: 5, sort_by: 'created_at', sort_order: 'desc' });
  const recentTenders = recentTendersData?.data || [];

  const statCards = useMemo(() => {
    if (!stats) return [];
    return [
      { title: 'Всего тендеров', value: formatNumber(stats.total), icon: FileText, trend: stats.trend_total, description: 'За все время' },
      { title: 'В обработке', value: formatNumber(stats.in_progress_count), icon: Loader, trend: stats.trend_in_progress, description: 'Активные тендеры' },
      { title: 'Готовы к решению', value: formatNumber(stats.ready_for_decision_count), icon: ClipboardCheck, trend: stats.trend_ready, description: 'Ожидают решения' },
      { title: 'Средняя маржа', value: formatPercent(stats.avg_margin_percent), icon: TrendingUp, trend: stats.trend_margin, description: 'По одобренным' },
      { title: 'Конверсия', value: formatPercent(stats.approval_rate_percent), icon: Target, trend: stats.trend_conversion, description: 'Одобренных' },
      { title: 'Объем одобренных', value: formatCurrency(stats.total_approved_volume_rub), icon: Banknote, trend: stats.trend_volume, description: 'Общая сумма' },
    ];
  }, [stats]);

  const pieData = useMemo(() => stats ? Object.entries(stats.by_status || {}).map(([name, value]) => ({ name, value })) : [], [stats]);
  const lineData = useMemo(() => stats?.over_time || [], [stats]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Дашборд</h1>
          <p className="text-neutral-500 mt-1">Обзор системы</p>
        </div>
        <Button onClick={() => router.push('/tenders/create')}><Plus className="h-4 w-4 mr-2" /> Новый тендер</Button>
      </div>

      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((stat) => <StatCard key={stat.title} {...stat} />)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Тендеры по статусам</CardTitle>
            <CardDescription>Распределение</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {pieData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                    {pieData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : <div className="text-center text-neutral-400 pt-20">Нет данных</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Динамика за 30 дней</CardTitle>
            <CardDescription>Новые тендеры</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            {lineData.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#0284c7" />
                </LineChart>
              </ResponsiveContainer>
            ) : <div className="text-center text-neutral-400 pt-20">Нет данных</div>}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Последние тендеры</CardTitle>
            <CardDescription>Недавно добавленные</CardDescription>
          </div>
          <Button variant="ghost" onClick={() => router.push('/tenders')}>Все тендеры <ArrowRight className="h-4 w-4 ml-2" /></Button>
        </CardHeader>
        <CardContent>
          <TenderList tenders={recentTenders} loading={tendersLoading} compact />
        </CardContent>
      </Card>
    </div>
  );
}