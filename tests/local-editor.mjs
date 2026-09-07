// node tests/local-editor.mjs — real save and upload requests, isolated from the owner's files.
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createServer, request } from 'node:http';
import sharp from 'sharp';
import { documents, validate } from '../scripts/editor/schema.mjs';
import { localEditor } from '../scripts/editor/server.mjs';
const root = mkdtempSync(join(tmpdir(), 'homepage-editor-'));
mkdirSync(join(root, 'src/data'), { recursive: true });
for (const doc of Object.values(documents)) {
  const bytes = readFileSync(new URL('../src/data/' + doc.file, import.meta.url));
  validate(JSON.parse(bytes), doc.schema);
  writeFileSync(join(root, 'src/data', doc.file), bytes);
}
let middleware;
localEditor(root).configureServer({ middlewares: { use(fn) { middleware = fn; } }, moduleGraph: { invalidateAll() {} } });
const server = createServer((req, res) => middleware(req, res, () => { res.statusCode = 404; res.end(); }));
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const origin = 'http://127.0.0.1:' + server.address().port;
const read = async name => (await fetch(origin + '/__editor/data/' + name)).json();
const post = (path, data, headers = {}) => fetch(origin + '/__editor/' + path, {
  method: 'POST', headers: { Origin: origin, 'X-Homepage-Editor': '1', 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(data),
});
try {
  const curator = await fetch(origin + '/__editor/cinema');
  assert.equal(curator.status, 200);
  assert.ok((await curator.text()).includes('筛选影视'));
  for (const name of ['cinema', 'music', 'literature']) {
    for (const hidden of [true, false]) {
      const before = await read(name);
      const data = structuredClone(before.data);
      const items = name === 'cinema' ? data : data[name === 'music' ? 'albums' : 'books'];
      if (!items.length) items.push({ id: 'test-book', title: '测试书籍', author: '测试作者', review: { content: '保留书评' } });
      items[0].hidden = hidden;
      assert.equal((await post('data/' + name, { data, revision: before.revision })).status, 200);
      assert.deepEqual((await read(name)).data, data, 'Keep/delete must preserve other metadata, tracks, artists and essays');
    }
  }
  for (const name of Object.keys(documents)) assert.equal((await post('data/' + name, await read(name))).status, 200, name);
  const original = await read('cinema');
  const edited = structuredClone(original);
  edited.data[0].title = '测试 <文字> & 原样保存'; edited.data[0].rating = '4.5 / 5';
  let response = await post('data/cinema', edited);
  assert.equal(response.status, 200);
  assert.equal((await read('cinema')).data[0].rating, '4.5 / 5');
  assert.equal(JSON.parse(readFileSync(join(root, '.local-editor/backups/cinema-import.json')))[0].title, original.data[0].title);
  assert.equal((await post('data/cinema', original)).status, 409, 'stale save must never overwrite');
  let current = await read('cinema');
  current.data[0].rating = '8 / 5';
  assert.equal((await post('data/cinema', current)).status, 400);
  current = await read('cinema'); current.data[0].posterUrl = 'javascript:alert(1)';
  assert.equal((await post('data/cinema', current)).status, 400);
  assert.equal((await post('data/cinema', original, { Origin: 'https://untrusted.example' })).status, 403);
  const badHost = await new Promise(resolve => { const req = request(origin + '/__editor/data/cinema', { headers: { Host: 'untrusted.example:1234' } }, res => { res.resume(); resolve(res.statusCode); }); req.end(); });
  assert.equal(badHost, 403);
  assert.equal((await post('data/../../package.json', original)).status, 404);
  const music = await read('music'); music.data.artists = [];
  assert.equal((await post('data/music', music)).status, 400, 'orphaned albums must be rejected');
  const literature = await read('literature');
  literature.data.essays.push({ id: 'test-essay', title: 'Test', author: 'Owner', content: '<script>text</script>' });
  assert.equal((await post('data/literature', literature)).status, 200);
  assert.equal((await read('literature')).data.essays[0].content, '<script>text</script>');
  const png = await sharp({ create: { width: 400, height: 250, channels: 3, background: '#789065' } }).png().toBuffer();
  response = await fetch(origin + '/__editor/image', { method: 'POST', headers: { Origin: origin, 'X-Homepage-Editor': '1' }, body: png });
  assert.equal(response.status, 200);
  const image = await response.json();
  assert.equal(image.width, 400); assert.equal(image.height, 250);
  assert.equal((await sharp(readFileSync(join(root, 'public', image.thumbnailUrl))).metadata()).width, 320);
  response = await fetch(origin + '/__editor/image', { method: 'POST', headers: { Origin: origin, 'X-Homepage-Editor': '1' }, body: '<svg><script>alert(1)</script></svg>' });
  assert.equal(response.status, 400);
  console.log('Local editor: persisted edits, backup, conflicts, validation, same-origin access, artist relations and real image conversion passed.');
} finally {
  server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
  rmSync(root, { recursive: true, force: true });
}
