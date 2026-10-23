// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import vercel from '@astrojs/vercel';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://naujaan-dev.vercel.app',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), markdoc(), keystatic(), sitemap({
    filter: (page) => !/^\/(?:keystatic|api)(?:\/|$)|^\/404(?:\/|\.html|$)/.test(new URL(page).pathname),
  })],
});
