// Open the site, then pass this function to playwright-cli run-code.
async page => {
  const origin = await page.evaluate(() => location.origin);
  const check = (ok, message) => { if (!ok) throw Error(message); };
  const close = async () => {
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => !document.querySelector('dialog[open]'));
  };
  for (const [route, selector, id] of [
    ['screen', '.cinema-card', 'cinema'],
    ['music', '.music-card', 'music'],
    ['literature', '.book-card', 'book'],
  ]) {
    await page.goto(`${origin}/marginalia/${route}/`);
    const card = page.locator(`${selector}:visible`).nth(12);
    await card.scrollIntoViewIfNeeded();
    await card.focus();
    const scroll = await page.evaluate(() => scrollY);
    for (const key of ['Enter', 'Space']) {
      await page.keyboard.press(key);
      const dialog = page.locator(`#${id}-modal-backdrop`);
      await dialog.waitFor({ state: 'visible' });
      check(await dialog.evaluate(element => element.matches(':modal') && !!document.getElementById(element.getAttribute('aria-labelledby'))?.textContent.trim()), `${route}: missing named modal`);
      for (const key of ['Tab', 'Tab', 'Shift+Tab', 'Shift+Tab']) {
        await page.keyboard.press(key);
        const focus = await dialog.evaluate(element => ({ inside: element.contains(document.activeElement), pageFocused: document.hasFocus(), active: document.activeElement.outerHTML.slice(0, 200) }));
        // The browser's own toolbar remains reachable; background page controls must not be.
        check(focus.inside || !focus.pageFocused, `${route}: focus escaped after ${key}: ${JSON.stringify(focus)}`);
      }
      await page.mouse.move(2, 400);
      await page.mouse.wheel(0, 550);
      await page.keyboard.press('PageDown');
      await page.waitForTimeout(350);
      check(await page.evaluate(() => scrollY) === scroll, `${route}: background scrolled`);
      await close();
      check(await card.evaluate(element => document.activeElement === element), `${route}: focus was not restored`);
      check(await page.evaluate(() => scrollY) === scroll, `${route}: close changed page position`);
    }
    await page.mouse.wheel(0, 250);
    await page.waitForFunction(before => scrollY > before, scroll);
  }

  await page.goto(`${origin}/marginalia/screen/`);
  await page.locator('[data-cinema-tab="series"]').click();
  const office = page.locator('[data-item-id="tv-2316"]');
  await office.evaluate(card => {
    const data = JSON.parse(card.dataset.itemJson);
    data.review = { content: 'Series review <safe>', quote: 'Series quote', date: '2026-01-01' };
    delete data.installments[0].review;
    data.installments[1].review = { content: 'Season review' };
    delete data.installments[2].review;
    card.dataset.itemJson = JSON.stringify(data);
  });
  await office.click();
  check((await page.locator('#review-preview-container').innerText()).includes('Series review <safe>'), 'Parent series review missing');
  await page.locator('[data-installment="1"]').click();
  check((await page.locator('#review-preview-container').innerText()).includes('Season review'), 'Season review must take priority');
  await page.locator('[data-installment="2"]').click();
  check((await page.locator('#review-preview-container').innerText()).includes('Series review <safe>'), 'Parent review lost when switching seasons');
  await close();
  await page.locator('[data-cinema-tab="films"]').click();
  const collection = page.locator('#section-films .cinema-card[data-collection="true"]').first();
  await collection.evaluate(card => {
    const data = JSON.parse(card.dataset.itemJson);
    data.review = data.installments[0].review = { content: 'First film only' };
    delete data.installments[1].review;
    card.dataset.itemJson = JSON.stringify(data);
  });
  await collection.click();
  await page.locator('[data-installment="1"]').click();
  check(!(await page.locator('#modal-content-slot').innerText()).includes('First film only'), 'Film review leaked to another installment');
  await close();

  await page.setViewportSize({ width: 320, height: 568 });
  await page.locator('[data-cinema-tab="animation"]').click();
  const touch = await page.context().newCDPSession(page);
  for (const title of ["Frieren: Beyond Journey's End", 'Fate/stay night [Unlimited Blade Works]']) {
    await page.locator('#section-animation .cinema-card').filter({ has: page.getByRole('heading', { name: title, exact: true }) }).click();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const pane = page.locator('#cinema-detail-body');
    check(await pane.evaluate(element => element.clientHeight > 170 && getComputedStyle(element).overflowY === 'auto'), `${title}: unusable mobile scroll area`);
    check(await page.locator('#modal-content-slot a').evaluate(link => {
      const box = link.getBoundingClientRect();
      const panel = document.getElementById('cinema-modal-container').getBoundingClientRect();
      return box.left >= panel.left && box.right <= panel.right && link.scrollWidth <= link.clientWidth + 1;
    }), `${title}: clipped external link`);
    const box = await pane.boundingBox();
    const background = await page.evaluate(() => scrollY);
    const x = box.x + box.width / 2, y = box.y + box.height - 20;
    await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let step = 1; step <= 8; step++) {
      await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - step * 20 }] });
      await page.waitForTimeout(20);
    }
    await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await page.waitForFunction(() => document.getElementById('cinema-detail-body').scrollTop > 0);
    check(await page.evaluate(() => scrollY) === background, `${title}: touch moved the background`);
    const last = page.locator('[data-installment]').last();
    await last.click();
    check(await last.getAttribute('aria-pressed') === 'true', `${title}: season cannot be selected`);
    check(await last.evaluate(button => {
      const box = button.getBoundingClientRect();
      const pane = document.getElementById('cinema-detail-body').getBoundingClientRect();
      return box.top >= pane.top - 1 && box.bottom <= pane.bottom + 1;
    }), `${title}: season is clipped`);
    await page.locator('#modal-content-slot img').evaluate(image => image.decode());
    await page.screenshot({ path: `output/playwright/screen-small-${title.startsWith('Frieren') ? 'frieren' : 'fate'}.png` });
    await close();
  }
  await page.goto(`${origin}/marginalia/literature/`);
  for (const [width, height] of [[390, 844], [320, 568], [568, 320], [844, 390], [1440, 900]]) {
    await page.setViewportSize({ width, height });
    const mobile = width < 640;
    const pane = page.locator(mobile ? '#book-detail-body' : '#book-modal-scroll-pane');
    for (const id of ['book-1084336', 'book-10554308', 'book-6082808', 'book-1041007']) {
      await page.locator(`[data-book-id="${id}"]`).click();
      await page.locator('#book-modal-slot img').evaluate(image => image.decode());
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      const label = `${id} at ${width}x${height}`;
      const panel = await page.locator('#book-modal-container').boundingBox();
      check(Math.abs(panel.height - Math.min(mobile ? 580 : 490, height * (mobile ? 0.88 : 0.86))) < 1, `${label}: wrong modal height`);
      check(await pane.evaluate(e => getComputedStyle(e).overflowY === 'auto' && e.clientHeight > 100), `${label}: unusable reading area`);
      if (mobile) check(await page.locator('#book-modal-scroll-pane').evaluate(e => getComputedStyle(e).overflowY === 'visible'), `${label}: nested review scrolling`);
      const background = await page.evaluate(() => scrollY);
      const titleTop = (await page.locator('#book-modal-title').boundingBox()).y;
      if (width === 320 && id === 'book-1041007') {
        const box = await pane.boundingBox();
        const x = box.x + box.width / 2, y = box.y + 140;
        await touch.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
        for (let step = 1; step <= 5; step++) {
          await touch.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - step * 20 }] });
          await page.waitForTimeout(20);
        }
        await touch.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        await page.waitForFunction(() => document.getElementById('book-detail-body').scrollTop > 0);
      }
      const toggle = page.locator('#toggle-essay-btn');
      if (await toggle.count()) await toggle.click();
      const lastReview = page.locator('#book-modal-scroll-pane p').last();
      await lastReview.scrollIntoViewIfNeeded();
      check(await lastReview.evaluate((e, paneId) => {
        const r = e.getBoundingClientRect(), p = document.getElementById(paneId).getBoundingClientRect();
        return r.bottom <= p.bottom + 1 && r.top >= p.top - 1;
      }, mobile ? 'book-detail-body' : 'book-modal-scroll-pane'), `${label}: review clipped`);
      check(Math.abs((await page.locator('#book-modal-title').boundingBox()).y - titleTop) < 1, `${label}: title moved`);
      check(await page.evaluate(() => scrollY) === background, `${label}: background moved`);
      if (await toggle.count()) {
        await toggle.click();
        await page.waitForFunction(id => document.getElementById(id).scrollTop === 0, mobile ? 'book-detail-body' : 'book-modal-scroll-pane');
      }
      const lastPart = page.locator('#book-modal-slot [data-installment]').last();
      if (await lastPart.count()) {
        await lastPart.scrollIntoViewIfNeeded();
        const before = await pane.evaluate(e => e.scrollTop);
        await lastPart.click();
        check(await lastPart.getAttribute('aria-pressed') === 'true', `${label}: last volume inaccessible`);
        check(Math.abs(await pane.evaluate(e => e.scrollTop) - before) < 2, `${label}: volume switch reset scroll`);
      }
      if (id === 'book-1084336') await page.screenshot({ path: `output/playwright/book-review-${width}x${height}.png` });
      await close();
    }
  }
  await touch.detach();
  return 'Keyboard activation, focus containment/restoration, background scroll lock, series review fallback and small-screen details passed';
}
