import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchQuranContent } from '@/core/api/quranApi';
import { useSettings } from '@/core/hooks/useSettings';
import { useTranslation } from '@/core/hooks/useTranslation';
import { useBookmarkStore } from '@/core/store/bookmarkStore';
import { ShareMenu } from '@/components/quran/ShareMenu';
import { toast } from 'sonner';
import { BookmarkSimple, PauseCircle, PlayCircle } from '@phosphor-icons/react';
import type { QuranAyah, QuranSelectionType } from '@/core/types';

interface QuranPageReaderProps {
  selection?: { type: QuranSelectionType; id: number };
  selectedAyah: { surah: number; ayah: number } | null;
  onAyahClick: (surah: number, ayah: number) => void;
}

export const QuranPageReader = ({ selection, selectedAyah, onAyahClick }: QuranPageReaderProps) => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const ayahRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { data: surahData, isLoading, error } = useQuery({
    queryKey: ['quran-content', selection?.type, selection?.id, settings.translationId],
    queryFn: () => fetchQuranContent(selection!.type, selection!.id, settings.translationId),
    enabled: !!selection,
  });

  useEffect(() => {
    if (selectedAyah && surahData?.ayahs) {
      const idx = surahData.ayahs.findIndex(
        (ayah: QuranAyah) => ayah.surahNumber === selectedAyah.surah && ayah.number === selectedAyah.ayah
      );
      if (idx !== -1 && ayahRefs.current[idx]) {
        ayahRefs.current[idx]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedAyah, surahData]);

  // handlePlayAyah forwards an ayah selection to the shared audio player controls.
  const handlePlayAyah = (e: React.MouseEvent, surah: number, ayah: number) => {
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent('playAyah', { detail: { surah, ayah } }));
    onAyahClick(surah, ayah);
  };

  const { bookmarks, addBookmark, removeBookmark } = useBookmarkStore();

  // handleBookmark toggles a bookmark for the selected ayah.
  const handleBookmark = (e: React.MouseEvent, surah: number, ayah: number, ayahText: string) => {
    e.stopPropagation();
    const existing = bookmarks.find(b => b.surah === surah && b.ayah === ayah);
    if (existing) {
      removeBookmark(existing.id);
      toast.success('تم إزالة العلامة المرجعية');
    } else {
      const surahName = surahData?.surahNameArabic || `سورة ${surah}`;
      addBookmark({ surah, ayah, surahName, text: ayahText });
      toast.success('تم حفظ العلامة المرجعية');
    }
  };

  // handleCopyAyah copies one ayah's Arabic text to the clipboard.
  const handleCopyAyah = (e: React.MouseEvent, text: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ');
  };

  const pageTitle = surahData?.surahNameArabic || '';

  if (isLoading) {
    return (
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-16 bg-muted rounded w-2/3 mx-auto" />
          <div className="h-6 bg-muted rounded w-1/3 mx-auto" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4 p-6">
              <div className="h-4 bg-muted rounded w-24 mx-auto" />
              <div className="h-12 bg-muted rounded w-3/4 mx-auto" />
              <div className="h-6 bg-muted rounded w-2/3 mx-auto" />
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error || !surahData) {
    return (
      <main className="flex-1 flex items-center justify-center text-muted-foreground p-6">
        {t('failedToLoad')}
      </main>
    );
  }

  const ayahs = surahData.ayahs || [];

  const arabicSizeClass = { small: 'text-2xl md:text-3xl leading-[2.5]', medium: 'text-3xl md:text-4xl leading-[2.5]', large: 'text-4xl md:text-5xl leading-[2.5]' }[settings.fontSize];

  return (
    <main className="flex-1 container py-8 pb-48">
      <div className="flex flex-col text-center">
        {/* Bismillah */}
        {selection?.type === 'surah' && selection.id !== 9 && (
          <div className="py-8 text-center">
            <h1 className={`text-primary font-arabic ${arabicSizeClass} !leading-loose mb-4`}>
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h1>
            <p className="text-muted-foreground italic text-sm">
              In the name of Allah, the Entirely Merciful, the Especially Merciful.
            </p>
          </div>
        )}

        {/* Ayahs */}
        {ayahs.map((ayah: QuranAyah, index: number) => {
          const ayahNum = ayah.number;
          const ayahText = ayah.text;
          const isSelected = selectedAyah?.surah === ayah.surahNumber && selectedAyah?.ayah === ayahNum;

          return (
            <div
              key={`${ayah.surahNumber}:${ayahNum}`}
              ref={el => { ayahRefs.current[index] = el; }}
              onClick={() => onAyahClick(ayah.surahNumber, ayahNum)}
              className={`group flex flex-col gap-6 p-8 rounded-3xl transition-all cursor-pointer border ${isSelected
                ? 'bg-gradient-to-br from-primary/10 to-transparent border-primary/30 shadow-sm'
                : 'border-transparent hover:bg-accent/40 hover:border-border'
                }`}
            >
              {/* Ayah divider label */}
              <div className="flex justify-center items-center gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                <span className={`h-px flex-1 max-w-[100px] bg-gradient-to-r ${isSelected ? 'from-transparent to-primary/50' : 'from-transparent to-border'}`} />
                <span className="text-primary font-bold text-xs tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-primary/10">
                  {t('ayahLabel')} {ayahNum}
                </span>
                <span className={`h-px flex-1 max-w-[100px] bg-gradient-to-l ${isSelected ? 'from-transparent to-primary/50' : 'from-transparent to-border'}`} />
              </div>

              {/* Arabic text */}
              <p
                className={`font-arabic ${arabicSizeClass} !leading-[2.5] w-full ${isSelected ? 'text-primary' : 'text-foreground'
                  }`}
                dir="rtl"
              >
                {ayahText}
              </p>

              {/* Translation */}
              {settings.showTranslation && ayah.translation && (
                <p className={`text-lg leading-relaxed max-w-2xl text-left w-full ${isSelected ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                  {ayah.translation}
                </p>
              )}

              {/* Action buttons */}
              <div className={`flex justify-center gap-4 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>
                <button
                  onClick={(e) => handleBookmark(e, ayah.surahNumber, ayahNum, ayahText)}
                  className={`transition-colors ${bookmarks.some(b => b.surah === ayah.surahNumber && b.ayah === ayahNum) ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                >
                  <BookmarkSimple className="text-xl" weight={bookmarks.some(b => b.surah === ayah.surahNumber && b.ayah === ayahNum) ? "fill" : "regular"} />
                </button>
                <button
                  onClick={(e) => handlePlayAyah(e, ayah.surahNumber, ayahNum)}
                  className={`transition-colors ${isSelected ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                >
                  {isSelected ? <PauseCircle className="text-xl" weight="fill" /> : <PlayCircle className="text-xl rtl:-scale-x-100" weight="regular" />}
                </button>
                <ShareMenu
                  text={ayahText}
                  surahName={pageTitle}
                  ayahNumber={ayahNum}
                />
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};
