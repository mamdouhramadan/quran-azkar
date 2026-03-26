"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

interface ShellContextValue {
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
}

const ShellContext = createContext<ShellContextValue | null>(null);

// ShellProvider keeps app-level shell UI state in one shared place.
export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // openSettings exposes a stable action for opening the global settings drawer.
  const openSettings = useCallback(() => setIsSettingsOpen(true), []);
  // closeSettings exposes a stable action for closing the global settings drawer.
  const closeSettings = useCallback(() => setIsSettingsOpen(false), []);

  const value = useMemo(
    () => ({ isSettingsOpen, openSettings, closeSettings }),
    [isSettingsOpen, openSettings, closeSettings]
  );

  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
}

// useShell gives components access to shared shell actions and state.
export function useShell() {
  const context = useContext(ShellContext);

  if (!context) {
    throw new Error("useShell must be used within ShellProvider");
  }

  return context;
}
