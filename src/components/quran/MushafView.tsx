"use client";

import { useQuery } from '@tanstack/react-query';
import { fetchQuranContent } from '@/core/api/quranApi';
import { useSettings } from '@/core/hooks/useSettings';
import { useTranslation } from '@/core/hooks/useTranslation';
import type { QuranAyah, QuranWord } from '@/core/types';

interface MushafViewProps {
  pageNumber: number;
  selectedAyah: { surah: number; ayah: number } | null;
  onAyahClick: (surah: number, ayah: number) => void;
}

interface MushafWord extends QuranWord {
  surahNumber: number;
  ayahNumber: number;
  isEndOfAyah: boolean;
}

// MushafView renders one Quran page grouped into Mushaf-like text lines.
export const MushafView = ({ pageNumber, selectedAyah, onAyahClick }: MushafViewProps) => {
  const { settings } = useSettings();
  const { t } = useTranslation();

  const { data: pageData, isLoading, error } = useQuery({
    queryKey: ['quran-content', 'page', pageNumber, settings.translationId],
    queryFn: () => fetchQuranContent('page', pageNumber, settings.translationId),
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex justify-center items-center py-20 min-h-[60vh]">
        <div className="animate-pulse space-y-6 w-full max-w-2xl px-6">
          {[...Array(15)].map((_, i) => (
            <div key={i} className={`h-8 bg-muted rounded ${i % 2 === 0 ? 'w-full' : 'w-11/12 mx-auto'}`}></div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="py-20 text-center text-destructive">
        <p>{t('failedToLoad') || 'Failed to load content'}</p>
      </div>
    );
  }

  const ayahs = pageData.ayahs ?? [];

  // Extract all words from the page and group by line number
  const allWords: MushafWord[] = ayahs.flatMap((ayah: QuranAyah) =>
    (ayah.words || []).map((word: QuranWord) => ({
      ...word,
      surahNumber: ayah.surahNumber,
      ayahNumber: ayah.number,
      isEndOfAyah: word.charTypeName === 'end'
    }))
  );

  // Group words by their line_number
  // Typically pages 2 to 604 have 15 lines. Pages 1 and 2 might have fewer, but usually mapped to line numbers.
  const lineNumbers = Array.from(
    new Set(allWords.map((word) => word.lineNumber).filter((lineNumber): lineNumber is number => lineNumber !== undefined))
  ).sort((a, b) => a - b);

  const currentJuz = ayahs[0]?.juz;

  return (
    <div className="flex-1 container py-8 pb-32 flex justify-center w-full max-w-4xl mx-auto">
      <div className="w-full bg-[#fdfaf6] dark:bg-card border-8 border-double border-primary/20 p-4 md:p-8 rounded-lg shadow-xl flex flex-col items-center justify-between min-h-[70vh] aspect-[1/1.4]">
        
        {/* Page Header */}
        <div className="w-full flex justify-between items-center border-b-2 border-primary pb-2 mb-6 font-arabic text-primary px-4">
          <span>{pageData.surahNameArabic}</span>
          <span>{t('juzNumber').replace('{{number}}', currentJuz?.toString() || '')}</span>
        </div>

        {/* Mushaf Lines */}
        <div className="w-full flex-1 flex flex-col justify-between items-center text-center space-y-2">
          {lineNumbers.map((lineNum) => {
            const lineWords = allWords.filter(w => w.lineNumber === lineNum);
            // Verify if there's a Bismillah in this line - Bismillahs take full width often
            const isBismillahLine = lineWords.every(w => w.ayahNumber === 1 && w.surahNumber !== 1) && lineWords.length > 0 && lineNum === 1;

            return (
              <div 
                key={lineNum} 
                className="w-full flex justify-between items-center flex-row-reverse flex-wrap text-center"
              >
                {lineWords.map((word: MushafWord) => {
                  const isSelected = selectedAyah?.surah === word.surahNumber && selectedAyah?.ayah === word.ayahNumber;
                  const fontClass = 'font-arabic';

                  return (
                    <span
                      key={word.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAyahClick(word.surahNumber, word.ayahNumber);
                      }}
                      className={`
                        cursor-pointer transition-colors px-1
                        ${fontClass} text-2xl md:text-3xl lg:text-4xl leading-tight
                        ${isSelected ? 'text-primary bg-primary/10 rounded' : 'text-foreground hover:text-primary'}
                        ${word.isEndOfAyah ? 'text-primary px-2 font-bold' : ''}
                      `}
                      title={word.translation}
                    >
                      {word.text}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Page Footer */}
        <div className="w-full border-t-2 border-primary pt-2 mt-6 text-center font-arabic text-primary flex justify-center items-center">
            <span className="bg-primary/10 px-4 py-1 rounded-full border border-primary/20">{pageNumber}</span>
        </div>
      </div>
    </div>
  );
};
