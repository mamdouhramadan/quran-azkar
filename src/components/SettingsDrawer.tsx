import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
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
import { MapPin, SpinnerGap } from '@phosphor-icons/react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// SettingsDrawer edits persisted user preferences in a temporary draft before saving.
export const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();
  const { loading: geoLoading, detectCity } = useGeolocation();
  const [draft, setDraft] = useState<Settings>(settings);

  // Fetch available translations from Quran.com API
  const { data: translations, isLoading: translationsLoading } = useQuery({
    queryKey: ['availableTranslations'],
    queryFn: fetchAvailableTranslations,
    staleTime: 86400000, // 24 hours
    enabled: isOpen,
  });

  // Fetch available reciters from Quran.com API
  const { data: apiReciters, isLoading: recitersLoading } = useQuery({
    queryKey: ['availableReciters', settings.language],
    queryFn: () => fetchReciters(settings.language),
    staleTime: 86400000, // 24 hours
    enabled: isOpen,
  });

  // Sync draft when drawer opens
  useEffect(() => {
    if (isOpen) setDraft(settings);
  }, [isOpen, settings]);

  // updateDraft merges incremental field edits into the local settings draft.
  const updateDraft = (partial: Partial<Settings>) => {
    setDraft(prev => ({ ...prev, ...partial }));
  };

  // handleSave commits the draft to shared settings and closes the drawer.
  const handleSave = () => {
    updateSettings(draft);
    toast.success(t('saveSettings'));
    onClose();
  };

  // handleCancel closes the drawer without persisting unsaved draft changes.
  const handleCancel = () => {
    onClose();
  };

  // handleDetectLocation resolves the user's city and applies it to the draft settings.
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
    'Mecca', 'Medina', 'Riyadh', 'Jeddah', 'Dubai', 'Cairo', 'Istanbul', 'Kuala Lumpur', 'London', 'New York'
  ];

  // Fallback reciters when API hasn't loaded yet
  const fallbackReciters = [
    { id: 'afasy', name: 'Mishary Rashid Al-Afasy' },
    { id: 'shatri', name: 'Abu Bakr Ash-Shatri' },
    { id: 'sudais', name: 'Abdul Rahman As-Sudais' },
    { id: 'husary', name: 'Mahmoud Khalil Al-Husary' },
  ];

  return (
    <Drawer open={isOpen} onOpenChange={(open) => { if (!open) handleCancel(); }}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle>{t('settings')}</DrawerTitle>
        </DrawerHeader>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="space-y-2">
            <Label>{t('city')}</Label>
            <div className="flex gap-2">
              <Select value={draft.city} onValueChange={(value) => updateDraft({ city: value })}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder={t('chooseCity')} />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDetectLocation}
                disabled={geoLoading}
                title={t('detectLocation')}
              >
                {geoLoading ? <SpinnerGap className="text-lg animate-spin" weight="bold" /> : <MapPin className="text-lg" weight="regular" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('language')}</Label>
            <Select value={draft.language} onValueChange={(value) => updateDraft({ language: value as 'ar' | 'en' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ar">العربية</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Translation Language Selector (API-powered) */}
          <div className="space-y-2">
            <Label>{t('translationLanguage')}</Label>
            <Select
              value={draft.translationId.toString()}
              onValueChange={(value) => updateDraft({ translationId: parseInt(value) })}
            >
              <SelectTrigger>
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
                    <span className="text-muted-foreground text-xs ml-2">({tr.languageName})</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reciter Selector (API-powered with 20+ reciters) */}
          <div className="space-y-2">
            <Label>{t('reciter')}</Label>
            {apiReciters && apiReciters.length > 0 ? (
              <Select
                value={draft.reciterId.toString()}
                onValueChange={(value) => updateDraft({ reciterId: parseInt(value) })}
              >
                <SelectTrigger>
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
                        <span className="text-muted-foreground text-xs ml-2">({reciter.style})</span>
                      )}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Select value={draft.reciter} onValueChange={(value) => updateDraft({ reciter: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {fallbackReciters.map((reciter) => (
                    <SelectItem key={reciter.id} value={reciter.id}>{reciter.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t('fontSize')}</Label>
            <Select value={draft.fontSize} onValueChange={(value) => updateDraft({ fontSize: value as 'small' | 'medium' | 'large' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">{t('fontSmall')}</SelectItem>
                <SelectItem value="medium">{t('fontMedium')}</SelectItem>
                <SelectItem value="large">{t('fontLarge')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="translation"
              checked={draft.showTranslation}
              onCheckedChange={(checked) => updateDraft({ showTranslation: checked })}
            />
            <Label htmlFor="translation">{t('showTranslation')}</Label>
          </div>

          <div className="space-y-2">
            <Label>{t('theme')}</Label>
            <Select value={draft.theme} onValueChange={(value) => updateDraft({ theme: value as 'light' | 'dark' | 'auto' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">{t('themeLight')}</SelectItem>
                <SelectItem value="dark">{t('themeDark')}</SelectItem>
                <SelectItem value="auto">{t('themeAuto')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              id="prayerAlerts"
              checked={draft.prayerAlerts}
              onCheckedChange={(checked) => updateDraft({ prayerAlerts: checked })}
            />
            <Label htmlFor="prayerAlerts">{t('prayerAlerts')}</Label>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1">
              {t('saveSettings')}
            </Button>
            <Button variant="outline" onClick={handleCancel} className="flex-1">
              {t('cancel')}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
