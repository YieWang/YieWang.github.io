// Run after npm run build: node tests/assets.mjs
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
for (const dir of ['public', 'dist']) {
  const files = readdirSync(new URL(`../${dir}`, import.meta.url), { recursive: true });
  for (const path of files.filter(path => /\.(jpg|jpeg|png|webp|pdf|zip)$/i.test(path))) {
    assert.ok(path === 'images/literature/cover.webp'
      || (dir === 'public' && /^local-uploads\/[a-f0-9]{20}(?:-thumb)?\.webp$/.test(path)), `Unexpected binary asset: ${dir}/${path}`);
  }
  if (dir === 'dist') {
    assert.ok(!existsSync(new URL('../dist/local-uploads/', import.meta.url)), 'Build must exclude local editor uploads');
    for (const path of files.filter(path => path.endsWith('.html'))) {
      assert.doesNotMatch(read(`${dir}/${path}`), /(?:["']|&quot;|&#34;|=)\/local-uploads\//, `${path} still references a local image; publish it to R2 first`);
    }
  }
}
const rail = read('src/components/MusicArtistNav.astro');
for (const name of ['highlight', 'jump']) {
  const start = rail.indexOf(`  function ${name}(`);
  const end = rail.indexOf('\n  }', start) + 4;
  vm.runInNewContext(ts.transpile(`const rows = []; const sections = []; let selected = -1;\n${rail.slice(start, end)}\n${name}(0);`));
}
console.log('Safe empty artist navigation and external assets with the flipbook cover: passed');
