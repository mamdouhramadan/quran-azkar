"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSettings } from '@/core/hooks/useSettings';
import { useTranslation } from '@/core/hooks/useTranslation';
import { useShell } from '@/core/providers/ShellProvider';
import type { SurahData } from '@/core/types';
import { ArrowRight, ArrowLeft, List, MagnifyingGlass } from '@phosphor-icons/react';
import { APP_BRAND } from '@/components/config/appBrand';

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

// TopBar renders shared navigation controls for both dashboard and reader routes.
export const TopBar = ({ 
  onSettingsClick, 
  selectedSurah, 
  selectionType = 'surah',
  onSurahChange, 
  surahs, 
  showSurahSelector = true,
  onBackClick,
  onQuranClick,
}: TopBarProps) => {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();
  const router = useRouter();
  const { openSettings } = useShell();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const currentSurah = surahs && selectedSurah ? surahs[selectedSurah - 1] : null;
  // handleSettingsClick allows pages to override the shared settings action when needed.
  const handleSettingsClick = onSettingsClick ?? openSettings;

  return (
    <nav className="h-[70px] relative w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-20 bg-card text-foreground shadow-md transition-all">
        
      {/* Left Area: Back Button (if any) + Logo */}
      <div className="flex items-center gap-4">
        {onBackClick && (
          <button onClick={onBackClick} className="hover:text-primary transition-colors active:scale-95 -ml-2 p-2 rounded-full hover:bg-accent">
             {settings.language === 'ar' ? <ArrowRight size={24} weight="bold" /> : <ArrowLeft size={24} weight="bold" />}
          </button>
        )}
        <Link href="/" aria-label={APP_BRAND.siteName} className="text-primary flex items-center gap-2">
            <APP_BRAND.LogoIcon size={35} weight="fill" />
            <div className="hidden sm:flex flex-col leading-none">
              <span className="font-bold text-xl">{APP_BRAND.shortName}</span>
              <span className="text-[11px] text-muted-foreground font-medium">{APP_BRAND.headerTagline}</span>
            </div>
        </Link>
      </div>

      {/* Center Links (or Surah Selector if reading Quran) */}
      <ul className="md:flex hidden items-center gap-10">
          {showSurahSelector ? (
               selectionType === 'surah' && currentSurah ? (
                 <Select value={selectedSurah!.toString()} onValueChange={(value) => onSurahChange(parseInt(value))}>
                    <SelectTrigger className="border-none bg-transparent p-0 h-auto text-lg font-bold shadow-none focus:ring-0">
                       <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                       {surahs?.map((s, i) => (
                          <SelectItem key={i+1} value={(i+1).toString()}>
                             {s.surahNameArabic} - {s.surahNameTranslation}
                          </SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
               ) : (
                 <div className="text-lg font-bold">
                   {selectionType === 'juz' ? t('juzNumber').replace('{{number}}', selectedSurah!.toString()) : 
                    selectionType === 'hizb' ? t('hizbNumber').replace('{{number}}', selectedSurah!.toString()) : 
                    selectionType === 'page' ? t('pageNumber').replace('{{number}}', selectedSurah!.toString()) : ''}
                 </div>
               )
          ) : (
            <>
              <li><Link className="hover:text-muted-foreground transition font-medium" href="/">{t('home')}</Link></li>
              <li><Link className="hover:text-muted-foreground transition font-medium" href="/quran">{t('quran')}</Link></li>
              <li><Link className="hover:text-muted-foreground transition font-medium" href="/favorites">{t('favorites')}</Link></li>
              <li><Link className="hover:text-muted-foreground transition font-medium" href="/tasbih">{t('electronicTasbih')}</Link></li>
            </>
          )}
      </ul>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center gap-4">
          <button onClick={() => router.push('/search')} className="hover:text-primary transition-colors p-2 rounded-full hover:bg-accent" title={t('search')}>
            <MagnifyingGlass className="text-xl" weight="regular" />
          </button>
          <button onClick={() => updateSettings({ language: settings.language === 'ar' ? 'en' : 'ar' })} className="font-bold hover:text-primary transition-colors text-sm px-2">
             {settings.language === 'ar' ? 'EN' : 'عربي'}
          </button>
          <button type="button" onClick={handleSettingsClick} className="bg-card text-foreground border border-border md:inline hidden text-sm hover:bg-accent active:scale-95 transition-all w-40 h-11 rounded-full font-bold">
              {t('settings')}
          </button>
      </div>

      {/* Mobile Burger / Center Surah Selector */}
      <div className="flex md:hidden items-center gap-4">
          {showSurahSelector ? (
              selectionType === 'surah' && currentSurah ? (
                 <Select value={selectedSurah!.toString()} onValueChange={(value) => onSurahChange(parseInt(value))}>
                    <SelectTrigger className="border-none bg-transparent p-0 h-auto text-lg font-bold shadow-none focus:ring-0">
                       <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                       {surahs?.map((s, i) => (
                          <SelectItem key={i+1} value={(i+1).toString()}>{s.surahNameArabic}</SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              ) : (
                 <div className="text-lg font-bold">
                    {selectionType === 'juz' ? t('juzNumber').replace('{{number}}', selectedSurah!.toString()) : 
                     selectionType === 'hizb' ? t('hizbNumber').replace('{{number}}', selectedSurah!.toString()) : 
                     selectionType === 'page' ? t('pageNumber').replace('{{number}}', selectedSurah!.toString()) : ''}
                 </div>
              )
          ) : null}

          <button aria-label="menu-btn" type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="menu-btn inline-block md:hidden active:scale-90 transition p-1">
              <List size={30} weight="bold" />
          </button>
      </div>

      {/* Mobile Menu Content */}
      <div className={`mobile-menu absolute top-[70px] z-50 left-0 w-full bg-card p-6 md:hidden shadow-lg border-t border-border transition-all duration-300 origin-top ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
          <ul className="flex flex-col space-y-4 text-lg text-center font-bold">
              <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-sm hover:text-primary">{t('home')}</Link></li>
              <li><Link href="/quran" onClick={() => setIsMobileMenuOpen(false)} className="text-sm hover:text-primary">{t('quran')}</Link></li>
              <li><Link href="/favorites" onClick={() => setIsMobileMenuOpen(false)} className="text-sm hover:text-primary">{t('favorites')}</Link></li>
              <li><Link href="/tasbih" onClick={() => setIsMobileMenuOpen(false)} className="text-sm hover:text-primary">{t('electronicTasbih')}</Link></li>
          </ul>

          <div className="flex flex-col gap-3 mt-6">
              <button onClick={() => { updateSettings({ language: settings.language === 'ar' ? 'en' : 'ar' }); setIsMobileMenuOpen(false); }} className="font-bold py-3 text-sm border border-border rounded-full hover:bg-accent transition-colors">
                  {settings.language === 'ar' ? 'Switch to English' : 'تغيير للعربية'}
              </button>
              <button type="button" onClick={() => { setIsMobileMenuOpen(false); handleSettingsClick(); }} className="bg-primary text-primary-foreground text-sm hover:opacity-90 active:scale-95 transition-all w-full h-11 rounded-full font-bold">
                  {t('settings')}
              </button>
          </div>
      </div>
    </nav>
  );
};
