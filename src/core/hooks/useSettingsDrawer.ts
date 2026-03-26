import { useShell } from '@/core/providers/ShellProvider';

// useSettingsDrawer preserves the old API while delegating to shared shell state.
export function useSettingsDrawer() {
  return useShell();
}
