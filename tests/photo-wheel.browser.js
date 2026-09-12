// Open the built photography page, then pass this function to playwright-cli run-code.
async (page) => {
  // The initial thumbnails must render even before the React bundle arrives.
  const coldContext = await page.context().browser().newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  try {
    const cold = await coldContext.newPage();
    await cold.goto(page.url());
    const initial = await cold.locator('[data-rwp-option]').evaluateAll(items => items
      .filter(item => getComputedStyle(item).visibility === 'visible')
      .map(item => Number(item.dataset.index)));
    if (JSON.stringify(initial) !== '[0,1,2,3]') throw Error(`Missing initial thumbnails: ${JSON.stringify(initial)}`);
    for (const img of await cold.locator('[data-rwp-option][style*="visibility:visible"] img').all()) {
      await img.evaluate(img => img.decode());
    }
    await cold.screenshot({ path: 'output/playwright/photo-wheel-before-js-desktop.png' });
    await cold.setViewportSize({ width: 390, height: 844 });
    await cold.screenshot({ path: 'output/playwright/photo-wheel-before-js-mobile.png' });
  } finally {
    await coldContext.close();
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  const picker = page.locator('.photo-wheel-scroll');
  await picker.waitFor();
  await page.evaluate(() => {
    window.nativePhotoWheels = [];
    document.addEventListener('wheel', event => {
      const scroller = event.target.closest('.photo-wheel-scroll');
      if (scroller) window.nativePhotoWheels.push(!event.defaultPrevented);
    });
  });
  const box = await page.locator('.photo-wheel-viewport').boundingBox();
  const position = () => picker.evaluate(element => element.scrollTop);
  const settle = async () => {
    await page.waitForTimeout(300);
    await page.waitForFunction(() => {
      const element = document.querySelector('.photo-wheel-scroll');
      const index = Math.round(element.scrollTop / 82);
      return Math.abs(element.scrollTop - index * 82) < 0.5 && element.children[index].getAttribute('aria-selected') === 'true';
    });
    const result = await picker.evaluate(element => {
      const index = Math.round(element.scrollTop / 82);
      return { top: element.scrollTop, index, selected: element.children[index].getAttribute('aria-selected') };
    });
    if (Math.abs(result.top - result.index * 82) > 1 || result.selected !== 'true') throw Error(`Incorrect resting selection: ${JSON.stringify(result)}`);
    return result.index;
  };
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.evaluate(() => {
    window.wheelFrames = [];
    window.sampleWheel = true;
    const sample = () => {
      window.wheelFrames.push(document.querySelector('.photo-wheel-scroll').scrollTop);
      if (window.sampleWheel) requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 12);
    await page.waitForTimeout(16);
  }
  const gentle = await settle();
  const frames = await page.evaluate(() => {
    window.sampleWheel = false;
    return window.wheelFrames.filter(value => Math.abs(value / 82 - Math.round(value / 82)) > 0.01).length;
  });
  if (gentle < 1 || frames < 5) throw Error('Wheel does not move continuously');
  const cursor = await picker.evaluate(element => getComputedStyle(element).cursor);
  if (cursor !== 'default') throw Error('Picker must use the normal cursor');
  const stageBox = await page.locator('#right-showcase-stage').boundingBox();
  await picker.evaluate(element => { element.scrollTop = 0; });
  await settle();
  await page.mouse.move(stageBox.x + stageBox.width / 2, stageBox.y + stageBox.height / 2);
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 12);
    await page.waitForTimeout(16);
  }
  const rightGentle = await settle();
  if (rightGentle !== gentle) throw Error('Left and right wheel distances differ');
  if (!await page.evaluate(() => window.nativePhotoWheels.length >= 24 && window.nativePhotoWheels.every(Boolean))) throw Error('Both sides must leave trackpad scrolling and gesture end to the browser');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await picker.evaluate(element => { element.scrollTop = 0; });
  await settle();
  for (let i = 0; i < 12; i++) {
    await page.mouse.wheel(0, 45);
    await page.waitForTimeout(16);
  }
  const fast = await settle();
  if (fast <= gentle) throw Error('Stronger gesture must travel farther');
  const beforeReverse = await position();
  for (let i = 0; i < 6; i++) {
    await page.mouse.wheel(0, -30);
    await page.waitForTimeout(16);
  }
  const reversed = await settle();
  if (await position() >= beforeReverse) throw Error('Reverse gesture failed');
  await picker.focus();
  await page.keyboard.press('ArrowDown');
  if (await settle() !== reversed + 1) throw Error('Keyboard must advance exactly once');
  const beforeDrag = await position();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 70);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 - 70, { steps: 12 });
  await page.mouse.up();
  await settle();
  if (await position() <= beforeDrag) throw Error('Mouse drag failed');
  const beforeRightDrag = await position();
  await page.mouse.move(stageBox.x + stageBox.width / 2, stageBox.y + stageBox.height / 2 + 70);
  await page.mouse.down();
  await page.mouse.move(stageBox.x + stageBox.width / 2, stageBox.y + stageBox.height / 2 - 70, { steps: 12 });
  await page.mouse.up();
  await settle();
  if (await position() <= beforeRightDrag) throw Error('Right-side drag failed');
  await page.keyboard.press('End');
  await settle();
  await page.keyboard.press('Home');
  if (await settle() !== 0) throw Error('Home must return to first photo');
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2 + 75);
  if (await settle() !== 1) throw Error('Clicking the next thumbnail must select it');
  const yearButton = page.locator('button[title^="跳转至 "]').first();
  const targetYear = (await yearButton.getAttribute('title')).match(/\d{4}/)[0];
  await yearButton.click();
  await settle();
  const selectedLabel = await picker.locator('[aria-selected="true"]').getAttribute('aria-label');
  if (!selectedLabel.startsWith(targetYear)) throw Error('External year selection failed');
  // A held drag owns the position, even if a mouse/trackpad also emits wheel events.
  for (const surface of [page.locator('.photo-wheel-viewport'), page.locator('#right-showcase-stage')]) {
    await picker.focus();
    await page.keyboard.press('Home');
    await settle();
    const box = await surface.boundingBox();
    const x = box.x + box.width / 2, y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    try {
      await page.mouse.move(x, y - 115, { steps: 10 });
      const held = await position();
      if (Math.abs(held - 115) > 1) throw Error('Drag must follow the pointer between photos');
      for (const wheel of [false, true]) {
        if (wheel) await page.mouse.wheel(0, 30);
        await page.waitForTimeout(1500);
        if (Math.abs(await position() - held) > 1) throw Error('Held drag snapped before release');
        if (await picker.locator('[role="option"]').first().getAttribute('aria-selected') !== 'true') throw Error('Held drag changed selection');
      }
      await page.mouse.move(x, y - 135, { steps: 4 });
      if (Math.abs(await position() - 135) > 1) throw Error('Drag must resume from the held position');
      await page.waitForTimeout(100);
    } finally {
      await page.mouse.up();
    }
    if (await settle() !== 2) throw Error('Release must snap to the nearest photo');
  }
  return { gentle, rightGentle, fast, intermediateFrames: frames, cursor, reverse: 'passed', keyboard: 'passed', drag: 'both sides passed', heldDrag: 'both sides stay put until release, including wheel events', boundaries: 'passed', thumbnailClick: 'passed', yearJump: 'passed' };
}
