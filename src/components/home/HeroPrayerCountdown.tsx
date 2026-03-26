import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPrayerTimes } from '@/core/api/prayerApi';
import { useSettings } from '@/core/hooks/useSettings';
import { useTranslation } from '@/core/hooks/useTranslation';
import { SectionSkeleton } from '@/components/shared/SectionSkeleton';
import { ErrorState } from '@/components/shared/ErrorState';

import fajrBg from '@/assets/prayer-fajr.jpg';
import dhuhrBg from '@/assets/prayer-dhuhr.jpg';
import asrBg from '@/assets/prayer-asr.jpg';
import maghribBg from '@/assets/prayer-maghrib.jpg';
import ishaBg from '@/assets/prayer-isha.jpg';

const PRAYER_BACKGROUNDS: Record<string, string> = {
  Fajr: fajrBg.src,
  Dhuhr: dhuhrBg.src,
  Asr: asrBg.src,
  Maghrib: maghribBg.src,
  Isha: ishaBg.src,
};

export const HeroPrayerCountdown = () => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [now, setNow] = useState(new Date());
  const [displayedBg, setDisplayedBg] = useState<string | null>(null);
  const [prevBg, setPrevBg] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data: prayerTimes, isLoading, isError, refetch } = useQuery({
    queryKey: ['prayerTimes', settings.city],
    queryFn: () => fetchPrayerTimes(settings.city),
    refetchInterval: 60000,
  });

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const prayerNames: Record<string, string> = useMemo(() => ({
    Fajr: t('fajr'), Dhuhr: t('dhuhr'), Asr: t('asr'), Maghrib: t('maghrib'), Isha: t('isha'),
  }), [t]);

  const nextPrayer = useMemo(() => {
    if (!prayerTimes) return null;

    const prayers = [
      { key: 'Fajr', time: prayerTimes.Fajr },
      { key: 'Dhuhr', time: prayerTimes.Dhuhr },
      { key: 'Asr', time: prayerTimes.Asr },
      { key: 'Maghrib', time: prayerTimes.Maghrib },
      { key: 'Isha', time: prayerTimes.Isha },
    ];

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    for (const prayer of prayers) {
      const [h, m] = prayer.time.split(':').map(Number);
      const prayerMinutes = h * 60 + m;
      if (prayerMinutes > currentMinutes) {
        const diff = (prayerMinutes - currentMinutes) * 60 - now.getSeconds();
        const hours = Math.floor(diff / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        return {
          key: prayer.key,
          name: prayerNames[prayer.key],
          countdown: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(Math.max(0, seconds)).padStart(2, '0')}`,
        };
      }
    }

    const [fH, fM] = prayers[0].time.split(':').map(Number);
    const fajrMinutes = fH * 60 + fM;
    const diff = ((24 * 60 - currentMinutes) + fajrMinutes) * 60 - now.getSeconds();
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return {
      key: 'Fajr',
      name: prayerNames['Fajr'],
      countdown: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(Math.max(0, seconds)).padStart(2, '0')}`,
    };
  }, [prayerTimes, now, prayerNames]);

  const targetBg = nextPrayer ? PRAYER_BACKGROUNDS[nextPrayer.key] : PRAYER_BACKGROUNDS.Fajr;

  // Crossfade when background changes
  useEffect(() => {
    if (!targetBg) return;
    if (displayedBg === null) {
      setDisplayedBg(targetBg);
      return;
    }
    if (targetBg !== displayedBg && !isTransitioning) {
      setPrevBg(displayedBg);
      setDisplayedBg(targetBg);
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setPrevBg(null);
        setIsTransitioning(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [targetBg, displayedBg, isTransitioning]);

  if (isLoading) return <SectionSkeleton variant="hero" />;
  if (isError) return <ErrorState message={t('failedToLoad')} onRetry={() => refetch()} />;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-primary/10 shadow-sm flex flex-col items-center justify-center p-6 !text-center h-full min-h-[200px]">
      {/* Previous background (fading out) */}
      {prevBg && (
        <img
          src={prevBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out opacity-0"
        />
      )}
      {/* Current background (fading in) */}
      <img
        src={displayedBg || targetBg}
        alt=""
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${isTransitioning ? 'opacity-100' : 'opacity-100'}`}
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-foreground/60 dark:bg-background/70" />
      {/* Radial glow overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,_hsl(var(--primary)),_transparent,_transparent)]" />

      <div className="relative z-10 flex flex-col gap-3">
        <span className="inline-flex items-center self-center px-3 py-1 rounded-full bg-background/20 text-white text-[10px] font-bold tracking-widest uppercase backdrop-blur-sm">
          {t('nextPrayer')}
        </span>
        <h1 className="text-white text-3xl md:text-4xl font-black tracking-tight drop-shadow-lg">
          {nextPrayer?.name || '...'}
        </h1>
        <div className="flex flex-col gap-1">
          <p className="text-white/70 text-xs font-medium">{t('timeRemaining')}</p>
          <div className="text-white text-4xl md:text-5xl font-black tracking-tighter tabular-nums drop-shadow-lg" dir="ltr">
            {nextPrayer?.countdown || '--:--:--'}
          </div>
        </div>
      </div>
    </div>
  );
};
