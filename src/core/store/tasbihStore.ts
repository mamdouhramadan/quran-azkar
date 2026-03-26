import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from '@/core/store/persistStorage';

interface TasbihState {
  count: number;
  increment: () => void;
  reset: () => void;
}

export const useTasbihStore = create<TasbihState>()(
  persist(
    (set) => ({
      count: 0,
      increment: () => set((s) => ({ count: s.count + 1 })),
      reset: () => set({ count: 0 }),
    }),
    {
      name: 'tasbih-count-v2',
      storage: persistStorage,
    }
  )
);
