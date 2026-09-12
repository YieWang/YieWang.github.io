// Run: node --test tests/image-preloading.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const pending = new Map();
const started = [];
let onLoad, onVisible;
class Image {
  src = '';
  loading = 'lazy';
  fetchPriority = 'auto';
  getAttribute() { return this.src; }
  closest() { return null; }
  decode() {
    started.push(this);
    return new Promise((resolve, reject) => pending.set(this.src, { resolve, reject }));
  }
}
const context = vm.createContext({
  exports: {}, Image, innerWidth: 390, innerHeight: 844,
  document: { readyState: 'loading' },
  window: { addEventListener: (_, callback) => { onLoad = callback; } },
  IntersectionObserver: class {
    constructor(callback) { onVisible = callback; }
    observe() {}
    unobserve() {}
  },
});
vm.runInContext(ts.transpile(readFileSync(new URL('../src/lib/preload-images.ts', import.meta.url), 'utf8'), {
  module: ts.ModuleKind.CommonJS,
  target: ts.ScriptTarget.ES2022,
}), context);
const { preloadImages, prioritizeImage } = context.exports;
const flush = () => new Promise(resolve => setImmediate(resolve));
const finish = async (url, failed = false) => {
  const job = pending.get(url);
  pending.delete(url);
  if (failed) job.reject(Error('broken image'));
  else job.resolve();
  await flush();
};
const hero = new Image();
hero.src = 'hero';
const last = new Image();
last.src = 'last';
preloadImages([hero]);
preloadImages(Array.from({ length: 10 }, (_, i) => `background-${i}`));
preloadImages([last, 'background-0']);
void onLoad();
await flush();
assert.equal(started.length, 0, 'Wait for actual visibility, including ancestor clipping');
onVisible([{ target: hero, isIntersecting: true }]);
assert.equal(started.length, 1, 'Only the visible image starts before it finishes loading');
assert.equal(hero.fetchPriority, 'high');
await flush();
assert.equal(started.length, 1, 'window.load must still wait for the visible image');
await finish('hero');
assert.equal(pending.size, 11, 'Release every remaining image after the first screen is ready');
assert.ok(started.slice(1).every(image => image.fetchPriority === 'low'));

onVisible([{ target: last, isIntersecting: true }]);
assert.equal(last.fetchPriority, 'high');
assert.ok(pending.has('last'), 'Scrolling promotes the existing background request');
await finish('background-0', true);
assert.equal(pending.size, 10, 'A failed image does not stop other downloads');
await finish('last');

const beforePromotion = started.length;
void prioritizeImage('background-1');
assert.equal(started.length, beforePromotion, 'Promoting an active URL reuses its request');
assert.equal(started.find(image => image.src === 'background-1').fetchPriority, 'high');
await finish('background-1');
void prioritizeImage('selected');
assert.equal(started.at(-1).src, 'selected', 'A selected photo starts immediately');
assert.equal(started.at(-1).fetchPriority, 'high');
await finish('selected');
while (pending.size) {
  await finish(pending.keys().next().value);
}
assert.equal(new Set(started.map(image => image.src)).size, 13);
assert.equal(started.length, 13, 'Repeated URLs are downloaded once');
assert.equal(last.loading, 'eager');
console.log('Image loading: first screen first, unrestricted background loading, priority, deduplication and failures passed');
