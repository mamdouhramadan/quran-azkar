import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from '@/core/store/persistStorage';

interface AzkarProgressState {
  progress: Record<string, number[]>; // slug -> remaining counts
  getRemaining: (slug: string) => number[] | undefined;
  setRemaining: (slug: string, remaining: number[]) => void;
  decrementAt: (slug: string, index: number) => void;
  resetCategory: (slug: string, initial: number[]) => void;
}

export const useAzkarProgressStore = create<AzkarProgressState>()(
  persist(
    (set, get) => ({
      progress: {},

      getRemaining: (slug) => get().progress[slug],

      setRemaining: (slug, remaining) =>
        set((s) => ({ progress: { ...s.progress, [slug]: remaining } })),

      decrementAt: (slug, index) =>
        set((s) => {
          const current = s.progress[slug];
          if (!current) return s;
          const updated = [...current];
          if (updated[index] > 0) updated[index]--;
          return { progress: { ...s.progress, [slug]: updated } };
        }),

      resetCategory: (slug, initial) =>
        set((s) => ({ progress: { ...s.progress, [slug]: initial } })),
    }),
    {
      name: 'azkar-progress-v2',
      storage: persistStorage,
    }
  )
);
