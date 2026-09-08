// Local-only publishing: Node, Git, gh and the existing Wrangler login.
import { existsSync, readFileSync, writeFileSync, mkdirSync, renameSync, rmSync, readdirSync, mkdtempSync, symlinkSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { homedir, tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { documents } from './editor/schema.mjs';
import { validateDocument } from './editor/server.mjs';

export const site = 'https://yiewang.github.io';
const assets = 'https://homepage-assets.mathtranslations.org';
const repo = 'YieWang/YieWang.github.io';
const account = '5e493d195f81f479d3b07ad39f3cc763';
const subject = 'Publish local editor changes';
export const contentFiles = [...Object.values(documents).map(d => 'src/data/' + d.file), 'src/data/media-curation.json'];
const routes = ['/', '/mathematics/', '/marginalia/', '/marginalia/screen/', '/marginalia/music/', '/marginalia/literature/', '/marginalia/photography/', '/marginalia/games/', '/marginalia/table-tennis/'];
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const pause = ms => new Promise(r => setTimeout(r, ms));
function run(command, args, cwd, extra = {}) {
  try {
    return execFileSync(command, args, { cwd, encoding: 'utf8', stdio: 'pipe', timeout: 180000, maxBuffer: 32 * 1024 * 1024,
      env: { ...process.env, HOMEPAGE_EDITOR: '0', WRANGLER_SEND_METRICS: 'false', CLOUDFLARE_ACCOUNT_ID: account }, ...extra });
  } catch (error) {
    throw Error(`${command} ${args.slice(0, 3).join(' ')} 执行失败。\n${String(error.stderr || error.stdout || error.message).slice(-3500)}`);
  }
}
const git = (root, ...args) => run('git', ['-c', 'core.quotepath=false', ...args], root).trim();
function atomic(file, bytes) {
  const temp = file + `.publish-${process.pid}.tmp`;
  writeFileSync(temp, bytes);
  renameSync(temp, file);
}

export function lock(root) {
  const file = join(root, '.local-editor/publish.lock');
  mkdirSync(dirname(file), { recursive: true });
  if (existsSync(file)) {
    const pid = Number(readFileSync(file, 'utf8'));
    if (!Number.isSafeInteger(pid) || pid < 1) throw Error('发布锁信息不完整，请确认没有其他发布窗口后移除 .local-editor/publish.lock。');
    try { process.kill(pid, 0); throw Error('另一个发布窗口还在运行，请等待它结束。'); }
    catch (error) { if (error.code !== 'ESRCH') throw error; }
    rmSync(file);
  }
  writeFileSync(file, String(process.pid), { flag: 'wx' });
  return () => rmSync(file, { force: true });
}

export function planImages(root, snapshots) {
  const replacements = new Map();
  const uploads = new Map();
  function add(url) {
    const match = /^\/local-uploads\/([a-f0-9]{20})(-thumb)?\.webp$/.exec(url);
    if (!match) throw Error(`本地图片路径无效：${url}`);
    const file = join(root, 'public', url);
    if (!existsSync(file)) throw Error(`找不到图片：${file}。请在编辑器重新上传并保存。`);
    const bytes = readFileSync(file);
    if (bytes.length > 20 * 1024 * 1024 || bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WEBP') throw Error(`图片不是有效的 WebP：${url}`);
    const sha = digest(bytes);
    const key = `images/local-editor/${sha}.webp`;
    uploads.set(key, { file, key, sha, bytes, url: `${assets}/${key}` });
    replacements.set(url, `${assets}/${key}`);
    const thumb = `/local-uploads/${match[1]}-thumb.webp`;
    if (!match[2] && existsSync(join(root, 'public', thumb)) && !replacements.has(thumb)) add(thumb);
  }
  function visit(value) {
    if (typeof value === 'string' && value.startsWith('/local-uploads/')) add(value);
    else if (value && typeof value === 'object') Object.values(value).forEach(visit);
  }
  for (const bytes of snapshots.values()) visit(JSON.parse(bytes));
  return { replacements, uploads: [...uploads.values()] };
}

export function replaceImages(bytes, replacements) {
  let changed = false;
  const data = JSON.parse(bytes, (_, value) => {
    if (typeof value === 'string' && replacements.has(value)) { changed = true; return replacements.get(value); }
    return value;
  });
  return changed ? Buffer.from(JSON.stringify(data, null, 2) + '\n') : bytes;
}

export function wrangler(root) {
  const cache = join(homedir(), '.npm/_npx');
  for (const name of existsSync(cache) ? readdirSync(cache) : []) {
    const pkg = join(cache, name, 'node_modules/wrangler/package.json');
    if (existsSync(pkg) && JSON.parse(readFileSync(pkg)).version === '4.129.0') return [process.execPath, join(dirname(pkg), 'bin/wrangler.js')];
  }
  return ['npx', '--yes', 'wrangler@4.129.0'];
}

export function uploadImages(root, uploads) {
  const [command, ...prefix] = wrangler(root);
  for (const [index, item] of uploads.entries()) {
    console.log(`上传并验证图片 ${index + 1}/${uploads.length}`);
    // Keys contain the full file hash; retrying cannot overwrite different artwork.
    try {
      run(command, [...prefix, 'r2', 'object', 'put', `homepage-media/${item.key}`, '--file', item.file,
        '--remote', '--content-type', 'image/webp', '--cache-control', 'public, max-age=31536000, immutable', '--force'], root);
    } catch (error) { throw Error(`${error.message}\n若提示登录或授权失效，请执行 npx --yes wrangler@4.129.0 login，完成浏览器登录后重试。`); }
    const actual = run('curl', ['--fail', '--silent', '--show-error', '--retry', '3', '--max-time', '45', item.url], root, { encoding: null });
    if (digest(actual) !== item.sha) throw Error(`图片上传后校验不一致：${item.url}。本地文件已保留，请稍后重试。`);
  }
}

export function pageEvidence(html) {
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1];
  if (!body) throw Error('页面缺少正文');
  return JSON.stringify({
    text: body.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<!--[^]*?-->/g, '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim(),
    images: [...body.matchAll(/<img\b[^>]*>/gi)].map(m => [...m[0].matchAll(/\b(src|srcset|alt)="([^"]*)"/g)].map(a => [a[1], a[2]])),
    details: [...body.matchAll(/\b(data-[\w-]+-json|props)="([^"]*)"/g)].map(m => [m[1], m[2]]),
    links: [...body.matchAll(/<a\b[^>]*\bhref="([^"]*)"/g)].map(m => m[1]),
  });
}

export function prepare(root, head, snapshots, images) {
  const temp = mkdtempSync(join(tmpdir(), 'homepage-publish-'));
  const release = join(temp, 'site');
  try {
    git(root, 'worktree', 'add', '--detach', release, head);
    symlinkSync(join(root, 'node_modules'), join(release, 'node_modules'), 'dir');
    for (const [file, bytes] of snapshots) writeFileSync(join(release, file), replaceImages(bytes, images.replacements));
    console.log('正在检查内容并构建发布预览…');
    for (const [name, doc] of Object.entries(documents)) validateDocument(name, JSON.parse(readFileSync(join(release, 'src/data', doc.file))));
    run(process.execPath, ['node_modules/astro/astro.js', 'build', '--site', site, '--base', '/'], release);
    console.log('正在运行发布检查…');
    run('npm', ['test'], release, { stdio: 'inherit' });
    const evidence = Object.fromEntries(routes.map(route => [route, pageEvidence(readFileSync(join(release, 'dist', route, 'index.html'), 'utf8'))]));
    const changes = contentFiles.filter(file => !readFileSync(join(release, file)).equals(Buffer.from(gitBytes(root, head, file))));
    const after = new Map(contentFiles.map(file => [file, readFileSync(join(release, file))]));
    const diff = run('git', ['--no-pager', 'diff', '--stat', '--', ...contentFiles], release);
    return { evidence, changes, after, diff };
  } finally {
    if (existsSync(release)) git(root, 'worktree', 'remove', '--force', release);
    rmSync(temp, { recursive: true, force: true });
  }
}
const gitBytes = (root, head, file) => run('git', ['show', `${head}:${file}`], root, { encoding: null });

export function commitContent(root, head, snapshots, after, changes) {
  if (git(root, 'rev-parse', 'HEAD') !== head) throw Error('检查期间 Git 版本发生变化，未提交。请重新运行发布。');
  for (const [file, bytes] of snapshots) if (!readFileSync(join(root, file)).equals(bytes)) throw Error(`检查期间 ${file} 被修改，未覆盖。请重新运行发布。`);
  const backup = join(root, '.local-editor/publish-backups', new Date().toISOString().replace(/[:.]/g, '-'));
  for (const file of changes) {
    mkdirSync(dirname(join(backup, file)), { recursive: true });
    writeFileSync(join(backup, file), snapshots.get(file));
    atomic(join(root, file), after.get(file));
  }
  git(root, 'commit', '--only', '-m', subject, '--', ...changes);
  const sha = git(root, 'rev-parse', 'HEAD');
  if (git(root, 'rev-parse', 'HEAD^') !== head || git(root, 'diff', '--name-only', head, sha).split('\n').some(f => !changes.includes(f))) throw Error('提交结果与检查版本不同，尚未推送。请查看 Git 状态。');
  for (const file of changes) if (!gitBytes(root, sha, file).equals(after.get(file))) throw Error(`提交后的 ${file} 与检查版本不同，尚未推送。`);
  return sha;
}

export async function waitForDeployment(root, sha, forceRun = false) {
  const runs = () => JSON.parse(run('gh', ['run', 'list', '--repo', repo, '--workflow', 'deploy.yml', '--commit', sha, '--limit', '5', '--json', 'databaseId,status,conclusion,url'], root));
  const previous = forceRun ? new Set(runs().map(r => r.databaseId)) : new Set();
  if (forceRun) run('gh', ['workflow', 'run', 'deploy.yml', '--repo', repo, '--ref', 'main'], root);
  let runId;
  for (let i = 0; i < 80; i++) {
    const match = runs().find(r => !previous.has(r.databaseId));
    if (match) {
      if (runId !== match.databaseId) { runId = match.databaseId; console.log(`部署进度：${match.url}`); }
      if (match.status === 'completed') {
        if (match.conclusion !== 'success') throw Error(`线上部署未成功（${match.conclusion}）：${match.url}。请查看失败步骤，修复后重新发布。`);
        return;
      }
    }
    if (i % 4 === 0) console.log('正在等待 GitHub 完成部署…');
    await pause(15000);
  }
  throw Error('等待部署超时；代码已推送，请稍后重新运行发布确认结果。');
}

export async function verifyPages(root, evidence) {
  for (let attempt = 0; attempt < 6; attempt++) {
    const mismatched = [];
    for (const [route, expected] of Object.entries(evidence)) {
      const html = run('curl', ['--fail', '--silent', '--show-error', '--retry', '2', '--max-time', '30', `${site}${route}?publish-check=${Date.now()}`], root);
      if (pageEvidence(html) !== expected) mismatched.push(route);
    }
    if (!mismatched.length) { console.log('线上 9 个页面的文字、顺序和图片地址已与本地发布版本核对。'); return; }
    console.log(`等待线上页面更新：${mismatched.join('、')}`);
    if (attempt < 5) await pause(15000);
  }
  throw Error('部署已完成，但线上内容尚未与本地一致。请稍后重新运行发布检查。');
}

export async function main(root, args) {
  if (args.some(a => !['--check', '--yes'].includes(a))) throw Error('用法：npm run publish；只检查：npm run publish:check');
  const check = args.includes('--check');
  const unlock = lock(root);
  const interrupt = () => { unlock(); console.error('\n发布已中断，本地内容保留。可重新运行发布。'); process.exit(130); };
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, interrupt);
  try {
    if (git(root, 'branch', '--show-current') !== 'main') throw Error('当前不在 main 分支，请先回到日常维护使用的 main 分支。');
    if (git(root, 'diff', '--name-only', '--diff-filter=U')) throw Error('存在尚未解决的 Git 冲突，停止发布。');
    if (git(root, 'diff', '--cached', '--name-only', '--', ...contentFiles)) throw Error('内容文件已有手动暂存的修改。请先执行 git restore --staged src/data，再重新发布；此命令不会丢失文件修改。');
    try {
      if (run('gh', ['api', `repos/${repo}`, '--jq', '.permissions.push'], root).trim() !== 'true') throw Error('当前账号没有仓库写入权限');
    } catch (error) { throw Error(`${error.message}\n请在终端执行 gh auth login --hostname github.com --git-protocol https --web，登录有此仓库权限的 GitHub 账号后重试。`); }
    git(root, 'fetch', 'origin', 'main');
    let head = git(root, 'rev-parse', 'HEAD');
    const remote = git(root, 'rev-parse', 'origin/main');
    const pending = head !== remote;
    const [behind] = git(root, 'rev-list', '--left-right', '--count', `${remote}...${head}`).split(/\s+/).map(Number);
    if (pending && !(behind === 0 && git(root, 'log', '--format=%s', `${remote}..${head}`).split('\n').every(s => s === subject) && git(root, 'diff', '--name-only', remote, head).split('\n').every(f => contentFiles.includes(f)))) {
      throw Error('本地 main 与远端版本不同，已停止，未覆盖任何修改。请先用 git status 查看状态，并同步或处理自己的代码提交后重试。');
    }
    const snapshots = new Map(contentFiles.map(file => [file, readFileSync(join(root, file))]));
    for (const [name, doc] of Object.entries(documents)) validateDocument(name, JSON.parse(snapshots.get('src/data/' + doc.file)));
    const images = planImages(root, snapshots);
    console.log(`本次包含编辑器中已保存的全部内容；待上传 ${images.uploads.length} 张图片（含缩略图）。`);
    const other = git(root, 'diff', '--name-only', 'HEAD').split('\n').filter(f => f && !contentFiles.includes(f));
    if (other.length) console.log(`另有程序文件修改，本次内容发布不包含：\n${other.join('\n')}`);
    if (!check) uploadImages(root, images.uploads);
    const prepared = prepare(root, head, snapshots, images);
    if (pending) console.log('本次会一并推送上次中断留下的内容提交。');
    console.log(prepared.diff || (pending ? '没有后续编辑，继续完成上次发布。' : '没有新的内容修改；可以重新部署当前版本。'));
    if (check) { console.log('检查通过。尚未上传图片、提交或推送。正式发布请运行 npm run publish。'); return; }
    if (!args.includes('--yes')) {
      const rl = createInterface({ input: process.stdin, output: process.stdout });
      try { if ((await rl.question('检查通过。输入“发布”并回车上线，直接回车取消：')).trim() !== '发布') { console.log('已取消，内容没有提交或推送。'); return; } }
      finally { rl.close(); }
    }
    if (prepared.changes.length) head = commitContent(root, head, snapshots, prepared.after, prepared.changes);
    if (git(root, 'rev-parse', 'HEAD') !== head) throw Error('Git 版本已变化，请重新运行发布。');
    git(root, 'push', 'origin', `${head}:refs/heads/main`);
    await waitForDeployment(root, head, !pending && !prepared.changes.length);
    await verifyPages(root, prepared.evidence);
    console.log(`发布成功：${site}/\n可以关闭这个窗口。继续编辑前，请刷新编辑器页面。`);
    if (git(root, 'diff', '--name-only', 'HEAD', '--', ...contentFiles)) console.log('本机还有后续编辑尚未发布；请再次运行发布入口。');
  } finally {
    for (const signal of ['SIGINT', 'SIGTERM']) process.off(signal, interrupt);
    unlock();
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  try { await main(root, process.argv.slice(2)); }
  catch (error) { console.error(`\n未完成发布：${error.message}\n本地内容和图片均保留；解决上述问题后可再次双击“发布主页.command”。`); process.exitCode = 1; }
}
