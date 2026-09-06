// Open the music page, then pass this function to playwright-cli run-code.
async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  const rail = page.locator('#artist-wheel');
  await rail.waitFor();
  const count = await page.locator('.music-card').count();
  const check = async (id) => {
    await page.waitForFunction(id => {
      const rows = [...document.querySelectorAll('.artist-row')];
      const selected = rows.find(row => row.hasAttribute('aria-current'));
      const sections = rows.map(row => document.getElementById(`section-${row.dataset.artist}`));
      const expected = scrollY <= 1 ? sections[0] : sections.filter(section => section.getBoundingClientRect().top <= innerHeight / 2).at(-1) || sections[0];
      const rowRect = selected.getBoundingClientRect();
      const railRect = document.getElementById('artist-wheel').getBoundingClientRect();
      return selected.dataset.artist === id && expected.id === `section-${id}` && Math.abs(rowRect.top + rowRect.height / 2 - railRect.top - railRect.height / 2) < 1;
    }, id);
    await page.waitForTimeout(250);
  };
  await page.locator('.artist-row[data-artist="faye-wong"]').click();
  await check('faye-wong');
  await page.locator('.artist-row[data-artist="ryuichi-sakamoto"]').click();
  await check('ryuichi-sakamoto');
  await page.evaluate(() => {
    const section = document.getElementById('section-radiohead');
    window.scrollTo({ top: scrollY + section.getBoundingClientRect().top - innerHeight / 2 + 60, behavior: 'instant' });
  });
  await check('radiohead');
  const box = await rail.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 75);
  await check('chet-baker');
  if (await page.locator('.music-card').count() !== count) throw Error('Artist navigation must not filter albums');
  // A large discography must retain its artist throughout the section.
  await page.evaluate(() => {
    const grid = document.querySelector('#section-ryuichi-sakamoto .grid');
    for (let i = 0; i < 36; i++) {
      const clone = grid.firstElementChild.cloneNode(true);
      clone.setAttribute('data-test-copy', '');
      grid.append(clone);
    }
    const section = document.getElementById('section-ryuichi-sakamoto');
    window.scrollTo({ top: scrollY + section.getBoundingClientRect().top + section.offsetHeight / 2 - innerHeight / 2, behavior: 'instant' });
  });
  await check('ryuichi-sakamoto');
  await page.evaluate(() => document.querySelectorAll('[data-test-copy]').forEach(node => node.remove()));
  await page.locator('.artist-row[data-artist="ryuichi-sakamoto"]').click();
  await check('ryuichi-sakamoto');
  await page.locator('.music-card').first().click();
  await page.waitForFunction(() => document.getElementById('music-modal-backdrop').classList.contains('opacity-100'));
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.getElementById('music-modal-backdrop').classList.contains('pointer-events-none'));
  await page.screenshot({ path: '/private/tmp/music-navigation-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.artist-row[data-artist="ryuichi-sakamoto"]').click();
  await check('ryuichi-sakamoto');
  await page.screenshot({ path: '/private/tmp/music-navigation-mobile.png' });
  const images = await page.locator('.artist-row img').evaluateAll(images => images.every(image => image.complete && image.naturalWidth > 0));
  if (!images) throw Error('Portrait failed to load');
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error('Horizontal overflow');
  return { artists: 7, albums: count, bidirectionalSync: 'passed', longDiscography: 'passed', modal: 'passed', portraits: 'passed', mobile: 'passed' };
}
