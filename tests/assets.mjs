// Run after npm run build: node tests/assets.mjs
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
for (const dir of ['public', 'dist']) {
  assert.ok(!readdirSync(new URL(`../${dir}`, import.meta.url), { recursive: true }).some(path => /\.(jpg|jpeg|png|webp|pdf|zip)$/i.test(path) && path !== 'images/literature/cover.webp'), `${dir} must contain no binary assets except the local flipbook cover`);
}
const rail = read('src/components/MusicArtistNav.astro');
for (const name of ['highlight', 'jump']) {
  const start = rail.indexOf(`  function ${name}(`);
  const end = rail.indexOf('\n  }', start) + 4;
  vm.runInNewContext(ts.transpile(`const rows = []; const sections = []; let selected = -1;\n${rail.slice(start, end)}\n${name}(0);`));
}
console.log('Safe empty artist navigation and external assets with the flipbook cover: passed');
