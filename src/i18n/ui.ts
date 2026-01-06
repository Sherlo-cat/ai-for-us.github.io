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
    
    // Features Section
    'feature.insights.title': 'AI Insights',
    'feature.insights.desc': 'Deep dives into the latest AI technologies and their real-world applications.',
    'feature.tutorials.title': 'Technical Tutorials',
    'feature.tutorials.desc': 'Hands-on guides to help you build and deploy AI-powered solutions.',
    'feature.trends.title': 'Industry Trends',
    'feature.trends.desc': 'Stay updated with the evolving landscape of artificial intelligence.',
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
    
    // Features Section
    'feature.insights.title': 'AI 洞察',
    'feature.insights.desc': '深入探索最新的AI技术及其在现实世界中的应用。',
    'feature.tutorials.title': '技术教程',
    'feature.tutorials.desc': '实战指南，帮助你构建和部署AI驱动的解决方案。',
    'feature.trends.title': '行业趋势',
    'feature.trends.desc': '紧跟人工智能领域不断演进的最新动态。',
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
