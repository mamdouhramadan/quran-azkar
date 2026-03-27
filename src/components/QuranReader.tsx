import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchQuranContent } from '@/core/api/quranApi';
import { useSettings } from '@/core/hooks/useSettings';
import { useTranslation } from '@/core/hooks/useTranslation';
import { BookOpen, BookmarkSimple } from '@phosphor-icons/react';
import { TafsirModal } from '@/components/quran/TafsirModal';
import { useBookmarkStore } from '@/core/store/bookmarkStore';
import { toast } from 'sonner';
import type { QuranAyah, QuranSelectionType } from '@/core/types';

interface QuranReaderProps {
  selection: { type: QuranSelectionType; id: number };
  selectedAyah: { surah: number; ayah: number } | null;
  onAyahClick: (surah: number, ayah: number) => void;
}

export const QuranReader = ({ selection, selectedAyah, onAyahClick }: QuranReaderProps) => {
  const { settings } = useSettings();
  const { t } = useTranslation();
  const [tafsirVerse, setTafsirVerse] = useState<{ key: string; text: string } | null>(null);
  const { bookmarks, addBookmark, removeBookmark } = useBookmarkStore();

  // handleBookmark toggles the current ayah in the bookmark store.
  const handleBookmark = (e: React.MouseEvent, surah: number, ayah: number, ayahText: string) => {
    e.stopPropagation();
    const existing = bookmarks.find(b => b.surah === surah && b.ayah === ayah);
    if (existing) {
      removeBookmark(existing.id);
      toast.success(t('bookmarkRemoved'));
    } else {
      const surahName = surahData?.surahNameArabic || t('surahFallbackName', { number: surah });
      addBookmark({ surah, ayah, surahName, text: ayahText });
      toast.success(t('bookmarkAdded'));
    }
  };
  
  const { data: surahData, isLoading, error } = useQuery({
    queryKey: ['quran-content', selection.type, selection.id, settings.translationId],
    queryFn: () => fetchQuranContent(selection.type, selection.id, settings.translationId),
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
          {[...Array(10)].map((_, i) => (
            <div key={i} className="h-16 bg-muted rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !surahData) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        {t('failedToLoad')}
      </div>
    );
  }

  const fontSizeClass = {
    small: 'text-lg',
    medium: 'text-xl',
    large: 'text-2xl'
  }[settings.fontSize];

  const arabicFontSizeClass = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-3xl'
  }[settings.fontSize];

  return (
    <div className="p-6 container">
      <div className="text-center mb-8">
        <h2 className={`${fontSizeClass} font-bold mb-2`}>
          {surahData.surahNameArabic}
        </h2>
        <p className="text-muted-foreground">
          {t('surahLineShort', {
            name: surahData.surahNameTranslation,
            count: surahData.totalAyah,
          })}
        </p>
      </div>

      <div className="space-y-6">
        {surahData.ayahs?.map((ayah: QuranAyah) => (
          <div
            key={`${ayah.surahNumber}:${ayah.number}`}
            className={`p-4 rounded-2xl border border-primary/10 hover:bg-accent/50 cursor-pointer transition-colors ${
              selectedAyah?.surah === ayah.surahNumber && selectedAyah?.ayah === ayah.number ? 'bg-accent' : ''
            }`}
            onClick={() => onAyahClick(ayah.surahNumber, ayah.number)}
          >
            <div className={`font-arabic ${arabicFontSizeClass} mb-3 text-right leading-loose`}>
              {ayah.text} ﴿{ayah.number}﴾
            </div>
            
            {settings.showTranslation && ayah.translation && (
              <div className={`${fontSizeClass} text-muted-foreground border-t pt-2 ${settings.language === 'ar' ? 'text-right' : 'text-left'}`}>
                {ayah.translation}
              </div>
            )}
            
            <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
              <span>
                {t('surahAyahRef', { surah: ayah.surahNumber, ayah: ayah.number })}
              </span>
              <div className="flex items-center gap-4">
                <button
                  onClick={(e) => handleBookmark(e, ayah.surahNumber, ayah.number, ayah.text)}
                  className={`transition-colors ${bookmarks.some(b => b.surah === ayah.surahNumber && b.ayah === ayah.number) ? 'text-primary' : 'hover:text-primary'}`}
                >
                  <BookmarkSimple className="text-xl" weight={bookmarks.some(b => b.surah === ayah.surahNumber && b.ayah === ayah.number) ? "fill" : "regular"} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setTafsirVerse({
                      key: `${ayah.surahNumber}:${ayah.number}`,
                      text: ayah.text,
                    });
                  }}
                  className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-bold transition-colors text-xs"
                >
                  <BookOpen className="text-sm" weight="fill" />
                  {t('viewTafsir')}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tafsir Modal */}
      <TafsirModal
        isOpen={!!tafsirVerse}
        onClose={() => setTafsirVerse(null)}
        verseKey={tafsirVerse?.key || ''}
        verseText={tafsirVerse?.text}
      />
    </div>
  );
};
