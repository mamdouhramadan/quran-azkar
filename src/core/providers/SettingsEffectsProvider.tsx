"use client";

import { useCallback, useEffect } from "react";
import { fetchPrayerTimes } from "@/core/api/prayerApi";
import { useSettings } from "@/core/hooks/useSettings";

const fontSizeMap = {
  small: "14px",
  medium: "16px",
  large: "18px",
} as const;

// resolveAutoTheme chooses a light or dark theme from the current city's prayer times.
async function resolveAutoTheme(city: string): Promise<"light" | "dark"> {
  try {
    const prayerTimes = await fetchPrayerTimes(city);
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const [maghribH, maghribM] = prayerTimes.Maghrib.split(":").map(Number);
    const [fajrH, fajrM] = prayerTimes.Fajr.split(":").map(Number);
    const isDark = currentMinutes >= maghribH * 60 + maghribM || currentMinutes < fajrH * 60 + fajrM;

    return isDark ? "dark" : "light";
  } catch {
    return "light";
  }
}

// SettingsEffectsProvider applies browser-only html, font, and theme side effects from settings.
export function SettingsEffectsProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  // applyResolvedTheme updates the root element classes without disturbing other html classes.
  const applyResolvedTheme = useCallback((theme: "light" | "dark") => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, []);

  useEffect(() => {
    document.documentElement.dir = settings.language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = settings.language;
    document.documentElement.style.fontSize = fontSizeMap[settings.fontSize];
  }, [settings.language, settings.fontSize]);

  useEffect(() => {
    if (settings.theme === "light" || settings.theme === "dark") {
      applyResolvedTheme(settings.theme);
      return;
    }

    if (settings.theme === "system") {
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      const applySystem = () => applyResolvedTheme(media.matches ? "dark" : "light");
      applySystem();
      media.addEventListener("change", applySystem);
      return () => media.removeEventListener("change", applySystem);
    }

    let isActive = true;

    // syncAutoTheme keeps auto theme mode aligned with local prayer-time boundaries.
    const syncAutoTheme = async () => {
      const resolvedTheme = await resolveAutoTheme(settings.city);

      if (isActive) {
        applyResolvedTheme(resolvedTheme);
      }
    };

    syncAutoTheme();

    const interval = setInterval(syncAutoTheme, 60000);

    return () => {
      isActive = false;
      clearInterval(interval);
    };
  }, [settings.city, settings.theme, applyResolvedTheme]);

  return <>{children}</>;
}
