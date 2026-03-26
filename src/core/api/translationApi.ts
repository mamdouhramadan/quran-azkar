import { BASE_URL } from './quranApi';

export interface TranslationResource {
  id: number;
  name: string;
  authorName: string;
  languageName: string;
  languageCode: string;
}

interface TranslationApiResource {
  id: number;
  name: string;
  author_name: string;
  language_name: string;
}

/**
 * Fetches the list of available Quran translations from Quran.com API v4.
 * Returns 100+ translations across many languages.
 */
export const fetchAvailableTranslations = async (): Promise<TranslationResource[]> => {
  const response = await fetch(`${BASE_URL}/resources/translations`);
  if (!response.ok) {
    throw new Error('Failed to fetch translations list');
  }
  const data = await response.json();
  return ((data.translations || []) as TranslationApiResource[]).map((translation) => ({
    id: translation.id,
    name: translation.name,
    authorName: translation.author_name,
    languageName: translation.language_name,
    languageCode: translation.language_name?.toLowerCase() || '',
  }));
};

/**
 * Groups translations by language for the settings UI.
 */
export const groupTranslationsByLanguage = (
  translations: TranslationResource[]
): Record<string, TranslationResource[]> => {
  return translations.reduce((groups, t) => {
    const lang = t.languageName || 'Other';
    if (!groups[lang]) groups[lang] = [];
    groups[lang].push(t);
    return groups;
  }, {} as Record<string, TranslationResource[]>);
};
