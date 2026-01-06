// Internationalization Configuration

export const languages = {
  en: 'English',
  zh: '中文',
} as const;

export type Language = keyof typeof languages;

export const defaultLang: Language = 'en';

export const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
};

// Routes configuration
// English is at root (/), Chinese is at /zh/
export const routes: Record<string, Record<Language, string>> = {
  home: {
    en: '',
    zh: '',
  },
  blog: {
    en: 'blog',
    zh: 'blog',
  },
  about: {
    en: 'about',
    zh: 'about',
  },
};

// Helper to get the URL prefix for a language
// English has no prefix, Chinese has /zh
export function getLangPrefix(lang: Language): string {
  return lang === 'en' ? '' : `/${lang}`;
}
