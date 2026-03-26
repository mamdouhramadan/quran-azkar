import { BASE_URL } from './quranApi';

export interface ReciterResource {
  id: number;
  name: string;
  arabicName: string;
  style: string | null;
  translatedName: string;
}

interface ReciterApiItem {
  id: number;
  reciter_name: string;
  style: string | null;
  translated_name?: {
    name?: string;
  };
}

interface ReciterAudioApiItem {
  verse_key: string;
  url?: string;
}

/**
 * Fetches the list of available Quran reciters from Quran.com API v4.
 * Returns 20+ reciters with high-quality audio.
 */
export const fetchReciters = async (language: string = 'en'): Promise<ReciterResource[]> => {
  const response = await fetch(`${BASE_URL}/resources/recitations?language=${language}`);
  if (!response.ok) {
    throw new Error('Failed to fetch reciters');
  }
  const data = await response.json();
  return ((data.recitations || []) as ReciterApiItem[]).map((reciter) => ({
    id: reciter.id,
    name: reciter.reciter_name,
    arabicName: reciter.translated_name?.name || reciter.reciter_name,
    style: reciter.style,
    translatedName: reciter.translated_name?.name || reciter.reciter_name,
  }));
};

/**
 * Fetches audio file URLs for a given reciter and chapter from Quran.com API v4.
 */
export const fetchReciterAudioByChapter = async (
  reciterId: number,
  chapterId: number
): Promise<{ verseKey: string; url: string }[]> => {
  const response = await fetch(
    `${BASE_URL}/recitations/${reciterId}/by_chapter/${chapterId}`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch reciter audio');
  }
  const data = await response.json();
  return ((data.audio_files || []) as ReciterAudioApiItem[]).map((audioFile) => ({
    verseKey: audioFile.verse_key,
    url: audioFile.url?.startsWith('http') ? audioFile.url : `https://verses.quran.com/${audioFile.url}`,
  }));
};
