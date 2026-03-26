import type { ReactNode } from 'react';
import type { Settings } from '@/core/types';
export type { Settings } from '@/core/types';
import {
  defaultSettings,
  SETTINGS_STORAGE_KEY,
  useSettingsStore,
} from '@/core/store/settingsStore';

interface SettingsHookValue {
  settings: Settings;
  updateSettings: (newSettings: Partial<Settings>) => void;
}

// SettingsProvider remains as a compatibility wrapper around the shared settings store.
export function SettingsProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

// useSettings exposes persisted settings state through the app's stable hook API.
export const useSettings = (): SettingsHookValue => {
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);

  return { settings, updateSettings };
};

export { defaultSettings, SETTINGS_STORAGE_KEY };
