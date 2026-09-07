// Run: node tests/photo-key-repeat.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/components/photography/PhotoWheel.tsx', import.meta.url), 'utf8');
const handler = source.slice(source.indexOf('    const onKeyDown ='), source.indexOf('    // Both sides'));
const keyboardTarget = { current: null }, calls = [];
let settlements = 0;
const element = {
  scrollTop: 20 * 82, style: {}, contains: target => target === element,
  closest: () => null,
  scrollTo: options => {
    calls.push(options);
    if (options.behavior === 'instant') element.scrollTop = options.top;
  },
};
const press = vm.runInNewContext(ts.transpile(handler + '\nonKeyDown;'), {
  element, keyboardTarget, itemHeight: 82, options: Array(30),
  settle: () => { keyboardTarget.current = null; settlements++; },
});
for (const target of [element, { closest: () => null }]) {
  element.scrollTop = 20 * 82;
  keyboardTarget.current = null;
  calls.length = 0;
  for (let i = 0; i < 15; i++) {
    press({ key: 'ArrowUp', repeat: i > 0, target, preventDefault() {} });
  }
  assert.equal(calls[0].behavior, 'smooth');
  assert.ok(calls.slice(1).every(call => call.behavior === 'instant'));
  assert.equal(element.scrollTop, 5 * 82, 'held keys advance before release, with or without wheel focus');
}
assert.equal(settlements, 28);
const count = calls.length;
press({ key: 'ArrowUp', target: { closest: () => ({}) } });
press({ key: 'ArrowUp', defaultPrevented: true });
assert.equal(calls.length, count, 'editing and already-handled keys stay untouched');
console.log('Photography key repeat and shared keyboard routing: passed');
