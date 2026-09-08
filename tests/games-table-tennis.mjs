// Run after npm run build: node tests/games-table-tennis.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadData } from './load-data.mjs';

const { escapeHtml } = loadData('../lib/html');

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const games = JSON.parse(read('src/data/games.json'));
const visibleGames = games.filter(game => !game.hidden);
const interestText = JSON.parse(read('src/data/interest-text.json'));
const gallery = read('dist/marginalia/games/index.html');
const tennis = read('dist/marginalia/table-tennis/index.html');
const steamIds = games.filter(game => game.appid !== null).map(game => game.appid);
assert.equal(new Set(steamIds).size, steamIds.length);
assert.equal(new Set(games.map(game => game.title)).size, games.length);
assert.equal(games[games.findIndex(game => game.appid === 730) + 1].title, 'League of Legends');
for (const game of games) {
  if (game.appid !== null && ![736260,632470].includes(game.appid)) assert.ok(game.playtimeMinutes > 60, `${game.title} must exceed one hour`);
  assert.equal(new URL(game.cover).origin, 'https://homepage-assets.mathtranslations.org');
  assert.ok(new URL(game.cover).pathname.startsWith('/images/games/'));
  assert.ok(!/\p{Script=Han}/u.test(game.title));
}
const renderedGames = [...gallery.matchAll(/<article\b[^>]*>([\s\S]*?)<\/article>/g)].map(match => match[1]);
assert.equal(renderedGames.length, visibleGames.length);
visibleGames.forEach((game, index) => {
  assert.ok(renderedGames[index].includes(escapeHtml(game.title)));
  assert.ok(renderedGames[index].includes(escapeHtml(game.cover)));
  if (game.note) assert.ok(renderedGames[index].includes(escapeHtml(game.note)), 'Saved notes must remain visible');
});
assert.ok(gallery.includes(escapeHtml(interestText.gamesInvitation)));
const tennisText = tennis.match(/<section\b[\s\S]*?<\/section>/)[0].replace(/<[^>]*>/g, '').replace(/\s+/g, '');
assert.equal(tennisText, ('Table Tennis' + escapeHtml(interestText.tableTennis + interestText.tableTennisInvitation)).replace(/\s+/g, ''));
for (const page of [gallery, tennis]) {
  assert.ok(!/Under curation|整理收录中|Breadcrumb|←/.test(page));
  assert.equal((page.match(/<h1\b/g) || []).length, 1);
  assert.match(page, /href="mailto:/);
}
console.log('Game selection, assets, notes and table tennis page: passed');
