import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from '@/core/store/persistStorage';

export const FAVORITES_STORAGE_KEY = 'azkar-favorites';

interface FavoritesStore {
  favorites: string[];
  toggleFavorite: (text: string) => void;
}

// useFavoritesStore persists favorite azkar entries through the shared storage adapter.
export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set) => ({
      favorites: [],
      // toggleFavorite adds or removes one zikr string from the favorites list.
      toggleFavorite: (text) =>
        set((state) => ({
          favorites: state.favorites.includes(text)
            ? state.favorites.filter((favorite) => favorite !== text)
            : [...state.favorites, text],
        })),
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      storage: persistStorage,
    }
  )
);
