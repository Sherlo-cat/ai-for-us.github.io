// UI String Translations

import { type Language, defaultLang } from './config';

// UI translations for the website interface
export const ui: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.blog': 'Blog',
    'nav.about': 'About',
    
    // Hero Section
    'hero.title': 'AI Engineer',
    'hero.subtitle': 'Exploring the Future of Artificial Intelligence',
    'hero.cta': 'Explore Articles',
    
    // Blog
    'blog.title': 'Latest Articles',
    'blog.readMore': 'Read More',
    'blog.publishedOn': 'Published on',
    'blog.minuteRead': 'min read',
    'blog.noArticles': 'No articles found.',
    
    // About
    'about.title': 'About Me',
    
    // Footer
    'footer.copyright': '© 2024 AI for Us. All rights reserved.',
    'footer.builtWith': 'Built with Astro & React',
    
    // Theme
    'theme.light': 'Light Mode',
    'theme.dark': 'Dark Mode',
    'theme.system': 'System',
    
    // Language
    'lang.switch': 'Switch Language',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Something went wrong',
    'common.backToHome': 'Back to Home',
    'common.tags': 'Tags',
  },
  
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.blog': '博客',
    'nav.about': '关于',
    
    // Hero Section
    'hero.title': 'AI 工程师',
    'hero.subtitle': '探索人工智能的未来',
    'hero.cta': '浏览文章',
    
    // Blog
    'blog.title': '最新文章',
    'blog.readMore': '阅读更多',
    'blog.publishedOn': '发布于',
    'blog.minuteRead': '分钟阅读',
    'blog.noArticles': '暂无文章。',
    
    // About
    'about.title': '关于我',
    
    // Footer
    'footer.copyright': '© 2024 AI for Us. 保留所有权利。',
    'footer.builtWith': '使用 Astro & React 构建',
    
    // Theme
    'theme.light': '浅色模式',
    'theme.dark': '深色模式',
    'theme.system': '跟随系统',
    
    // Language
    'lang.switch': '切换语言',
    
    // Common
    'common.loading': '加载中...',
    'common.error': '出错了',
    'common.backToHome': '返回首页',
    'common.tags': '标签',
  },
  
  ja: {
    // Navigation
    'nav.home': 'ホーム',
    'nav.blog': 'ブログ',
    'nav.about': '紹介',
    
    // Hero Section
    'hero.title': 'AIエンジニア',
    'hero.subtitle': '人工知能の未来を探る',
    'hero.cta': '記事を見る',
    
    // Blog
    'blog.title': '最新記事',
    'blog.readMore': '続きを読む',
    'blog.publishedOn': '公開日',
    'blog.minuteRead': '分で読める',
    'blog.noArticles': '記事がありません。',
    
    // About
    'about.title': '私について',
    
    // Footer
    'footer.copyright': '© 2024 AI for Us. All rights reserved.',
    'footer.builtWith': 'Astro & React で構築',
    
    // Theme
    'theme.light': 'ライトモード',
    'theme.dark': 'ダークモード',
    'theme.system': 'システム設定',
    
    // Language
    'lang.switch': '言語を切り替える',
    
    // Common
    'common.loading': '読み込み中...',
    'common.error': 'エラーが発生しました',
    'common.backToHome': 'ホームに戻る',
    'common.tags': 'タグ',
  },
  
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.blog': 'Blog',
    'nav.about': 'Acerca de',
    
    // Hero Section
    'hero.title': 'Ingeniero de IA',
    'hero.subtitle': 'Explorando el Futuro de la Inteligencia Artificial',
    'hero.cta': 'Explorar Artículos',
    
    // Blog
    'blog.title': 'Últimos Artículos',
    'blog.readMore': 'Leer Más',
    'blog.publishedOn': 'Publicado el',
    'blog.minuteRead': 'min de lectura',
    'blog.noArticles': 'No se encontraron artículos.',
    
    // About
    'about.title': 'Sobre Mí',
    
    // Footer
    'footer.copyright': '© 2024 AI for Us. Todos los derechos reservados.',
    'footer.builtWith': 'Construido con Astro & React',
    
    // Theme
    'theme.light': 'Modo Claro',
    'theme.dark': 'Modo Oscuro',
    'theme.system': 'Sistema',
    
    // Language
    'lang.switch': 'Cambiar Idioma',
    
    // Common
    'common.loading': 'Cargando...',
    'common.error': 'Algo salió mal',
    'common.backToHome': 'Volver al Inicio',
    'common.tags': 'Etiquetas',
  },
};

/**
 * Get a translation function for the specified language
 */
export function useTranslations(lang: Language) {
  return function t(key: string): string {
    return ui[lang][key] || ui[defaultLang][key] || key;
  };
}

/**
 * Get a single translation
 */
export function t(lang: Language, key: string): string {
  return ui[lang][key] || ui[defaultLang][key] || key;
}
