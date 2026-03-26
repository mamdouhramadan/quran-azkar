"use client";

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useTranslation } from '@/core/hooks/useTranslation';
import { BookmarkSimple, BookOpen, Play } from '@phosphor-icons/react';
import { useBookmarkStore } from '@/core/store/bookmarkStore';
import type { Bookmark } from '@/core/types';

// Migration note: The App now uses useBookmarkStore instead of localStorage directly.

export const BookmarkedAyahSection = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const [bookmark, setBookmark] = useState<Bookmark | null>(null);

  useEffect(() => {
    if (bookmarks.length > 0) {
      setBookmark(bookmarks[bookmarks.length - 1]);
    } else {
      setBookmark(null);
    }
  }, [bookmarks]);

  if (!bookmark) {
    return (
      <section className="h-full">
        <div className="rounded-3xl bg-card border border-primary/10 p-8 shadow-sm h-full flex flex-col items-center justify-center text-center">
          <BookmarkSimple className="text-5xl text-muted-foreground/30 mb-4 block" weight="regular" />
          <p className="text-muted-foreground font-medium mb-1">{t('noBookmark')}</p>
          <p className="text-muted-foreground text-xs">{t('noBookmarkHint')}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="h-full">
      <div className="rounded-3xl bg-card border border-primary/10 p-8 shadow-sm h-full flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black tracking-tight">{t('continueReading')}</h2>
          <BookmarkSimple className="text-primary text-xl" weight="fill" />
        </div>
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <BookOpen weight="regular" />
          </div>
          <div>
            <p className="font-bold text-sm">{bookmark.surahName || `${t('ayah')} ${bookmark.surah}`}</p>
            <p className="text-xs text-muted-foreground">{t('ayah')} {bookmark.ayah}</p>
          </div>
        </div>
        {bookmark.text && (
          <p className="font-arabic text-lg leading-loose text-muted-foreground line-clamp-2 mb-4" dir="rtl">{bookmark.text}</p>
        )}
        <button
          onClick={() => router.push(`/?surah=${bookmark.surah}&ayah=${bookmark.ayah}`)}
          className="w-full bg-primary text-primary-foreground rounded-xl py-3 font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
        >
          <Play weight="regular" />
          {t('continueReading')}
        </button>
      </div>
    </section>
  );
};
