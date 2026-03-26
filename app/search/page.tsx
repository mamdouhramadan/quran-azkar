"use client";

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import { searchQuran, type SearchResult } from '@/core/api/searchApi';
import { TopBar } from '@/components/TopBar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useSettings } from '@/core/hooks/useSettings';
import { useTranslation } from '@/core/hooks/useTranslation';
import { MagnifyingGlass, BookOpenText, ArrowRight, SpinnerGap } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

// formatLocaleDigits renders surah/ayah numbers with Arabic-Indic digits when UI is Arabic.
function formatLocaleDigits(n: number, lang: string): string {
  if (lang !== 'ar') return String(n);
  const digits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return n
    .toString()
    .split('')
    .map((d) => digits[parseInt(d, 10)])
    .join('');
}

// formatVerseKeyDisplay localizes the verse key (e.g. 2:255) for the active UI language.
function formatVerseKeyDisplay(verseKey: string, lang: string): string {
  const parts = verseKey.split(':');
  if (parts.length !== 2) return verseKey;
  const surah = parseInt(parts[0], 10);
  const ayah = parseInt(parts[1], 10);
  if (Number.isNaN(surah) || Number.isNaN(ayah)) return verseKey;
  return `${formatLocaleDigits(surah, lang)}:${formatLocaleDigits(ayah, lang)}`;
}

// SearchPage lets users search the Quran and jump directly into reader results.
export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const router = useRouter();
  const { settings } = useSettings();
  const { t, lang } = useTranslation();

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

  const {
    data,
    isLoading,
    isFetchingNextPage,
    error,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['quranSearch', debouncedQuery, settings.language],
    queryFn: ({ pageParam }) => searchQuran(debouncedQuery, settings.language, pageParam, 20),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined,
    enabled: debouncedQuery.trim().length >= 2,
    staleTime: 60000,
  });

  const flatResults = data?.pages.flatMap((p) => p.results) ?? [];
  const totalResults = data?.pages[0]?.totalResults ?? 0;
  const totalPages = data?.pages[0]?.totalPages ?? 0;
  const loadedPages = data?.pages.length ?? 0;

  // handleResultClick opens the selected verse in the Quran reader (home route reads ?surah=&ayah=).
  const handleResultClick = (result: SearchResult) => {
    const params = new URLSearchParams({
      surah: String(result.surahNumber),
      ayah: String(result.ayahNumber),
    });
    router.push(`/?${params.toString()}`);
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
              {totalResults} {t('searchResults')}
            </p>
          )}
        </div>

        {/* Results */}
        {error && (
          <div className="rounded-3xl bg-card border border-primary/10 p-8 text-center">
            <p className="text-destructive font-medium">{t('failedToLoad')}</p>
          </div>
        )}

        {data && flatResults.length === 0 && debouncedQuery.trim().length >= 2 && (
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

        <div className="space-y-4">
          {flatResults.map((result) => (
            <button
              key={result.verseKey}
              type="button"
              onClick={() => handleResultClick(result)}
              className="w-full text-start rounded-2xl bg-card border border-border/80 shadow-sm overflow-hidden hover:border-primary/25 hover:shadow-md hover:bg-card transition-all group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              {/* Surah header */}
              <div className="relative border-b border-primary/10 bg-gradient-to-br from-primary/[0.07] via-card to-card px-4 py-4 sm:px-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-primary/90">
                      <BookOpenText className="size-5 shrink-0" weight="fill" aria-hidden />
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary/70">
                        {t('quran')}
                      </span>
                    </div>
                    {result.surahNameArabic ? (
                      <p className="font-arabic text-xl sm:text-2xl font-bold text-foreground leading-snug text-end" dir="rtl">
                        {result.surahNameArabic}
                      </p>
                    ) : null}
                    {result.surahNameEnglish ? (
                      <p className="text-sm font-semibold text-muted-foreground tracking-tight">
                        {result.surahNameEnglish}
                      </p>
                    ) : null}
                    {!result.surahNameArabic && !result.surahNameEnglish ? (
                      <p className="text-sm font-semibold text-muted-foreground">
                        {t('searchMetaSurah').replace('{{surah}}', formatLocaleDigits(result.surahNumber, lang))}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2 sm:justify-end shrink-0">
                    <span className="inline-flex items-center rounded-full bg-background/90 border border-border/80 px-2.5 py-1 text-[11px] font-bold text-foreground shadow-sm">
                      {t('searchMetaSurah').replace('{{surah}}', formatLocaleDigits(result.surahNumber, lang))}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-primary/12 text-primary border border-primary/20 px-2.5 py-1 text-[11px] font-bold">
                      {t('searchMetaAyah').replace('{{ayah}}', formatLocaleDigits(result.ayahNumber, lang))}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-muted/80 px-2.5 py-1 font-mono text-[10px] font-medium text-muted-foreground">
                      {t('searchVerseKey').replace('{{key}}', formatVerseKeyDisplay(result.verseKey, lang))}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-primary/80 mb-2">
                    {t('searchArabicMatch')}
                  </p>
                  <p
                    className="font-arabic text-lg sm:text-xl leading-[1.9] text-foreground text-right"
                    dir="rtl"
                    dangerouslySetInnerHTML={{ __html: result.highlightedText }}
                  />
                </div>

                {result.translationText ? (
                  <div className="rounded-xl bg-muted/40 border border-border/60 px-3 py-3 sm:px-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                      {t('searchTranslationMatch')}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 text-start" dir="auto">
                      {result.translationText}
                    </p>
                  </div>
                ) : null}

                <div className="flex items-center justify-end gap-2 pt-1 border-t border-border/50">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:gap-2 transition-all">
                    {t('searchOpenInReader')}
                    <ArrowRight className="text-base rtl:rotate-180 shrink-0" weight="bold" />
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {hasNextPage && debouncedQuery.trim().length >= 2 && (
          <div className="flex flex-col items-center gap-2 mt-10">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl px-8 h-11 font-bold border-primary/30"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? (
                <span className="inline-flex items-center gap-2">
                  <SpinnerGap className="text-lg animate-spin" weight="bold" />
                  {t('searchLoadingMore')}
                </span>
              ) : (
                t('searchLoadMore')
              )}
            </Button>
            {totalPages > 1 && (
              <p className="text-xs text-muted-foreground">
                {t('searchPaginationSummary')
                  .replace('{{loaded}}', String(loadedPages))
                  .replace('{{total}}', String(totalPages))}
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
