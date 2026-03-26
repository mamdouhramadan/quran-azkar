// QuranWord represents one token returned from the Quran content APIs.
export interface QuranWord {
  id: number;
  position: number;
  text: string;
  translation: string;
  transliteration: string;
  audioUrl: string | null;
  charTypeName: string;
  lineNumber?: number;
}

// QuranAyah represents one ayah enriched with translation and navigation metadata.
export interface QuranAyah {
  id: number;
  number: number;
  surahNumber: number;
  text: string;
  translation: string;
  words: QuranWord[];
  page: number;
  juz: number;
  hizb: number;
  globalAyahNumber: number;
}

// SurahData represents a surah or grouped Quran slice returned by the reader APIs.
export interface SurahData {
  surahNumber: number;
  surahNameArabic: string;
  surahNameEnglish: string;
  surahNameTranslation: string;
  totalAyah: number;
  ayahs?: QuranAyah[];
}

// QuranSelectionType identifies the supported reader navigation modes.
export type QuranSelectionType = 'surah' | 'juz' | 'hizb' | 'page';
