// Internationalization Utilities

import { defaultLang, languages, type Language } from './config';

// Base path from Astro config (for GitHub Pages deployment)
const BASE_PATH = '/ai-for-us.github.io';

/**
 * Get the language from the current URL
 * English: / (no prefix)
 * Chinese: /zh/
 */
export function getLangFromUrl(url: URL): Language {
  // Remove base path from pathname
  const pathname = url.pathname.replace(BASE_PATH, '');
  const [, lang] = pathname.split('/');
  if (lang === 'zh') {
    return 'zh';
  }
  return 'en'; // Default to English for root paths
}

/**
 * Get the path without the language prefix and base path
 */
export function getPathWithoutLang(pathname: string): string {
  // Remove base path first
  let cleanPath = pathname.replace(BASE_PATH, '');
  const parts = cleanPath.split('/').filter(Boolean);
  if (parts[0] === 'zh') {
    return '/' + parts.slice(1).join('/');
  }
  return cleanPath || '/';
}

/**
 * Create a localized path (includes base path for internal navigation)
 * English: /base/ (no lang prefix)
 * Chinese: /base/zh/
 */
export function getLocalizedPath(path: string, lang: Language): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  if (lang === 'en') {
    // English at root (under base path)
    return cleanPath ? `${BASE_PATH}/${cleanPath}` : `${BASE_PATH}/`;
  } else {
    // Chinese with /zh/ prefix (under base path)
    return cleanPath ? `${BASE_PATH}/zh/${cleanPath}` : `${BASE_PATH}/zh`;
  }
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

/**
 * Get language switcher URL
 * Switches between English and Chinese versions of current page
 */
export function getLanguageSwitchUrl(currentPath: string, currentLang: Language): string {
  const pathWithoutLang = getPathWithoutLang(currentPath);
  const targetLang = currentLang === 'en' ? 'zh' : 'en';
  return getLocalizedPath(pathWithoutLang, targetLang);
}
