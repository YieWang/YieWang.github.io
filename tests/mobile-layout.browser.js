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
          // body 自己滚动（auto）或交给整页滚动（visible，Mathematics）都可以，只是不能锁死
          scrollable: getComputedStyle(document.body).overflowY !== 'hidden',
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
    check(await canvas.evaluate(c => c.clientHeight) >= 200, 'Mobile wave height');
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
  for (const route of ['/', '/marginalia/']) {
    await page.goto(origin + route);
    check(await page.evaluate(() => getComputedStyle(document.body).overflowY === 'hidden'), `Desktop ${route} must remain single-screen`);
  }
  // Mathematics 电脑端：默认全部折叠、右列显示线描；悬停／点击栏目名在右列显示，一次一栏；鼠标离开区域回到线描
  await page.goto(origin + '/mathematics/');
  const mathState = () => page.evaluate(() => ({
    fits: document.documentElement.scrollHeight <= innerHeight,
    open: [...document.querySelectorAll('[data-math-group][data-open]')].map(group => group.id),
    figure: getComputedStyle(document.querySelector('.math-figure')).visibility,
    focusable: [...document.querySelectorAll('.math-panel a')].some(link => !link.closest('[inert]')),
  }));
  let state = await mathState();
  check(state.fits && state.open.length === 0 && state.figure === 'visible' && !state.focusable, `Desktop Mathematics collapsed: ${JSON.stringify(state)}`);
  await page.locator('#talk .math-toggle').click();
  await page.locator('#note .math-toggle').click();
  await page.waitForTimeout(500);
  state = await mathState();
  check(state.fits && state.open.join() === 'note' && state.figure === 'hidden', `Desktop Mathematics single panel: ${JSON.stringify(state)}`);
  await page.locator('#talk .math-toggle').hover();
  await page.waitForTimeout(400);
  state = await mathState();
  check(state.open.join() === 'talk', `Desktop Mathematics hover: ${JSON.stringify(state)}`);
  await page.mouse.move(5, 5);
  await page.waitForTimeout(700);
  state = await mathState();
  check(state.open.length === 0 && state.figure === 'visible', `Desktop Mathematics leave: ${JSON.stringify(state)}`);
  // 条目很多时右侧高度不变、页面不变长，超出部分在框内滚动，底边淡出
  await page.evaluate(() => {
    const body = document.querySelector('#math-panel-talk .math-panel-body');
    const one = body.querySelector('article');
    for (let i = 0; i < 14; i++) body.appendChild(one.cloneNode(true));
  });
  await page.locator('#talk .math-toggle').hover();
  await page.waitForTimeout(150);
  const long = await page.evaluate(() => {
    const panel = document.getElementById('math-panel-talk');
    const figure = document.querySelector('.math-figure').getBoundingClientRect();
    return {
      fits: document.documentElement.scrollHeight <= innerHeight,
      scrolls: panel.scrollHeight > panel.clientHeight,
      fade: panel.classList.contains('more-below'),
      bottom: Math.abs(panel.getBoundingClientRect().bottom - figure.bottom) < 1.5,
      hint: panel.nextElementSibling.classList.contains('is-visible'),
    };
  });
  check(long.fits && long.scrolls && long.fade && long.bottom && long.hint, `Desktop long panel: ${JSON.stringify(long)}`);
  // 短竖条：进入时出现一下，不滑动就淡出；滑动时再出现
  const barVisible = () => page.locator('#math-panel-talk + .math-scroll').evaluate(track => track.classList.contains('is-visible'));
  await page.waitForTimeout(2000);
  check(!await barVisible(), 'Scroll hint must fade out when idle');
  await page.mouse.move(800, 420);
  await page.mouse.wheel(0, 200);
  await page.waitForTimeout(200);
  check(await barVisible(), 'Scroll hint must reappear while scrolling');
  // 内容放得下的栏不出现短竖条
  await page.locator('#template .math-toggle').hover();
  await page.waitForTimeout(300);
  check(!await page.locator('#math-panel-template + .math-scroll').evaluate(track => track.classList.contains('is-active')), 'No scroll hint when content fits');
  await page.goto(origin + '/mathematics/#talk');
  check(await page.locator('#talk').evaluate(group => group.hasAttribute('data-open') && !group.querySelector('.math-panel').inert), 'Hash link must open Talk');
  return 'Mobile scrolling, wave swipe, photo metadata, short-screen details, Screen redirect/category/back-to-top, desktop scroll rules and Mathematics collapse passed';
}
