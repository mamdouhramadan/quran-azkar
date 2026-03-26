"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopBar } from '@/components/TopBar';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useTranslation } from '@/core/hooks/useTranslation';
import { useBookmarkStore } from '@/core/store/bookmarkStore';
import { toast } from 'sonner';
import { BookmarkSimple, FolderPlus, Folder, Trash, Play, ShareNetwork, DotsThreeVertical } from '@phosphor-icons/react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// BookmarksPage manages saved ayat and user-created bookmark folders.
export default function BookmarksPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { bookmarks, folders, createFolder, deleteFolder, removeBookmark, moveToFolder } = useBookmarkStore();
  
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const filteredBookmarks = activeFolderId
    ? bookmarks.filter(b => b.folderId === activeFolderId)
    : bookmarks;

  // handleCreateFolder creates a new bookmark folder from a quick prompt input.
  const handleCreateFolder = () => {
    const name = window.prompt(t('folderName'));
    if (name && name.trim()) {
      createFolder(name.trim());
      toast.success(t('folderName') + ' ✓');
    }
  };

  // handleShareWhatsApp shares bookmark text using WhatsApp's share URL.
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
          <h1 className="text-xl font-bold tracking-tight">{t('bookmarks')}</h1>
          <Breadcrumb items={[{ label: t('bookmarks') }]} />
        </div>

        {/* Header Hero */}
        <div className="relative rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/10 p-8 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="relative flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary shrink-0">
                <BookmarkSimple className="text-3xl" weight="fill" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">{t('bookmarks')}</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {bookmarks.length} {t('bookmarks')}
                </p>
              </div>
            </div>
            <button
              onClick={handleCreateFolder}
              className="flex items-center justify-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl font-bold hover:bg-primary/20 transition-colors"
            >
              <FolderPlus className="text-xl" weight="fill" />
              <span className="hidden sm:inline">{t('addFolder')}</span>
            </button>
          </div>
        </div>

        {/* Folders Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar scroll-smooth w-full">
          <button
            onClick={() => setActiveFolderId(null)}
            className={`whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${
              activeFolderId === null 
                ? 'bg-primary text-primary-foreground shadow-md' 
                : 'bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground'
            }`}
          >
            <BookmarkSimple weight={activeFolderId === null ? 'fill' : 'regular'} className="text-lg" />
            {t('allBookmarks')}
          </button>
          {folders.map(folder => (
            <div key={folder.id} className="relative group flex shrink-0">
              <button
                onClick={() => setActiveFolderId(folder.id)}
                className={`whitespace-nowrap flex items-center gap-2 px-5 py-2.5 rounded-full font-bold transition-all ${
                  activeFolderId === folder.id 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Folder weight={activeFolderId === folder.id ? 'fill' : 'regular'} className="text-lg" />
                {folder.name}
              </button>
              {activeFolderId === folder.id && (
                <button
                  onClick={() => {
                    if (window.confirm('Delete this folder? Bookmarks inside it will not be deleted.')) {
                      deleteFolder(folder.id);
                      setActiveFolderId(null);
                    }
                  }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground size-6 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                >
                  <Trash size={12} weight="fill" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Bookmarks List */}
        {filteredBookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-5">
              <BookmarkSimple className="text-4xl text-muted-foreground/40" weight="regular" />
            </div>
            <p className="text-lg font-bold text-foreground mb-1">{t('noBookmarks')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="group rounded-2xl bg-card border border-primary/10 p-5 transition-all hover:border-primary/30 hover:shadow-md"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <BookmarkSimple weight="fill" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{bookmark.surahName}</p>
                      <p className="text-xs text-muted-foreground">آية {bookmark.ayah}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="size-8 flex items-center justify-center rounded-lg hover:bg-accent outline-none">
                      <DotsThreeVertical weight="bold" className="text-muted-foreground" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => moveToFolder(bookmark.id, undefined)}>
                        <BookmarkSimple className="mr-2 h-4 w-4" />
                        <span>Remove from Folder</span>
                      </DropdownMenuItem>
                      {folders.map(f => (
                        <DropdownMenuItem key={f.id} onClick={() => moveToFolder(bookmark.id, f.id)}>
                          <Folder className="mr-2 h-4 w-4" />
                          <span>Move to {f.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="font-arabic text-xl leading-[2.2] mb-6 line-clamp-2" dir="rtl">
                  {bookmark.text}
                </p>

                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <button
                    onClick={() => router.push(`/?surah=${bookmark.surah}&ayah=${bookmark.ayah}`)}
                    className="flex-1 bg-primary text-primary-foreground rounded-xl py-2.5 text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                  >
                    <Play weight="fill" className="text-lg" />
                    {t('goToPage')}
                  </button>
                  <button
                    onClick={() => handleShareWhatsApp(bookmark.text)}
                    className="flex size-10 items-center justify-center rounded-xl bg-accent text-foreground hover:bg-accent/80 transition-colors"
                  >
                    <ShareNetwork className="text-lg" weight="fill" />
                  </button>
                  <button
                    onClick={() => removeBookmark(bookmark.id)}
                    className="flex size-10 items-center justify-center rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                  >
                    <Trash className="text-lg" weight="fill" />
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
