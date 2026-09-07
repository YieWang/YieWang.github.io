// Run after npm run build: node tests/assets.mjs
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
for (const file of ['literature']) {
  const context = { exports: {} };
  vm.runInNewContext(ts.transpile(read(`src/data/${file}.ts`), { module: ts.ModuleKind.CommonJS }), context);
  for (const collection of Object.values(context.exports)) assert.equal(collection.length, 0, `${file} must contain no demo records`);
}
for (const dir of ['public', 'dist']) {
  assert.ok(!readdirSync(new URL(`../${dir}`, import.meta.url), { recursive: true }).some(path => /\.(jpg|jpeg|png|webp|pdf|zip)$/i.test(path)), `${dir} must contain no binary assets`);
}
const rail = read('src/components/MusicArtistNav.astro');
for (const name of ['highlight', 'jump']) {
  const start = rail.indexOf(`  function ${name}(`);
  const end = rail.indexOf('\n  }', start) + 4;
  vm.runInNewContext(ts.transpile(`const rows = []; const sections = []; let selected = -1;\n${rail.slice(start, end)}\n${name}(0);`));
}
console.log('No demo literature, safe empty artist navigation and external assets: passed');
