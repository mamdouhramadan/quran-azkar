"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { azkarCategories } from '@/core/data/azkarData';
import { TopBar } from '@/components/TopBar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useFavorites } from '@/core/hooks/useFavorites';
import { useTranslation } from '@/core/hooks/useTranslation';
import { useAzkarProgressStore } from '@/core/store/azkarProgressStore';
import { toast } from 'sonner';
import { Copy, ShareNetwork, CheckCircle, Trophy, Heart } from '@phosphor-icons/react';

interface AzkarCategoryPageProps {
  slug: string;
}

// toArabicNumeral formats numbers for Arabic UI displays.
const toArabicNumeral = (num: number): string => {
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return num.toString().split('').map(d => arabicDigits[parseInt(d)]).join('');
};

// playClickSound creates a lightweight feedback sound for each azkar count tap.
const playClickSound = (() => {
  let ctx: AudioContext | null = null;
  return () => {
    try {
      if (!ctx) ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.12);
    } catch {
      // silent fail
    }
  };
})();

// AzkarCategoryPage manages one azkar category with progress, favorites, and sharing actions.
export function AzkarCategoryPage({ slug }: AzkarCategoryPageProps) {
  const router = useRouter();
  const { t, lang } = useTranslation();
  const { toggleFavorite, isFavorite } = useFavorites();
  const normalizedSlug = decodeURIComponent(slug).replace(/^\/+|\/+$/g, '').toLowerCase();
  const category = azkarCategories.find(c => c.slug === normalizedSlug);

  const { getRemaining, setRemaining, decrementAt, resetCategory } = useAzkarProgressStore();
  const remaining = getRemaining(normalizedSlug) ?? [];

  useEffect(() => {
    if (!category) return;
    const stored = getRemaining(normalizedSlug);
    if (!stored || stored.length !== category.azkar.length) {
      setRemaining(normalizedSlug, category.azkar.map(z => z.count));
    }
  }, [normalizedSlug, category, getRemaining, setRemaining]);

  // handleCount decrements the remaining counter for one zikr entry.
  const handleCount = useCallback((index: number) => {
    playClickSound();
    decrementAt(normalizedSlug, index);
  }, [normalizedSlug, decrementAt]);

  // handleReset restores all counters for the active azkar category.
  const handleReset = () => {
    if (!category) return;
    resetCategory(normalizedSlug, category.azkar.map(z => z.count));
  };

  // handleCopy copies zikr text without triggering the outer count action.
  const handleCopy = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success('تم النسخ');
  };

  // handleShareWhatsApp shares zikr text without triggering the outer count action.
  const handleShareWhatsApp = (text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const totalRemaining = remaining.reduce((a, b) => a + b, 0);
  const totalAll = category?.azkar.reduce((a, z) => a + z.count, 0) || 1;
  const progress = Math.round(((totalAll - totalRemaining) / totalAll) * 100);

  if (!category) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20 md:pb-0">
      <TopBar
        selectedSurah={null}
        onSurahChange={() => {}}
        showSurahSelector={false}
        onBackClick={() => router.push('/')}
      />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8 w-full border-b border-border pb-4">
          <h1 className="text-xl font-bold tracking-tight">{t(category.titleKey)}</h1>
          <Breadcrumb items={[{ label: 'الأذكار', href: '/' }, { label: t(category.titleKey) }]} />
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
            <category.icon className="text-5xl" weight="fill" />
          </div>
          <p className="text-muted-foreground">{t(category.descKey)}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8 bg-card rounded-2xl border border-border p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold">{t('progress')}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{lang === 'ar' ? toArabicNumeral(progress) : progress}٪</span>
              <button onClick={handleReset} className="text-xs text-primary font-bold hover:underline">
                {t('reset')}
              </button>
            </div>
          </div>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Azkar list */}
        <div className="space-y-4">
          {category.azkar.map((zikr, index) => {
            const done = remaining[index] === 0;
            return (
              <div
                key={index}
                onClick={() => handleCount(index)}
                className={`rounded-2xl border p-5 cursor-pointer transition-all select-none active:scale-[0.98] ${
                  done
                    ? 'bg-primary/5 border-primary/20 opacity-60'
                    : 'bg-card border-border hover:ring-2 ring-primary'
                }`}
              >
                <p className="font-arabic text-xl leading-loose mb-4">{zikr.text}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {zikr.source && (
                      <span className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
                        {zikr.source}
                      </span>
                    )}
                    {/* Action buttons */}
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(zikr.text); }}
                      className="flex size-8 items-center justify-center rounded-full bg-muted transition-colors"
                      title="تفضيل"
                    >
                      <Heart className={`text-base ${isFavorite(zikr.text) ? 'text-red-500' : 'text-muted-foreground'}`} weight={isFavorite(zikr.text) ? 'fill' : 'regular'} />
                    </button>
                    <button
                      onClick={(e) => handleCopy(zikr.text, e)}
                      className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors"
                      title="نسخ"
                    >
                      <Copy className="text-base" weight="regular" />
                    </button>
                    <button
                      onClick={(e) => handleShareWhatsApp(zikr.text, e)}
                      className="flex size-8 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-colors"
                      title="مشاركة عبر واتساب"
                    >
                      <ShareNetwork className="text-base" weight="regular" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    {done ? (
                      <CheckCircle className="text-primary" weight="regular" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground hidden sm:inline">{t('pressToCount')}</span>
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-black text-sm">
                          {lang === 'ar' ? toArabicNumeral(remaining[index] ?? zikr.count) : (remaining[index] ?? zikr.count)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Completion message */}
        {progress === 100 && (
          <div className="mt-8 text-center p-6 rounded-2xl bg-primary/10 border border-primary/20">
            <Trophy className="text-primary text-5xl mb-2" weight="regular" />
            <p className="text-lg font-black text-primary">{t('completedAll')}</p>
            <p className="text-sm text-muted-foreground mt-1">{t('acceptedFromYou')}</p>
          </div>
        )}
      </main>
    </div>
  );
}
