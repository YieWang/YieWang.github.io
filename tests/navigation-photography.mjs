// Run: node tests/navigation-photography.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const read = (path) => readFileSync(new URL(`../src/${path}`, import.meta.url), 'utf8');
const run = (source, context) => vm.runInContext(ts.transpile(source), context);
const between = (source, start, end) => source.slice(source.indexOf(start), source.indexOf(end));
const shell = read('components/SiteShell.astro');
let click;
let prevented;
const paths = [];
const navigation = vm.createContext({
  document: { addEventListener: (_, handler) => { click = handler; } },
  window: { location: { pathname: '/', hash: '' } },
  history: { pushState: (_, __, path) => paths.push(path) },
  activateSection: () => {},
});
run(between(shell, "  document.addEventListener('click'", '  // 监听浏览器前进/后退'), navigation);
for (const flags of [{}, { metaKey: true }, { ctrlKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { defaultPrevented: true }]) {
  prevented = false;
  paths.length = 0;
  click({
    button: 0,
    target: { closest: () => ({ target: '', getAttribute: (key) => key === 'href' ? '/mathematics' : null }) },
    preventDefault: () => { prevented = true; },
    ...flags,
  });
  const ordinaryClick = Object.keys(flags).length === 0;
  assert.equal(prevented, ordinaryClick);
  assert.deepEqual(paths, ordinaryClick ? ['/mathematics'] : []);
}

const pending = [];
const frames = [];
const layerA = { src: 'initial', style: { opacity: '1' } };
const layerB = { src: '', style: { opacity: '0' } };
const gallery = vm.createContext({
  layerA, layerB,
  Image: class { constructor() { pending.push(this); } },
  requestAnimationFrame: (callback) => frames.push(callback),
});
run("let activeLayer = 'A'; let imageRequest = 0;" + between(
  read('pages/marginalia/photography/index.astro'),
  '    function morphToImage(', '    function activatePhotoByIndex(',
), gallery);
const select = (url) => run(`morphToImage('${url}', '${url}');`, gallery);
const flush = () => { while (frames.length) frames.shift()(); };
const visible = () => layerA.style.opacity === '1' ? layerA.src : layerB.src;
select('older');
select('newer');
pending[1].onload();
pending[0].onload();
flush();
assert.equal(visible(), 'newer', 'Late old image must not overwrite latest selection');
select('superseded-before-frame');
pending[2].onload();
select('latest');
flush();
assert.equal(visible(), 'newer', 'An obsolete animation frame must not change the image');
pending[3].onload();
flush();
assert.equal(visible(), 'latest');

for (const [page, nextFunction] of [['elevation', 'updateElevation'], ['spatial', 'calculateCylinder']]) {
  const requests = [];
  const stageImg = { src: '', style: {} };
  const context = vm.createContext({ stageImg, stageLoc: null, stageCam: null,
    Image: class { constructor() { requests.push(this); } },
  });
  run("let currentId = '';" + between(read(`pages/marginalia/photography/${page}.astro`),
    '    function showPhoto(', `    function ${nextFunction}(`), context);
  run("showPhoto({ id: 'older', imageUrl: 'older' }); showPhoto({ id: 'newer', imageUrl: 'newer' });", context);
  requests[1].onload();
  requests[0].onload();
  assert.equal(stageImg.src, 'newer', `${page}: stale image must be ignored`);
}
console.log('Navigation modifiers and photography loading races: passed');
