"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { TopBar } from '@/components/TopBar';
import { SurahListHome } from '@/components/home/SurahListHome';
import { fetchSurahs } from '@/core/api/quranApi';
import { Breadcrumb } from '@/components/Breadcrumb';
import { JuzHizbNav, QuranTab } from '@/components/quran/JuzHizbNav';
import { DivisionList } from '@/components/quran/DivisionList';
import { useTranslation } from '@/core/hooks/useTranslation';
import { BookOpenText } from '@phosphor-icons/react';

// QuranListPage renders the Quran entry screen with surah, juz, and hizb navigation.
export default function QuranListPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<QuranTab>('surah');

  const { data: surahs } = useQuery({
    queryKey: ['surahs'],
    queryFn: fetchSurahs,
  });

  const handleSurahClick = (surahNumber: number) => {
    router.push(`/?surah=${surahNumber}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <TopBar
        selectedSurah={null}
        onSurahChange={() => {}}
        showSurahSelector={false}
        onBackClick={() => router.push('/')}
      />

      <main className="container max-w-6xl py-6 sm:py-10 px-4 sm:px-6">
        {/* Hero */}
        <header className="relative mb-8 sm:mb-10 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/[0.08] via-card to-card p-6 sm:p-8 shadow-sm ring-1 ring-border/40">
          <div
            className="pointer-events-none absolute -end-16 -top-12 size-48 rounded-full bg-primary/10 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-8 -start-10 size-40 rounded-full bg-primary/5 blur-2xl"
            aria-hidden
          />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary shadow-inner ring-1 ring-primary/20">
                <BookOpenText className="text-3xl" weight="fill" />
              </span>
              <div className="min-w-0 space-y-1">
                <h1 className="font-arabic text-2xl sm:text-3xl font-black tracking-tight text-foreground md:text-4xl" dir="rtl">
                  {t('quranLibraryTitle')}
                </h1>
                <p className="max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t('quranLibrarySubtitle')}
                </p>
              </div>
            </div>
            <div className="shrink-0 rounded-full border border-border/50 bg-background/60 px-3 py-1.5 text-xs backdrop-blur-sm sm:text-sm">
              <Breadcrumb items={[{ label: t('quran') }, { label: t('quranLibraryTitle') }]} />
            </div>
          </div>
        </header>

        <JuzHizbNav activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'surah' && <SurahListHome surahs={surahs} onSurahClick={handleSurahClick} />}
        {activeTab === 'juz' && <DivisionList type="juz" />}
        {activeTab === 'hizb' && <DivisionList type="hizb" />}
      </main>
    </div>
  );
}
