// Open the site, then pass this function to playwright-cli run-code.
async (page) => {
  const origin = await page.evaluate(() => location.origin);
  const routes = ['/', '/mathematics/', '/marginalia/', '/marginalia/photography/', '/marginalia/screen/', '/marginalia/music/', '/marginalia/literature/', '/marginalia/games/', '/marginalia/table-tennis/'];
  const positions = () => page.locator('#header .nav-link').evaluateAll(links => links.map(link => {
    const { x, y, width, height } = link.getBoundingClientRect();
    return [x, y, width, height];
  }));
  const results = [];
  for (const width of [1440, 700, 390]) {
    await page.setViewportSize({ width, height: 900 });
    let baseline;
    for (const route of routes) {
      await page.goto(origin + route);
      await page.evaluate(() => document.fonts.ready);
      const before = await positions();
      baseline ??= before;
      const matches = values => values.every((rect, i) => rect.every((value, j) => Math.abs(value - baseline[i][j]) < 0.5));
      if (!matches(before)) throw Error(`Navigation differs from home: ${width} ${route}`);
      await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
      if (!matches(await positions())) throw Error(`Navigation moved on scroll: ${width} ${route}`);
      if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error(`Horizontal overflow: ${width} ${route}`);
      if (width === 1440 && route === '/marginalia/photography/') {
        const gallery = await page.locator('#gallery-viewport-root').boundingBox();
        if (gallery.y + gallery.height > 900) throw Error('Photography exceeds viewport');
      }
      results.push(`${width} ${route}: passed`);
    }
  }
  await page.goto(origin + '/');
  await page.locator('#nav-mathematics').click();
  await page.waitForURL('**/mathematics');
  if (!await page.locator('#nav-mathematics').evaluate(link => link.classList.contains('active-nav'))) throw Error('Navigation activation failed');
  return results;
}
