import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://sherlo-cat.github.io',
  base: '/ai-for-us.github.io',
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-US',
          zh: 'zh-CN',
          ja: 'ja-JP',
          es: 'es-ES',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ja', 'es'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  output: 'static',
  build: {
    assets: 'assets',
  },
});
