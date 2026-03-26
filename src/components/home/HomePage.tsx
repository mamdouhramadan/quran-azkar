"use client";

import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { HeroPrayerCountdown } from '@/components/home/HeroPrayerCountdown';
import { PrayerTimesGrid } from '@/components/home/PrayerTimesGrid';
import { DailyVerse } from '@/components/home/DailyVerse';
import { MainCategories } from '@/components/home/MainCategories';
import { Tasbih } from '@/components/home/Tasbih';
import { BookmarkedAyahSection } from '@/components/home/BookmarkedAyah';
import { KhatmahCounter } from '@/components/home/KhatmahCounter';
import { WeeklyReadingChart } from '@/components/home/WeeklyReadingChart';
import { useTranslation } from '@/core/hooks/useTranslation';

// HomePage renders the main spiritual dashboard and entry points into the app.
export const HomePage = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <TopBar
        selectedSurah={null}
        onSurahChange={() => { }}
        showSurahSelector={false}
        onQuranClick={() => router.push('/quran')}
      />

      <main className="flex-1 container py-8">
        <section className="mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-3/4">
              <HeroPrayerCountdown />
            </div>
            <div className="md:w-1/4">
              <PrayerTimesGrid />
            </div>
          </div>
        </section>

        <MainCategories />

        <section className="mb-10">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-2/3">
              <Tasbih />
            </div>
            <div className="lg:w-1/3">
              <KhatmahCounter />
            </div>
          </div>
        </section>

        <DailyVerse />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <BookmarkedAyahSection />
          <WeeklyReadingChart />
        </div>

      </main>
    </div>
  );
};
