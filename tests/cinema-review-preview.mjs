// node tests/cinema-review-preview.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const page = readFileSync(new URL('../src/pages/marginalia/screen/index.astro', import.meta.url), 'utf8');
const source = page.slice(page.indexOf('    let isLongReview ='), page.indexOf('    modalContentSlot.innerHTML ='));
const html = { exports: {}, require: name => JSON.parse(readFileSync(new URL(name, new URL('../src/lib/', import.meta.url)), 'utf8')) };
vm.runInNewContext(ts.transpile(readFileSync(new URL('../src/lib/html.ts', import.meta.url), 'utf8'), { module: ts.ModuleKind.CommonJS }), html);
const render = content => vm.runInNewContext(ts.transpile(source + '\n({ isLongReview, previewHtml, remainingHtml });'), {
  hasReview: true, review: { content }, escapeHtml: html.exports.escapeHtml,
});
const textOf = html => [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map(match => match[1]).join('\n');
for (const content of ['短评', '甲'.repeat(200), '第一段\n\n第二段']) {
  const result = render(content);
  assert.equal(result.isLongReview, false);
  assert.equal(result.remainingHtml, '');
}
for (const content of ['甲'.repeat(201), '🙂'.repeat(201), '<script>\n'.repeat(100)]) {
  const result = render(content);
  assert.equal(result.isLongReview, true);
  assert.equal(textOf(result.previewHtml), html.exports.escapeHtml((Array.from(content.trim()).slice(0, 200).join('') + '…').split(/\r?\n+/).map(p => p.trim()).filter(Boolean).join('\n')));
  assert.equal(textOf(result.remainingHtml), html.exports.escapeHtml(content.trim()));
  assert.ok(!result.previewHtml.includes('<script>'));
}
for (const content of ['  第一段\n  第二段', '\t第一段\n\t第二段', '　　第一段\r\n\r\n　　第二段']) {
  const result = render(content);
  assert.equal(textOf(result.previewHtml), '第一段\n第二段');
  assert.equal((result.previewHtml.match(/text-indent: 2em/g) || []).length, 2);
}
for (const item of JSON.parse(readFileSync(new URL('../src/data/cinema-import.json', import.meta.url)))) {
  if (!item.review?.content) continue;
  const result = render(item.review.content);
  const full = result.isLongReview ? result.remainingHtml : result.previewHtml;
  const paragraphs = item.review.content.split(/\r?\n+/).map(p => p.trim()).filter(Boolean);
  assert.equal(textOf(full), paragraphs.map(html.exports.escapeHtml).join('\n'));
  assert.equal((full.match(/text-indent: 2em/g) || []).length, paragraphs.length);
}
console.log('Review preview: 200-character boundary, Unicode, paragraphs, full text and escaping passed.');
