"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from '@/core/hooks/useTranslation';
import { useShell } from '@/core/providers/ShellProvider';

import { House, BookmarkSimple, BookOpenText, Heart, Gear } from '@phosphor-icons/react';

const navItems = [
  { path: '/', icon: House, labelKey: 'home' as const },
  { path: '/bookmarks', icon: BookmarkSimple, labelKey: 'bookmark' as const, isAction: true },
  { path: '/quran', icon: BookOpenText, labelKey: 'quran' as const, isCenter: true },
  { path: '/favorites', icon: Heart, labelKey: 'favorites' as const },
  { path: '/settings', icon: Gear, labelKey: 'settings' as const, isAction: true },
];

// BottomNav provides the mobile-first primary navigation and quick settings access.
export const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useTranslation();
  const { openSettings } = useShell();

  // handleClick routes normally and opens the global settings drawer when needed.
  const handleClick = (item: typeof navItems[0]) => {
    if (item.path === '/settings') {
      openSettings();
      return;
    }
    router.push(item.path);
  };

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-border bg-card/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = !item.isAction && (
            item.path === '/'
              ? pathname === '/'
              : pathname.startsWith(item.path)
          );

          if (item.isCenter) {
            return (
              <button
                key={item.path}
                onClick={() => handleClick(item)}
                className="flex items-center justify-center -mt-5 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg transition-transform active:scale-95"
              >
                <item.icon
                  className="text-2xl"
                  weight="fill"
                />
              </button>
            );
          }

          return (
            <button
              key={item.path}
              onClick={() => handleClick(item)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <item.icon
                className="text-2xl"
                weight={isActive ? "fill" : "regular"}
              />
              <span className="text-[10px] font-bold">{t(item.labelKey)}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
