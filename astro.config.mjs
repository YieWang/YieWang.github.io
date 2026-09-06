import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  vite: {
    server: {
      allowedHosts: true,
    },
    build: {
      // three.js 是按需异步加载的 vendor chunk（约 518 kB），放宽默认 500 kB 告警阈值
      chunkSizeWarningLimit: 600,
    },
  },
  // 适合 GitHub Pages 的相对基路径支持
  base: process.env.BASE_PATH || '/',
});

