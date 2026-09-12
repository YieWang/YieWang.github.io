// Open /marginalia/photography, then pass this function to playwright-cli run-code.
async (page) => {
  await page.reload();
  const picker = page.locator('.photo-wheel-scroll');
  await picker.waitFor();
  for (const width of [1440, 900]) {
    await page.setViewportSize({ width, height: 900 });
    for (const top of [0, 20, 41, 82, 160, 240]) {
      await picker.evaluate((element, top) => {
        element.style.scrollSnapType = 'none';
        element.scrollTop = top;
      }, top);
      await page.waitForFunction(top =>
        Math.abs(parseFloat(document.querySelector('[data-rwp-options]').style.getPropertyValue('--photo-wheel-angle')) - top / 82 * 22.5) < 0.01, top);
      const caption = await page.locator('[data-rwp-option] .city-header-badge').first().evaluate(element => ({
        rendered: element.getBoundingClientRect().height,
        height: parseFloat(getComputedStyle(element).height),
        opacity: Number(getComputedStyle(element).opacity),
        filter: getComputedStyle(element).filter,
      }));
      if (Math.abs(caption.rendered - caption.height) > 0.5) throw Error(`City caption flattened: ${JSON.stringify({ width, top, caption })}`);
      if (top === 0 && (caption.opacity !== 1 || caption.filter !== 'blur(0px)')) throw Error('Centered caption must be clear');
      if (top > 0 && top < 82 && !(caption.opacity > 0.32 && caption.opacity < 1)) throw Error('Caption clarity must follow the scroll continuously');
      if (top >= 82 && (caption.opacity > 0.4 || caption.filter === 'blur(0px)')) throw Error('Unselected caption must stay soft and faded');
      if (!await page.locator('[data-rwp-highlight-item] .city-header-badge').evaluateAll(items =>
        items.every(item => getComputedStyle(item).visibility === 'hidden'))) throw Error('Duplicate city captions visible');
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  await picker.waitFor();
  for (const surface of [page.locator('.photo-wheel-viewport'), page.locator('#right-showcase-stage')]) {
    const before = await picker.evaluate(element => element.scrollTop);
    const box = await surface.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 60);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 - 60, { steps: 12 });
    await page.mouse.up();
    await page.waitForFunction(before => {
      const element = document.querySelector('.photo-wheel-scroll');
      const index = Math.round(element.scrollTop / 82);
      return element.scrollTop > before && Math.abs(element.scrollTop - index * 82) < 0.5
        && element.children[index].getAttribute('aria-selected') === 'true';
    }, before);
    await page.waitForFunction(() => {
      const title = document.querySelector('#meta-title').textContent;
      return [...document.querySelectorAll('.stage-layer-img')].some(img =>
        getComputedStyle(img).opacity === '1' && img.alt === title && img.complete && img.naturalWidth > 0);
    });
  }
  return 'City captions remain face-on without duplicates at six positions at two desktop widths; both drag surfaces snap and synchronize.';
}
