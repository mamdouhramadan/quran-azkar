"use client";

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSettings } from '@/core/hooks/useSettings';
import { useTranslation } from '@/core/hooks/useTranslation';
import { useShell } from '@/core/providers/ShellProvider';
import type { SurahData } from '@/core/types';
import {
  ArrowRight,
  ArrowLeft,
  List,
  MagnifyingGlass,
  Sun,
  Moon,
  Monitor,
  CaretDown,
  Check,
  Gear,
  House,
  BookOpenText,
  Heart,
  CirclesFour,
} from '@phosphor-icons/react';
import { APP_BRAND } from '@/components/config/appBrand';
import { cn } from '@/core/utils/cn';

interface TopBarProps {
  onSettingsClick?: () => void;
  selectedSurah: number | null;
  selectionType?: 'surah' | 'juz' | 'hizb' | 'page';
  onSurahChange: (surah: number) => void;
  surahs?: SurahData[];
  showSurahSelector?: boolean;
  onBackClick?: () => void;
  onQuranClick?: () => void;
}

const MAIN_NAV = [
  { href: '/', labelKey: 'home' as const, Icon: House },
  { href: '/quran/', labelKey: 'quran' as const, Icon: BookOpenText },
  { href: '/favorites/', labelKey: 'favorites' as const, Icon: Heart },
  { href: '/tasbih/', labelKey: 'electronicTasbih' as const, Icon: CirclesFour },
] as const;

function isNavActive(pathname: string, href: string) {
  const base = href.replace(/\/$/, '') || '/';
  if (base === '/') return pathname === '/' || pathname === '';
  return pathname === href || pathname.startsWith(`${base}/`) || pathname.startsWith(base);
}

