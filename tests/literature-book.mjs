// Run: node tests/literature-book.mjs
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/LiteratureBook.astro', import.meta.url), 'utf8');
let selected = false, activeSection = true, offscreen = false;
let callback, loads = 0, unloads = 0;
const panel = { hasAttribute: () => selected };
const frame = {
  dataset: { src: '/previews/literature' },
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
assert.equal(loads, 0);
selected = true; callback(); callback();
assert.equal(loads, 1, 'duplicate hover/focus must keep the current document');
selected = false; callback();
assert.equal(frame.url, undefined, 'switching away must release the renderer document');
selected = true; callback();
assert.equal(loads, 2);
for (const reason of ['section', 'offscreen', 'hidden']) {
  activeSection = reason !== 'section'; offscreen = reason === 'offscreen'; document.hidden = reason === 'hidden';
  callback();
  assert.equal(frame.url, undefined);
  activeSection = true; offscreen = false; document.hidden = false; callback();
}
assert.equal(unloads, 4);
const preview = readFileSync(new URL('../src/pages/previews/literature.astro', import.meta.url), 'utf8');
const pages = vm.runInNewContext(preview.split('---')[1] + '\npages');
assert.equal(pages.join('').length, 796);
assert.equal(pages.join('').match(/多年以后/g).length, 1);
assert.equal(pages.length % 2, 0, 'inner pages must form complete spreads');
for (let i = 0; i < pages.length + 2; i++) {
  assert.ok(existsSync(new URL(`../public/images/literature/book/${i}.webp`, import.meta.url)), `Missing page artwork ${i}`);
}
console.log('Literature preview lifecycle, repeated selection and supplied passage: passed');
