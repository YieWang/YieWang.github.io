// node tests/cinema-collections.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadData } from './load-data.mjs';
const root = new URL('../src/data/', import.meta.url);
const context = { exports: loadData('cinema.ts') };
const { groupFilmCollections, cinemaFilms, cinemaAnimation, cinemaSeries } = context.exports;
const { hasComment } = loadData('../lib/review-order.ts');
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
// Regular episodes from the imported TMDb season records; specials are separate.
for (const [id, episodes] of Object.entries({ 'tv-276903': 10, 'tv-16069': 11, 'tv-83119': 10,
  'tv-215197': 10, 'tv-38242': 21, 'tv-75701': 10, 'tv-155441': 15, 'tv-33823': 37,
  'tv-94028': 8, 'tv-6100': 11, 'tv-4319': 11, 'tv-210955': 9 })) {
  assert.equal(cinemaSeries.find(item => item.id === id)?.runtime, `${episodes} Episodes`);
}
assert.ok(cinemaSeries.every(item => !/^1 Seasons?$/i.test(item.runtime || '')), 'Single-season television shows must display episodes');
const harryPotter = groupFilmCollections(cinemaFilms).find(x => x.title === 'Harry Potter');
assert.equal(harryPotter.installments.length, 8);
assert.ok(harryPotter.installments.every(x => x.title.startsWith('Harry Potter and ')));
assert.ok(!harryPotter.installments.some(x => x.id === 'film-25726614'), 'Fantastic Beasts stays separate from Harry Potter, whether kept or hidden');
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
for (const tier of [0,1,2,3]) {
  for (const studio of new Set(animationCards.filter(x => order(x) === tier).map(x => x.studio).filter(Boolean))) {
    const positions = animationCards.map((x,index) => x.studio === studio && order(x) === tier ? index : -1).filter(index => index >= 0);
    assert.equal(positions.at(-1)-positions[0]+1,positions.length,'Same studio must be adjacent within its tier');
    const years = positions.map(index => Number(animationCards[index].year));
    assert.deepEqual(years,[...years].sort((a,b) => a-b),'Studio works must follow release years');
  }
}
const groupKey = x => `${order(x)}:${x.studio || x.id}`;
assert.deepEqual([...new Set(animationCards.map(groupKey))].sort(),[...new Set(beforeStudios.map(groupKey))].sort(),'Preserve every studio group');
assert.ok(animationCards.some(x => x.id === 'tv-37854'), 'One Piece remains visible');

const filmCards = Array.from(context.exports.cinemaFilmCards);
assert.ok(filmCards.some(x => x.id === 'film-1296697' && !x.installments), 'Original Planet of the Apes stays standalone');
const excludedIds = JSON.parse(readFileSync(new URL('media-curation.json', root), 'utf8')).excludedCinemaIds;
for (const id of excludedIds) {
  assert.ok(!allCinemaItems.some(x => x.id === id), `Deleted films must stay removed: ${id}`);
}
assert.deepEqual(filmCards.map(x => x.id).sort(), Array.from(groupFilmCollections(cinemaFilms), x => x.id).sort(), 'Sorting preserves every existing film card');
const leadDirector = x => (x.installments?.[0] || x).director.split(',')[0].trim();
const names = JSON.parse(readFileSync(new URL('cinema-sort-names.json', root), 'utf8'));
const directorNameOrder = new Intl.Collator('en', { sensitivity: 'base', numeric: true, ignorePunctuation: true });
const groups = new Map();
filmCards.forEach((card, index) => {
  const director = leadDirector(card);
  const group = groups.get(director) || [];
  group.push({ card, index }); groups.set(director, group);
});
const groupOrder = [];
for (const [director, group] of groups) {
  assert.equal(group.at(-1).index - group[0].index + 1, group.length, 'Same lead director stays adjacent across card types');
  const years = group.map(x => Number(x.card.year));
  assert.deepEqual(years, [...years].sort((a,b) => a-b));
  groupOrder.push({ name: names[director] || director, reviewed: group.some(x => hasComment(x.card)) });
}
assert.deepEqual(groupOrder, [...groupOrder].sort((a,b) => Number(b.reviewed)-Number(a.reviewed) || directorNameOrder.compare(a.name,b.name)));
assert.equal(names['Stephen Chow'], 'Zhou Xing Chi');
assert.equal(leadDirector(filmCards.find(x => x.title === 'Harry Potter')), 'Chris Columbus');
assert.equal(leadDirector(filmCards.find(x => x.title === 'King of Comedy')), 'Stephen Chow');
for (const id of ['film-1474189', 'film-1309045', 'film-1417598',
  'film-24753477', 'film-26931786', 'film-26933210',
  'film-3231742', 'film-3066739', 'film-1432146']) {
  assert.ok(!allCinemaItems.some(x => x.id === id), `Deleted series must stay hidden: ${id}`);
}
console.log('Films: adjacent lead directors, chronological groups and intact membership passed');
