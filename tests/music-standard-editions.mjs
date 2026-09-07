// node tests/music-standard-editions.mjs
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
const json = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const music = json('src/data/music-import.json');
const rules = json('src/data/media-curation.json');
const audit = json('reports/music-standard-editions-audit.json');
const tracks = music.albums.flatMap(a => a.tracks);
const ids = new Set(tracks.map(t => t.id));
const excluded = new Set(rules.excludedTracks.map(t => t.id));
assert.equal(ids.size, tracks.length);
assert.equal(ids.size + excluded.size, 965);
assert.ok(tracks.every(t => !excluded.has(t.id)));
assert.equal(new Set(music.albums.map(a => a.id)).size, music.albums.length);
const catalogSongs = new Set();
const isrcs = new Set();
const families = new Set();
const forbidden = /deluxe|expanded|remaster|anniversary|bonus|drowning shadows|庆功|慶功|纪念盘|紀念盤|sound\s*track|原声带|原聲帶|精选|精選|合辑|合輯|greatest hits|Taylor[’']s Version/i;
for (const album of music.albums) {
  assert.ok(['studio', 'single', 'ep'].includes(album.releaseType));
  assert.ok(!forbidden.test(album.title), album.title);
  const artist = music.artists.find(a => a.id === album.artistId);
  assert.ok(artist?.albumIds.includes(album.id));
  assert.ok(album.tracks.length);
  const proof = audit.albums[album.id];
  assert.equal(Number(album.year), proof.originalReleaseYear, `Original release year: ${album.title}`);
  assert.match(proof.originalReleaseYearSource, /^https:\/\//);
  assert.equal(proof.catalogAlbumId, album.catalogAlbumId);
  assert.equal(proof.title, album.title);
  assert.match(proof.standardEditionSource, /^https:\/\//);
  const family = `${album.artistId}|${proof.familyKey}`;
  assert.ok(!families.has(family), `Duplicate album edition: ${album.title}`);
  families.add(family);
  for (const track of album.tracks) {
    const canonical = proof.tracks.find(t => t.id === track.catalogSongId);
    assert.ok(canonical, `${album.title}: ${track.title}`);
    assert.equal(track.title, canonical.displayTitle || canonical.title);
    assert.equal(track.trackNo, canonical.track);
    assert.equal(track.discNo, canonical.disc);
    assert.ok(!catalogSongs.has(track.catalogSongId), `Repeated catalog song: ${track.title}`);
    catalogSongs.add(track.catalogSongId);
    if (track.isrc) {
      assert.ok(!isrcs.has(track.isrc), `Repeated ISRC: ${track.title}`);
      isrcs.add(track.isrc);
    }
    if (album.releaseType !== 'studio') {
      assert.ok(!audit.studioSongKeys[album.artistId]?.includes(canonical.key), `Standalone song already on studio album: ${track.title}`);
    }
  }
}
for (const artist of music.artists) {
  assert.ok(artist.albumIds.length);
  const songs = music.albums.filter(a => a.artistId === artist.id).flatMap(a => a.tracks);
  const names = new Set(songs.map(t => t.title.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')));
  assert.ok(names.size >= 2, `Artist below two-song minimum: ${artist.name}`);
  assert.deepEqual([...artist.albumIds].sort(), music.albums.filter(a => a.artistId === artist.id).map(a => a.id).sort());
}
assert.ok(!music.artists.some(a => ['Soundtracks', 'Compilations', '纯音乐', '艾薇儿', 'Abel Tesfaye'].includes(a.name)));
assert.deepEqual(music.albums.filter(a => a.artistName === 'Adele').map(a => a.title).sort(), ['19', '21', '25', '30']);
assert.ok(music.albums.some(a => a.artistName === 'Queen' && a.title === 'Made In Heaven'));
assert.equal(music.albums.find(a => a.artistName === 'Beyond' && a.title === '命运派对').year, 1990);
assert.ok(tracks.some(t => t.id === 'local-FB841F0CFE0C61D1' && t.title === '妥协'));
assert.ok(music.albums.some(a => a.title === 'JORDI' && a.tracks.some(t => t.title === 'Memories' && t.isrc === 'USUM71913350')));
assert.ok(!tracks.some(t => /Nipsey Hussle/.test(t.title)));
for (const row of audit.decisions) assert.equal(ids.has(row.id), row.status === 'collected');
assert.equal(new Set(audit.decisions.map(r => r.id)).size, audit.decisions.length);
assert.ok(audit.heldAlbums.flatMap(a => a.tracks).every(t => !ids.has(t.id)));
if (existsSync(new URL('../Homepage-Assets/media/apple-library-songs.json', import.meta.url))) {
  for (const song of json('Homepage-Assets/media/apple-library-songs.json')) {
    assert.equal(ids.has(song.id), !excluded.has(song.id), `Unaccounted source song: ${song.id}`);
  }
}
console.log(`Standard editions: ${music.artists.length} artists, ${music.albums.length} releases, ${tracks.length} unique tracks; provenance, exclusions and standalone overlap passed.`);
