"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { searchQuran, type SearchResult } from '@/core/api/searchApi';
import { TopBar } from '@/components/TopBar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useSettings } from '@/core/hooks/useSettings';
import { useTranslation } from '@/core/hooks/useTranslation';
import { MagnifyingGlass, BookOpenText, ArrowRight, SpinnerGap } from '@phosphor-icons/react';

// SearchPage lets users search the Quran and jump directly into reader results.
export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const router = useRouter();
  const { settings } = useSettings();
  const { t } = useTranslation();

  // debounceTimeout delays API work until typing briefly settles.
  const debounceTimeout = useCallback(() => {
    let timer: NodeJS.Timeout;
    return (value: string) => {
      clearTimeout(timer);
      timer = setTimeout(() => setDebouncedQuery(value), 400);
    };
  }, [])();

  // handleInputChange updates the visible query and triggers the debounced search.
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    debounceTimeout(value);
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ['quranSearch', debouncedQuery, settings.language],
    queryFn: () => searchQuran(debouncedQuery, settings.language),
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 60000,
  });

  // handleResultClick opens the selected verse in the Quran reader.
  const handleResultClick = (result: SearchResult) => {
    router.push(`/quran?surah=${result.surahNumber}&ayah=${result.ayahNumber}`);
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
        <div className="flex items-center justify-between mb-8 w-full border-b border-primary/10 pb-4">
          <h1 className="text-xl font-bold tracking-tight">{t('search')}</h1>
          <Breadcrumb items={[{ label: t('search') }]} />
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative">
            <MagnifyingGlass className="absolute left-4 rtl:left-auto rtl:right-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground" weight="regular" />
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder={t('searchPlaceholder')}
              className="w-full h-14 pl-12 rtl:pl-4 rtl:pr-12 pr-4 rounded-2xl bg-card border border-primary/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-base"
              autoFocus
              dir="auto"
            />
            {isLoading && (
              <SpinnerGap className="absolute right-4 rtl:right-auto rtl:left-4 top-1/2 -translate-y-1/2 text-xl text-primary animate-spin" weight="bold" />
            )}
          </div>
          {debouncedQuery.trim().length >= 2 && data && (
            <p className="text-sm text-muted-foreground mt-3">
              {data.totalResults} {t('searchResults')}
            </p>
          )}
        </div>

        {/* Results */}
        {error && (
          <div className="rounded-3xl bg-card border border-primary/10 p-8 text-center">
            <p className="text-destructive font-medium">{t('failedToLoad')}</p>
          </div>
        )}

        {data && data.results.length === 0 && debouncedQuery.trim().length >= 2 && (
          <div className="rounded-3xl bg-card border border-primary/10 p-12 text-center">
            <MagnifyingGlass className="text-5xl text-muted-foreground/50 mx-auto mb-4" weight="regular" />
            <p className="text-foreground font-bold mb-1">{t('noSearchResults')}</p>
            <p className="text-sm text-muted-foreground">{t('noResults')} &ldquo;{debouncedQuery}&rdquo;</p>
          </div>
        )}

        {!debouncedQuery.trim() && (
          <div className="rounded-3xl bg-card border border-primary/10 p-12 text-center">
            <BookOpenText className="text-5xl text-primary/30 mx-auto mb-4" weight="regular" />
            <p className="text-foreground font-bold mb-1">{t('searchHint')}</p>
            <p className="text-sm text-muted-foreground">{t('searchHintDesc')}</p>
          </div>
        )}

        <div className="space-y-3">
          {data?.results.map((result) => (
            <button
              key={result.verseKey}
              onClick={() => handleResultClick(result)}
              className="w-full text-start rounded-2xl bg-card border border-primary/10 p-5 hover:bg-accent/50 transition-all group cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  {/* Surah badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                      <BookOpenText className="text-sm" weight="fill" />
                      {result.surahNameArabic || result.surahNameEnglish} : {result.ayahNumber}
                    </span>
                  </div>

                  {/* Arabic text */}
                  <p
                    className="font-arabic text-lg leading-loose mb-2 text-right"
                    dir="rtl"
                    dangerouslySetInnerHTML={{ __html: result.highlightedText }}
                  />

                  {/* Translation */}
                  {result.translationText && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {result.translationText}
                    </p>
                  )}
                </div>

                <ArrowRight className="text-lg text-muted-foreground group-hover:text-primary transition-colors mt-1 rtl:rotate-180 shrink-0" weight="bold" />
              </div>
            </button>
          ))}
        </div>

        {/* Load more */}
        {data && data.currentPage < data.totalPages && (
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              {t('searchResults')}: {data.currentPage} / {data.totalPages}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
