// node tests/media-data.mjs (raw export checks also run when local preparation files exist)
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
import { loadData } from './load-data.mjs';
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const json = path => JSON.parse(read(path));
const music = json('src/data/music-import.json');
const cinema = json('src/data/cinema-import.json');
const curation = json('src/data/media-curation.json');
const excludedTracks = new Set(curation.excludedTracks.map(t => t.id));
const excludedCinema = new Set(curation.excludedCinemaIds.map(id => id.replace('film-', '')));
const tracks = music.albums.flatMap(album => album.tracks);
assert.equal(tracks.length, 965 - excludedTracks.size);
assert.equal(new Set(tracks.map(t => t.id)).size, 965 - excludedTracks.size);
assert.ok(tracks.every(t => t.source === 'apple-music'));
assert.ok(tracks.some(t => t.id === 'local-FB841F0CFE0C61D1' && t.title === '妥协'));
assert.ok(music.albums.some(album => album.tracks.length === 1));
assert.equal(new Set(music.albums.map(a => a.id)).size, music.albums.length);
for (const album of music.albums) {
  const artist = music.artists.find(a => a.id === album.artistId);
  assert.ok(artist?.albumIds.includes(album.id));
  assert.ok(album.tracks.length > 0);
}
assert.ok(tracks.every(t => !excludedTracks.has(t.id)));
for (const exclusion of curation.excludedTracks.filter(t => t.duplicateOf)) {
  assert.ok(tracks.some(t => t.id === exclusion.duplicateOf) || excludedTracks.has(exclusion.duplicateOf), `Missing recording decision for ${exclusion.id}`);
  assert.match(exclusion.isrc, /^[A-Z]{2}[A-Z0-9]{3}\d{7}$/);
}
assert.ok(cinema.every(x => !curation.excludedCinemaIds.includes(x.id)));
assert.equal(cinema.filter(x => x.genre.split(', ').includes('Animation')).length, 114);
assert.ok(cinema.every(x => x.director && x.country));
assert.equal(cinema.find(x => x.id === 'tv-134182').country, 'CN');
assert.equal(cinema.find(x => x.id === 'film-24735062').country, 'CN');
assert.equal(cinema.find(x => x.id === 'tv-95479').creditRole, 'ORIGINAL WORK');
assert.ok(!music.artists.some(x => x.name === 'Soundtracks'));
assert.ok(!music.artists.some(x => x.name === 'Compilations'));
assert.ok(music.albums.every(x => x.coverUrl));
assert.ok(music.albums.some(x => x.title === 'Live for Today'));
assert.ok(!tracks.some(x => /Taylor[’']s Version/.test(x.title)));
assert.ok(music.artists.every(x => x.albumIds.length > 0));
for (const rule of curation.musicGroups) {
  for (const album of music.albums.filter(a => a.title === rule.title && a.artistName === rule.albumArtist)) {
    assert.equal(music.artists.find(a => a.id === album.artistId).name, rule.group);
    assert.equal(album.artistDisplayName, rule.albumArtist);
  }
}
assert.equal(cinema.filter(x => x.type === 'film').length, 343);
assert.equal(cinema.filter(x => x.type === 'series').length, 55);
assert.ok(cinema.every(x => !x.review && x.watchedEntries.every(entry => !entry.comment)));
const watched = cinema.flatMap(x => x.watchedEntries);
assert.equal(watched.length, 441);
assert.equal(new Set(watched.map(x => x.doubanId)).size, 441);
assert.equal(new Set(cinema.filter(x => x.type === 'series').map(x => x.tmdbId)).size, 55);
assert.equal(cinema.find(x => x.id === 'tv-2316').watchedEntries.length, 9);
assert.ok(cinema.find(x => x.id === 'tv-1429').watchedEntries.some(x => x.doubanId === '35853587'));
for (const x of cinema) assert.equal(x.firstWatched, x.watchedEntries.map(m => m.firstWatched).sort()[0]);
for (const url of [...music.albums.map(x => x.coverUrl), ...music.artists.map(x => x.avatarUrl), ...cinema.map(x => x.posterUrl)].filter(Boolean)) {
  // Verified standalone artwork from the artist's release page and Spotify single.
  if (music.albums.some(album => album.coverUrl === url) && [
    'https://linkstorage.linkfire.com/medialinks/images/7248a0a9-2812-43be-9429-b6811dd83742/artwork-440x440.jpg',
    'https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02e9bfead25d05f8e25c9ffdb1',
  ].includes(url)) continue;
  if (music.albums.some(album => album.coverUrl === url) && /^https:\/\/is\d+-ssl\.mzstatic\.com\/image\/thumb\//.test(url)) continue;
  assert.match(url, /^https:\/\/homepage-assets\.mathtranslations\.org\/images\/(music|cinema)\/[a-z0-9/.-]+\.webp$/);
}
const root = 'Homepage-Assets/media/';
if (existsSync(new URL(`../${root}cinema-records.json`, import.meta.url))) {
  const original = json(root + 'cinema-records.json');
  for (const x of original) {
    if (excludedCinema.has(x.subjectId)) continue;
    const imported = watched.find(m => m.doubanId === x.subjectId);
    assert.equal(imported?.firstWatched, x.markedAt);
    assert.equal(imported?.comment, '');
    assert.equal(imported?.rating, x.stars ? `${x.stars} / 5` : '');
  }
  const posters = json(root + 'cinema-upload-manifest.json');
  for (const x of cinema) {
    const selection = posters.find(p => (p.type === 'film' ? 'film-' + p.id : p.id) === x.id);
    assert.equal(x.posterUrl, 'https://homepage-assets.mathtranslations.org/' + selection.key);
  }
  const originalSongs = json(root + 'apple-library-songs.json');
  for (const song of originalSongs) assert.equal(tracks.some(t => t.id === song.id), !excludedTracks.has(song.id));
  const catalogSongs = json(root + 'apple-catalog-songs.json');
  const recording = id => catalogSongs.find(song => song.id === originalSongs.find(song => song.id === id)?.attributes.playParams?.catalogId)?.attributes.isrc;
  for (const exclusion of curation.excludedTracks.filter(t => t.duplicateOf)) {
    assert.equal(recording(exclusion.id), exclusion.isrc);
    assert.equal(recording(exclusion.duplicateOf), exclusion.isrc);
  }
}
const context = { exports: {}, require: () => ({ default: json('src/data/screen-name-variants.json') }) };
vm.runInNewContext(ts.transpile(read('src/lib/html.ts'), { module: ts.ModuleKind.CommonJS }), context);
assert.equal(context.exports.escapeHtml('<img src=x onerror="alert(1)">&\''), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&amp;&#39;');
const page = read('src/pages/marginalia/music/index.astro');
assert.ok(page.includes('const displayTracks = album.tracks;'));
assert.ok(!page.includes('album.tracks.filter('));
console.log('Media source coverage, series grouping, watch dates, poster mappings and HTML escaping: passed');

// Shared export must interleave Chinese pinyin and Latin names for both page columns.
const sortedContext = { exports: {}, require: name => ({ default: json('src/data/' + name.replace('./', '')) }) };
vm.runInNewContext(ts.transpile(read('src/data/music.ts'), { module: ts.ModuleKind.CommonJS }), sortedContext);
const sortedNames = Array.from(sortedContext.exports.musicArtists, a => a.name);
assert.equal(sortedNames.length, music.artists.length);
assert.ok(sortedNames.indexOf('陈奕迅') < sortedNames.indexOf('Coldplay'));
assert.ok(sortedNames.includes('林俊杰') && sortedNames.includes('Lenka'));
assert.ok(sortedNames.indexOf('Lenka') < sortedNames.indexOf('林俊杰'));
assert.ok(sortedNames.indexOf('周杰伦') > sortedNames.indexOf('Queen'));
const keys = json('src/data/music-sort-names.json');
for (const name of sortedNames.filter(name => /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(name))) assert.ok(keys[name], `Missing romanization: ${name}`);
const collator = new Intl.Collator('en', { sensitivity: 'base', numeric: true, ignorePunctuation: true });
for (let i = 1; i < sortedNames.length; i++) assert.ok(collator.compare(keys[sortedNames[i-1]] || sortedNames[i-1], keys[sortedNames[i]] || sortedNames[i]) <= 0);
console.log('Mixed pinyin and Latin artist ordering: passed');

const cinemaContext = { exports: loadData('cinema.ts') };
assert.equal(cinemaContext.exports.allCinemaItems.length, 295);
assert.equal(cinema.filter(item => item.hidden).length, 103);
for (const id of ['film-26930504', 'film-25796222', 'tv-85937', 'film-1306809', 'film-27074316', 'film-4237879']) {
  assert.ok(cinemaContext.exports.allCinemaItems.some(item => item.id === id), `Must retain ${id}`);
}
assert.ok(cinemaContext.exports.allCinemaItems.every(item => !item.hidden));
const groupedIds = curation.cinemaGroups.flat();
assert.equal(new Set(groupedIds).size, groupedIds.length);
assert.ok(groupedIds.every(id => cinema.some(item => item.id === id)));
for (const [name, predicate] of [
  ['cinemaAnimation', item => item.genre.split(', ').includes('Animation')],
  ['cinemaFilms', item => item.type === 'film' && !item.genre.split(', ').includes('Animation')],
]) {
  const items = Array.from(cinemaContext.exports[name]);
  assert.deepEqual(items.map(item => item.id).sort(), cinema.filter(item => !item.hidden && predicate(item)).map(item => item.id).sort());
  const key = item => {
    const group = curation.cinemaGroups.findIndex(ids => ids.includes(item.id));
    return group < 0 ? `director:${item.director}` : `series:${group}`;
  };
  const groups = new Map();
  for (const [index, item] of items.entries()) {
    const group = groups.get(key(item)) ?? [];
    group.push({ index, item });
    groups.set(key(item), group);
  }
  let reachedUnreviewed = false;
  for (const group of groups.values()) {
    assert.equal(group.at(-1).index - group[0].index + 1, group.length, 'Related works must stay adjacent');
    for (let i = 1; i < group.length; i++) assert.ok(Number(group[i - 1].item.year) <= Number(group[i].item.year));
    const reviewed = group.some(({ item }) => item.review);
    assert.ok(!reachedUnreviewed || !reviewed, 'Groups with reviews must come first');
    reachedUnreviewed ||= !reviewed;
  }
  for (const ids of curation.cinemaGroups) {
    const positions = ids.map(id => items.findIndex(item => item.id === id)).filter(index => index >= 0).sort((a, b) => a - b);
    if (positions.length) assert.equal(positions.at(-1) - positions[0] + 1, positions.length);
  }
}
assert.ok(!read('src/pages/marginalia/screen/index.astro').includes('items: [...category.items].sort'));
assert.equal(context.exports.secondaryNames(['Parasite'], '기생충', '寄生虫'), '기생충 · 寄生虫');
assert.equal(context.exports.secondaryNames(['Bleach'], 'BLEACH', '死神', '第 2 季'), '死神 · 第 2 季');
assert.equal(context.exports.secondaryNames(['Reset'], '开端', '开端'), '开端');
assert.equal(context.exports.secondaryNames(['Christopher Nolan'], 'Christopher Nolan', '克里斯托弗·诺兰'), '克里斯托弗·诺兰');
assert.equal(context.exports.secondaryNames(['A', 'B'], '小林常夫', '伊達勇登', '小林常夫', '伊达勇登'), '小林常夫 · 伊達勇登 · 伊达勇登');
console.log('Cinema related groups, release ordering and review priority: passed');

for (const [native, chinese] of Object.entries(json('src/data/screen-name-variants.json'))) assert.equal(context.exports.secondaryNames([], native, chinese), chinese);
for (const id of ['film-24843198', 'film-24735062']) assert.ok(!cinemaContext.exports.allCinemaItems.some(item => item.id === id));

for (const id of ['tv-134182', 'film-26277313', 'film-1291577']) assert.ok(!cinemaContext.exports.allCinemaItems.some(item => item.id === id));
