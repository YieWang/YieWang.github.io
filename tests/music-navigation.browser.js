// Open the music page, then pass this function to playwright-cli run-code.
async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  const rail = page.locator('#artist-wheel');
  await rail.waitFor();
  const count = await page.locator('.music-card').count();
  if (count === 0) {
    if (!(await page.getByText('No music yet.', { exact: true }).isVisible())) throw new Error('Missing empty music state');
    if (await page.locator('.artist-row').count()) throw new Error('Empty library has artist rows');
    return;
  }
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
  const ids = await page.locator('.artist-row').evaluateAll(rows => rows.map(row => row.dataset.artist));
  const largest = await page.locator('section[id^="section-"]').evaluateAll(sections => sections.reduce((a, b) => a.querySelectorAll('.music-card').length > b.querySelectorAll('.music-card').length ? a : b).id.slice(8));
  await page.locator(`.artist-row[data-artist="${ids[1]}"]`).click();
  await check(ids[1]);
  await page.locator(`.artist-row[data-artist="${largest}"]`).click();
  await check(largest);
  await page.evaluate(id => {
    const section = document.getElementById(`section-${id}`);
    window.scrollTo({ top: scrollY + section.getBoundingClientRect().top + section.offsetHeight / 2 - innerHeight / 2, behavior: 'instant' });
  }, largest);
  await check(largest);
  const box = await rail.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, 75);
  await check(ids[Math.min(ids.length - 1, ids.indexOf(largest) + 1)]);
  if (await page.locator('.music-card').count() !== count) throw Error('Artist navigation must not filter albums');
  await page.locator('.music-card').first().click();
  await page.waitForFunction(() => document.getElementById('music-modal-backdrop').classList.contains('opacity-100'));
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.getElementById('music-modal-backdrop').classList.contains('pointer-events-none'));
  await page.screenshot({ path: 'output/playwright/music-navigation-desktop.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(`.artist-row[data-artist="${largest}"]`).click();
  await check(largest);
  await page.screenshot({ path: 'output/playwright/music-navigation-mobile.png' });
  await page.waitForFunction(() => {
    const clip = document.getElementById('artist-wheel').getBoundingClientRect();
    const visible = [...document.querySelectorAll('.artist-row img')].filter(image => {
      const r = image.getBoundingClientRect();
      return r.top >= Math.max(0, clip.top) && r.bottom <= Math.min(innerHeight, clip.bottom);
    });
    return visible.length > 0 && visible.every(image => image.complete && image.naturalWidth > 0);
  });
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error('Horizontal overflow');
  return { artists: ids.length, albums: count, bidirectionalSync: 'passed', longDiscography: 'passed', modal: 'passed', portraits: 'passed', mobile: 'passed' };
}
