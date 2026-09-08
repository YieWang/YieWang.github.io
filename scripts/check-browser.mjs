// npm run build && npm run test:browser [-- suite-name ...]
import { execFileSync, spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { setTimeout as delay } from 'node:timers/promises';

const root = fileURLToPath(new URL('../', import.meta.url));
const routes = {
  'photo-keyboard': '/marginalia/photography/',
  'modal-interactions': '/',
  cinema: '/marginalia/screen/',
  'cinema-category-refresh': '/marginalia/screen/',
  'photo-wheel': '/marginalia/photography/',
  'photo-wheel-text': '/marginalia/photography/',
  'photography-mobile': '/marginalia/photography/',
  'music-navigation': '/marginalia/music/',
  'music-vinyl-spacing': '/marginalia/music/',
  'mobile-layout': '/',
  'fixed-navigation': '/',
  'back-to-top': '/',
  'marginalia-centering': '/marginalia/',
  'marginalia-preview': '/marginalia/',
  'photo-spread': '/marginalia/',
};
const suites = process.argv.length > 2 ? process.argv.slice(2) : Object.keys(routes);
for (const suite of suites) if (!(suite in routes)) throw Error(`Unknown browser suite: ${suite}`);

const socket = createServer();
await new Promise(resolve => socket.listen(0, '127.0.0.1', resolve));
const port = socket.address().port;
await new Promise(resolve => socket.close(resolve));
const origin = `http://127.0.0.1:${port}`;
const temporary = mkdtempSync(join(tmpdir(), 'homepage-browser-'));
const session = `homepage-check-${process.pid}`;
const cli = (...args) => {
  const output = execFileSync(join(root, 'node_modules/.bin/playwright-cli'), [`-s=${session}`, ...args], {
    cwd: root, encoding: 'utf8', timeout: 180_000, maxBuffer: 4 * 1024 * 1024,
  });
  if (output.includes('### Error')) throw Error(output);
  return output;
};
const preview = spawn(process.execPath, ['node_modules/astro/astro.js', 'preview', '--host', '127.0.0.1', '--port', String(port)], { cwd: root, stdio: 'inherit' });
let cleaned = false;
const cleanup = () => {
  if (cleaned) return;
  cleaned = true;
  try { cli('close'); } finally {
    preview.kill('SIGTERM');
    rmSync(temporary, { recursive: true, force: true });
  }
};
for (const [signal, code] of [['SIGINT', 130], ['SIGTERM', 143]]) {
  process.once(signal, () => { try { cleanup(); } finally { process.exit(code); } });
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (preview.exitCode !== null) throw Error('Preview exited before becoming ready');
    ready = await fetch(origin, { signal: AbortSignal.timeout(1000) }).then(res => res.ok).catch(() => false);
    if (ready) break;
    await delay(250);
  }
  if (!ready) throw Error('Preview did not become ready');
  mkdirSync(join(root, 'output/playwright'), { recursive: true });
  cli('open', origin);
  for (const suite of suites) {
    const source = readFileSync(join(root, `tests/${suite}.browser.js`), 'utf8');
    const file = join(temporary, `${suite}.js`);
    writeFileSync(file, `async fixture => {
      const context = await fixture.context().browser().newContext({ viewport: { width: 1440, height: 900 } });
      try {
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await page.goto(${JSON.stringify(origin + routes[suite])});
        const result = await (\n${source}\n)(page);
        if (errors.length) throw Error(errors.join('\\n'));
        return result;
      } finally { await context.close(); }
    }`);
    const output = cli('run-code', '--filename', file);
    writeFileSync(join(root, `output/playwright/${suite}.log`), output);
    console.log(`${suite}: passed`);
  }
} finally {
  cleanup();
}
