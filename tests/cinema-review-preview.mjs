// node tests/cinema-review-preview.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const page = readFileSync(new URL('../src/pages/marginalia/cinema/index.astro', import.meta.url), 'utf8');
const source = page.slice(page.indexOf('    let isLongReview ='), page.indexOf('    modalContentSlot.innerHTML ='));
const html = { exports: {}, require: name => JSON.parse(readFileSync(new URL(name, new URL('../src/lib/', import.meta.url)), 'utf8')) };
vm.runInNewContext(ts.transpile(readFileSync(new URL('../src/lib/html.ts', import.meta.url), 'utf8'), { module: ts.ModuleKind.CommonJS }), html);
const render = content => vm.runInNewContext(ts.transpile(source + '\n({ isLongReview, previewHtml, remainingHtml });'), {
  hasReview: true, item: { review: { content } }, escapeHtml: html.exports.escapeHtml,
});
for (const content of ['短评', '甲'.repeat(200), '第一段\n\n第二段']) {
  const result = render(content);
  assert.equal(result.isLongReview, false);
  assert.equal(result.remainingHtml, '');
}
for (const content of ['甲'.repeat(201), '🙂'.repeat(201), '<script>\n'.repeat(100)]) {
  const result = render(content);
  assert.equal(result.isLongReview, true);
  assert.ok(result.previewHtml.includes(html.exports.escapeHtml(Array.from(content.trim()).slice(0, 200).join('') + '…')));
  assert.ok(result.remainingHtml.includes(html.exports.escapeHtml(content.trim())));
  assert.ok(!result.previewHtml.includes('<script>'));
}
console.log('Review preview: 200-character boundary, Unicode, paragraphs, full text and escaping passed.');
