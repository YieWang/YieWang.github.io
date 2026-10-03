// Run: node tests/photography-data.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';
import { loadData } from './load-data.mjs';
import { validateDocument } from '../scripts/editor/server.mjs';

// Saved content is editable: additions, deletions, captions and reused images are valid.
const data = JSON.parse(readFileSync(new URL('../src/data/photography.json', import.meta.url), 'utf8'));
validateDocument('photography', data);
const { allPhotos, allCityAlbums } = loadData('photography.ts');
assert.equal(new Set(allPhotos.map(photo => photo.id)).size, allPhotos.length);
for (const photo of allPhotos) {
  assert.ok(typeof photo.id === 'string' && photo.id.trim());
  assert.ok(photo.title && photo.width > 0 && photo.height > 0);
}
console.log(`Photography data: ${allPhotos.length} visible photos, ${allCityAlbums.length} albums; editable content validated.`);

// Metadata regressions use fixtures so editing or removing a real photo cannot break publishing.
const sample = {
  id: 'known', title: 'Mist over the Lake', subtitle: '湖上薄雾',
  location: '杭州', locationEn: 'Hangzhou', year: 2023, date: '2023-03-04',
  imageUrl: 'https://example.invalid/photo.webp', thumbnailUrl: 'https://example.invalid/thumb.webp',
  width: 6000, height: 4000, camera: 'Canon EOS M6', lens: 'EF-M22mm f/2 STM',
  exif: { focalLength: '22mm', aperture: 'f/2', shutter: '1/100s', iso: '160' },
  story: '湖边随记', film: 'Test film',
};
const withoutExif = {
  ...sample, id: 'missing', title: 'Window', subtitle: '窗',
  camera: undefined, lens: undefined, exif: undefined, story: '', film: undefined,
};
const album = { id: 'sample-album', year: 2023, location: '杭州', locationEn: 'Hangzhou', country: 'China' };
const fixtures = loadData('photography.ts', { 'photography.json': [{ year: 2023, cities: [
  { ...album, photos: [sample, { ...sample, id: 'hidden-photo', hidden: true }, withoutExif] },
  { ...album, id: 'hidden-album', hidden: true, photos: [{ ...sample, id: 'hidden-album-photo' }] },
] }] });
const { allPhotos: galleryPhotos, photoOptics, photoLocation } = fixtures;
assert.equal(galleryPhotos.map(photo => photo.id).join(','), 'known,missing');
assert.equal(fixtures.allCityAlbums.length, 1);
assert.ok(galleryPhotos.every(photo => photo.cityId === 'sample-album'));
assert.equal(loadData('photography.ts', { 'photography.json': [] }).allPhotos.length, 0);
// A source without EXIF must not inherit another photograph's camera or exposure.
const [known, missing] = galleryPhotos;
assert.equal(missing.camera, undefined);
assert.equal(missing.exif, undefined);
assert.equal(photoOptics(missing), '');
assert.equal(known.camera, 'Canon EOS M6');
assert.equal(photoOptics(known), 'f/2 · 1/100s · ISO 160');

// Exercise the real metadata update when moving from a known photo to one without EXIF.
const page = readFileSync(new URL('../src/pages/marginalia/photography/index.astro', import.meta.url), 'utf8');
const elements = Object.fromEntries(['cameraMeta', 'metaTitle', 'metaLocation', 'metaStory', 'exifCam', 'exifLens', 'exifFilm', 'exifFilmDot', 'exifOptics'].map(name => [name, { textContent: '', style: {} }]));
const gallery = vm.createContext({
  ...elements, allPhotos: galleryPhotos, photoOptics, photoLocation,
  canvas: null, thumbnails: null, yearSelect: null, city: null,
  morphToImage() {},
});
vm.runInContext(ts.transpile('let activeIndex = 0;\n' + page.slice(
  page.indexOf('    function activatePhotoByIndex('),
  page.indexOf('    // Listen for custom event'),
)), gallery);
const select = photo => vm.runInContext(`activatePhotoByIndex(${galleryPhotos.indexOf(photo)}, { fromWheel: true });`, gallery);
select(known);
assert.equal(elements.metaTitle.textContent, 'Mist over the Lake');
assert.equal(elements.metaLocation.textContent, '2023・ HANGZHOU （杭州）・湖上薄雾');
assert.ok(page.includes('{photoLocation(firstPhoto)}'));
assert.equal(elements.exifOptics.textContent, 'f/2 · 1/100s · ISO 160');
assert.equal(elements.metaStory.textContent, '"湖边随记"');
assert.equal(elements.exifFilm.textContent, 'Test film');
assert.equal(elements.exifFilmDot.style.display, 'inline');
select(missing);
assert.equal(elements.cameraMeta.style.display, 'none');
assert.equal(elements.exifCam.textContent, '');
assert.equal(elements.exifOptics.textContent, '');
assert.equal(elements.metaStory.textContent, '');
assert.equal(elements.exifFilm.textContent, '');
assert.equal(elements.exifFilmDot.style.display, 'none');
select(known);
assert.equal(elements.cameraMeta.style.display, '');
assert.equal(elements.exifFilmDot.style.display, 'inline');
console.log('Metadata selection: known → missing → known passed.');
