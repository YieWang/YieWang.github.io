// node tests/publish.mjs — actual isolated Git commits; no online writes.
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import { planImages, replaceImages, digest, lock, commitContent, pageEvidence, waitForDeployment } from '../scripts/publish.mjs';
import { validateDocument } from '../scripts/editor/server.mjs';

const root = mkdtempSync(join(tmpdir(), 'homepage-publish-test-'));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: 'pipe' }).trim();
try {
  for (const [name, data] of Object.entries({ cinema: [], music: { artists: [], albums: [] }, literature: { books: [], essays: [] }, games: [], photography: [] })) validateDocument(name, data);
  assert.throws(() => validateDocument('games', [{ id: 'duplicate', title: 'A' }, { id: 'duplicate', title: 'B' }]), /标识重复/);
  mkdirSync(join(root, 'public/local-uploads'), { recursive: true });
  const name = '1234567890abcdefabcd';
  const image = await sharp({ create: { width: 80, height: 40, channels: 3, background: '#426b80' } }).webp().toBuffer();
  const thumb = await sharp(image).resize(20).webp().toBuffer();
  writeFileSync(join(root, `public/local-uploads/${name}.webp`), image);
  writeFileSync(join(root, `public/local-uploads/${name}-thumb.webp`), thumb);
  const local = `/local-uploads/${name}.webp`;
  const before = Buffer.from(JSON.stringify({ hidden: true, review: { content: '我的评论\n保留换行' }, seasons: [{ posterUrl: local }, { posterUrl: local }], photos: [{ imageUrl: local, thumbnailUrl: `/local-uploads/${name}-thumb.webp` }] }) + '\n');
  const plan = planImages(root, new Map([['data.json', before]]));
  assert.equal(plan.uploads.length, 2, 'nested, hidden and duplicate references include only the image and its thumbnail');
  assert.ok(plan.uploads.every(x => x.key.includes(digest(x.bytes))));
  const after = replaceImages(before, plan.replacements);
  assert.equal(JSON.parse(after).review.content, '我的评论\n保留换行');
  assert.equal(JSON.parse(after).hidden, true);
  assert.ok(!after.toString().includes('"/local-uploads/'));
  assert.deepEqual(replaceImages(after, plan.replacements), after, 'retry leaves remote references unchanged');
  assert.equal(planImages(root, new Map([['data.json', after]])).uploads.length, 0);
  assert.throws(() => planImages(root, new Map([['x', '"/local-uploads/../../secret.webp"']])), /路径无效/);
  assert.throws(() => planImages(root, new Map([['x', '"/local-uploads/aaaaaaaaaaaaaaaaaaaa.webp"']])), /找不到图片/);
  const unlock = lock(root);
  assert.throws(() => lock(root), /另一个发布窗口/);
  unlock();
  assert.ok(!existsSync(join(root, '.local-editor/publish.lock')));

  git('init', '-b', 'main');
  git('config', 'user.email', 'test@example.invalid'); git('config', 'user.name', 'Publisher test');
  writeFileSync(join(root, '.gitignore'), 'public/\n.local-editor/\n');
  mkdirSync(join(root, 'src/data'), { recursive: true });
  const file = 'src/data/games.json';
  writeFileSync(join(root, file), '{}\n'); writeFileSync(join(root, 'other.css'), 'original\n');
  git('add', '.'); git('commit', '-m', 'Initial');
  const head = git('rev-parse', 'HEAD');
  writeFileSync(join(root, 'other.css'), 'staged change\n'); git('add', 'other.css');
  writeFileSync(join(root, 'other.css'), 'newer unstaged change\n');
  writeFileSync(join(root, file), before);
  const snapshots = new Map([[file, before]]);
  const transformed = new Map([[file, after]]);
  writeFileSync(join(root, file), 'concurrent edit\n');
  assert.throws(() => commitContent(root, head, snapshots, transformed, [file]), /被修改/);
  assert.equal(readFileSync(join(root, file), 'utf8'), 'concurrent edit\n');
  writeFileSync(join(root, file), before);
  let sha = commitContent(root, head, snapshots, transformed, [file]);
  assert.equal(git('show', `${sha}:other.css`), 'original', 'unrelated staged content must not be committed');
  assert.equal(git('show', ':other.css'), 'staged change', 'unrelated index entry survives');
  assert.equal(readFileSync(join(root, 'other.css'), 'utf8'), 'newer unstaged change\n');
  assert.equal(git('show', `${sha}:${file}`), after.toString().trim());
  const backupDir = join(root, '.local-editor/publish-backups');
  assert.deepEqual(readFileSync(join(backupDir, readdirSync(backupDir)[0], file)), before);

  // A local bare remote exercises a failed push, retry, and non-forced remote conflict.
  const remote = join(root, '.local-editor/remote.git');
  git('init', '--bare', '-b', 'main', remote); git('remote', 'add', 'origin', join(root, 'missing.git'));
  assert.throws(() => git('push', 'origin', `${sha}:refs/heads/main`));
  assert.equal(git('rev-parse', 'HEAD'), sha, 'failed push retains the commit for retry');
  const next = JSON.parse(after); next.review.content = '重试前补写的内容';
  const nextBytes = Buffer.from(JSON.stringify(next) + '\n');
  writeFileSync(join(root, file), nextBytes);
  sha = commitContent(root, sha, new Map([[file, nextBytes]]), new Map([[file, nextBytes]]), [file]);
  git('remote', 'set-url', 'origin', remote); git('push', 'origin', `${sha}:refs/heads/main`);
  assert.ok(git('ls-remote', 'origin', 'refs/heads/main').startsWith(sha));
  assert.equal(JSON.parse(git('--git-dir', remote, 'show', `main:${file}`)).review.content, '重试前补写的内容', 'retry must also publish subsequent saved edits');
  const newer = git('commit-tree', `${sha}^{tree}`, '-p', sha, '-m', 'Another publisher');
  git('push', 'origin', `${newer}:refs/heads/main`);
  assert.throws(() => git('push', 'origin', `${sha}:refs/heads/main`), 'a newer remote must never be force-overwritten');
  assert.ok(git('ls-remote', 'origin', 'refs/heads/main').startsWith(newer));

  const html = '<body><h1>标题</h1><img src="cover.webp" alt="封面"><script>random()</script></body>';
  assert.equal(pageEvidence(html), pageEvidence(html.replace('random()', 'other()')));
  assert.notEqual(pageEvidence(html), pageEvidence(html.replace('标题', '旧标题')));
  assert.notEqual(pageEvidence(html), pageEvidence(html.replace('cover.webp', 'old.webp')));
  assert.notEqual(pageEvidence(html.replace('<h1>', '<h1 data-book-json="old-review">')), pageEvidence(html.replace('<h1>', '<h1 data-book-json="new-review">')), 'modal details must be verified even when not visible until clicked');
  const bin = join(root, '.local-editor/bin'); mkdirSync(bin);
  writeFileSync(join(bin, 'gh'), `#!${process.execPath}
import fs from 'node:fs';
const args = process.argv.slice(2);
if (args[0] === 'workflow') fs.writeFileSync('dispatched', 'yes');
else {
  if (!args.includes('--commit') || !args.includes('expected-sha')) process.exit(2);
  console.log(JSON.stringify([{ databaseId: fs.existsSync('dispatched') ? 2 : 1, status: 'completed', conclusion: fs.existsSync('fail-deployment') ? 'failure' : 'success', url: 'https://example.invalid/deployment' }]));
}
`, { mode: 0o755 });
  const oldPath = process.env.PATH;
  process.env.PATH = bin + ':' + oldPath;
  try {
    await waitForDeployment(root, 'expected-sha', true);
    assert.ok(existsSync(join(root, 'dispatched')), 'no-change retry dispatches and tracks a new run');
    writeFileSync(join(root, 'fail-deployment'), 'yes');
    await assert.rejects(waitForDeployment(root, 'expected-sha'), /线上部署未成功/);
  } finally { process.env.PATH = oldPath; }
  console.log('Publisher: nested images, thumbnails, retries, path validation, locking, concurrent edits, backups, scoped Git commit/push and live-page evidence passed.');
} finally { rmSync(root, { recursive: true, force: true }); }
