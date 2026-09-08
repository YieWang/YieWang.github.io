// Open the local site, then pass this function to playwright-cli run-code.
async (page) => {
  const origin = await page.evaluate(() => location.origin);
  const results = [];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ['screen', 'music', 'literature', 'games']) {
      await page.emulateMedia({ reducedMotion: width === 390 ? 'reduce' : 'no-preference' });
      await page.goto(`${origin}/marginalia/${route}/`);
      const button = page.locator('#back-to-top');
      await button.waitFor({ state: 'attached' });
      if (await button.isVisible()) throw Error(`${route}: visible at top`);
      await page.evaluate(() => window.scrollTo(0, innerHeight + 200));
      if (await page.evaluate(() => document.documentElement.scrollHeight - innerHeight <= innerHeight)) {
        if (await button.isVisible()) throw Error(`${route}: visible on a short page`);
        results.push(`${route} ${width}: short page correctly hides button`);
        continue;
      }
      await button.waitFor({ state: 'visible' });
      await page.waitForTimeout(200);
      const box = await button.boundingBox();
      if (box.width !== 44 || box.height !== 44 || box.x + box.width > width) throw Error(`${route}: button dimensions`);
      if (route !== 'games') {
        const card = { screen: '.cinema-card', music: '.music-card', literature: '.book-card' }[route];
        await page.locator(card).first().evaluate(node => node.click());
        await button.waitFor({ state: 'hidden' });
        await page.keyboard.press('Escape');
        await button.waitFor({ state: 'visible' });
      }
      await page.screenshot({ path: `output/playwright/back-to-top-${route}-${width}.png` });
      await button.focus();
      await page.keyboard.press('Enter');
      await page.waitForFunction(() => scrollY === 0);
      await button.waitFor({ state: 'hidden' });
      if (route === 'music') {
        await page.waitForFunction(() => document.querySelector('.artist-row')?.getAttribute('aria-current') === 'true');
      }
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error(`${route}: horizontal overflow`);
      results.push(`${route} ${width}: passed`);
    }
  }
  await page.goto(`${origin}/marginalia/`);
  if (await page.locator('#back-to-top').count()) throw Error('Button outside requested pages');
  return results;
}
