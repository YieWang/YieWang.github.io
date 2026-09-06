// Open the built photography page, then pass this function to playwright-cli run-code.
async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  const picker = page.locator('.photo-wheel-scroll');
  await picker.waitFor();
  const box = await picker.boundingBox();
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
  await page.getByTitle('跳转至 2025 年').click();
  await settle();
  const selectedLabel = await picker.locator('[aria-selected="true"]').getAttribute('aria-label');
  if (!selectedLabel.startsWith('2025')) throw Error('External year selection failed');
  return { gentle, rightGentle, fast, intermediateFrames: frames, cursor, reverse: 'passed', keyboard: 'passed', drag: 'both sides passed', boundaries: 'passed', thumbnailClick: 'passed', yearJump: 'passed' };
}
