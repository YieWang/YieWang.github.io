// node tests/media-additions.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadData } from './load-data.mjs';
import { documents, validate } from '../scripts/editor/schema.mjs';
const read = file => JSON.parse(readFileSync(new URL(`../src/data/${file}`, import.meta.url), 'utf8'));
const cinema = read('cinema-import.json');
validate(cinema, documents.cinema.schema);
const literature = loadData('literature.ts');
const books = ['第七天', '群山回唱', '没有人给他写信的上校', '变形记', '审判', '城堡', '判决', '一个陌生女人的来信', '牧羊少年奇幻之旅', '一个人的朝圣'];
const seriesIds = [31816, 1418, 64280, 42009, 66732, 1425, 46648, 204541, 61746, 6710, 78986, 61611];
const animeIds = [61459, 53052, 65249, 42509, 70880, 83121, 116727, 39218, 13916, 62564, 42511, 60808, 65329, 65676, 118797, 39434, 63145, 60827, 42916, 67126, 65648, 36243, 65944, 60572, 102788];
const cards = loadData('cinema.ts');
for (const title of books) {
  const matches = literature.literatureBooks.filter(b => b.title === title);
  assert.equal(matches.length, 1, title);
  const b = matches[0];
  assert.ok(b.coverSource && b.coverWidth > 0 && b.coverHeight > b.coverWidth, title);
  assert.ok(!b.review && !b.firstRead && !b.reread, 'Do not invent reading records');
}
const ordinaryWorld = cards && literature.literatureBookCards.find(b => b.title === '平凡的世界');
assert.ok(ordinaryWorld);
assert.equal(ordinaryWorld.installments.length, 3);
for (const [ids, items] of [[seriesIds, cards.cinemaSeriesCards], [animeIds, cards.cinemaAnimationCards]]) {
  for (const id of ids) {
    const matches = items.filter(x => x.tmdbId === id);
    assert.equal(matches.length, 1, `TMDB ${id}`);
    const x = matches[0];
    for (const part of x.installments || [x]) {
      assert.ok(part.director && part.chineseTitle && part.country);
      assert.match(part.posterUrl, /^https:\/\/homepage-assets\.mathtranslations\.org\//);
      assert.match(part.posterSourceUrl, /^https:\/\/image\.tmdb\.org\//);
      assert.equal(part.externalLink?.platform, 'TMDb');
      if (part.partLabel) {
        assert.ok(!part.chineseTitle.includes(part.partLabel), `${part.chineseTitle} should not include ${part.partLabel}`);
      }
      assert.ok(!part.review && !part.rating && !part.firstWatched);
      assert.equal(part.watchedEntries.length, 0);
    }
  }
}
for (const [id, count] of [
  [31816, 2], [1418, 12], [42509, 2], [83121, 3], [62564, 3], [42511, 2], [65676, 3],
  [42009, 6], [66732, 4], [1425, 6], [46648, 4], [61746, 9], [67126, 2], [102788, 2], [60572, 25]
]) {
  const x = cinema.find(x => x.tmdbId === id);
  assert.equal(x.seasons.length, count);
  assert.equal(x.posterUrl, x.seasons[0].posterUrl);
}
assert.equal(cinema.filter(x => x.tmdbId === 4935).length, 1, 'Howl is already present');
assert.ok(!cinema.some(x => x.id === 'film-26837952'), 'Excluded spin-off films stay deleted');
assert.equal(new Set(cinema.map(x => x.id)).size, cinema.length);
console.log('All requested titles are present once, with correct categories, full season groups and no invented personal records.');