// TopBar renders shared navigation controls for both dashboard and reader routes.
export const TopBar = ({
  onSettingsClick,
  selectedSurah,
  selectionType = 'surah',
  onSurahChange,
  surahs,
  showSurahSelector = true,
  onBackClick,
}: TopBarProps) => {
  const { settings, updateSettings } = useSettings();
  const { t, lang } = useTranslation();
  const brandFont = lang === 'ar' ? 'font-brand-ar' : 'font-brand-en';
  const router = useRouter();
  const pathname = usePathname();
  const { openSettings } = useShell();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentSurah = surahs && selectedSurah ? surahs[selectedSurah - 1] : null;
  const handleSettingsClick = onSettingsClick ?? openSettings;

  const themeModes = [
    { mode: 'light' as const, Icon: Sun, labelKey: 'themeLight' as const },
    { mode: 'dark' as const, Icon: Moon, labelKey: 'themeDark' as const },
    { mode: 'system' as const, Icon: Monitor, labelKey: 'themeSystem' as const },
  ];

  return (
    <nav className="h-[70px] relative w-full px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-20 bg-card/90 backdrop-blur-md text-foreground border-b border-border/50 shadow-sm transition-[background,box-shadow] duration-300">
      {/* Left Area: Back Button (if any) + Logo */}
      <div className="flex min-w-0 shrink items-center gap-3 sm:gap-4">
        {onBackClick && (
          <button
            type="button"
            onClick={onBackClick}
            className="hover:text-primary transition-colors active:scale-95 -ml-1 sm:-ml-2 p-2 rounded-full hover:bg-accent"
          >
            {settings.language === 'ar' ? <ArrowRight size={24} weight="bold" /> : <ArrowLeft size={24} weight="bold" />}
          </button>
        )}
        <Link href="/" aria-label={t('brandWordmark')} className="text-primary flex min-w-0 items-center gap-2">
          <APP_BRAND.LogoIcon size={35} weight="fill" className="shrink-0" />
          <div className="hidden sm:flex flex-col leading-none min-w-0">
            <span
              className={cn(
                brandFont,
                'truncate text-xl font-bold tracking-tight sm:text-[1.35rem]',
                lang === 'ar' && 'leading-tight'
              )}
            >
              {t('brandWordmark')}
            </span>
            <span className="mt-0.5 truncate text-[11px] font-medium text-muted-foreground">{t('brandTagline')}</span>
          </div>
        </Link>
      </div>

      {/* Center Links (or Surah Selector if reading Quran) */}
      <ul className="md:flex hidden items-center gap-6 lg:gap-10">
        {showSurahSelector ? (
          selectionType === 'surah' && currentSurah ? (
            <Select value={selectedSurah!.toString()} onValueChange={(value) => onSurahChange(parseInt(value))}>
              <SelectTrigger className="border-none bg-transparent p-0 h-auto text-lg font-bold shadow-none focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {surahs?.map((s, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {s.surahNameArabic} - {s.surahNameTranslation}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-lg font-bold">
              {selectionType === 'juz'
                ? t('juzNumber').replace('{{number}}', selectedSurah!.toString())
                : selectionType === 'hizb'
                  ? t('hizbNumber').replace('{{number}}', selectedSurah!.toString())
                  : selectionType === 'page'
                    ? t('pageNumber').replace('{{number}}', selectedSurah!.toString())
                    : ''}
            </div>
          )
        ) : (
          MAIN_NAV.map((item, i) => {
            const active = isNavActive(pathname, item.href);
            const NavIcon = item.Icon;
            return (
              <li
                key={item.href}
                className="animate-in fade-in slide-in-from-bottom-1 duration-500 fill-mode-both"
                style={{ animationDelay: `${60 + i * 50}ms` }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    'group relative inline-flex items-center gap-2 py-1.5 text-sm font-semibold transition-colors duration-200',
                    active ? 'text-primary' : 'text-foreground/80 hover:text-foreground'
                  )}
                >
                  <NavIcon
                    className="text-lg shrink-0 transition-transform duration-200 group-hover:scale-105"
                    weight={active ? 'fill' : 'regular'}
                    aria-hidden
                  />
                  <span>{t(item.labelKey)}</span>
                  <span
                    className={cn(
                      'absolute bottom-0 inset-x-0 h-0.5 origin-center rounded-full bg-primary transition-transform duration-300 ease-out',
                      active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-75 group-hover:opacity-60'
                    )}
                  />
                </Link>
              </li>
            );
          })
        )}
      </ul>

      {/* Desktop: search, theme, language, settings */}
      <div className="hidden md:flex items-center gap-2 lg:gap-3 shrink-0">
        <button
          type="button"
          onClick={() => router.push('/search/')}
          className="hover:text-primary transition-colors p-2 rounded-full hover:bg-accent"
          title={t('search')}
        >
          <MagnifyingGlass className="text-xl" weight="regular" />
        </button>

        <div
          className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 p-1 shadow-inner"
          role="group"
          aria-label={t('theme')}
        >
          {themeModes.map(({ mode, Icon, labelKey }) => {
            const selected = settings.theme === mode;
            return (
              <button
                key={mode}
                type="button"
                onClick={() => updateSettings({ theme: mode })}
                title={t(labelKey)}
                aria-label={t(labelKey)}
                aria-pressed={selected}
                className={cn(
                  'relative flex size-9 items-center justify-center rounded-full transition-all duration-300 ease-out motion-reduce:transition-none',
                  selected
                    ? 'bg-card text-primary shadow-sm ring-1 ring-primary/25 scale-[1.02]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/90'
                )}
              >
                <Icon
                  className={cn('text-lg transition-transform duration-300 ease-out motion-reduce:transition-none', selected && 'scale-110')}
                  weight={selected ? 'fill' : 'regular'}
                />
              </button>
            );
          })}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-3 text-sm font-semibold transition hover:bg-muted"
            >
              <span className="text-lg leading-none" aria-hidden>
                {settings.language === 'ar' ? '🇸🇦' : '🇬🇧'}
              </span>
              <span className="hidden lg:inline max-w-[7rem] truncate">
                {settings.language === 'ar' ? t('languageArabic') : t('languageEnglish')}
              </span>
              <CaretDown className="size-3.5 opacity-70" weight="bold" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[200px] rounded-xl border-border/60 p-1.5 z-[60]">
            <DropdownMenuItem
              className="gap-2 rounded-lg cursor-pointer flex items-center justify-between"
              onClick={() => updateSettings({ language: 'ar' })}
            >
              <span className="text-lg leading-none shrink-0" aria-hidden>
                🇸🇦
              </span>
              <span className="flex-1">{t('languageArabic')}</span>
              {settings.language === 'ar' && <Check className="size-4 text-primary shrink-0" weight="bold" aria-hidden />}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 rounded-lg cursor-pointer flex items-center justify-between"
              onClick={() => updateSettings({ language: 'en' })}
            >
              <span className="text-lg leading-none shrink-0" aria-hidden>
                🇬🇧
              </span>
              <span className="flex-1">{t('languageEnglish')}</span>
              {settings.language === 'en' && <Check className="size-4 text-primary shrink-0" weight="bold" aria-hidden />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={handleSettingsClick}
          className="p-2 rounded-full text-foreground hover:text-primary hover:bg-accent active:scale-95 transition-all"
          aria-label={t('settings')}
          title={t('settings')}
        >
          <Gear className="text-xl" weight="bold" />
        </button>
      </div>

      {/* Mobile: surah selector + menu toggle */}
      <div className="flex md:hidden items-center gap-2 shrink-0">
        {showSurahSelector ? (
          selectionType === 'surah' && currentSurah ? (
            <Select value={selectedSurah!.toString()} onValueChange={(value) => onSurahChange(parseInt(value))}>
              <SelectTrigger className="border-none bg-transparent p-0 h-auto text-lg font-bold shadow-none focus:ring-0 max-w-[40vw]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {surahs?.map((s, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {s.surahNameArabic}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="text-lg font-bold truncate max-w-[45vw]">
              {selectionType === 'juz'
                ? t('juzNumber').replace('{{number}}', selectedSurah!.toString())
                : selectionType === 'hizb'
                  ? t('hizbNumber').replace('{{number}}', selectedSurah!.toString())
                  : selectionType === 'page'
                    ? t('pageNumber').replace('{{number}}', selectedSurah!.toString())
                    : ''}
            </div>
          )
        ) : null}

        <button
          aria-expanded={isMobileMenuOpen}
          aria-label="menu"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="menu-btn inline-flex md:hidden active:scale-90 transition p-2 rounded-full hover:bg-accent"
        >
          <List size={28} weight="bold" />
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          'mobile-menu absolute top-[70px] z-50 left-0 right-0 bg-card/98 backdrop-blur-lg border-b border-border shadow-xl md:hidden overflow-hidden transition-all duration-300 ease-out origin-top',
          isMobileMenuOpen ? 'max-h-[min(85vh,520px)] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        )}
      >
        <div className="p-5 space-y-5">
          <ul className="flex flex-col gap-1">
            {MAIN_NAV.map((item, i) => {
              const active = isNavActive(pathname, item.href);
              const NavIcon = item.Icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    style={{ transitionDelay: isMobileMenuOpen ? `${i * 40}ms` : '0ms' }}
                    className={cn(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-base font-bold transition-all duration-300',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-foreground hover:bg-muted active:scale-[0.99]',
                      isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0'
                    )}
                  >
                    <NavIcon
                      className="text-2xl shrink-0"
                      weight={active ? 'fill' : 'regular'}
                      aria-hidden
                    />
                    <span>{t(item.labelKey)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border/60">
            <span className="text-xs font-bold text-muted-foreground w-full">{t('theme')}</span>
            <div className="inline-flex items-center rounded-full border border-border/60 bg-muted/40 p-1 shadow-inner w-full justify-between sm:w-auto sm:justify-start">
              {themeModes.map(({ mode, Icon, labelKey }) => {
                const selected = settings.theme === mode;
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => updateSettings({ theme: mode })}
                    title={t(labelKey)}
                    aria-label={t(labelKey)}
                    aria-pressed={selected}
                    className={cn(
                      'relative flex flex-1 sm:flex-initial sm:size-10 size-11 items-center justify-center rounded-full transition-all duration-300 ease-out',
                      selected
                        ? 'bg-card text-primary shadow-sm ring-1 ring-primary/25'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className={cn('text-xl transition-transform duration-300', selected && 'scale-110')} weight={selected ? 'fill' : 'regular'} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-muted-foreground">{t('language')}</span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  updateSettings({ language: 'ar' });
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold transition-all duration-200',
                  settings.language === 'ar'
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'border-border hover:bg-muted'
                )}
              >
                <span className="text-xl">🇸🇦</span>
                {t('languageArabic')}
              </button>
              <button
                type="button"
                onClick={() => {
                  updateSettings({ language: 'en' });
                  setIsMobileMenuOpen(false);
                }}
                className={cn(
                  'flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold transition-all duration-200',
                  settings.language === 'en'
                    ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/20'
                    : 'border-border hover:bg-muted'
                )}
              >
                <span className="text-xl">🇬🇧</span>
                {t('languageEnglish')}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              handleSettingsClick();
            }}
            className="w-full flex items-center justify-center h-12 rounded-xl border border-border bg-muted/50 text-primary hover:bg-muted active:scale-[0.99] transition-all shadow-sm"
            aria-label={t('settings')}
            title={t('settings')}
          >
            <Gear className="text-2xl" weight="bold" aria-hidden />
          </button>
        </div>
      </div>
    </nav>
  );
};
