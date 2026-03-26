import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/core/hooks/useSettings';
import type { Settings } from '@/core/types';
import { useTranslation } from '@/core/hooks/useTranslation';
import { useGeolocation } from '@/core/hooks/useGeolocation';
import { fetchAvailableTranslations } from '@/core/api/translationApi';
import { fetchReciters } from '@/core/api/reciterApi';
import { toast } from 'sonner';
import {
  MapPin,
  SpinnerGap,
  Globe,
  BookOpenText,
  PaintBrush,
  Bell,
} from '@phosphor-icons/react';
import { cn } from '@/core/utils/cn';
import { useMediaQuery } from '@/core/hooks/useMediaQuery';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string; weight?: string }>;
  children: React.ReactNode;
  className?: string;
}

function SettingsSection({ title, icon: Icon, children, className }: SettingsSectionProps) {
  return (
    <section
      className={cn(
        'rounded-2xl border border-border/70 bg-card/80 p-4 shadow-sm ring-1 ring-border/40 md:p-5',
        className
      )}
    >
      <div className="mb-4 flex items-center gap-2.5 border-b border-border/50 pb-3">
        <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="text-lg" weight="fill" />
        </span>
        <h3 className="text-sm font-bold tracking-tight text-foreground">{title}</h3>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

// SettingsDrawer edits persisted user preferences in a temporary draft before saving.
export const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();
  const { loading: geoLoading, detectCity } = useGeolocation();
  const [draft, setDraft] = useState<Settings>(settings);

  const { data: translations, isLoading: translationsLoading } = useQuery({
    queryKey: ['availableTranslations'],
    queryFn: fetchAvailableTranslations,
    staleTime: 86400000,
    enabled: isOpen,
  });

  const { data: apiReciters, isLoading: recitersLoading } = useQuery({
    queryKey: ['availableReciters', settings.language],
    queryFn: () => fetchReciters(settings.language),
    staleTime: 86400000,
    enabled: isOpen,
  });

  useEffect(() => {
    if (isOpen) setDraft(settings);
  }, [isOpen, settings]);

  const updateDraft = (partial: Partial<Settings>) => {
    setDraft((prev) => ({ ...prev, ...partial }));
  };

  const handleSave = () => {
    updateSettings(draft);
    toast.success(t('saveSettings'));
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleDetectLocation = async () => {
    const city = await detectCity();
    if (city) {
      updateDraft({ city });
      toast.success(`${t('locationDetected')}: ${city}`);
    } else {
      toast.error(t('locationError'));
    }
  };

  const cities = [
    'Mecca', 'Medina', 'Riyadh', 'Jeddah', 'Dubai', 'Cairo', 'Istanbul', 'Kuala Lumpur', 'London', 'New York',
  ];

  const fallbackReciters = [
    { id: 'afasy', name: 'Mishary Rashid Al-Afasy' },
    { id: 'shatri', name: 'Abu Bakr Ash-Shatri' },
    { id: 'sudais', name: 'Abdul Rahman As-Sudais' },
    { id: 'husary', name: 'Mahmoud Khalil Al-Husary' },
  ];

  const isLg = useMediaQuery('(min-width: 1024px)');
  const drawerDirection = useMemo<'bottom' | 'left' | 'right'>(() => {
    if (!isLg) return 'bottom';
    return draft.language === 'ar' ? 'right' : 'left';
  }, [isLg, draft.language]);

  const isSidePanel = drawerDirection === 'left' || drawerDirection === 'right';

  return (
    <Drawer
      open={isOpen}
      onOpenChange={(open) => { if (!open) handleCancel(); }}
      direction={drawerDirection}
      shouldScaleBackground={drawerDirection === 'bottom'}
    >
      <DrawerContent
        className={cn(
          'flex flex-col gap-0 overflow-hidden p-0',
          'border-border/80 bg-background/95 backdrop-blur-xl shadow-2xl',
          drawerDirection === 'bottom' && [
            'max-h-[90vh] h-auto',
            'sm:left-1/2 sm:right-auto sm:w-full sm:max-w-xl md:max-w-2xl sm:-translate-x-1/2 sm:rounded-t-3xl',
          ],
          drawerDirection === 'left' && [
            'fixed inset-y-0 left-0 right-auto z-50 mt-0 h-full min-h-0 max-h-none w-full max-w-xl md:max-w-2xl',
            'rounded-none rounded-r-3xl border-r border-border/80',
            '[&>div:first-child]:hidden',
          ],
          drawerDirection === 'right' && [
            'fixed inset-y-0 right-0 left-auto z-50 mt-0 h-full min-h-0 max-h-none w-full max-w-xl md:max-w-2xl',
            'rounded-none rounded-l-3xl border-l border-border/80',
            '[&>div:first-child]:hidden',
          ],
        )}
      >
        <DrawerHeader
          className={cn(
            'shrink-0 space-y-1 border-b border-border/60 px-5 pb-4',
            isSidePanel ? 'pb-4 pt-5 text-start sm:px-8' : 'pt-1 text-center sm:px-8',
          )}
        >
          <DrawerTitle className="text-xl font-black tracking-tight">{t('settings')}</DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground">{t('settingsSubtitle')}</DrawerDescription>
        </DrawerHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-6">
          <div className={cn('grid gap-5 pb-2', isSidePanel ? 'w-full' : 'mx-auto max-w-2xl')}>
            <SettingsSection title={t('settingsSectionGeneral')} icon={Globe}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label={t('language')}>
                  <Select value={draft.language} onValueChange={(value) => updateDraft({ language: value as 'ar' | 'en' })}>
                    <SelectTrigger className="h-11 rounded-xl border-border/80 bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ar">العربية</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field label={t('city')}>
                  <div className="flex gap-2">
                    <Select value={draft.city} onValueChange={(value) => updateDraft({ city: value })}>
                      <SelectTrigger className="h-11 flex-1 rounded-xl border-border/80 bg-background">
                        <SelectValue placeholder={t('chooseCity')} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-11 w-11 shrink-0 rounded-xl border-border/80"
                      onClick={handleDetectLocation}
                      disabled={geoLoading}
                      title={t('detectLocation')}
                    >
                      {geoLoading ? <SpinnerGap className="text-lg animate-spin" weight="bold" /> : <MapPin className="text-lg" weight="regular" />}
                    </Button>
                  </div>
                </Field>
              </div>
            </SettingsSection>

            <SettingsSection title={t('settingsSectionReading')} icon={BookOpenText}>
              <div className="grid gap-4">
                <Field label={t('translationLanguage')}>
                  <Select
                    value={draft.translationId.toString()}
                    onValueChange={(value) => updateDraft({ translationId: parseInt(value) })}
                  >
                    <SelectTrigger className="h-11 rounded-xl border-border/80 bg-background">
                      {translationsLoading ? (
                        <span className="flex items-center gap-2 text-muted-foreground text-sm">
                          <SpinnerGap className="text-sm animate-spin" weight="bold" />
                          {t('loadingTafsir')}
                        </span>
                      ) : (
                        <SelectValue placeholder={t('selectTranslation')} />
                      )}
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {translations?.map((tr) => (
                        <SelectItem key={tr.id} value={tr.id.toString()}>
                          <span className="font-medium">{tr.name}</span>
                          <span className="text-muted-foreground text-xs ms-2">({tr.languageName})</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label={t('reciter')}>
                  {apiReciters && apiReciters.length > 0 ? (
                    <Select
                      value={draft.reciterId.toString()}
                      onValueChange={(value) => updateDraft({ reciterId: parseInt(value) })}
                    >
                      <SelectTrigger className="h-11 rounded-xl border-border/80 bg-background">
                        {recitersLoading ? (
                          <span className="flex items-center gap-2 text-muted-foreground text-sm">
                            <SpinnerGap className="text-sm animate-spin" weight="bold" />
                          </span>
                        ) : (
                          <SelectValue placeholder={t('selectReciter')} />
                        )}
                      </SelectTrigger>
                      <SelectContent className="max-h-64">
                        {apiReciters.map((reciter) => (
                          <SelectItem key={reciter.id} value={reciter.id.toString()}>
                            <span className="font-medium">{reciter.name}</span>
                            {reciter.style && (
                              <span className="text-muted-foreground text-xs ms-2">({reciter.style})</span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Select value={draft.reciter} onValueChange={(value) => updateDraft({ reciter: value })}>
                      <SelectTrigger className="h-11 rounded-xl border-border/80 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fallbackReciters.map((reciter) => (
                          <SelectItem key={reciter.id} value={reciter.id}>
                            {reciter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </Field>
                <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/40 px-4 py-3">
                  <Label htmlFor="translation" className="cursor-pointer text-sm font-medium leading-snug">
                    {t('showTranslation')}
                  </Label>
                  <Switch
                    id="translation"
                    checked={draft.showTranslation}
                    onCheckedChange={(checked) => updateDraft({ showTranslation: checked })}
                  />
                </div>
              </div>
            </SettingsSection>

            <div className="grid gap-5 md:grid-cols-2">
              <SettingsSection title={t('settingsSectionAppearance')} icon={PaintBrush} className="md:min-h-full">
                <div className="space-y-4">
                  <Field label={t('fontSize')}>
                    <Select value={draft.fontSize} onValueChange={(value) => updateDraft({ fontSize: value as 'small' | 'medium' | 'large' })}>
                      <SelectTrigger className="h-11 rounded-xl border-border/80 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">{t('fontSmall')}</SelectItem>
                        <SelectItem value="medium">{t('fontMedium')}</SelectItem>
                        <SelectItem value="large">{t('fontLarge')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label={t('theme')}>
                    <Select value={draft.theme} onValueChange={(value) => updateDraft({ theme: value as 'light' | 'dark' | 'system' | 'auto' })}>
                      <SelectTrigger className="h-11 rounded-xl border-border/80 bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">{t('themeLight')}</SelectItem>
                        <SelectItem value="dark">{t('themeDark')}</SelectItem>
                        <SelectItem value="system">{t('themeSystem')}</SelectItem>
                        <SelectItem value="auto">{t('themeAuto')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
              </SettingsSection>

              <SettingsSection title={t('settingsSectionNotifications')} icon={Bell} className="md:min-h-full">
                <div className="flex min-h-[120px] flex-col justify-center rounded-xl border border-border/60 bg-muted/40 px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <Label htmlFor="prayerAlerts" className="cursor-pointer text-sm font-medium leading-snug">
                      {t('prayerAlerts')}
                    </Label>
                    <Switch
                      id="prayerAlerts"
                      checked={draft.prayerAlerts}
                      onCheckedChange={(checked) => updateDraft({ prayerAlerts: checked })}
                    />
                  </div>
                </div>
              </SettingsSection>
            </div>
          </div>
        </div>

        <DrawerFooter className={cn('shrink-0 border-t border-border/60 bg-muted/30 px-4 py-4 backdrop-blur-sm sm:px-6', isSidePanel && 'pb-[max(1rem,env(safe-area-inset-bottom))]')}>
          <div className={cn('flex w-full gap-3', !isSidePanel && 'mx-auto max-w-2xl')}>
            <Button onClick={handleSave} className="h-11 flex-1 rounded-xl font-bold shadow-md">
              {t('saveSettings')}
            </Button>
            <Button variant="outline" onClick={handleCancel} className="h-11 flex-1 rounded-xl font-bold border-border/80">
              {t('cancel')}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
