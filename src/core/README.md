# Core Module

Platform-agnostic business logic shared between **Web** and **React Native** projects.

## Structure

```
core/
├── api/            # API service functions
│   ├── prayerApi.ts    # Prayer times (Aladhan API)
│   └── quranApi.ts     # Quran content & audio URLs
├── hooks/          # Reusable React hooks
│   ├── useFavorites.ts          # Azkar favorites (localStorage)
│   ├── useGeolocation.ts        # City detection via GPS
│   ├── usePrayerNotifications.ts # Prayer time alerts
│   ├── useSettings.ts           # App settings & theme
│   └── useTranslation.ts       # i18n helper (ar/en)
├── data/           # Static data
│   └── azkarData.ts    # Azkar categories & content
├── i18n/           # Translations
│   └── translations.ts # Arabic & English strings
└── index.ts        # Barrel exports
```

## Usage in React Native

### 1. Copy the `core/` folder

Copy `src/core/` into your React Native project:

```
my-rn-app/
├── src/
│   ├── core/       ← paste here
│   ├── screens/
│   └── components/
```

### 2. Configure path alias

In `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/core/*": ["./src/core/*"]
    }
  }
}
```

### 3. Import & use

```tsx
import { fetchPrayerTimes } from '@/core/api/prayerApi';
import { useSettings } from '@/core/hooks/useSettings';
import { useTranslation } from '@/core/hooks/useTranslation';

// Or use barrel exports:
import { fetchPrayerTimes, useSettings, useTranslation } from '@/core';
```

## Platform Adaptations

Some hooks use Web APIs that need React Native alternatives:

| Hook | Web API Used | RN Alternative |
|------|-------------|----------------|
| `useFavorites` | `localStorage` | `AsyncStorage` / `MMKV` |
| `useGeolocation` | `navigator.geolocation` | `expo-location` |
| `usePrayerNotifications` | `Notification` API | `expo-notifications` |
| `useSettings` | `localStorage`, `document.documentElement` | `AsyncStorage`, `Appearance` API |

### Recommended approach

Create a `platform.ts` adapter in each project:

```ts
// core/platform.ts (web)
export const storage = {
  get: (key: string) => localStorage.getItem(key),
  set: (key: string, value: string) => localStorage.setItem(key, value),
};

// core/platform.ts (react native)
export const storage = {
  get: (key: string) => MMKV.getString(key),
  set: (key: string, value: string) => MMKV.set(key, value),
};
```

Then refactor hooks to use `platform.storage` instead of `localStorage` directly.

## Dependencies

These packages are required in both web and RN:

- `@tanstack/react-query` — data fetching & caching
- `react` — core React

## Notes

- No UI components live here — only logic, data, and API calls
- All hooks are standard React hooks (no DOM dependencies in core logic)
- Translations support Arabic (RTL) and English (LTR)
