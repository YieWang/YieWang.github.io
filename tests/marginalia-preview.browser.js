// Open /marginalia, then pass this function to playwright-cli run-code.
async (page) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  const iframe = page.locator('.literature-book iframe');
  const book = page.frameLocator('.literature-book iframe').locator('#book');
  await page.waitForFunction(() => document.querySelector('.literature-book iframe').contentDocument.querySelector('#book')?.dataset.renderer);
  const originalFrame = await iframe.elementHandle().then(handle => handle.contentFrame());
  const loadedAt = await originalFrame.evaluate(() => performance.timeOrigin);
  const bookCover = await book.evaluate(async el => {
    const image = new Image();
    image.src = JSON.parse(el.dataset.pages)[0];
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  });
  if (!bookCover.width || !bookCover.height) throw new Error('Book cover failed to decode');
  const checkPhotos = async () => {
    for (const img of await page.locator('.photo-container img').all()) {
      const fits = await img.evaluate(async img => {
        await img.decode();
        return Math.abs(img.clientWidth / img.clientHeight - img.naturalWidth / img.naturalHeight) < 0.03;
      });
      if (!fits) throw new Error('Photo cropped or stretched');
    }
  };
  await checkPhotos();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'output/playwright/marginalia-photography.png' });
  for (let i = 0; i < 3; i++) {
    await page.getByRole('link', { name: 'Literature', exact: true }).hover();
    await page.waitForTimeout(250);
    await page.getByRole('link', { name: 'Music', exact: true }).hover();
  }
  if (await originalFrame.evaluate(() => performance.timeOrigin) !== loadedAt) throw new Error('Book document reloaded during selection');
  const cover = page.locator('.vinyl-sleeve img');
  await cover.evaluate(img => img.decode());
  if (!(await cover.getAttribute('src')).includes('apple-644810a35d099b63.webp')) throw new Error('Missing selected album cover');
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'output/playwright/marginalia-music.png' });
  await page.getByRole('link', { name: 'Literature', exact: true }).hover();
  await page.waitForTimeout(250);
  const closedBook = await iframe.screenshot({ path: 'output/playwright/marginalia-literature-cover.png' });
  await page.waitForTimeout(4500);
  if (closedBook.equals(await iframe.screenshot())) throw new Error('Book did not turn its pages');
  await page.screenshot({ path: 'output/playwright/marginalia-literature.png' });
  if (await book.getAttribute('data-error')) throw new Error('Book failed to initialize');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(800);
  await page.waitForFunction(() => document.querySelector('.literature-book iframe').contentDocument.querySelector('#book')?.dataset.renderer);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('link', { name: 'Photography', exact: true }).focus();
  await checkPhotos();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'output/playwright/marginalia-mobile.png' });
  for (const photo of await page.locator('.photo-container img').all()) {
    const box = await photo.boundingBox();
    if (box.x < 0 || box.x + box.width > 390) throw new Error('Photo clipped by mobile viewport');
  }
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Mobile horizontal overflow');
  if (errors.length) throw new Error(errors.join('\n'));
  return 'Photo ratios, Music cover, cached book, reduced motion and mobile layout: passed';
}
