// node tests/local-editor-controls.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import { documents } from '../scripts/editor/schema.mjs';

const ui = readFileSync(new URL('../scripts/editor/ui.js', import.meta.url), 'utf8');
const moveSource = ui.slice(ui.indexOf('  const move = (from, to)'), ui.indexOf('  const render = () =>'));
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
console.log('Editor controls: stable moves, bounds, field cleanup, automatic sorting and edit-mode persistence passed.');
