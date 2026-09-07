// node tests/local-editor-controls.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { documents, matchesSearch } from '../scripts/editor/schema.mjs';

const ui = readFileSync(new URL('../scripts/editor/ui.js', import.meta.url), 'utf8');
const moveStart = ui.indexOf('  const move = (from, to)');
const moveSource = ui.slice(moveStart, ui.indexOf('  const render = () =>', moveStart));
const items = ['A', 'B', 'C', 'D'];
let changes = 0;
const move = vm.runInNewContext(moveSource + '\nmove;', {
  currentList: { items }, changed: () => changes++, render() {},
});
move(0, 3);
assert.deepEqual(items, ['B', 'C', 'D', 'A']);
move(3, 1);
assert.deepEqual(items, ['B', 'A', 'C', 'D']);
move(0, -1); move(3, 4); move(1, 1);
assert.equal(changes, 2);

const cinema = documents.cinema.schema.fields;
assert.ok(!('summary' in cinema) && !('summary' in cinema.seasons.fields));
assert.ok(!('rating' in documents.music.schema.fields.albums.fields));
assert.ok(!('listenedDate' in documents.music.schema.fields.albums.fields));
assert.ok(documents.cinema.schema.primary.includes('review'));
assert.ok(!documents.cinema.schema.primary.includes('director'));
assert.ok(documents.games.schema.primary.includes('note'));
assert.ok(!documents.games.schema.primary.includes('url'));
const film = { title: 'April Story', chineseTitle: '四月物语', director: 'Shunji Iwai', hidden: true,
  posterUrl: 'https://example.com/poster-secret', review: { content: '武藏野的春天' } };
assert.ok(matchesSearch(film, documents.cinema.schema, '四月物语'));
assert.ok(matchesSearch(film, documents.cinema.schema, 'ＡＰＲＩＬ iwai'));
assert.ok(matchesSearch(film, documents.cinema.schema, '武藏野'));
assert.ok(!matchesSearch(film, documents.cinema.schema, 'poster-secret'));
assert.ok(!matchesSearch(film, documents.cinema.schema, '   '));
assert.ok(!matchesSearch(film, documents.cinema.schema, 'April missing'));
assert.ok(matchesSearch({ title: 'Track' }, documents.music.schema.fields.albums.fields.tracks, 'Adele Track', 'Adele / Album / 曲目'));
assert.ok(!('rating' in cinema.review.fields));
assert.ok(!('stillUrl' in cinema) && !('format' in cinema));
assert.equal(cinema.watchedEntries.advanced, true);
assert.equal(documents.music.schema.fields.albums.reorder, false);
assert.equal(documents.music.schema.fields.artists.reorder, false);
assert.equal(documents.literature.schema.fields.books.reorder, false);
assert.notEqual(documents.games.schema.reorder, false);

// Run the actual save handler with a successful endpoint and an existing edit-mode preference.
const session = new Map([['homepage-editing', '1']]);
let reloaded = false;
const saveSource = ui.slice(ui.indexOf('async function save()'), ui.indexOf('\nfunction findRecord'));
const save = vm.runInNewContext(saveSource + '\nsave;', {
  busy: false, dirty: true, data: [], state: { revision: 'current' }, docName: 'games',
  content: { querySelector: () => null }, dialog: { open: false }, toolbar: {}, status: {},
  document: { querySelector: () => null, getElementById: () => null },
  sessionStorage: { setItem: (key, value) => session.set(key, value) },
  location: { pathname: '/marginalia/games', reload: () => { reloaded = true; } },
  api: async () => ({}), showError: error => { throw error; },
});
await save();
assert.equal(reloaded, true);
assert.equal(session.get('homepage-editing'), '1');
const locateSource = ui.slice(ui.indexOf('function locateRecord('), ui.indexOf('\nfunction manage('));
let scrolled = false, closed = false;
const target = {
  querySelector: () => ({ getAttribute: () => '/game' }), closest: () => null,
  scrollIntoView: options => { scrolled = options.block === 'center'; },
  getAttribute: () => null, focus() {}, addEventListener() {},
  classList: { add() {}, remove() {} },
};
const recordItem = { url: '/game' };
const errors = {};
const locate = vm.runInNewContext(locateSource + '\nlocateRecord;', {
  docName: 'games', get: () => recordItem, errorBox: errors, close: () => { closed = true; },
  document: { querySelectorAll: () => [target] }, setTimeout() {},
});
locate({ item: recordItem, path: [0] });
assert.ok(scrolled && closed);
scrolled = false; closed = false; recordItem.hidden = true;
locate({ item: recordItem, path: [0] });
assert.ok(!scrolled && !closed && errors.textContent.includes('已隐藏'));
const outsideSource = ui.slice(ui.indexOf('const outsidePanel ='), ui.indexOf('\nlet pressedOutside'));
const outside = vm.runInNewContext(outsideSource + '\noutsidePanel;', {
  dialog: { getBoundingClientRect: () => ({ left: 900, right: 1390, top: 12, bottom: 800 }) },
});
assert.equal(outside({ clientX: 500, clientY: 300 }), true);
assert.equal(outside({ clientX: 1000, clientY: 300 }), false);
console.log('Editor controls: stable moves, bounds, field cleanup, automatic sorting and edit-mode persistence passed.');
