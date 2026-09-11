import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import { localEditor } from './scripts/editor/server.mjs';

const editing = process.env.HOMEPAGE_EDITOR === '1';

// https://astro.build/config
export default defineConfig({
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  redirects: { '/marginalia/cinema': '/marginalia/screen/' },
  devToolbar: { enabled: !editing },
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
  ],
  vite: {
    ...(editing ? { cacheDir: 'node_modules/.vite-editor' } : {}),
    plugins: editing ? [localEditor()] : [],
    server: {
      allowedHosts: editing ? ['localhost'] : true,
      ...(editing ? { host: '127.0.0.1', strictPort: true, hmr: false } : {}),
    },
  },
  // 适合 GitHub Pages 的相对基路径支持
  base: process.env.BASE_PATH || '/',
});
