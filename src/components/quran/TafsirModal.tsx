"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTafsirList, fetchTafsir, type TafsirInfo } from '@/core/api/tafsirApi';
import { useSettings } from '@/core/hooks/useSettings';
import { useTranslation } from '@/core/hooks/useTranslation';
import { X, BookOpen, CaretDown, SpinnerGap } from '@phosphor-icons/react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TafsirModalProps {
  isOpen: boolean;
  onClose: () => void;
  verseKey: string; // Format: "surah:ayah"
  verseText?: string;
}

export const TafsirModal = ({ isOpen, onClose, verseKey, verseText }: TafsirModalProps) => {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();
  const [showTafsirList, setShowTafsirList] = useState(false);

  const selectedTafsirId = settings.selectedTafsir || 1;

  // Fetch available tafsirs
  const { data: tafsirList } = useQuery({
    queryKey: ['tafsirList', settings.language],
    queryFn: () => fetchTafsirList(settings.language),
    staleTime: 86400000, // 24 hours
  });

  // Fetch tafsir content for the selected verse
  const { data: tafsirContent, isLoading, error } = useQuery({
    queryKey: ['tafsir', selectedTafsirId, verseKey],
    queryFn: () => fetchTafsir(selectedTafsirId, verseKey),
    enabled: isOpen && !!verseKey,
  });

  const selectedTafsirName = tafsirList?.find((t: TafsirInfo) => t.id === selectedTafsirId)?.name || 'Ibn Kathir';

  // handleSelectTafsir persists the active tafsir source for later verse lookups.
  const handleSelectTafsir = (id: number) => {
    updateSettings({ selectedTafsir: id });
    setShowTafsirList(false);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-x-4 bottom-4 top-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:max-w-2xl md:w-full z-50 bg-card rounded-3xl border border-primary/10 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="text-xl text-primary" weight="fill" />
            </div>
            <div>
              <h2 className="font-bold text-base">{t('tafsir')}</h2>
              <p className="text-xs text-muted-foreground">{verseKey}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="size-10 rounded-full bg-muted flex items-center justify-center hover:bg-accent transition-colors"
          >
            <X className="text-lg" weight="bold" />
          </button>
        </div>

        {/* Tafsir Source Selector */}
        <div className="px-5 pt-4 pb-2">
          <div className="relative">
            <button
              onClick={() => setShowTafsirList(!showTafsirList)}
              className="w-full flex items-center justify-between rounded-2xl bg-muted/50 border border-primary/10 px-4 py-3 text-sm font-medium hover:bg-accent/50 transition-colors"
            >
              <span>{t('tafsirSource')}: {selectedTafsirName}</span>
              <CaretDown className={`text-lg transition-transform ${showTafsirList ? 'rotate-180' : ''}`} weight="bold" />
            </button>

            {showTafsirList && tafsirList && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-primary/10 rounded-2xl shadow-xl z-10 max-h-64 overflow-y-auto">
                {tafsirList.map((tafsirItem: TafsirInfo) => (
                  <button
                    key={tafsirItem.id}
                    onClick={() => handleSelectTafsir(tafsirItem.id)}
                    className={`w-full text-start px-4 py-3 text-sm hover:bg-accent/50 transition-colors first:rounded-t-2xl last:rounded-b-2xl ${
                      tafsirItem.id === selectedTafsirId ? 'bg-primary/10 text-primary font-bold' : ''
                    }`}
                  >
                    <div className="font-medium">{tafsirItem.name}</div>
                    <div className="text-xs text-muted-foreground">{tafsirItem.authorName} · {tafsirItem.languageName}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Verse Text */}
        {verseText && (
          <div className="px-5 py-3">
            <div className="rounded-2xl bg-primary/5 border border-primary/10 p-4">
              <p className="font-arabic text-lg leading-loose text-right" dir="rtl">
                {verseText}
              </p>
            </div>
          </div>
        )}

        {/* Tafsir Content */}
        <ScrollArea className="flex-1 px-5 pb-5">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <SpinnerGap className="text-3xl text-primary animate-spin" weight="bold" />
              <span className="ml-3 text-sm text-muted-foreground">{t('loadingTafsir')}</span>
            </div>
          )}

          {error && (
            <div className="rounded-2xl bg-destructive/10 p-6 text-center">
              <p className="text-destructive font-medium text-sm">{t('failedToLoad')}</p>
            </div>
          )}

          {tafsirContent && !isLoading && (
            <div className="space-y-4 pt-2">
              <div
                className="prose prose-sm max-w-none text-foreground leading-relaxed"
                dir="auto"
                dangerouslySetInnerHTML={{ __html: tafsirContent.text }}
              />
              <div className="pt-4 border-t border-primary/10">
                <p className="text-xs text-muted-foreground">
                  {t('tafsirSource')}: {tafsirContent.resourceName}
                </p>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
};
