// Internationalization Configuration

export const languages = {
  en: 'English',
  zh: '中文',
  ja: '日本語',
  es: 'Español',
} as const;

export type Language = keyof typeof languages;

export const defaultLang: Language = 'en';

export const languageFlags: Record<Language, string> = {
  en: '🇺🇸',
  zh: '🇨🇳',
  ja: '🇯🇵',
  es: '🇪🇸',
};

// Routes that should be localized
export const routes: Record<string, Record<Language, string>> = {
  home: {
    en: '',
    zh: '',
    ja: '',
    es: '',
  },
  blog: {
    en: 'blog',
    zh: 'blog',
    ja: 'blog',
    es: 'blog',
  },
  about: {
    en: 'about',
    zh: 'about',
    ja: 'about',
    es: 'about',
  },
};
