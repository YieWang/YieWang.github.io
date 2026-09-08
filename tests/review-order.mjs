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
// Renderers must consume the already grouped order without pulling out individual reviews.
const frontmatter = read('src/pages/marginalia/screen/index.astro').split('---')[1].replace(/^import .*;$/gm, '');
const tabs = vm.runInNewContext(frontmatter + '\ncategories', {
  cinemaFilmCards: items, cinemaSeriesCards: items, cinemaAnimationCards: items,
});
for (const tab of tabs) assert.deepEqual(Array.from(tab.items, x => x.id), items.map(x => x.id));
const literatureFrontmatter = read('src/pages/marginalia/literature/index.astro').split('---')[1].replace(/^import .*;$/gm, '');
assert.equal(vm.runInNewContext(literatureFrontmatter + '\nbookCards', { literatureBookCards: items, literatureEssays: [] }), items);
assert.ok(!read('src/pages/marginalia/[id].astro').includes('reviewFirst'));
assert.ok(!read('src/pages/marginalia/music/index.astro').includes('reviewFirst'));
console.log('Nested review detection and page preservation of grouped order passed.');
