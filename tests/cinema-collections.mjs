// node tests/cinema-collections.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
const root = new URL('../src/data/', import.meta.url);
const context = { exports: {}, require: name => {
  const data = JSON.parse(readFileSync(new URL(name, root), 'utf8'));
  return { ...data, default: data };
} };
vm.runInNewContext(ts.transpile(readFileSync(new URL('cinema.ts', root), 'utf8'), {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
}), context);
const { groupFilmCollections, cinemaFilms, cinemaAnimation, cinemaSeries } = context.exports;
for (const items of [cinemaFilms, cinemaAnimation, cinemaSeries]) {
  const cards = Array.from(groupFilmCollections(items));
  const films = cards.flatMap(card => Array.from(card.installments || [card]));
  assert.deepEqual(films.map(x => x.id).sort(), Array.from(items, x => x.id).sort());
  for (const card of cards.filter(x => x.installments)) {
    assert.ok(card.installments.length > 1);
    assert.ok(card.installments.every(x => x.type === 'film' && !x.hidden));
    assert.deepEqual(Array.from(card.installments, x => Number(x.year)), Array.from(card.installments, x => Number(x.year)).sort((a,b) => a-b));
  }
}
const killBill = groupFilmCollections(cinemaFilms).find(x => x.title === 'Kill Bill');
assert.deepEqual(Array.from(killBill.installments, x => x.id), ['film-1291580', 'film-1291584']);
assert.equal(groupFilmCollections([killBill.installments[1]])[0], killBill.installments[1], 'A single retained film stays a normal card');
assert.equal(groupFilmCollections(cinemaSeries).length, cinemaSeries.length, 'Do not combine different TV shows');
console.log('Collection membership, hidden films, release order, single films and TV preservation passed');
