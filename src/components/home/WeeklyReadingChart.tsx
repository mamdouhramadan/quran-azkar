import { useMemo } from 'react';
import { useTranslation } from '@/core/hooks/useTranslation';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { useKhatmahStore } from '@/core/store/khatmahStore';

const DAY_NAMES_AR = ['أحد', 'إثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
const DAY_NAMES_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const WeeklyReadingChart = () => {
  const { t, lang } = useTranslation();
  const dayNames = lang === 'ar' ? DAY_NAMES_AR : DAY_NAMES_EN;
  const dailyHistory = useKhatmahStore((s) => s.dailyHistory);

  const chartData = useMemo(() => {
    const days: { name: string; pages: number }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const record = dailyHistory.find((r) => r.date === dateStr);
      days.push({
        name: dayNames[d.getDay()],
        pages: record?.pages ?? 0,
      });
    }
    return days;
  }, [dailyHistory, dayNames]);

  const totalWeek = chartData.reduce((a, b) => a + b.pages, 0);

  return (
    <section className="h-full">
      <div className="rounded-3xl bg-card border border-primary/10 p-8 shadow-sm h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black tracking-tight">{t('weeklyStats')}</h2>
          <span className="text-sm font-bold text-primary">
            {totalWeek} {t('pages')}
          </span>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} barCategoryGap="20%">
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis hide allowDecimals={false} />
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
                fontSize: 13,
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`${value} ${t('pages')}`, t('totalPagesWeek')]}
            />
            <Bar dataKey="pages" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};
