"use client";

import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useFavorites } from '@/core/hooks/useFavorites';
import { useTranslation } from '@/core/hooks/useTranslation';
import { toast } from 'sonner';
import { Heart, Copy, ShareNetwork } from '@phosphor-icons/react';

// FavoritesPage shows the user's saved azkar for quick reuse.
export default function FavoritesPage() {
  const router = useRouter();
  const { favorites, toggleFavorite } = useFavorites();
  const { t } = useTranslation();

  // handleCopy copies the selected favorite zikr to the clipboard.
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('copied'));
  };

  // handleShareWhatsApp shares the selected favorite zikr through WhatsApp.
  const handleShareWhatsApp = (text: string) => {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 md:pb-0">
      <TopBar
        selectedSurah={null}
        onSurahChange={() => {}}
        showSurahSelector={false}
        onBackClick={() => router.push('/')}
      />

      <main className="container py-8">
        <div className="flex items-center justify-between mb-8 w-full border-b border-border pb-4">
          <h1 className="text-xl font-bold tracking-tight">{t('favoritesTitle')}</h1>
          <Breadcrumb items={[{ label: t('favoritesTitle') }]} />
        </div>

        {/* Header */}
        <div className="relative rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/10 p-8 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
              <Heart className="text-3xl" weight="fill" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">{t('favoritesTitle')}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {favorites.length > 0
                  ? `${favorites.length} ${t('savedAzkar')}`
                  : t('savedAzkar')}
              </p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-5">
              <Heart className="text-4xl text-muted-foreground/40" weight="regular" />
            </div>
            <p className="text-lg font-bold text-foreground mb-1">{t('noFavorites')}</p>
            <p className="text-sm text-muted-foreground max-w-[260px]">{t('noFavoritesHint')}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((text, index) => (
              <div
                key={index}
                className="group rounded-2xl bg-card border border-border p-5 transition-shadow hover:shadow-md"
              >
                <p className="font-arabic text-xl leading-[2.2] mb-4" dir="rtl">{text}</p>

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <button
                    onClick={() => toggleFavorite(text)}
                    className="flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Heart className="text-sm" weight="fill" />
                    إزالة
                  </button>
                  <div className="flex-1" />
                  <button
                    onClick={() => handleCopy(text)}
                    className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                    title={t('copied')}
                  >
                    <Copy className="text-lg" weight="regular" />
                  </button>
                  <button
                    onClick={() => handleShareWhatsApp(text)}
                    className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <ShareNetwork className="text-lg" weight="regular" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
