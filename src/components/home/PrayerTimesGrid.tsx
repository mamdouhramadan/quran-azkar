import { useMemo, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPrayerTimes } from '@/core/api/prayerApi';
import { useSettings } from '@/core/hooks/useSettings';
import { useTranslation } from '@/core/hooks/useTranslation';
import { SectionSkeleton } from '@/components/shared/SectionSkeleton';
import { ErrorState } from '@/components/shared/ErrorState';

import { SunHorizon, Sun, Moon, Bed } from '@phosphor-icons/react';

type PrayerIconComponent = typeof SunHorizon;

const PRAYER_ICONS: Record<string, PrayerIconComponent> = {
  Fajr: SunHorizon,
  Dhuhr: Sun, // Phosphor's Sun icon is equivalent to light_mode
  Asr: Sun,
  Maghrib: Moon,
  Isha: Bed,
};

const PRAYER_KEYS = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

// PrayerTimesGrid highlights the next prayer in both desktop and mobile layouts.
export const PrayerTimesGrid = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const activeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: prayerTimes, isLoading, isError, refetch } = useQuery({
    queryKey: ['prayerTimes', settings.city],
    queryFn: () => fetchPrayerTimes(settings.city),
    refetchInterval: 60000,
  });

  const activePrayer = useMemo(() => {
    if (!prayerTimes) return null;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    for (const key of PRAYER_KEYS) {
      const [h, m] = prayerTimes[key].split(':').map(Number);
      if (h * 60 + m > currentMinutes) return key;
    }
    return 'Fajr';
  }, [prayerTimes]);

  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      const container = scrollRef.current;
      const el = activeRef.current;
      const scrollLeft = el.offsetLeft - container.clientWidth / 2 + el.clientWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activePrayer]);

  if (isLoading) return <SectionSkeleton variant="prayerGrid" />;
  if (isError || !prayerTimes) return <ErrorState compact message={t('failedToLoad')} onRetry={() => refetch()} />;

  const prayerNameMap: Record<string, string> = {
    Fajr: t('fajr'), Dhuhr: t('dhuhr'), Asr: t('asr'), Maghrib: t('maghrib'), Isha: t('isha'),
  };

  const prayers = PRAYER_KEYS.map(key => ({
    key,
    name: prayerNameMap[key],
    time: prayerTimes[key],
  }));

  return (
    <>
      {/* Desktop: vertical list */}
      <div className="hidden md:flex flex-col gap-2 h-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold">{t('prayerTimesToday')}</h2>
          <span className="text-[10px] text-muted-foreground">{settings.city}</span>
        </div>
        {prayers.map((prayer) => {
          const isActive = prayer.key === activePrayer;
          return (
            <div
              key={prayer.key}
              className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${
                isActive ? 'bg-primary text-primary-foreground' : 'bg-card border border-primary/10 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = PRAYER_ICONS[prayer.key];
                  return <Icon className={`text-xl ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} weight={isActive ? "fill" : "regular"} />;
                })()}
                <span className="text-sm font-bold">{prayer.name}</span>
              </div>
              <span className={`text-sm font-black tabular-nums ${isActive ? '' : 'text-foreground'}`} dir="ltr">
                {prayer.time}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile: horizontal scroll */}
      <div ref={scrollRef} className="md:hidden flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 scrollbar-hide snap-x snap-mandatory">
        {prayers.map((prayer) => {
          const isActive = prayer.key === activePrayer;
          return (
            <div
              key={prayer.key}
              ref={isActive ? activeRef : undefined}
              className={`flex-shrink-0 snap-center flex flex-col items-center gap-2 px-5 py-4 rounded-2xl min-w-[100px] transition-all !text-center ${
                isActive ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' : 'bg-card border border-primary/10 shadow-sm'
              }`}
            >
              {(() => {
                const Icon = PRAYER_ICONS[prayer.key];
                return <Icon className={`text-2xl ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'}`} weight={isActive ? "fill" : "regular"} />;
              })()}
              <span className={`text-xs font-bold ${isActive ? '' : 'text-muted-foreground'}`}>{prayer.name}</span>
              <span className="text-base font-black tabular-nums" dir="ltr">{prayer.time}</span>
            </div>
          );
        })}
      </div>
    </>
  );
};
