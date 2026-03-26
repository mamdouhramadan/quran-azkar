import { useCallback } from 'react';
import { useFavoritesStore } from '@/core/store/favoritesStore';

// useFavorites exposes persisted favorite azkar entries through a simple hook API.
export const useFavorites = () => {
  const favorites = useFavoritesStore((state) => state.favorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  // isFavorite checks whether a zikr is already stored in the persisted favorites list.
  const isFavorite = (text: string) => favorites.includes(text);

  return { favorites, toggleFavorite, isFavorite: useCallback(isFavorite, [favorites]) };
};
