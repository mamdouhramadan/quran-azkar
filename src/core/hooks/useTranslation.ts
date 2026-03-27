import { useSettings } from '@/core/hooks/useSettings';
import { translations, type TranslationKey } from '@/core/i18n/translations';

type TParams = Record<string, string | number>;

export const useTranslation = () => {
  const { settings } = useSettings();
  const lang = settings.language;

  const t = (key: TranslationKey, params?: TParams): string => {
    let s = translations[lang]?.[key] ?? translations.ar[key] ?? key;
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        s = s.split(`{{${k}}}`).join(String(v));
      }
    }
    return s;
  };

  const isRtl = lang === 'ar';

  return { t, lang, isRtl };
};
