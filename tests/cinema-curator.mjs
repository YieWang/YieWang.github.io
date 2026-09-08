// node tests/cinema-curator.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const page = read('scripts/editor/cinema.html');
assert.match(page, /<option value="kept" selected>已保留<\/option>/);
const context = { records: data => data };
vm.createContext(context);
vm.runInContext(page.slice(page.indexOf('function collectionItems'), page.indexOf('const node =')), context);
for (const rating of [undefined, null, '', '   ']) assert.equal(context.hasUnrated({ rating }), true);
for (const rating of ['0 / 5', '5 / 5', 0]) assert.equal(context.hasUnrated({ rating }), false);
assert.equal(context.hasUnrated({ parts: [{ rating: '5 / 5' }, {}] }), true);
assert.equal(context.hasUnrated({ parts: [{ rating: '5 / 5' }, { rating: '4 / 5' }] }), false);
assert.equal(context.hasUnrated({ rating: '5 / 5', seasons: [{}] }), true);
assert.equal(context.hasUnrated({ rating: '5 / 5', seasons: [{ rating: '4 / 5' }] }), false);
const data = JSON.parse(read('src/data/cinema-import.json'));
const { cinemaGroups: groups, cinemaCollectionTitles: titles } = JSON.parse(read('src/data/media-curation.json'));
const cards = context.collectionItems(data, { groups, titles });
assert.deepEqual(Array.from(cards.flatMap(x => x.parts), x => x.id).sort(), data.map(x => x.id).sort());
const potter = cards.find(x => x.title === 'Harry Potter');
assert.equal(potter.parts.length, 8);
assert.equal(potter.year, 2001);
const ids = Array.from(potter.parts, x => x.id);
const untouched = JSON.stringify(data.filter(x => !ids.includes(x.id)));
for (const hidden of [true, false]) {
  context.setHidden(data, ids, hidden);
  assert.ok(data.filter(x => ids.includes(x.id)).every(x => x.hidden === hidden));
  assert.equal(JSON.stringify(data.filter(x => !ids.includes(x.id))), untouched);
}
data.find(x => x.id === ids[0]).hidden = true;
assert.equal(context.collectionItems(data, { groups, titles }).find(x => x.title === 'Harry Potter').partial, true);
assert.ok(cards.some(x => x.id === 'film-1296697' && x.parts.length === 1));
console.log('Curator: one card per series, complete membership, first cover/year, whole-series actions and partial deletions passed.');

const books = JSON.parse(read('src/data/literature.json')).books;
const bookCards = context.bookCollectionItems(books);
assert.deepEqual(Array.from(bookCards.flatMap(x => x.parts), x => x.id).sort(), books.map(x => x.id).sort());
const trilogy = bookCards.find(x => x.title === '1Q84');
assert.deepEqual(Array.from(trilogy.parts, x => x.partOrder), [1, 2, 3]);
assert.equal(trilogy.coverUrl, books.find(x => x.collection === '1Q84' && x.partOrder === 1).coverUrl);
const bookIds = Array.from(trilogy.parts, x => x.id);
const otherBooks = JSON.stringify(books.filter(x => !bookIds.includes(x.id)));
for (const hidden of [true, false]) {
  context.setHidden(books, bookIds, hidden);
  assert.ok(books.filter(x => bookIds.includes(x.id)).every(x => x.hidden === hidden));
  assert.equal(JSON.stringify(books.filter(x => !bookIds.includes(x.id))), otherBooks);
}
console.log('Book curator: one card per collection, volume order, first cover and whole-series actions passed.');
