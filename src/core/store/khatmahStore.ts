import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { persistStorage } from '@/core/store/persistStorage';

interface DailyRecord {
  date: string;
  pages: number;
}

interface KhatmahState {
  completedCount: number;
  currentPage: number;
  dailyHistory: DailyRecord[];
  increment: () => void;
  decrement: () => void;
  resetCurrent: () => void;
}

const TOTAL_PAGES = 604;

export const useKhatmahStore = create<KhatmahState>()(
  persist(
    (set) => ({
      completedCount: 0,
      currentPage: 0,
      dailyHistory: [],

      increment: () =>
        set((s) => {
          const today = new Date().toISOString().split('T')[0];
          const history = [...s.dailyHistory];
          const idx = history.findIndex((r) => r.date === today);
          if (idx >= 0) history[idx] = { ...history[idx], pages: history[idx].pages + 1 };
          else history.push({ date: today, pages: 1 });
          // Keep last 30 days
          const cutoff = new Date();
          cutoff.setDate(cutoff.getDate() - 30);
          const filtered = history.filter((r) => new Date(r.date) >= cutoff);

          const newPage = s.currentPage + 1;
          if (newPage >= TOTAL_PAGES) {
            return { completedCount: s.completedCount + 1, currentPage: 0, dailyHistory: filtered };
          }
          return { currentPage: newPage, dailyHistory: filtered };
        }),

      decrement: () =>
        set((s) => {
          const today = new Date().toISOString().split('T')[0];
          const history = [...s.dailyHistory];
          const idx = history.findIndex((r) => r.date === today);
          if (idx >= 0) history[idx] = { ...history[idx], pages: Math.max(0, history[idx].pages - 1) };
          return { currentPage: Math.max(0, s.currentPage - 1), dailyHistory: history };
        }),

      resetCurrent: () => set({ currentPage: 0 }),
    }),
    {
      name: 'khatmah-data-v2',
      storage: persistStorage,
    }
  )
);

export { TOTAL_PAGES };
