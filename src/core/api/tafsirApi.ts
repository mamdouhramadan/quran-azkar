import { BASE_URL } from './quranApi';

export interface TafsirInfo {
  id: number;
  name: string;
  authorName: string;
  languageName: string;
  slug: string;
}

export interface TafsirContent {
  tafsirId: number;
  verseKey: string;
  text: string;
  resourceName: string;
  languageName: string;
}

interface TafsirApiInfo {
  id: number;
  name: string;
  author_name: string;
  language_name: string;
  slug: string;
}

/**
 * Fetches the list of available tafsirs from Quran.com API v4.
 */
export const fetchTafsirList = async (language: string = 'en'): Promise<TafsirInfo[]> => {
  const response = await fetch(`${BASE_URL}/resources/tafsirs?language=${language}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tafsir list');
  }
  const data = await response.json();
  return ((data.tafsirs || []) as TafsirApiInfo[]).map((tafsir) => ({
    id: tafsir.id,
    name: tafsir.name,
    authorName: tafsir.author_name,
    languageName: tafsir.language_name,
    slug: tafsir.slug,
  }));
};

/**
 * Fetches tafsir content for a specific verse.
 * @param tafsirId - The tafsir resource ID
 * @param verseKey - Format: "surah:ayah" e.g. "2:255"
 */
export const fetchTafsir = async (
  tafsirId: number,
  verseKey: string
): Promise<TafsirContent> => {
  const response = await fetch(`${BASE_URL}/tafsirs/${tafsirId}/by_ayah/${verseKey}`);
  if (!response.ok) {
    throw new Error('Failed to fetch tafsir');
  }
  const data = await response.json();
  const tafsir = data.tafsir;

  return {
    tafsirId: tafsir.resource_id,
    verseKey: verseKey,
    text: tafsir.text || '',
    resourceName: tafsir.resource_name || '',
    languageName: tafsir.language_name || '',
  };
};
