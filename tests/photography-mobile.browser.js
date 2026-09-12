// Open /marginalia/photography, then pass this function to playwright-cli run-code.
async (page) => {
  const context = await page.context().browser().newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  let phase = 'initial image';
  try {
    const mobile = await context.newPage();
    await mobile.goto(page.url());
    await mobile.waitForFunction(() => getComputedStyle(document.querySelector('#right-showcase-stage')).touchAction === 'auto');
    const selected = () => mobile.locator('#photo-mobile-thumbnails [aria-pressed="true"]').getAttribute('data-photo-index');
    const synchronized = () => mobile.waitForFunction(() => {
      const button = document.querySelector('#photo-mobile-thumbnails [aria-pressed="true"]');
      const title = document.querySelector('#meta-title').textContent.trim();
      return button.getAttribute('aria-label').endsWith(title)
        && [...document.querySelectorAll('.stage-layer-img')].some(img => getComputedStyle(img).opacity === '1' && img.alt === title && img.complete && img.naturalWidth > 0);
    });
    await synchronized();
    const cdp = await context.newCDPSession(mobile);
    const swipe = async (x, y, dx, dy) => {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
      for (let step = 1; step <= 10; step++) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + dx * step / 10, y: y + dy * step / 10 }] });
        await mobile.waitForTimeout(16);
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    };
    const box = await mobile.locator('#photo-canvas').boundingBox();
    phase = 'horizontal swipe';
    await swipe(box.x + box.width * 0.75, box.y + box.height / 2, -120, 0);
    await mobile.waitForFunction(() => document.querySelector('#photo-mobile-thumbnails [aria-pressed="true"]').dataset.photoIndex === '1');
    await synchronized();
    phase = 'thumbnail click';
    await mobile.locator('#photo-mobile-thumbnails button').nth(2).click();
    await synchronized();
    if (await selected() !== '2') throw Error('Thumbnail selection failed');
    phase = 'year jump';
    await mobile.locator('#photo-year-select').selectOption({ index: 1 });
    await synchronized();
    const year = await mobile.locator('#photo-year-select').inputValue();
    if (!(await mobile.locator('#meta-location').textContent()).includes(year)) throw Error('Year jump failed');
    phase = 'portrait image';
    const portrait = mobile.locator('#photo-mobile-thumbnails button').filter({ has: mobile.locator('img') });
    const portraitIndex = await portrait.evaluateAll(buttons => buttons.findIndex(button => {
      const img = button.querySelector('img');
      return Number(img.getAttribute('height')) > Number(img.getAttribute('width')) * 1.4;
    }));
    await portrait.nth(portraitIndex).click();
    await synchronized();
    for (const [width, height] of [[320, 568], [390, 844], [844, 390]]) {
      await mobile.setViewportSize({ width, height });
      const valid = await mobile.evaluate(() => {
        const image = [...document.querySelectorAll('.stage-layer-img')].find(img => getComputedStyle(img).opacity === '1');
        const rect = image.getBoundingClientRect();
        return document.documentElement.scrollWidth === innerWidth && rect.height > 100
          && Math.abs(rect.width / rect.height - image.naturalWidth / image.naturalHeight) < 0.01
          && getComputedStyle(document.querySelector('aside')).display === 'none';
      });
      if (!valid) throw Error(`Mobile image geometry failed at ${width}x${height}`);
    }
    phase = 'vertical scroll';
    await mobile.evaluate(() => scrollTo(0, 0));
    const before = await selected();
    await swipe(420, 300, 0, -160);
    await mobile.waitForFunction(() => scrollY > 40);
    if (await selected() !== before) throw Error('Vertical scroll changed the photo');
  } catch (error) {
    throw Error(`${phase}: ${error.message}`);
  } finally {
    await context.close();
  }
  // Resizing the same page must hand gestures back to the desktop wheel.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await page.locator('#photo-mobile-thumbnails button').nth(2).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#right-showcase-stage')).touchAction === 'none');
  await page.waitForFunction(() => document.querySelector('.photo-wheel-scroll [aria-selected="true"]').getAttribute('aria-label').endsWith(document.querySelector('#meta-title').textContent.trim()));
  if (await page.locator('#photo-mobile-thumbnails').isVisible()) throw Error('Mobile strip visible on desktop');
  // Switching layouts during a held drag must not leave the new desktop scroller locked.
  const stage = await page.locator('#right-showcase-stage').boundingBox();
  await page.mouse.move(stage.x + stage.width / 2, stage.y + stage.height / 2);
  await page.mouse.down();
  await page.mouse.move(stage.x + stage.width / 2, stage.y + stage.height / 2 - 115, { steps: 10 });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForFunction(() => !document.querySelector('.photo-wheel-scroll'));
  await page.mouse.up();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.locator('.photo-wheel-scroll').focus();
  await page.keyboard.press('ArrowDown');
  await page.waitForFunction(() => {
    const wheel = document.querySelector('.photo-wheel-scroll');
    return wheel.children[3].getAttribute('aria-selected') === 'true' && Math.abs(wheel.scrollTop - 3 * 82) < 0.5;
  });
  return 'Touch swipe, thumbnail selection, year jump, original ratios, portrait/landscape scrolling and desktop handoff passed.';
}
