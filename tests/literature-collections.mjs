// node tests/literature-collections.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadData } from './load-data.mjs';
const root = new URL('../src/data/', import.meta.url);
const data = JSON.parse(readFileSync(new URL('literature.json', root), 'utf8'));
const context = { exports: loadData('literature.ts') };
const { literatureBooks: books, literatureBookCards: cards, groupBookCollections } = context.exports;
assert.equal(books.length, data.books.filter(b => !b.hidden).length);
assert.equal(cards.length, new Set(books.map(b => b.collection || b.id)).size);
assert.equal(new Set(books.map(b => b.id)).size, books.length);
assert.equal(new Set(data.books.flatMap(b => b.sourceIds || [])).size, 53, 'Retained source records after removing hidden books');
assert.deepEqual(Array.from(cards.flatMap(b => b.installments || [b]), b => b.id).sort(), Array.from(books, b => b.id).sort());
for (const [name, count] of Object.entries({ '1Q84': 3, '射雕三部曲': 3, '哈利·波特': 7, '基地七部曲': 7, '三体': 3, '明朝那些事儿': 7, '平凡的世界': 3 })) {
  const card = cards.find(b => b.title === name);
  assert.equal(card.installments.length, count, name);
  assert.equal(card.coverUrl, card.installments[0].coverUrl);
  assert.deepEqual(Array.from(card.installments, b => b.partOrder), Array.from({ length: count }, (_, i) => i + 1));
}
const excluded = ['彷徨之刃','沉睡的人鱼之家','恋爱的贡多拉','风雪追击','我的晃荡的青春','悖论13','假面饭店','湖畔','从前我死去的家','祈祷落幕时','虚无的十字架','时生','新参者','未知图书','九州·缥缈录Ⅰ：蛮荒','九州·缥缈录Ⅱ：苍云古齿','九州·缥缈录Ⅲ：天下名将','九州·缥缈录Ⅳ：辰月之征','九州·缥缈录Ⅴ：一生之盟','九州·缥缈录Ⅵ：豹魂'];
assert.ok(books.every(b => !excluded.includes(b.title)));
assert.ok(books.every(b => (b.coverUrl.startsWith('https://homepage-assets.mathtranslations.org/literature/') || b.coverUrl.startsWith('https://homepage-assets.mathtranslations.org/images/local-editor/')) && b.coverSource));
assert.ok(books.every(b => !b.firstRead && !b.reread), 'Record dates do not prove a first reading');
assert.equal(data.essays.length, 0);
const first = books[0];
assert.equal(groupBookCollections([first])[0], first);
for (const author of new Set(cards.map(b => b.author))) {
  const positions = Array.from(cards, (b, i) => b.author === author ? i : -1).filter(i => i >= 0);
  assert.equal(positions.at(-1) - positions[0] + 1, positions.length, `${author}: all books must be adjacent`);
}
console.log('Visible books, complete collections, preserved sources and author adjacency passed');
