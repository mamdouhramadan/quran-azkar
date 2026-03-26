"use client";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SettingsProvider } from "@/core/hooks/useSettings";
import { QueryProvider } from "@/core/providers/QueryProvider";
import { SettingsEffectsProvider } from "@/core/providers/SettingsEffectsProvider";
import { ShellProvider } from "@/core/providers/ShellProvider";

// AppProviders composes the app's shared client-side providers once.
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <SettingsEffectsProvider>
        <QueryProvider>
          <ShellProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {children}
            </TooltipProvider>
          </ShellProvider>
        </QueryProvider>
      </SettingsEffectsProvider>
    </SettingsProvider>
  );
}
