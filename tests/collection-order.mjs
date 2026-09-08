// node tests/collection-order.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadData } from './load-data.mjs';
const ids = items => Array.from(items, item => item.id);
const review = { content: 'Personal review' };
const film = (id, year, director, extra = {}) => ({ id, title: id, type: 'film', year, director, genre: 'Drama', ...extra });
const show = (id, year, extra = {}) => film(id, year, id, { type: 'series', ...extra });
const anime = (id, year, studio, extra = {}) => film(id, year, id, { genre: 'Animation', studio, ...extra });
const source = [
  film('single-old', 1900, 'Old'), film('a-old', 2000, 'A, B'), film('a-review', 2010, 'A', { review }),
  film('z-first', 1950, 'Z'), film('z-last', 1960, 'Z'),
  film('b-early', 1990, 'B'), film('b-late', 2025, 'B'), film('b-first', 2000, 'B'), film('b-last', 2020, 'C', { review }),
  film('blank', 1901, 'Blank', { review: { content: '　\n' } }),
  show('tv-new', 2020), show('tv-old', 1990), show('tv-reviewed', 2010, { review }),
  show('tv-seasons', 2025, { seasons: [
    { id: 'season-late', title: 'late', year: 2009, releaseDate: '2009-10-01' },
    { id: 'season-early', title: 'early', year: 2009, releaseDate: '2009-02-01', review },
  ] }),
  anime('movie-old', 1900, 'Old'), anime('studio-a-old', 2000, 'A'), anime('studio-a-reviewed', 2010, 'A', { review }),
  anime('series-movie-first', 2020, 'S'), anime('series-movie-last', 2021, 'Other'),
  anime('anime-single', 2000, 'Single', { type: 'series', review }),
  anime('anime-multi', 2020, 'Multi', { type: 'series', seasons: [
    { id: 'part-1', title: 'one', year: 2020 }, { id: 'part-2', title: 'two', year: 2021 },
  ] }),
];
const original = JSON.stringify(source);
const cinema = loadData('cinema.ts', {
  'cinema-import.json': source,
  'media-curation.json': { cinemaGroups: [['z-first','z-last'], ['b-first','b-last'], ['series-movie-first','series-movie-last']], cinemaCollectionTitles: {} },
});
assert.deepEqual(ids(cinema.cinemaFilmCards), ['a-old','a-review','b-early','b-first','b-late','blank','single-old','z-first']);
assert.deepEqual(ids(cinema.cinemaFilmCards[3].installments), ['b-first','b-last']);
assert.deepEqual(ids(cinema.cinemaSeriesCards), ['tv-seasons','tv-reviewed','tv-old','tv-new']);
assert.deepEqual(ids(cinema.cinemaSeriesCards[0].installments), ['season-early','season-late']);
assert.deepEqual(ids(cinema.cinemaAnimationCards), ['anime-multi','anime-single','series-movie-first','studio-a-old','studio-a-reviewed','movie-old']);
assert.equal(JSON.stringify(source), original, 'Sorting must not mutate source records');

const book = (id, author, originalYear, extra = {}) => ({ id, title: id, author, year: 2026 - originalYear % 10, originalYear, ...extra });
const books = [
  book('a', 'Alpha', 1800), book('z-new', 'Zulu', 2000, { review }), book('z-old', 'Zulu', 1900),
  book('b-single', 'Bravo', 1700), book('b-two', 'Bravo', 2005, { collection: 'B', partOrder: 2 }),
  book('b-one', 'Bravo', 2010, { collection: 'B', partOrder: 1 }),
  book('liu', '刘慈欣', 2004), book('keigo', '东野圭吾', 1996),
];
const data = { books, essays: [
  { id: 'old', date: '2025.8.15' }, { id: 'new-a', date: '2026-09-08' },
  { id: 'middle', date: '2025.10.1' }, { id: 'new-b', date: '2026.9.8' },
  { id: 'hidden', date: '2027-01-01', hidden: true },
] };
const before = JSON.stringify(data);
const literature = loadData('literature.ts', { 'literature.json': data });
assert.deepEqual(ids(literature.literatureBookCards), ['z-old','z-new','a','b-single','b-one','keigo','liu']);
assert.deepEqual(ids(literature.literatureBookCards[4].installments), ['b-one','b-two']);
assert.deepEqual(ids(literature.literatureEssays), ['new-a','new-b','middle','old']);
assert.equal(JSON.stringify(data), before);

const live = loadData('literature.ts');
const names = JSON.parse(readFileSync(new URL('../src/data/literature-sort-names.json', import.meta.url), 'utf8'));
const audit = JSON.parse(readFileSync(new URL('../reports/literature-ordering-audit.json', import.meta.url), 'utf8'));
for (const b of live.literatureBooks) {
  assert.ok(Number.isInteger(b.originalYear) && b.originalYear > 0, b.title);
  assert.equal(b.originalYear, audit.books[b.title].year);
  assert.match(audit.books[b.title].source, /^https:\/\//);
  assert.ok(names[b.originalAuthor || b.author], b.author);
}
for (const [author, expected] of [
  ['毛姆', ['月亮和六便士','面纱','刀锋']],
  ['阿加莎·克里斯蒂', ['罗杰疑案','东方快车谋杀案','尼罗河上的惨案']],
  ['东野圭吾', ['恶意','秘密','白夜行','解忧杂货店']],
]) assert.deepEqual(Array.from(live.literatureBookCards.filter(b => b.author === author), b => b.title), expected);
console.log('Tier priority, whole-group reviews, source chronology, romanized author names, essay dates and source preservation passed.');

for (const author of new Set(live.literatureBookCards.map(b => b.author))) {
  const years = Array.from(live.literatureBookCards.filter(b => b.author === author), b => b.originalYear);
  assert.deepEqual(years, [...years].sort((a,b) => a-b), author);
}
