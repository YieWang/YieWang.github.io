// Run: node tests/literature-book.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/LiteratureBook.astro', import.meta.url), 'utf8');
let selected = false, activeSection = true, offscreen = false;
let callback, loads = 0, unloads = 0;
const panel = { hasAttribute: () => selected };
const frame = {
  dataset: { src: source.match(/data-src="([^"]+)"/)[1] },
  closest: () => panel,
  hasAttribute: () => frame.url !== undefined,
  set src(value) { this.url = value; loads++; },
  removeAttribute() { delete this.url; unloads++; },
};
const document = {
  hidden: false,
  querySelector: selector => selector.includes('iframe') ? frame : { hasAttribute: () => offscreen },
  getElementById: () => ({ classList: { contains: () => activeSection } }),
  addEventListener: () => {},
};
vm.runInNewContext(ts.transpile(source.match(/<script>([\s\S]*?)<\/script>/)[1]), {
  document, MutationObserver: class { constructor(fn) { callback = fn; } observe() {} },
});
assert.equal(loads, 1, 'entering Marginalia warms the preview before selection');
assert.equal(frame.url, '/previews/literature/', 'use the canonical URL without a redirect');
assert.equal(frame.dataset.active, 'false');
selected = true; callback(); callback();
assert.equal(loads, 1, 'duplicate hover/focus must keep the current document');
assert.equal(frame.dataset.active, 'true');
selected = false; callback();
assert.equal(frame.url, '/previews/literature/', 'switching away must retain decoded pages');
assert.equal(frame.dataset.active, 'false');
selected = true; callback();
assert.equal(loads, 1);
for (const reason of ['section', 'offscreen', 'hidden']) {
  activeSection = reason !== 'section'; offscreen = reason === 'offscreen'; document.hidden = reason === 'hidden';
  callback();
  assert.equal(frame.dataset.active, 'false');
  activeSection = true; offscreen = false; document.hidden = false; callback();
  assert.equal(frame.dataset.active, 'true');
}
assert.equal(unloads, 0);
assert.equal(loads, 1);
const preview = readFileSync(new URL('../src/pages/previews/literature.astro', import.meta.url), 'utf8');
const pages = vm.runInNewContext(preview.split('---')[1] + '\npages');
assert.equal(pages.join('').length, 2844);
assert.equal(pages.join('').match(/Muchos años después/g).length, 1);
assert.equal(pages.length % 2, 0, 'inner pages must form complete spreads');
assert.ok(preview.includes('https://homepage-assets.mathtranslations.org/images/literature/book/'));
const pageImages = vm.runInNewContext(preview.split('---')[1] + '\npageImages');
const coverVersion = createHash('sha256').update(readFileSync(new URL('../public/images/literature/cover.webp', import.meta.url))).digest('hex').slice(0, 12);
assert.equal(pageImages[0], '/images/literature/cover.webp?v=' + coverVersion, 'New covers must bypass cached artwork');
assert.equal(pageImages.length, pages.length + 2);
// Later pages must not block the first turn; the engine stages them on demand.
const requested = [], scheduled = [];
let coverRemoved = false, flips = 0;
const book = { dataset: { pages: '[]' }, querySelector: () => ({}) };
vm.runInNewContext(ts.transpile(preview.match(/<script>([\s\S]*?)<\/script>/)[1]
  .replace(/import .* from '@zinejs\/core';/, '')), {
  ImageSource: class {
    get(page) {
      requested.push(page);
      return page < 3 ? Promise.resolve({}) : new Promise(() => {});
    }
  },
  Zine: class {
    ready = Promise.resolve();
    on() {}
    getPage() { return 0; }
    flipNext() { flips++; }
  },
  document: {
    hidden: false,
    getElementById: () => book,
    querySelector: () => ({ remove: () => { coverRemoved = true; } }),
    addEventListener() {},
  },
  window: { frameElement: null, addEventListener() {} },
  matchMedia: () => ({ matches: false, addEventListener() {} }),
  clearTimeout() {},
  setTimeout: (callback, delay) => scheduled.push({ callback, delay }),
  console,
});
await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(requested, [0, 1, 2]);
assert.equal(coverRemoved, true);
assert.equal(scheduled.length, 1);
assert.equal(scheduled[0].delay, 150);
scheduled[0].callback();
assert.equal(flips, 1);
console.log('Literature preview lifecycle, repeated selection and supplied passage: passed');
