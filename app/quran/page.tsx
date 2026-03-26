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

// QuranListPage renders the Quran entry screen with surah, juz, and hizb navigation.
export default function QuranListPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<QuranTab>('surah');

  const { data: surahs } = useQuery({
    queryKey: ['surahs'],
    queryFn: fetchSurahs,
  });

  // handleSurahClick moves the user into the reader flow for the selected surah.
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
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8 w-full border-b border-border pb-4">
          <h1 className="text-2xl font-black tracking-tight">القرآن الكريم</h1>
          <Breadcrumb items={[{ label: 'القرآن الكريم' }]} />
        </div>
        
        <JuzHizbNav activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === 'surah' && <SurahListHome surahs={surahs} onSurahClick={handleSurahClick} />}
        {activeTab === 'juz' && <DivisionList type="juz" />}
        {activeTab === 'hizb' && <DivisionList type="hizb" />}
      </main>
    </div>
  );
}
