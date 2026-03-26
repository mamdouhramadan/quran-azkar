"use client";

import { useTranslation } from '@/core/hooks/useTranslation';
import { BookOpen, SelectionBackground, Hash } from '@phosphor-icons/react';

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
    <div className="flex bg-card border border-primary/10 rounded-2xl p-1 mb-6 hide-scrollbar overflow-x-auto w-full">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 flex min-w-[100px] items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <tab.icon weight={isActive ? 'fill' : 'regular'} className="text-lg" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
