"use client";

import { TopBar } from '@/components/TopBar';
import { QuranPageReader } from '@/components/QuranPageReader';
import { InfiniteQuranReader } from '@/components/InfiniteQuranReader';
import { QuranReader } from '@/components/QuranReader';
import { MushafView } from '@/components/quran/MushafView';
import { AudioPlayer } from '@/components/AudioPlayer';
import type { QuranSelectionType, SurahData } from '@/core/types';

interface QuranReaderViewProps {
  viewMode: 'pages' | 'infinite' | 'single';
  selection: { type: QuranSelectionType; id: number };
  selectedAyah: { surah: number; ayah: number } | null;
  surahs?: SurahData[];
  onSurahChange: (surah: number) => void;
  onAyahChange: (surah: number, ayah: number) => void;
  onBack: () => void;
}

// QuranReaderView switches between reader modes while keeping shared reader controls.
export const QuranReaderView = ({
  viewMode,
  selection,
  selectedAyah,
  surahs,
  onSurahChange,
  onAyahChange,
  onBack,
}: QuranReaderViewProps) => {
  // handleSurahChange forwards selection changes to the parent route state.
  const handleSurahChange = (surah: number) => {
    onSurahChange(surah);
  };

  // handleAudioAyahChange syncs the audio player selection back to the reader state.
  const handleAudioAyahChange = (surah: number, ayah: number) => {
    onAyahChange(surah, ayah);
  };

  // renderReader chooses the correct Quran reader variant for the active mode.
  const renderReader = () => {
    switch (viewMode) {
      case 'pages':
        if (selection.type === 'page') {
          return (
            <MushafView
              pageNumber={selection.id}
              selectedAyah={selectedAyah}
              onAyahClick={onAyahChange}
            />
          );
        }
        return (
          <QuranPageReader
            selection={selection}
            selectedAyah={selectedAyah}
            onAyahClick={onAyahChange}
          />
        );
      case 'infinite':
        return (
          <InfiniteQuranReader
            selection={selection}
            selectedAyah={selectedAyah}
            onAyahClick={onAyahChange}
          />
        );
      default:
        return (
          <QuranReader
            selection={selection}
            selectedAyah={selectedAyah}
            onAyahClick={onAyahChange}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopBar
        selectedSurah={selection.id}
        selectionType={selection.type}
        onSurahChange={handleSurahChange}
        surahs={surahs}
        showSurahSelector={selection.type !== 'page'}
        onBackClick={onBack}
      />
      {renderReader()}
      <AudioPlayer
        surahNumber={selectedAyah?.surah || (selection.type === 'surah' ? selection.id : 1)}
        ayahNumber={selectedAyah?.ayah || null}
        onAyahChange={handleAudioAyahChange}
      />
    </div>
  );
};
