// Open /marginalia/cinema/, then pass this function to playwright-cli run-code.
async page => {
  const url = page.url();
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const category of ['animation', 'series', 'films']) {
    await page.locator(`[data-cinema-tab="${category}"]`).click();
    const targetY = await page.evaluate(() => Math.min(1000, document.documentElement.scrollHeight - innerHeight - 100));
    await page.evaluate(y => window.scrollTo(0, y), targetY);
    await page.waitForFunction(y => window.scrollY === y, targetY);
    await page.reload();
    await page.waitForFunction(({ category, targetY }) => {
      const selected = document.querySelector(`[data-cinema-tab="${category}"]`);
      return selected?.getAttribute('aria-pressed') === 'true'
        && !document.getElementById(`section-${category}`).hidden
        && Math.abs(window.scrollY - targetY) < 2;
    }, { category, targetY });
    if (page.url() !== url) throw Error('Category selection changed the URL');
    if (await page.locator('[data-cinema-tab][aria-pressed="true"]').count() !== 1) throw Error('Multiple selected categories');
  }
  await page.evaluate(() => history.replaceState({ cinemaCategory: 'unknown', other: 1 }, ''));
  await page.reload();
  if (await page.locator('[data-cinema-tab="films"]').getAttribute('aria-pressed') !== 'true') throw Error('Invalid category must default to Films');
  await page.locator('[data-cinema-tab="animation"]').click();
  if (await page.evaluate(() => history.state.other) !== 1) throw Error('Other history state was overwritten');
  return 'All three categories retain selection and scroll on refresh; invalid state and URL preservation passed';
}
