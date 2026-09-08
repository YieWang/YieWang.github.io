// Open /marginalia/, then pass this function to playwright-cli run-code.
async (page) => {
  const context = await page.context().browser().newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
  });
  const mobile = await context.newPage();
  const ids = ['photography', 'cinema', 'literature', 'music', 'table-tennis', 'games'];
  try {
    await mobile.goto(page.url());
    for (const width of [320, 375, 390, 430, 639]) {
      await mobile.setViewportSize({ width, height: 844 });
      for (const id of ids) {
        await mobile.locator(`[data-stage-id="${id}"]`).tap();
        await mobile.waitForTimeout(850);
        const geometry = await mobile.locator(`#stage-panel-${id}`).evaluate(panel => {
          const stage = panel.getBoundingClientRect();
          const art = panel.querySelector('a').getBoundingClientRect();
          const strip = panel.querySelector('.cinema-strip')?.getBoundingClientRect();
          return {
            active: panel.hasAttribute('data-active') && !panel.inert,
            offset: art.x + art.width / 2 - stage.x - stage.width / 2,
            stripOffset: strip ? strip.x + strip.width / 2 - stage.x - stage.width / 2 : 0,
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
        if (!geometry.active || Math.abs(geometry.offset) > 1 || Math.abs(geometry.stripOffset) > 1 || geometry.overflow) {
          throw new Error(`${width}px ${id}: ${JSON.stringify(geometry)}`);
        }
        if (width === 390) await mobile.screenshot({ path: `output/playwright/center-mobile-${id}.png` });
      }
    }
  } finally {
    await context.close();
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const id of ids) {
    await page.locator(`[data-stage-id="${id}"]`).hover();
    await page.waitForTimeout(450);
    const offset = await page.locator(`#stage-panel-${id}`).evaluate(panel => {
      const stage = panel.getBoundingClientRect();
      const art = panel.querySelector('a').getBoundingClientRect();
      return art.x + art.width / 2 - stage.x - stage.width / 2;
    });
    const expected = id === 'photography' ? -52 : id === 'cinema' ? -37 : -49;
    if (Math.abs(offset - expected) > 1) throw new Error(`Desktop ${id}: ${offset}`);
  }
  return 'All six stages centered at five mobile widths; touch switching, overflow and desktop positions passed';
}
