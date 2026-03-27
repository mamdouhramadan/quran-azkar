"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/core/hooks/useTranslation';
import { MagnifyingGlass, CaretRight, BookOpen, Sparkle } from '@phosphor-icons/react';
import { cn } from '@/core/utils/cn';
import type { SurahData } from '@/core/types';

interface SurahListHomeProps {
  surahs?: SurahData[];
  onSurahClick: (surahNumber: number) => void;
}

const toArabicNumeral = (num: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num
    .toString()
    .split('')
    .map((d) => arabicDigits[parseInt(d, 10)])
    .join('');
};

// SurahListHome renders the searchable surah grid used on the Quran landing page.
export const SurahListHome = ({ surahs, onSurahClick }: SurahListHomeProps) => {
  const { t, lang } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState('');

  if (!surahs) {
    return (
      <section className="mb-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-2xl bg-gradient-to-br from-muted/80 to-muted/40 ring-1 ring-border/40"
            />
          ))}
        </div>
      </section>
    );
  }

  const filtered = surahs.filter((surah: SurahData) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const n = String(surah.surahNumber);
    return (
      surah.surahNameArabic?.includes(search) ||
      surah.surahNameTranslation?.toLowerCase().includes(q) ||
      surah.surahNameEnglish?.toLowerCase().includes(q) ||
      n.includes(q)
    );
  });

  return (
    <section className="mb-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-black tracking-tight sm:text-2xl">{t('surahList')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {surahs.length} {t('surahCount')}
          </p>
        </div>
      </div>

      <div className="relative mb-8">
        <MagnifyingGlass
          className="pointer-events-none absolute start-4 top-1/2 z-10 -translate-y-1/2 text-lg text-muted-foreground"
          weight="regular"
          aria-hidden
        />
        <input
          className={cn(
            'h-14 w-full rounded-2xl border border-border/80 bg-card/80 pe-4 ps-12 text-sm shadow-sm',
            'placeholder:text-muted-foreground/80',
            'transition-all focus:border-primary/40 focus:bg-card focus:outline-none focus:ring-2 focus:ring-primary/20'
          )}
          placeholder={t('searchSurah')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          type="search"
          autoComplete="off"
          dir="auto"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((surah: SurahData) => {
          const num = surah.surahNumber;
          const numDisplay = lang === 'ar' ? toArabicNumeral(num) : num;
          return (
            <button
              key={num}
              type="button"
              onClick={() => onSurahClick(num)}
              className={cn(
                'group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-border/70 bg-card p-4 text-start shadow-sm',
                'transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-lg hover:shadow-primary/5',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35'
              )}
            >
              <div className="relative flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 font-black text-primary ring-1 ring-primary/15">
                <span className="text-lg tabular-nums">{numDisplay}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-arabic text-lg font-bold leading-snug text-foreground" dir="rtl">
                  {surah.surahNameArabic}
                </p>
                <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground sm:text-sm">
                  {surah.surahNameTranslation || surah.surahNameEnglish}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary/80">
                  <Sparkle className="size-3.5" weight="fill" aria-hidden />
                  {surah.totalAyah} {t('verses')}
                </p>
              </div>
              <CaretRight
                className="size-5 shrink-0 text-muted-foreground/50 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary rtl:rotate-180"
                weight="bold"
                aria-hidden
              />
            </button>
          );
        })}
      </div>

      {(!search ||
        t('duaKhatmTitle').toLowerCase().includes(search.toLowerCase()) ||
        'دعاء ختم القرآن'.includes(search)) && (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => router.push('/dua-khatm/')}
            className={cn(
              'group flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/12 via-primary/5 to-transparent p-4 text-start shadow-sm',
              'transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30'
            )}
          >
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary ring-1 ring-primary/25">
              <BookOpen className="text-3xl" weight="fill" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-black sm:text-lg">{t('duaKhatmTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('duaKhatmDesc')}</p>
            </div>
            <CaretRight
              className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 rtl:rotate-180"
              weight="bold"
              aria-hidden
            />
          </button>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/30 py-14 text-center">
          <p className="text-muted-foreground">
            {t('noResults')} &ldquo;{search}&rdquo;
          </p>
        </div>
      )}
    </section>
  );
};
