import type { QuranAyah, QuranSelectionType, SurahData } from '@/core/types';
export type { QuranWord, QuranAyah, SurahData, QuranSelectionType } from '@/core/types';

export const BASE_URL = 'https://api.quran.com/api/v4';

// Currently preferred English translation: 131 for Clear Quran, or 20 for Sahih International
const TRANSLATION_ID = 131;

interface ChapterApiRecord {
  id: number;
  name_arabic: string;
  name_simple: string;
  verses_count: number;
  translated_name: {
    name: string;
  };
}

interface VerseWordApiRecord {
  id: number;
  position: number;
  text: string;
  translation?: {
    text?: string;
  };
  transliteration?: {
    text?: string;
  };
  audio_url?: string | null;
  char_type_name: string;
  line_number?: number;
}

interface VerseApiRecord {
  id: number;
  verse_number: number;
  verse_key: string;
  text_uthmani?: string;
  text_imlaei?: string;
  translations?: Array<{ text?: string }>;
  page_number: number;
  juz_number: number;
  hizb_number: number;
  words?: VerseWordApiRecord[];
}

export const fetchSurahs = async (): Promise<SurahData[]> => {
  const response = await fetch(`${BASE_URL}/chapters?language=en`);
  if (!response.ok) {
    throw new Error('Failed to fetch surahs');
  }
  const data = await response.json();
  return (data.chapters as ChapterApiRecord[]).map((chapter) => ({
    surahNumber: chapter.id,
    surahNameArabic: chapter.name_arabic,
    surahNameEnglish: chapter.name_simple,
    surahNameTranslation: chapter.translated_name.name,
    totalAyah: chapter.verses_count,
  }));
};

export const fetchSurahContent = async (surahNumber: number, translationId: number = TRANSLATION_ID): Promise<SurahData> => {
  // 1. We need to fetch chapter metadata if we don't pass it in
  const chaptersResponse = await fetch(`${BASE_URL}/chapters/${surahNumber}?language=en`);
  const chapterData = await chaptersResponse.json();
  const chapter = chapterData.chapter as ChapterApiRecord;

  // 2. Fetch verses with words and translations. 
  // Max per_page is 50 for quran.com api typically, we might need to handle pagination if it's > 50?
  // Actually, some endpoints allow more. Let's try fetching all using per_page=300
  const versesResponse = await fetch(
    `${BASE_URL}/verses/by_chapter/${surahNumber}?language=en&words=true&translations=${translationId}&fields=text_uthmani,text_imlaei&per_page=300`
  );
  if (!versesResponse.ok) {
    throw new Error('Failed to fetch surah content');
  }
  
  const versesData = await versesResponse.json();
  const verses = versesData.verses;

  // 3. Map it to our generic structure
  const ayahs = mapVersesToAyahs(verses);

  return {
    surahNumber: chapter.id,
    surahNameArabic: chapter.name_arabic,
    surahNameEnglish: chapter.name_simple,
    surahNameTranslation: chapter.translated_name.name,
    totalAyah: chapter.verses_count,
    ayahs,
  };
};

// Backwards compatibility layer for legacy code expecting english and arabic1 arrays
export const fetchSurahContentLegacy = async (surahNumber: number) => {
  const content = await fetchSurahContent(surahNumber);
  return {
    ...content,
    arabic1: content.ayahs?.map(a => a.text) || [],
    english: content.ayahs?.map(a => a.translation) || []
  };
};

// ... Fetch complete Quran can be extremely heavy with quran.com API pagination.
// We should deprecate fetching all 6236 ayahs at once, but we will leave a stub
export const fetchCompleteQuran = async () => {
   throw new Error("Fetching the entire Quran at once via Quran.com API v4 is discouraged due to high payload size (50MB+). Fetch by Surah or Juz instead.");
};

export const fetchQuranByPages = async () => {
    throw new Error("To be implemented: fetching paginated by mushaf pages directly");
};

// Provide Quran.com Audio IDs mapped to reciters
const RECITER_MAP: Record<string, number> = {
  afasy: 7, // Mishari Rashid al-`Afasy
  shatri: 11, // Abu Bakr al-Shatri
  sudais: 3, // Abdur-Rahman as-Sudais
  husary: 4, // Mahmoud Khalil Al-Husary
};

