"use client";

import { Suspense, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter, useSearchParams } from 'next/navigation';
import { HomePage } from '@/components/home/HomePage';
import { QuranReaderView } from '@/components/quran/QuranReaderView';
import { usePrayerNotifications } from '@/core/hooks/usePrayerNotifications';
import { fetchSurahs } from '@/core/api/quranApi';
import type { QuranSelectionType } from '@/core/types';

// HomeContent switches between the home dashboard and reader flows based on URL state.
function HomeContent() {
  const [selection, setSelection] = useState<{ type: QuranSelectionType; id: number } | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<{ surah: number; ayah: number } | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'pages' | 'infinite' | 'single'>('list');
  usePrayerNotifications();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { data: surahs } = useQuery({
    queryKey: ['surahs'],
    queryFn: fetchSurahs,
  });

  // This effect syncs the reader state with route search params.
  useEffect(() => {
    const surahParam = searchParams.get('surah');
    const juzParam = searchParams.get('juz');
    const hizbParam = searchParams.get('hizb');
    const pageViewParam = searchParams.get('page');
    const ayahParam = searchParams.get('ayah');

    if (surahParam) {
      const surahNum = parseInt(surahParam);
      setSelection({ type: 'surah', id: surahNum });
      setViewMode('pages');
      if (ayahParam) {
        setSelectedAyah({ surah: surahNum, ayah: parseInt(ayahParam) });
      } else {
        setSelectedAyah(null);
      }
      return;
    }

    if (juzParam) {
      setSelection({ type: 'juz', id: parseInt(juzParam) });
      setViewMode('pages');
      setSelectedAyah(null);
      return;
    }

    if (hizbParam) {
      setSelection({ type: 'hizb', id: parseInt(hizbParam) });
      setViewMode('pages');
      setSelectedAyah(null);
      return;
    }

    if (pageViewParam) {
      setSelection({ type: 'page', id: parseInt(pageViewParam) });
      setViewMode('pages');
      setSelectedAyah(null);
      return;
    }

    setSelection(null);
    setSelectedAyah(null);
    setViewMode('list');
  }, [searchParams]);

  // handleBackToList returns the route to the dashboard view state.
  const handleBackToList = () => {
    setSelection(null);
    setSelectedAyah(null);
    setViewMode('list');
    router.replace('/');
  };

  if (viewMode === 'list') {
    return <HomePage />;
  }

  if (selection) {
    return (
      <QuranReaderView
        viewMode={viewMode as 'pages' | 'infinite' | 'single'}
        selection={selection}
        selectedAyah={selectedAyah}
        surahs={surahs}
        onSurahChange={(surah) => {
          setSelection({ type: 'surah', id: surah });
          setSelectedAyah(null);
        }}
        onAyahChange={(surah, ayah) => setSelectedAyah({ surah, ayah })}
        onBack={handleBackToList}
      />
    );
  }

  return <HomePage />;
}

// HomeRouteClient owns the interactive home-route experience inside a suspense boundary.
export function HomeRouteClient() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <HomeContent />
    </Suspense>
  );
}
