"use client";

import { AppProviders } from "@/core/providers/AppProviders";

// Providers keeps the Next.js entrypoint thin while delegating to src/providers.
export function Providers({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
