import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    server: {
      allowedHosts: true,
    },
  },
  // 适合 GitHub Pages 的相对基路径支持
  base: process.env.BASE_PATH || '/',
});

