// Open the photography page, then pass this function to playwright-cli run-code.
async (page) => {
  const picker = page.locator('.photo-wheel-scroll');
  const check = async index => {
    await page.waitForFunction(index => {
      const wheel = document.querySelector('.photo-wheel-scroll');
      const thumbnail = document.querySelectorAll('[data-rwp-option] img')[index];
      const image = [...document.querySelectorAll('.stage-layer-img')].find(img => getComputedStyle(img).opacity === '1');
      return Math.abs(wheel.scrollTop - index * 82) < 0.5
        && wheel.children[index].getAttribute('aria-selected') === 'true'
        && image?.complete && image.naturalWidth > 0 && image.alt === thumbnail.alt
        && document.getElementById('meta-title').textContent.trim() === thumbnail.alt;
    }, index);
  };
  const results = [];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await picker.focus();
    // Wait for hydration as well as the initial server-rendered listbox.
    await page.waitForFunction(() => document.querySelector('astro-island')?.hasAttribute('ssr') === false);
    for (const gap of [0, 30, 70, 120, 300]) {
      await page.keyboard.press('Home');
      await check(0);
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(gap);
      await page.keyboard.press('ArrowDown');
      await check(2);
      results.push({ width, gap, index: 2 });
    }
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await check(3);
    await page.keyboard.press('Home');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('ArrowDown');
    await check(1);
    const last = await picker.locator('[role="option"]').count() - 1;
    await page.keyboard.press('End');
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowUp');
    await check(last - 1);
  }
  return { rapidDoublePress: results, reversal: 'passed', boundaries: 'passed', imageSync: 'passed' };
}
