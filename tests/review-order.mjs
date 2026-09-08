// node tests/review-order.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const context = { exports: {} };
vm.runInNewContext(ts.transpile(read('src/lib/review-order.ts'), { module: ts.ModuleKind.CommonJS }), context);
const { reviewFirst } = context.exports;
const items = [
  { id: 'plain', rating: '5 / 5' },
  { id: 'blank', review: { date: '2024.02.20', content: '　 \n' } },
  { id: 'film', review: { content: '影评' } },
  { id: 'series', installments: [{}, { review: { content: '第二部书评' } }] },
  { id: 'season', seasons: [{ review: { content: '分季评论' } }] },
  { id: 'collection', collectionReview: { content: '系列书评' } },
  { id: 'hidden-part', installments: [{ hidden: true, review: { content: '隐藏评论' } }] },
];
const before = JSON.stringify(items);
assert.deepEqual([...items].sort(reviewFirst).map(x => x.id), ['film','series','season','collection','plain','blank','hidden-part']);
assert.equal(JSON.stringify(items), before, 'Display sorting must not rewrite records or reorder installments');
// Run the actual Screen frontmatter so all three tabs use the common rule.
const frontmatter = read('src/pages/marginalia/screen/index.astro').split('---')[1].replace(/^import .*;$/gm, '');
const tabs = vm.runInNewContext(frontmatter + '\ncategories', {
  reviewFirst, cinemaFilmCards: items, cinemaSeries: items, cinemaAnimationCards: items, withSeasonDetails: item => item,
});
for (const tab of tabs) assert.deepEqual(Array.from(tab.items, x => x.id), [...items].sort(reviewFirst).map(x => x.id));
// Author groups arrive together; stable review sorting keeps them together within each tier.
const books = [
  { id: 'a-plain', author: 'A' },
  { id: 'a-review', author: 'A', review: { content: '书评' } },
  { id: 'a-series', author: 'A', installments: [{ review: { content: '分部书评' } }] },
  { id: 'b-review', author: 'B', review: { content: '书评' } },
  { id: 'b-plain', author: 'B' },
  { id: 'c-blank', author: 'C', review: { content: '　\n' } },
];
const booksBefore = JSON.stringify(books);
const literatureFrontmatter = read('src/pages/marginalia/literature/index.astro').split('---')[1].replace(/^import .*;$/gm, '');
const bookCards = vm.runInNewContext(literatureFrontmatter + '\nbookCards', {
  ...context.exports, literatureBookCards: books, literatureEssays: [],
});
assert.deepEqual(Array.from(bookCards, book => book.id), ['a-review', 'a-series', 'b-review', 'a-plain', 'b-plain', 'c-blank']);
assert.equal(JSON.stringify(books), booksBefore, 'Display sorting must preserve source books and installments');
assert.ok(!read('src/pages/marginalia/[id].astro').includes('reviewFirst'));
assert.ok(!read('src/pages/marginalia/music/index.astro').includes('reviewFirst'));
console.log('Review priority: all Screen tabs, books, nested reviews, whitespace, stable order and game/music isolation passed.');