export const getAyahAudioUrl = (surahNumber: number, ayahNumber: number, reciter: string = 'afasy') => {
  // Quran.com audio v4 uses a different structure. 
  // e.g. https://api.quran.com/api/v4/recitations/7/by_ayah/1:1
  // That returns a JSON. To just return a pure string URL synchronously, we might need a fallback.
  // We'll keep everyayah.com for synchronous simple URLs for now, 
  // as quran.com requires an additional fetch for the exact reciter path unless we build the URL.
  // Everyayah building:
  const reciterPathMapping: Record<string, string> = {
    afasy: 'Alafasy_128kbps',
    shatri: 'Abu_Bakr_Ash-Shaatree_128kbps',
    sudais: 'Abdurrahmaan_As-Sudais_192kbps',
    husary: 'Husary_128kbps',
  };
  const reciterPath = reciterPathMapping[reciter] || reciterPathMapping.afasy;
  const paddedSurah = surahNumber.toString().padStart(3, '0');
  const paddedAyah = ayahNumber.toString().padStart(3, '0');
  return `https://everyayah.com/data/${reciterPath}/${paddedSurah}${paddedAyah}.mp3`;
};

export const fetchTranslation = async (): Promise<never[]> => {
  return []; // Deprecated with v4
};

// mapVersesToAyahs normalizes Quran.com verse payloads into the app's shared ayah shape.
const mapVersesToAyahs = (verses: VerseApiRecord[]): QuranAyah[] => {
  return verses.map((verse) => ({
    id: verse.id,
    number: verse.verse_number,
    surahNumber: parseInt(verse.verse_key.split(':')[0], 10),
    text: verse.text_uthmani || verse.text_imlaei || '',
    translation: verse.translations?.[0]?.text?.replace(/<[^>]*>?/gm, '') || '',
    page: verse.page_number,
    juz: verse.juz_number,
    hizb: verse.hizb_number,
    globalAyahNumber: verse.id,
    words: verse.words?.map((word) => ({
      id: word.id,
      position: word.position,
      text: word.text,
      translation: word.translation?.text || '',
      transliteration: word.transliteration?.text || '',
      audioUrl: word.audio_url ? `https://audios.quranicaudio.com/${word.audio_url}` : null,
      charTypeName: word.char_type_name,
      lineNumber: word.line_number
    })) || []
  }));
};

export const fetchJuzContent = async (juzNumber: number, translationId: number = TRANSLATION_ID): Promise<SurahData> => {
  const res = await fetch(`${BASE_URL}/verses/by_juz/${juzNumber}?language=en&words=true&translations=${translationId}&fields=text_uthmani,text_imlaei&per_page=300`);
  if (!res.ok) throw new Error(`Failed to fetch Juz ${juzNumber}`);
  const data = await res.json();
  const ayahs = mapVersesToAyahs(data.verses as VerseApiRecord[]);
  return {
    surahNumber: juzNumber,
    surahNameArabic: `الجزء ${juzNumber}`,
    surahNameEnglish: `Juz ${juzNumber}`,
    surahNameTranslation: `Juz ${juzNumber}`,
    totalAyah: ayahs.length,
    ayahs
  };
};

export const fetchHizbContent = async (hizbNumber: number, translationId: number = TRANSLATION_ID): Promise<SurahData> => {
  const res = await fetch(`${BASE_URL}/verses/by_hizb/${hizbNumber}?language=en&words=true&translations=${translationId}&fields=text_uthmani,text_imlaei&per_page=300`);
  if (!res.ok) throw new Error(`Failed to fetch Hizb ${hizbNumber}`);
  const data = await res.json();
  const ayahs = mapVersesToAyahs(data.verses as VerseApiRecord[]);
  return {
    surahNumber: hizbNumber,
    surahNameArabic: `الحزب ${hizbNumber}`,
    surahNameEnglish: `Hizb ${hizbNumber}`,
    surahNameTranslation: `Hizb ${hizbNumber}`,
    totalAyah: ayahs.length,
    ayahs
  };
};

export const fetchPageContent = async (pageNumber: number, translationId: number = TRANSLATION_ID): Promise<SurahData> => {
  const res = await fetch(`${BASE_URL}/verses/by_page/${pageNumber}?language=en&words=true&translations=${translationId}&fields=text_uthmani,text_imlaei&per_page=300`);
  if (!res.ok) throw new Error(`Failed to fetch Page ${pageNumber}`);
  const data = await res.json();
  const ayahs = mapVersesToAyahs(data.verses as VerseApiRecord[]);
  return {
    surahNumber: pageNumber,
    surahNameArabic: `الصفحة ${pageNumber}`,
    surahNameEnglish: `Page ${pageNumber}`,
    surahNameTranslation: `Page ${pageNumber}`,
    totalAyah: ayahs.length,
    ayahs
  };
};

export const fetchQuranContent = async (type: QuranSelectionType, id: number, translationId: number = TRANSLATION_ID): Promise<SurahData> => {
  switch (type) {
    case 'surah': return fetchSurahContent(id, translationId);
    case 'juz': return fetchJuzContent(id, translationId);
    case 'hizb': return fetchHizbContent(id, translationId);
    case 'page': return fetchPageContent(id, translationId);
    default: throw new Error('Invalid content type');
  }
};
