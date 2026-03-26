"use client";

import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { SettingsDrawer } from "@/components/SettingsDrawer";
import { useShell } from "@/core/providers/ShellProvider";

// AppShell renders the global chrome and shared drawer around page content.
export function AppShell({ children }: { children: React.ReactNode }) {
  const { isSettingsOpen, closeSettings } = useShell();

  return (
    <>
      {children}
      <Footer />
      <BottomNav />
      <SettingsDrawer isOpen={isSettingsOpen} onClose={closeSettings} />
    </>
  );
}
