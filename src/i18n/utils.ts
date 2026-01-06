// Internationalization Utilities

import { defaultLang, languages, type Language } from './config';

/**
 * Get the language from the current URL
 */
export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang in languages) {
    return lang as Language;
  }
  return defaultLang;
}

/**
 * Get the path without the language prefix
 */
export function getPathWithoutLang(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] in languages) {
    return '/' + parts.slice(1).join('/');
  }
  return pathname;
}

/**
 * Create a localized path
 */
export function getLocalizedPath(path: string, lang: Language): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `/${lang}/${cleanPath}`.replace(/\/+$/, '') || `/${lang}`;
}

/**
 * Get alternate language paths for the current page
 */
export function getAlternatePaths(pathname: string): Record<Language, string> {
  const pathWithoutLang = getPathWithoutLang(pathname);
  
  return Object.keys(languages).reduce((acc, lang) => {
    acc[lang as Language] = getLocalizedPath(pathWithoutLang, lang as Language);
    return acc;
  }, {} as Record<Language, string>);
}

/**
 * Check if a language is supported
 */
export function isValidLanguage(lang: string): lang is Language {
  return lang in languages;
}
