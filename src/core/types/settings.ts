// Settings defines the persistent user preferences shared across the app.
export interface Settings {
  language: 'ar' | 'en';
  theme: 'light' | 'dark' | 'auto';
  city: string;
  reciter: string;
  fontSize: 'small' | 'medium' | 'large';
  showTranslation: boolean;
  prayerAlerts: boolean;
  selectedTafsir: number;
  translationId: number;
  reciterId: number;
}
