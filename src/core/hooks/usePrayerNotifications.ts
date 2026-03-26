import { useEffect, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPrayerTimes } from '@/core/api/prayerApi';
import { useSettings } from '@/core/hooks/useSettings';

const prayerNames: Record<string, { ar: string; en: string }> = {
  Fajr: { ar: 'الفجر', en: 'Fajr' },
  Dhuhr: { ar: 'الظهر', en: 'Dhuhr' },
  Asr: { ar: 'العصر', en: 'Asr' },
  Maghrib: { ar: 'المغرب', en: 'Maghrib' },
  Isha: { ar: 'العشاء', en: 'Isha' },
};

export const usePrayerNotifications = () => {
  const { settings } = useSettings();
  const notifiedRef = useRef<Set<string>>(new Set());

  const { data: prayerTimes } = useQuery({
    queryKey: ['prayerTimes', settings.city],
    queryFn: () => fetchPrayerTimes(settings.city),
    refetchInterval: 60000,
  });

  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission();
    return result === 'granted';
  }, []);

  useEffect(() => {
    if (!settings.prayerAlerts || !prayerTimes) return;

    const checkAndNotify = async () => {
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const today = now.toDateString();

      const keys = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

      for (const key of keys) {
        const time = prayerTimes[key];
        if (!time) continue;
        // Compare HH:MM
        const prayerHHMM = time.substring(0, 5);
        const notifKey = `${today}-${key}`;

        if (prayerHHMM === currentTime && !notifiedRef.current.has(notifKey)) {
          notifiedRef.current.add(notifKey);
          const hasPermission = await requestPermission();
          if (hasPermission) {
            const lang = settings.language;
            const name = prayerNames[key]?.[lang] || key;
            const title = lang === 'ar' ? `حان وقت صلاة ${name}` : `Time for ${name} prayer`;
            const body = lang === 'ar' ? 'حيّ على الصلاة' : 'Hayya ala as-salah';
            new Notification(title, {
              body,
              icon: '/favicon.ico',
              tag: notifKey,
            });
          }
        }
      }
    };

    checkAndNotify();
    const interval = setInterval(checkAndNotify, 30000); // check every 30s
    return () => clearInterval(interval);
  }, [settings.prayerAlerts, settings.language, prayerTimes, requestPermission]);

  // Request permission when alerts are enabled
  useEffect(() => {
    if (settings.prayerAlerts) {
      requestPermission();
    }
  }, [settings.prayerAlerts, requestPermission]);
};
