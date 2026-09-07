// Run: node tests/photography-data.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/data/photography.ts', import.meta.url), 'utf8');
const context = vm.createContext({ exports: {} });
vm.runInContext(ts.transpile(source, { module: ts.ModuleKind.CommonJS }), context);
const { allPhotos, allCityAlbums, photoOptics, photoLocation } = context.exports;
assert.equal(allPhotos.length, 73);
assert.equal(allCityAlbums.length, 8);
assert.equal(new Set(allPhotos.map(photo => photo.id)).size, 73);
assert.equal(allPhotos.filter(photo => photo.exif).length, 72);
const urls = allPhotos.flatMap(photo => [photo.imageUrl, photo.thumbnailUrl]);
assert.equal(new Set(urls).size, 146);
for (const url of urls) {
  assert.ok(url.startsWith('https://homepage-assets.mathtranslations.org/photography/'));
  assert.ok(url.endsWith('.webp'));
}
for (const photo of allPhotos) {
  assert.match(photo.title, /^[A-Za-z]/);
  assert.ok(photo.subtitle);
  assert.ok(photo.title && photo.width > 0 && photo.height > 0);
  assert.equal(photo.story, '');
  assert.equal(photo.film, undefined);
}
// A source without EXIF must not inherit another photograph's camera or exposure.
const missing = allPhotos.find(photo => photo.id === '202512-hong-kong-10');
assert.equal(missing.camera, undefined);
assert.equal(missing.exif, undefined);
assert.equal(photoOptics(missing), '');
const known = allPhotos.find(photo => photo.id === '202303-hangzhou-west-lake-01');
assert.equal(known.camera, 'Canon EOS M6');
assert.equal(photoOptics(known), 'f/2 · 1/100s · ISO 160');
console.log('Photography import: 73 photos, 8 albums, 146 URLs; missing EXIF preserved.');

// Exercise the real metadata update when moving from a known photo to one without EXIF.
const page = readFileSync(new URL('../src/pages/marginalia/photography/index.astro', import.meta.url), 'utf8');
const elements = Object.fromEntries(['cameraMeta', 'metaTitle', 'metaLocation', 'metaStory', 'exifCam', 'exifLens', 'exifFilm', 'exifFilmDot', 'exifOptics'].map(name => [name, { textContent: '', style: {} }]));
const gallery = vm.createContext({
  ...elements, allPhotos, photoOptics, photoLocation,
  morphToImage() {}, preloadPhoto() {},
});
vm.runInContext(ts.transpile('let currentPhotoIndex = 0;\n' + page.slice(
  page.indexOf('    function activatePhotoByIndex('),
  page.indexOf('    // Listen for custom event'),
)), gallery);
const select = photo => vm.runInContext(`activatePhotoByIndex(${allPhotos.indexOf(photo)}, { fromWheel: true });`, gallery);
select(known);
assert.equal(elements.metaTitle.textContent, 'Mist over the Lake');
assert.equal(elements.metaLocation.textContent, '2023・ HANGZHOU （杭州）・湖上薄雾');
assert.ok(page.includes('{photoLocation(firstPhoto)}'));
assert.equal(elements.exifOptics.textContent, 'f/2 · 1/100s · ISO 160');
select(missing);
assert.equal(elements.cameraMeta.style.display, 'none');
assert.equal(elements.exifCam.textContent, '');
assert.equal(elements.exifOptics.textContent, '');
assert.equal(elements.metaStory.textContent, '');
select(known);
assert.equal(elements.cameraMeta.style.display, '');
assert.equal(elements.exifFilmDot.style.display, 'none');
console.log('Metadata selection: known → missing → known passed.');
