"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/core/hooks/useTranslation';
import { MagnifyingGlass, CaretLeft, BookOpen } from '@phosphor-icons/react';
import type { SurahData } from '@/core/types';

interface SurahListHomeProps {
  surahs?: SurahData[];
  onSurahClick: (surahNumber: number) => void;
}

// toArabicNumeral renders Latin digits using Arabic numeral glyphs.
const toArabicNumeral = (num: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => arabicDigits[parseInt(d)]).join('');
};

// SurahListHome renders the searchable surah grid used on the Quran landing page.
export const SurahListHome = ({ surahs, onSurahClick }: SurahListHomeProps) => {
  const { t, lang } = useTranslation();
  const router = useRouter();
  const [search, setSearch] = useState('');

  if (!surahs) {
    return (
      <section className="mb-12">
        <div className="animate-pulse space-y-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 bg-card rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  const filtered = surahs.filter((surah: SurahData, index: number) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      surah.surahNameArabic?.includes(search) ||
      surah.surahNameTranslation?.toLowerCase().includes(q) ||
      surah.surahNameEnglish?.toLowerCase().includes(q) ||
      (index + 1).toString().includes(q)
    );
  });

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black tracking-tight">{t('surahList')}</h2>
        <span className="text-muted-foreground text-sm font-medium">{surahs.length} {t('surahCount')}</span>
      </div>

      <div className="mb-6">
        <div className="flex w-full items-stretch rounded-2xl h-12 bg-card border border-primary/10">
          <div className="text-muted-foreground flex items-center justify-center px-4">
            <MagnifyingGlass className="text-xl" weight="regular" />
          </div>
          <input
            className="flex w-full min-w-0 flex-1 border-none bg-transparent focus:outline-none focus:ring-0 text-sm placeholder:text-muted-foreground"
            placeholder={t('searchSurah')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((surah: SurahData) => {
          const surahNumber = surahs.indexOf(surah) + 1;
          return (
            <div
              key={surahNumber}
              onClick={() => onSurahClick(surahNumber)}
              className="group relative flex items-center justify-between p-5 bg-card rounded-2xl overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all border border-primary/10"
            >
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                  {lang === 'ar' ? toArabicNumeral(surahNumber) : surahNumber}
                </div>
                <div>
                  <h3 className="text-lg font-black">{surah.surahNameArabic}</h3>
                  <p className="text-muted-foreground text-sm">
                    {surah.totalAyah} {t('verses')} • {surah.surahNameTranslation}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-muted-foreground/20 font-black text-3xl uppercase opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                  {surah.surahNameEnglish}
                </span>
                <CaretLeft className="text-primary" weight="regular" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dua Khatm Al-Quran card */}
      {(!search || t('duaKhatmTitle').includes(search) || 'دعاء ختم القرآن'.includes(search)) && (
        <div className="mt-4">
          <div
            onClick={() => router.push('/dua-khatm')}
            className="group relative flex items-center justify-between p-5 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all border border-primary/20"
          >
            <div className="flex items-center gap-5">
              <div className="size-14 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                <BookOpen className="text-3xl" weight="regular" />
              </div>
              <div>
                <h3 className="text-lg font-black">{t('duaKhatmTitle')}</h3>
                <p className="text-muted-foreground text-sm">{t('duaKhatmDesc')}</p>
              </div>
            </div>
            <CaretLeft className="text-primary" weight="regular" />
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t('noResults')} "{search}"
        </div>
      )}
    </section>
  );
};
