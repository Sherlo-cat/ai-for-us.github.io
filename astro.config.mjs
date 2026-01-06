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
        },
      },
    }),
  ],
  // Disable built-in i18n routing - using manual routing instead
  // English at root (/), Chinese at /zh/
  output: 'static',
  build: {
    assets: 'assets',
  },
});
