import { useState, useEffect, useCallback, type UIEvent } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchQuranContent } from '@/core/api/quranApi';
import { useSettings } from '@/core/hooks/useSettings';
import type { QuranAyah, QuranSelectionType, SurahData } from '@/core/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InfiniteQuranReaderProps {
  selection: { type: QuranSelectionType; id: number };
  selectedAyah: { surah: number; ayah: number } | null;
  onAyahClick: (surah: number, ayah: number) => void;
}

export const InfiniteQuranReader = ({ 
  selection, 
  selectedAyah, 
  onAyahClick 
}: InfiniteQuranReaderProps) => {
  const { settings } = useSettings();
  const [loadedSurahs, setLoadedSurahs] = useState<SurahData[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['infinite-quran', selection.type, selection.id, settings.translationId],
    queryFn: async ({ pageParam = selection.id }) => {
      const surahData = await fetchQuranContent(selection.type, pageParam, settings.translationId);
      return { ...surahData, surahNumber: pageParam };
    },
    getNextPageParam: (lastPage) => {
      const nextId = lastPage.surahNumber + 1;
      const maxId = selection.type === 'surah' ? 114 : selection.type === 'juz' ? 30 : selection.type === 'hizb' ? 60 : 604;
      return nextId <= maxId ? nextId : undefined;
    },
    initialPageParam: selection.id,
  });

  useEffect(() => {
    if (data) {
      setLoadedSurahs(data.pages);
    }
  }, [data]);

  // handleScroll requests the next Quran chunk when the reader nears the bottom.
  const handleScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

  if (error) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        {settings.language === 'ar' ? 'فشل في تحميل محتوى القرآن' : 'Failed to load Quran content'}
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
    <ScrollArea className="h-[calc(100vh-120px)]" onScrollCapture={handleScroll}>
      <div className="p-6 container">
        {loadedSurahs.map((surahData) => (
          <div key={surahData.surahNumber} className="mb-12">
            <div className="text-center mb-8 border-b border-primary/10 pb-4">
              <h2 className={`${fontSizeClass} font-bold mb-2`}>
                {surahData.surahNameArabic}
              </h2>
              <p className="text-muted-foreground">
                {settings.language === 'ar' ? 
                  `سورة ${surahData.surahNameTranslation} - ${surahData.totalAyah} آيات` :
                  `Surah ${surahData.surahNameTranslation} - ${surahData.totalAyah} verses`
                }
              </p>
            </div>

            <div className="space-y-6">
              {surahData.ayahs?.map((ayah: QuranAyah, index: number) => (
                <div
                  key={`${surahData.surahNumber}-${index + 1}`}
                  className={`p-4 rounded-2xl border border-primary/10 hover:bg-accent/50 cursor-pointer transition-colors ${
                    selectedAyah?.surah === surahData.surahNumber && selectedAyah?.ayah === index + 1 ? 'bg-accent' : ''
                  }`}
                  onClick={() => onAyahClick(surahData.surahNumber, index + 1)}
                >
                  <div className={`font-arabic ${arabicFontSizeClass} mb-3 text-right leading-loose`}>
                    {ayah.text} ﴿{index + 1}﴾
                  </div>
                  
                  {settings.showTranslation && ayah.translation && (
                    <div className={`${fontSizeClass} text-muted-foreground border-t pt-2 ${settings.language === 'ar' ? 'text-right' : 'text-left'}`}>
                      {ayah.translation}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                    <span>
                      {settings.language === 'ar' ? 
                        `سورة ${surahData.surahNameTranslation} - آية ${index + 1}` : 
                        `Surah ${surahData.surahNameTranslation} - Verse ${index + 1}`
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {isFetchingNextPage && (
          <div className="p-6 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/2 mx-auto"></div>
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        )}

        {!hasNextPage && (
          <div className="p-6 text-center text-muted-foreground">
            <p className={fontSizeClass}>
              {settings.language === 'ar' ? 'انتهى القرآن الكريم' : 'End of the Holy Quran'}
            </p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};
