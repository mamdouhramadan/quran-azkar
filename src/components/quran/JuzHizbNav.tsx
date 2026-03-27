"use client";

import { useTranslation } from '@/core/hooks/useTranslation';
import { BookOpen, SelectionBackground, Hash } from '@phosphor-icons/react';
import { cn } from '@/core/utils/cn';

export type QuranTab = 'surah' | 'juz' | 'hizb';

interface JuzHizbNavProps {
  activeTab: QuranTab;
  onTabChange: (tab: QuranTab) => void;
}

type QuranTabIcon = typeof BookOpen;

// JuzHizbNav switches the Quran landing view between surah, juz, and hizb tabs.
export const JuzHizbNav = ({ activeTab, onTabChange }: JuzHizbNavProps) => {
  const { t } = useTranslation();

  const tabs: { id: QuranTab; label: string; icon: QuranTabIcon }[] = [
    { id: 'surah', label: t('surahView'), icon: BookOpen },
    { id: 'juz', label: t('juz'), icon: SelectionBackground },
    { id: 'hizb', label: t('hizb'), icon: Hash },
  ];

  return (
    <div
      className="mb-8 flex w-full gap-1 rounded-2xl border border-border/70 bg-muted/40 p-1.5 shadow-inner ring-1 ring-border/30"
      role="tablist"
      aria-label={t('quran')}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'relative flex min-h-[48px] flex-1 min-w-0 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-bold transition-all duration-200 sm:gap-2.5 sm:px-4 sm:text-sm',
              isActive
                ? 'bg-card text-primary shadow-md ring-1 ring-primary/20'
                : 'text-muted-foreground hover:bg-background/80 hover:text-foreground'
            )}
          >
            {isActive && (
              <span
                className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-primary sm:inset-x-3"
                aria-hidden
              />
            )}
            <tab.icon
              weight={isActive ? 'fill' : 'regular'}
              className={cn('shrink-0 text-lg sm:text-xl', isActive && 'text-primary')}
            />
            <span className="truncate">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
