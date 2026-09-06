// Run after npm run build: node tests/games-table-tennis.mjs
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const games = JSON.parse(read('src/data/games.json'));
const gallery = read('dist/marginalia/games/index.html');
const tennis = read('dist/marginalia/table-tennis/index.html');
// Supplied snapshot above one hour, with the owner's explicit additions and removals.
const expectedSteamIds = [730,250900,1623730,1568590,646570,1057090,289070,105600,1174180,2001120,1426210,2379780,1145360,413150,1061090,1850570,240720,206440,813230,312530,787480,814380,638230,271590,1483870,1238840,1222140,1238810,477160,292030,753640,973810,632470,736260];
assert.deepEqual(new Set(games.filter(game => game.appid !== null).map(game => game.appid)), new Set(expectedSteamIds));
assert.equal(new Set(games.map(game => game.title)).size, games.length);
assert.equal(games[games.findIndex(game => game.appid === 730) + 1].title, 'League of Legends');
for (const game of games) {
  if (game.appid !== null && ![736260,632470].includes(game.appid)) assert.ok(game.playtimeMinutes > 60, `${game.title} must exceed one hour`);
  assert.ok(existsSync(new URL(`../public${game.cover}`, import.meta.url)), game.cover);
  assert.ok(gallery.includes(game.cover));
  assert.equal(game.note, '');
  assert.ok(!/\p{Script=Han}/u.test(game.title));
}
for (const title of ['League of Legends', 'Baba Is You', 'Disco Elysium', 'The Legend of Zelda: Breath of the Wild', 'The Legend of Zelda: Tears of the Kingdom', 'Super Smash Bros. Ultimate']) assert.ok(gallery.includes(title));
assert.equal((gallery.match(/<article\b/g) || []).length, 38);
assert.match(gallery, /class="invitation\b[^"]*"[^>]*>\s*Let’s have a game\.\s*<\/a>/);
assert.ok(!/\p{Script=Han}/u.test(gallery.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '')));
const tennisText = tennis.match(/<section\b[\s\S]*?<\/section>/)[0].replace(/<[^>]*>/g, '').replace(/\s+/g, '');
assert.equal(tennisText, 'TableTennis我从小学三年级开始打乒乓球，一直打的都是野球，右手直拍横打，欢迎和我约球。');
for (const page of [gallery, tennis]) {
  assert.ok(!/Under curation|整理收录中|Breadcrumb|←/.test(page));
  assert.equal((page.match(/<h1\b/g) || []).length, 1);
  assert.match(page, /href="mailto:/);
}
console.log('Game selection, assets, notes and table tennis page: passed');
