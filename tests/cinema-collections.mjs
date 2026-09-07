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
    assert.equal(card.year, card.installments[0].year);
    assert.ok(card.installments.every(x => x.type === 'film' && !x.hidden));
    assert.deepEqual(Array.from(card.installments, x => Number(x.year)), Array.from(card.installments, x => Number(x.year)).sort((a,b) => a-b));
  }
}
const killBill = groupFilmCollections(cinemaFilms).find(x => x.title === 'Kill Bill');
assert.deepEqual(Array.from(killBill.installments, x => x.id), ['film-1291580', 'film-1291584']);
assert.equal(groupFilmCollections([killBill.installments[1]])[0], killBill.installments[1], 'A single retained film stays a normal card');
assert.equal(groupFilmCollections(cinemaSeries).length, cinemaSeries.length, 'Do not combine different TV shows');
console.log('Collection membership, hidden films, release order, single films and TV preservation passed');

const { allCinemaItems, withSeasonDetails } = context.exports;
const vinland = withSeasonDetails(allCinemaItems.find(x => x.id === 'tv-88803'));
assert.deepEqual(Array.from(vinland.installments, x => x.year), [2019, 2023]);
assert.notEqual(vinland.installments[0].posterUrl, vinland.installments[1].posterUrl);
for (const series of allCinemaItems.filter(x => x.seasons?.length)) {
  const card = withSeasonDetails(series);
  assert.equal(card.posterUrl, card.installments[0].posterUrl);
  assert.equal(card.year, card.installments[0].year);
  assert.deepEqual(Array.from(card.installments.flatMap(x => x.watchedEntries), x => JSON.stringify(x)).sort(), Array.from(series.watchedEntries, x => JSON.stringify(x)).sort());
  for (const season of card.installments) {
    assert.ok(!season.seasons && !season.installments, 'Season payloads must not recursively carry the whole series');
    assert.ok(!season.review && !season.summary, 'Do not restore deleted reviews');
    if (!season.watchedEntries.length) assert.ok(!season.rating && !season.firstWatched, 'Unrecorded seasons must not inherit personal ratings or dates');
  }
}
console.log('Season details, first covers, original watch records and missing ratings passed');

const animationCards = Array.from(context.exports.cinemaAnimationCards);
const order = card => (card.type === 'series' ? 0 : 2) + ((card.installments?.length || 0) > 1 ? 0 : 1);
assert.deepEqual(animationCards.map(order), animationCards.map(order).sort((a, b) => a - b), 'Anime series first, then animated films; collections first in each section');
for (const id of ['tv-37854', 'tv-46260', 'tv-46261', 'tv-30984']) {
  const card = animationCards.find(x => x.id === id);
  assert.equal(card.installments?.length || 0, id === 'tv-37854' ? 0 : 2, 'Use complete shows instead of story arcs');
  const parts = card.installments || [card];
  assert.ok(parts.every(x => !x.firstWatched && !x.rating), 'New anime has no invented personal records');
  assert.ok(parts.every(x => x.posterUrl.startsWith('https://homepage-assets.mathtranslations.org/')), 'New posters must be on R2');
}
console.log('Animation category order and four new franchise cards passed');

assert.deepEqual(Array.from(animationCards.find(x => x.id === 'tv-46260').installments, x => x.runtime), ['220 Episodes', '500 Episodes']);
assert.deepEqual(Array.from(animationCards.find(x => x.id === 'tv-46261').installments, x => x.runtime), ['328 Episodes', '25 Episodes']);

const beforeStudios = Array.from(groupFilmCollections(cinemaAnimation), withSeasonDetails).sort((a,b) => order(a)-order(b));
assert.deepEqual(animationCards.filter(x => !x.studio).map(x => x.id), beforeStudios.filter(x => !x.studio).map(x => x.id), 'Keep all other cards in their relative order');
for (const tier of [2,3]) {
  const positions = animationCards.map((x,index) => x.studio && order(x) === tier ? index : -1).filter(index => index >= 0);
  if (positions.length) assert.equal(positions.at(-1)-positions[0]+1,positions.length,'Disney/Pixar must be adjacent in each film tier');
}
assert.ok(animationCards.some(x => x.id === 'tv-37854'), 'One Piece remains visible');
