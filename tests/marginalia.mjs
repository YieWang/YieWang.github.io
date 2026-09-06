// Run: node tests/marginalia.mjs
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/SiteShell.astro', import.meta.url), 'utf8');
const ids = ['photography', 'cinema', 'literature', 'music', 'table-tennis', 'games'];
const element = (id) => {
  const attributes = new Map();
  const classes = new Set();
  return {
    id, dataset: {}, inert: true, layouts: [],
    get offsetWidth() { this.layouts.push(classes.has('is-expanded')); return 400; },
    setAttribute(key, value) { attributes.set(key, value); },
    getAttribute(key) { return attributes.get(key); },
    removeAttribute(key) { attributes.delete(key); },
    toggleAttribute(key, value) { if (value) attributes.set(key, ''); else { attributes.delete(key); if (key === 'data-active') delete this.dataset.active; } },
    classList: { add: (...keys) => keys.forEach(key => classes.add(key)), remove: (...keys) => keys.forEach(key => classes.delete(key)), toggle(key, value) { if (value) classes.add(key); else classes.delete(key); }, contains: key => classes.has(key) },
  };
};
const panels = ids.map(id => element(`stage-panel-${id}`));
const triggers = ids.map(id => { const e = element(id); e.setAttribute('data-stage-id', id); return e; });
const handlers = {};
let touch = false;
const section = element('marginalia-section');
section.classList.add('active-section');
const context = vm.createContext({
  document: {
    getElementById: id => id === section.id ? section : panels.find(p => p.id === id),
    querySelectorAll: selector => selector === '.stage-panel' ? panels : triggers,
    addEventListener: (name, handler) => { handlers[name] = handler; },
  },
  window: { matchMedia: () => ({ matches: touch }) },
  PointerEvent: class {},
});
const start = source.indexOf('  function setStage(');
vm.runInContext(ts.transpile(source.slice(start, source.indexOf('  const stage = document.querySelector<HTMLElement>', start))), context);
const select = id => vm.runInContext(`setStage(${JSON.stringify(id)})`, context);

// Fast selection and duplicate focus/hover events must leave only the latest panel usable.
for (const id of [...ids, 'cinema', 'music', 'literature', 'cinema', 'literature', 'cinema', 'cinema']) select(id);
assert.equal(panels.filter(p => !p.inert).length, 1);
assert.equal(panels.find(p => !p.inert).id, 'stage-panel-cinema');
assert.equal(triggers.find(t => t.getAttribute('aria-current') === 'true').id, 'cinema');
for (const panel of panels) {
  assert.equal(panel.getAttribute('aria-hidden'), String(panel.inert));
  assert.equal(panel.classList.contains('is-expanded'), !panel.inert);
}
select('invalid');
assert.equal(panels.find(p => !p.inert).id, 'stage-panel-cinema');

// Touch selects a preview; normal and modified link clicks keep native navigation.
for (const [isTouch, modifiers, expected] of [[true, {}, true], [false, {}, false], [true, { metaKey: true }, false], [true, { ctrlKey: true }, false]]) {
  touch = isTouch;
  let prevented = false;
  handlers.click({ button: 0, ...modifiers, target: { closest: () => ({ dataset: { stageId: 'games' } }) }, preventDefault() { prevented = true; } });
  assert.equal(prevented, expected);
}
assert.equal(panels.find(p => !p.inert).id, 'stage-panel-games');

// Re-entering from the already expanded state must commit animation removal before replay.
const enter = () => vm.runInContext('enterMarginalia()', context);
enter();
assert.equal(panels[0].classList.contains('is-expanded'), true);
assert.deepEqual(panels[0].layouts, [false]);
enter();
assert.deepEqual(panels[0].layouts, [false, false]);
select('cinema');
assert.equal(panels[0].classList.contains('is-expanded'), false);
enter();
assert.equal(panels.filter(p => !p.inert).length, 1);
assert.deepEqual(panels[0].layouts, [false, false, false]);

// Exercise the actual navigation function, including its delayed section reveal.
const home = element('home-section');
const sections = [home, section];
let reveal;
Object.assign(context, {
  pageTitles: { home: 'Home', marginalia: 'Marginalia' }, transitionTimer: null,
  setTimeout: callback => { reveal = callback; return 1; },
  clearTimeout: () => { reveal = null; },
  updateScrollState: () => {}, Event: class {},
});
context.window.scrollTo = () => {};
context.window.dispatchEvent = () => {};
const findPanel = context.document.getElementById;
context.document.getElementById = id => sections.find(s => s.id === id) ?? findPanel(id);
const queryAll = context.document.querySelectorAll;
context.document.querySelectorAll = selector => selector === '.page-section' ? sections : selector === '.nav-link' ? [] : queryAll(selector);
context.document.querySelector = () => sections.find(s => s.classList.contains('active-section'));
const navigationStart = source.indexOf('  function activateSection(');
vm.runInContext(ts.transpile(source.slice(navigationStart, source.indexOf('  // 监听导航点击事件', navigationStart))), context);
vm.runInContext("activateSection('home', true)", context);
vm.runInContext("activateSection('marginalia')", context);
assert.equal(section.classList.contains('active-section'), false);
reveal();
assert.equal(section.classList.contains('active-section'), true);
assert.equal(panels[0].layouts.at(-1), false);
assert.equal(panels[0].classList.contains('is-expanded'), true);

const films = ['tokyo-story', '2001-a-space-odyssey', 'perfect-days', 'three-colors-blue', 'yi-yi', 'april-story'];
for (const frame of films) assert.ok(existsSync(new URL(`../public/images/cinema/${frame}.jpg`, import.meta.url)));

console.log('Marginalia navigation, selection, touch links and photo entrance: passed');
