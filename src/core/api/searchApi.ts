import { BASE_URL } from './quranApi';

export interface SearchResult {
  verseKey: string;
  verseId: number;
  surahNumber: number;
  ayahNumber: number;
  text: string;
  highlightedText: string;
  translationText: string;
  surahNameArabic: string;
  surahNameEnglish: string;
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  currentPage: number;
  totalPages: number;
}

interface SearchApiResult {
  verse_key: string;
  verse_id: number;
  text?: string;
  highlighted?: string;
  translations?: Array<{ text?: string }>;
  verse?: {
    chapter_name_arabic?: string;
    chapter_name_simple?: string;
  };
}

/**
 * Searches the Quran via Quran.com API v4.
 * Supports Arabic text and translation text queries.
 */
export const searchQuran = async (
  query: string,
  language: string = 'en',
  page: number = 1,
  size: number = 20
): Promise<SearchResponse> => {
  if (!query.trim()) {
    return { results: [], totalResults: 0, currentPage: 1, totalPages: 0 };
  }

  const response = await fetch(
    `${BASE_URL}/search?q=${encodeURIComponent(query)}&language=${language}&size=${size}&page=${page}`
  );

  if (!response.ok) {
    throw new Error('Search failed');
  }

  const data = await response.json();
  const search = data.search;

  const results: SearchResult[] = ((search.results || []) as SearchApiResult[]).map((result) => {
    const [surah, ayah] = result.verse_key.split(':').map(Number);
    return {
      verseKey: result.verse_key,
      verseId: result.verse_id,
      surahNumber: surah,
      ayahNumber: ayah,
      text: result.text || '',
      highlightedText: result.highlighted || result.text || '',
      translationText: result.translations?.[0]?.text?.replace(/<[^>]*>?/gm, '') || '',
      surahNameArabic: result.verse?.chapter_name_arabic || '',
      surahNameEnglish: result.verse?.chapter_name_simple || '',
    };
  });

  return {
    results,
    totalResults: search.total_results || 0,
    currentPage: search.current_page || 1,
    totalPages: search.total_pages || 0,
  };
};
