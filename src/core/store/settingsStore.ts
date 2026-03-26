import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Settings } from '@/core/types';
import { persistStorage } from '@/core/store/persistStorage';

export const SETTINGS_STORAGE_KEY = 'quran-settings';

export const defaultSettings: Settings = {
  language: 'ar',
  theme: 'light',
  city: 'Mecca',
  reciter: 'afasy',
  fontSize: 'medium',
  showTranslation: true,
  prayerAlerts: false,
  selectedTafsir: 1,
  translationId: 131,
  reciterId: 7,
};

interface SettingsStore {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
  resetSettings: () => void;
}

// useSettingsStore persists shared user settings through one unified Zustand store.
export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      // updateSettings merges partial preferences into the persisted settings snapshot.
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      // resetSettings restores the persisted settings store back to app defaults.
      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: SETTINGS_STORAGE_KEY,
      storage: persistStorage,
    }
  )
);
