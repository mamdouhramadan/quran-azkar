import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Bookmark, BookmarkDraft, Folder } from '@/core/types';
export type { Bookmark, BookmarkDraft, Folder } from '@/core/types';
import { persistStorage } from '@/core/store/persistStorage';

// BookmarkStore defines the bookmark actions and persisted bookmark collections.
interface BookmarkStore {
  bookmarks: Bookmark[];
  folders: Folder[];
  addBookmark: (bookmark: BookmarkDraft) => void;
  removeBookmark: (id: string) => void;
  createFolder: (name: string) => void;
  deleteFolder: (id: string) => void;
  renameFolder: (id: string, newName: string) => void;
  moveToFolder: (bookmarkId: string, folderId: string | undefined) => void;
}

export const useBookmarkStore = create<BookmarkStore>()(
  persist(
    (set) => ({
      bookmarks: [],
      folders: [],
      addBookmark: (bookmark) => set((state) => {
        // Prevent duplicate bookmarking of the exact same Ayah in the same folder
        const exists = state.bookmarks.some(
          b => b.surah === bookmark.surah && b.ayah === bookmark.ayah && b.folderId === bookmark.folderId
        );
        if (exists) return state;

        return {
          bookmarks: [
            ...state.bookmarks,
            {
              ...bookmark,
              id: crypto.randomUUID(),
              createdAt: Date.now(),
            },
          ],
        };
      }),
      removeBookmark: (id) => set((state) => ({
        bookmarks: state.bookmarks.filter((b) => b.id !== id),
      })),
      createFolder: (name) => set((state) => ({
        folders: [
          ...state.folders,
          {
            id: crypto.randomUUID(),
            name,
            createdAt: Date.now(),
          },
        ],
      })),
      deleteFolder: (id) => set((state) => ({
        folders: state.folders.filter((f) => f.id !== id),
        // Remove folder references from associated bookmarks
        bookmarks: state.bookmarks.map((b) =>
          b.folderId === id ? { ...b, folderId: undefined } : b
        ),
      })),
      renameFolder: (id, newName) => set((state) => ({
        folders: state.folders.map((f) =>
          f.id === id ? { ...f, name: newName } : f
        ),
      })),
      moveToFolder: (bookmarkId, folderId) => set((state) => ({
        bookmarks: state.bookmarks.map((b) =>
          b.id === bookmarkId ? { ...b, folderId } : b
        ),
      })),
    }),
    {
      name: 'quran-bookmarks-storage',
      storage: persistStorage,
    }
  )
);
