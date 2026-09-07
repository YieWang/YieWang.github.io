// node tests/media-data.mjs (raw export checks also run when local preparation files exist)
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';
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
assert.ok(cinema.every(x => !curation.excludedCinemaIds.includes(x.id)));
assert.equal(cinema.filter(x => x.genre.split(', ').includes('Animation')).length, 111);
assert.ok(cinema.every(x => x.director && x.country));
assert.equal(cinema.find(x => x.id === 'tv-134182').country, 'CN');
assert.equal(cinema.find(x => x.id === 'film-24735062').country, 'CN');
assert.equal(cinema.find(x => x.id === 'tv-95479').creditRole, 'ORIGINAL WORK');
assert.ok(music.artists.some(x => x.name === 'Soundtracks'));
assert.ok(music.artists.some(x => x.name === 'Compilations'));
assert.ok(music.albums.every(x => x.coverUrl));
assert.ok(music.albums.some(x => x.title === 'Live for Today'));
assert.ok(tracks.some(x => x.title === "Long Live (Taylor's Version)"));
assert.ok(music.artists.every(x => x.albumIds.length > 0));
for (const rule of curation.musicGroups) {
  for (const album of music.albums.filter(a => a.title === rule.title && a.artistName === rule.albumArtist)) {
    assert.equal(music.artists.find(a => a.id === album.artistId).name, rule.group);
    assert.equal(album.artistDisplayName, rule.albumArtist);
  }
}
assert.equal(cinema.filter(x => x.type === 'film').length, 362);
assert.equal(cinema.filter(x => x.type === 'series').length, 51);
const watched = cinema.flatMap(x => x.watchedEntries);
assert.equal(watched.length, 460);
assert.equal(new Set(watched.map(x => x.doubanId)).size, 460);
assert.equal(new Set(cinema.filter(x => x.type === 'series').map(x => x.tmdbId)).size, 51);
assert.equal(cinema.find(x => x.id === 'tv-2316').watchedEntries.length, 9);
assert.ok(cinema.find(x => x.id === 'tv-1429').watchedEntries.some(x => x.doubanId === '35853587'));
for (const x of cinema) assert.equal(x.firstWatched, x.watchedEntries.map(m => m.firstWatched).sort()[0]);
for (const url of [...music.albums.map(x => x.coverUrl), ...music.artists.map(x => x.avatarUrl), ...cinema.map(x => x.posterUrl)].filter(Boolean)) {
  assert.match(url, /^https:\/\/homepage-assets\.mathtranslations\.org\/images\/(music|cinema)\/[a-z0-9/.-]+\.webp$/);
}
const root = 'Homepage-Assets/media/';
if (existsSync(new URL(`../${root}cinema-records.json`, import.meta.url))) {
  const original = json(root + 'cinema-records.json');
  for (const x of original) {
    if (excludedCinema.has(x.subjectId)) continue;
    const imported = watched.find(m => m.doubanId === x.subjectId);
    assert.equal(imported?.firstWatched, x.markedAt);
    assert.equal(imported?.comment, x.comment || '');
    assert.equal(imported?.rating, x.stars ? `${x.stars} / 5` : '');
  }
  const posters = json(root + 'cinema-upload-manifest.json');
  for (const x of cinema) {
    const selection = posters.find(p => (p.type === 'film' ? 'film-' + p.id : p.id) === x.id);
    assert.equal(x.posterUrl, 'https://homepage-assets.mathtranslations.org/' + selection.key);
  }
  const originalSongs = json(root + 'apple-library-songs.json');
  for (const song of originalSongs) assert.equal(tracks.some(t => t.id === song.id), !excludedTracks.has(song.id));
}
const context = { exports: {} };
vm.runInNewContext(ts.transpile(read('src/lib/html.ts'), { module: ts.ModuleKind.CommonJS }), context);
assert.equal(context.exports.escapeHtml('<img src=x onerror="alert(1)">&\''), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;&amp;&#39;');
const page = read('src/pages/marginalia/music/index.astro');
assert.ok(page.includes('const displayTracks = album.tracks;'));
assert.ok(!page.includes('album.tracks.filter('));
console.log('Media source coverage, series grouping, watch dates, poster mappings and HTML escaping: passed');
