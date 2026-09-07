// Run: node tests/photo-key-repeat.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/photography/PhotoWheel.tsx', import.meta.url), 'utf8');
const setup = source.slice(source.indexOf("    let heldKey ="), source.indexOf('    const draw ='));
const handler = source.slice(source.indexOf('    const steps:'), source.indexOf('    // Both sides'));
let now = 0, frameId = 0;
const frames = new Map(), calls = [];
const keyboardTarget = { current: null }, cancelKeyboard = {};
const element = {
  scrollTop: 20 * 82, style: {}, contains: target => target === element,
  closest: () => null, scrollTo(options) { calls.push(options); },
};
const { down, up, release } = vm.runInNewContext(ts.transpile(setup + handler + '\n({down:onKeyDown,up:onKeyUp,release:releaseKeyboard});'), {
  element, keyboardTarget, itemHeight: 82, options: Array(100), drag: { current: null },
  cancelKeyboard, wheelTimer: 0, wheeling: false, clearTimeout() {},
  performance: { now: () => now },
  requestAnimationFrame(fn) { frames.set(++frameId, fn); return frameId; },
  cancelAnimationFrame(id) { frames.delete(id); },
  settle() { keyboardTarget.current = null; },
  stopAt(top) { element.scrollTop = Math.round(top / 82) * 82; },
});
const tick = (dt = 16) => {
  now += dt;
  const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn(now));
  assert.ok(frames.size <= 1, 'one animation owns keyboard scrolling');
};
const finish = () => {
  let n = 0;
  while (frames.size && n++ < 60) tick();
  assert.equal(frames.size, 0, 'settle within one second after release');
};
for (const target of [element, { closest: () => null }]) {
  for (const dt of [8, 16, 32]) {
    cancelKeyboard.current(); element.scrollTop = 50 * 82; calls.length = 0;
    const press = (key, repeat = false) => down({ key, repeat, target, preventDefault() {} });
    press('ArrowUp'); up({ key: 'ArrowUp' });
    const displacements = [];
    for (let i = 0; i < 8; i++) { const before = element.scrollTop; tick(8); displacements.push(before - element.scrollTop); }
    assert.ok(displacements[2] > displacements[0], 'single press accelerates rather than jumping');
    finish(); assert.equal(element.scrollTop, 49 * 82);
    press('ArrowUp'); press('ArrowUp'); finish();
    assert.equal(element.scrollTop, 47 * 82, 'rapid taps retain both steps');
    calls.length = 0;
    press('ArrowUp', true);
    for (let i = 0; i < 60; i++) {
      press('ArrowUp', true);
      const before = element.scrollTop; tick(dt);
      assert.ok(before >= element.scrollTop, 'no reverse bounce while moving up');
      assert.ok(before - element.scrollTop < 82, 'no whole-photo jump in a frame');
      assert.ok(Math.abs(keyboardTarget.current * 82 - element.scrollTop) <= 246, 'repeat lead stays bounded');
    }
    assert.equal(calls.length, 1, 'repeats never restart native smooth scrolling');
    const released = element.scrollTop;
    up({ key: 'ArrowUp' }); tick(dt);
    assert.ok(element.scrollTop < released, 'release preserves inertia');
    finish();
    assert.ok(released - element.scrollTop <= 246, 'release cannot replay an accumulated backlog');
    press('ArrowDown', true); for (let i = 0; i < 5; i++) tick();
    const beforeReverse = element.scrollTop;
    press('ArrowUp'); up({ key: 'ArrowDown' }); finish();
    assert.ok(element.scrollTop < beforeReverse, 'opposite key changes direction');
    press('ArrowUp', true); release();
    assert.equal(frames.size, 0, 'blur cancels the animation and snaps');
    press('ArrowDown', true); tick(); cancelKeyboard.current();
    const cancelled = element.scrollTop; tick();
    assert.equal(element.scrollTop, cancelled, 'gesture or external selection cancels keyboard motion');
  }
}
for (const [position, key] of [[0, 'ArrowUp'], [99 * 82, 'ArrowDown']]) {
  element.scrollTop = position;
  down({ key, repeat: true, target: element, preventDefault() {} }); finish();
  assert.equal(element.scrollTop, position, 'boundaries do not overshoot');
}
const count = calls.length;
down({ key: 'ArrowUp', target: { closest: () => ({}) } });
down({ key: 'ArrowUp', defaultPrevented: true });
assert.equal(calls.length, count);
console.log('Photography inertia, bounded repeat, release, reversal and cancellation: passed');
