// node tests/literature-collections.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const root = new URL('../src/data/', import.meta.url);
const data = JSON.parse(readFileSync(new URL('literature.json', root), 'utf8'));
const context = { exports: {}, require: () => ({ default: data }) };
vm.runInNewContext(ts.transpile(readFileSync(new URL('literature.ts', root), 'utf8'), {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
}), context);
const { literatureBooks: books, literatureBookCards: cards, groupBookCollections } = context.exports;
assert.equal(books.length, 103);
assert.equal(cards.length, 72);
assert.equal(new Set(books.map(b => b.id)).size, books.length);
assert.equal(new Set(books.flatMap(b => b.sourceIds)).size, 84);
assert.deepEqual(Array.from(cards.flatMap(b => b.installments || [b]), b => b.id).sort(), Array.from(books, b => b.id).sort());
for (const [name, count] of Object.entries({ '1Q84': 3, '龙族': 6, '射雕三部曲': 3, '哈利·波特': 7, '基地七部曲': 7, '三体': 3, '明朝那些事儿': 9 })) {
  const card = cards.find(b => b.title === name);
  assert.equal(card.installments.length, count, name);
  assert.equal(card.coverUrl, card.installments[0].coverUrl);
  assert.deepEqual(Array.from(card.installments, b => b.partOrder), Array.from({ length: count }, (_, i) => i + 1));
}
const excluded = ['彷徨之刃','沉睡的人鱼之家','恋爱的贡多拉','风雪追击','我的晃荡的青春','悖论13','假面饭店','湖畔','从前我死去的家','祈祷落幕时','虚无的十字架','时生','新参者','未知图书'];
assert.ok(books.every(b => !excluded.includes(b.title)));
assert.ok(books.every(b => b.coverUrl.startsWith('https://homepage-assets.mathtranslations.org/literature/') && b.coverSource));
assert.ok(books.every(b => !b.firstRead && !b.reread), 'Record dates do not prove a first reading');
assert.equal(data.essays.length, 0);
const first = books[0];
assert.equal(groupBookCollections([first])[0], first);
const tiers = Array.from(cards, b => Number(!b.installments));
assert.deepEqual(tiers, [...tiers].sort());
for (const tier of [true, false]) {
  const subset = Array.from(cards).filter(b => !!b.installments === tier);
  for (const author of new Set(subset.map(b => b.author))) {
    const positions = subset.map((b, i) => b.author === author ? i : -1).filter(i => i >= 0);
    assert.equal(positions.at(-1) - positions[0] + 1, positions.length);
  }
}
console.log('84 source records, exact exclusions, 103 volumes, 72 cards, complete series, external covers and no invented reading dates passed');
