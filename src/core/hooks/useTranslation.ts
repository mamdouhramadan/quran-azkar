import { useSettings } from '@/core/hooks/useSettings';
import { translations, type TranslationKey } from '@/core/i18n/translations';

export const useTranslation = () => {
  const { settings } = useSettings();
  const lang = settings.language;

  const t = (key: TranslationKey): string => {
    return translations[lang]?.[key] ?? translations.ar[key] ?? key;
  };

  const isRtl = lang === 'ar';

  return { t, lang, isRtl };
};
