import { readFileSync, writeFileSync, mkdirSync, renameSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { documents, validate } from './schema.mjs';

const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const reply = (res, code, data) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  res.end(JSON.stringify(data));
};
async function body(req, limit) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > limit) throw Error('内容太大；图片请控制在 20 MB 以内');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
function safeTree(value) {
  if (!value || typeof value !== 'object') return;
  for (const key of Object.keys(value)) {
    if (['__proto__', 'constructor', 'prototype'].includes(key)) throw Error('内容字段无效');
    safeTree(value[key]);
  }
}
function uniqueIds(value, ids = new Set()) {
  if (!value || typeof value !== 'object') return;
  if (value.id !== undefined) {
    if (typeof value.id !== 'string' || !value.id || ids.has(value.id)) throw Error('条目标识重复或无效，请重新打开编辑器');
    ids.add(value.id);
  }
  Object.values(value).forEach(child => uniqueIds(child, ids));
}
// Synchronous compare + atomic rename prevents overlapping saves from silently overwriting one another.
export function saveDocument(root, name, revision, data) {
  const doc = documents[name];
  if (!doc) throw Error('未知栏目');
  const file = resolve(root, 'src/data', doc.file);
  const before = readFileSync(file);
  if (hash(before) !== revision) return { conflict: true };
  safeTree(data);
  validate(data, doc.schema);
  uniqueIds(data);
  if (name === 'music') {
    const artists = new Map(data.artists.map(a => [a.id, a]));
    for (const album of data.albums) {
      if (!artists.has(album.artistId)) throw Error('专辑必须选择已有音乐人；删除音乐人前请先移动或删除其专辑');
    }
    for (const artist of data.artists) artist.albumIds = data.albums.filter(a => a.artistId === artist.id).map(a => a.id);
  }
  const after = JSON.stringify(data, null, 2) + '\n';
  const backup = resolve(root, '.local-editor/backups', doc.file);
  mkdirSync(dirname(backup), { recursive: true });
  writeFileSync(backup, before);
  const temp = `${file}.${randomUUID()}.tmp`;
  writeFileSync(temp, after);
  renameSync(temp, file);
  return { revision: hash(after) };
}

export function localEditor(root = process.cwd()) {
  return {
    name: 'homepage-local-editor',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url || '').split('?')[0];
        // Newly uploaded files must be available immediately, before Vite refreshes its public-file index.
        if (req.method === 'GET' && /^\/local-uploads\/[a-f0-9]{20}(?:-thumb)?\.webp$/.test(path)) {
          const file = resolve(root, 'public' + path);
          if (existsSync(file)) { res.writeHead(200, { 'Content-Type': 'image/webp' }); return res.end(readFileSync(file)); }
        }
        if (!path.startsWith('/__editor/')) return next();
        const host = req.headers.host;
        if (!/^(127\.0\.0\.1|localhost):\d+$/.test(host || '') || !['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress)) {
          return reply(res, 403, { error: '编辑器仅限本机使用' });
        }
        if (req.method !== 'GET' && (req.headers.origin !== `http://${host}` || req.headers['x-homepage-editor'] !== '1')) {
          return reply(res, 403, { error: '请从本地编辑页面保存' });
        }
        try {
          const assets = { '/__editor/cinema': ['cinema.html', 'text/html'], '/__editor/ui.js': ['ui.js', 'text/javascript'], '/__editor/schema.js': ['schema.mjs', 'text/javascript'], '/__editor/style.css': ['style.css', 'text/css'] };
          if (req.method === 'GET' && assets[path]) {
            const [file, type] = assets[path];
            res.writeHead(200, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' });
            return res.end(readFileSync(new URL(file, import.meta.url)));
          }
          if (req.method === 'GET' && path === '/__editor/status') return reply(res, 200, { editor: true });
          if (req.method === 'POST' && path === '/__editor/image') {
            const bytes = await body(req, 20 * 1024 * 1024);
            const input = sharp(bytes, { limitInputPixels: 60000000, animated: false });
            const meta = await input.metadata();
            if (!['jpeg', 'png', 'webp', 'avif', 'heif', 'gif', 'tiff'].includes(meta.format)) throw Error('请选择 JPG、PNG、WebP、AVIF、GIF 或 TIFF 图片');
            const name = hash(bytes).slice(0, 20);
            const originals = resolve(root, '.local-editor/originals');
            const output = resolve(root, 'public/local-uploads');
            mkdirSync(originals, { recursive: true });
            mkdirSync(output, { recursive: true });
            writeFileSync(resolve(originals, `${name}.${meta.format}`), bytes);
            const large = await input.clone().rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 88 }).toBuffer({ resolveWithObject: true });
            const thumb = await input.clone().rotate().resize({ width: 320, height: 320, fit: 'inside', withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
            writeFileSync(resolve(output, `${name}.webp`), large.data);
            writeFileSync(resolve(output, `${name}-thumb.webp`), thumb);
            return reply(res, 200, { url: `/local-uploads/${name}.webp`, thumbnailUrl: `/local-uploads/${name}-thumb.webp`, width: large.info.width, height: large.info.height });
          }
          const name = path.slice('/__editor/data/'.length);
          if (!path.startsWith('/__editor/data/') || !Object.hasOwn(documents, name)) return reply(res, 404, { error: '未找到编辑内容' });
          const doc = documents[name];
          if (req.method === 'GET') {
            const bytes = readFileSync(resolve(root, 'src/data', doc.file));
            return reply(res, 200, { data: JSON.parse(bytes), revision: hash(bytes), schema: doc.schema, label: doc.label });
          }
          if (req.method === 'POST') {
            const input = JSON.parse((await body(req, 8 * 1024 * 1024)).toString());
            const result = saveDocument(root, name, input.revision, input.data);
            if (result.conflict) return reply(res, 409, { error: '文件已在另一个窗口或编辑器中修改。当前填写内容仍保留；请先复制需要保留的文字，再重新打开页面。' });
            server.moduleGraph.invalidateAll();
            return reply(res, 200, result);
          }
          return reply(res, 405, { error: '不支持此操作' });
        } catch (error) {
          return reply(res, 400, { error: error.message || '保存失败，填写内容仍保留' });
        }
      });
    },
  };
}
