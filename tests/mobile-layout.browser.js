// Open the local site, then pass this function to playwright-cli run-code.
async page => {
  const origin = await page.evaluate(() => location.origin);
  const context = await page.context().browser().newContext({
    viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true,
  });
  const check = (valid, message) => { if (!valid) throw Error(message); };
  try {
    const mobile = await context.newPage();
    for (const [width, height] of [[320, 568], [390, 844], [430, 932], [844, 390], [667, 375]]) {
      await mobile.setViewportSize({ width, height });
      for (const route of ['/', '/mathematics/', '/marginalia/']) {
        await mobile.goto(origin + route);
        await mobile.locator('#footer').scrollIntoViewIfNeeded();
        const state = await mobile.evaluate(() => ({
          scrollable: getComputedStyle(document.body).overflowY === 'auto',
          footer: document.getElementById('footer').getBoundingClientRect().bottom,
          overflow: document.documentElement.scrollWidth > innerWidth,
        }));
        check(state.scrollable && state.footer <= height + 1 && !state.overflow, `${width} ${route}: ${JSON.stringify(state)}`);
      }
      await mobile.goto(origin + '/marginalia/photography/');
      const photo = await mobile.locator('#bottom-meta-footer').evaluate(footer => ({
        width: footer.clientWidth,
        titleWidth: document.getElementById('meta-title').parentElement.clientWidth,
        cameraWidth: document.getElementById('photo-camera-meta').clientWidth,
        bottom: footer.getBoundingClientRect().bottom,
        stageBottom: document.getElementById('right-showcase-stage').getBoundingClientRect().bottom,
      }));
      check(photo.titleWidth > 0 && photo.cameraWidth <= photo.width && photo.bottom <= photo.stageBottom + 1, `Photo ${width}: ${JSON.stringify(photo)}`);
      if (width === 390) await mobile.screenshot({ path: 'output/playwright/photography-mobile-fixed.png' });
      if (width < 640) continue;
      for (const [route, card] of [['screen', '.cinema-card'], ['music', '.music-card'], ['literature', '.book-card']]) {
        await mobile.goto(`${origin}/marginalia/${route}/`);
        await mobile.locator(card).first().tap();
        await mobile.waitForTimeout(400);
        const sidebar = await mobile.locator('.detail-sidebar').evaluate(e => ({ height: e.clientHeight, content: e.scrollHeight }));
        check(sidebar.content <= sidebar.height + 1, `${route} ${width}: ${JSON.stringify(sidebar)}`);
        await mobile.screenshot({ path: `output/playwright/${route}-landscape-fixed-${width}.png` });
        await mobile.touchscreen.tap(2, height / 2);
        await mobile.waitForTimeout(300);
        check(await mobile.locator('[id$="modal-backdrop"].pointer-events-auto').count() === 0, `${route}: cannot close`);
      }
    }
    await mobile.setViewportSize({ width: 320, height: 568 });
    await mobile.goto(origin + '/');
    const canvas = mobile.locator('#geodetic-canvas-vertical');
    check(await canvas.evaluate(c => c.clientHeight) === 300, 'Mobile wave height');
    const box = await canvas.boundingBox();
    const y = Math.min(520, box.y + box.height - 20);
    const cdp = await context.newCDPSession(mobile);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 160, y }] });
    for (let i = 1; i <= 10; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 160, y: y - i * 13 }] });
      await mobile.waitForTimeout(20);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await mobile.waitForTimeout(400);
    check(await mobile.evaluate(() => scrollY > 0), 'Swipe starting on the wave must scroll');
    await mobile.goto(origin + '/marginalia/cinema/');
    await mobile.waitForURL('**/marginalia/screen/');
    await mobile.locator('[data-cinema-tab="animation"]').tap();
    await mobile.reload();
    check(await mobile.locator('[data-cinema-tab="animation"]').getAttribute('aria-pressed') === 'true', 'Screen category restore');
    await mobile.evaluate(() => scrollTo(0, 1000));
    await mobile.locator('#back-to-top').tap();
    await mobile.waitForFunction(() => scrollY === 0);
  } finally {
    await context.close();
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  for (const route of ['/', '/mathematics/', '/marginalia/']) {
    await page.goto(origin + route);
    check(await page.evaluate(() => getComputedStyle(document.body).overflowY === 'hidden'), `Desktop ${route} must remain single-screen`);
  }
  return 'Mobile scrolling, wave swipe, photo metadata, short-screen details, Screen redirect/category/back-to-top and desktop scroll rules passed';
}
