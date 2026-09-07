// Open /marginalia/music/, then pass this function to playwright-cli run-code.
async (page) => {
  const results = [];
  for (const width of [320, 390, 479, 480, 639, 640, 767, 768, 1023, 1024, 1440, 1760, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.mouse.move(0, 0);
    const card = page.locator('.music-card:has(+ .music-card)').first();
    await card.hover();
    await page.waitForTimeout(550);
    const geometry = await card.evaluate(el => {
      const r = el.getBoundingClientRect();
      const next = el.nextElementSibling.getBoundingClientRect();
      const disc = el.querySelector('.vinyl-disc');
      const style = getComputedStyle(disc);
      const matrix = new DOMMatrix(style.transform);
      // Circular vinyl's visible edge, independent of its rotated square bounding box.
      const clearance = next.left - r.right - matrix.m41;
      const grid = getComputedStyle(el.parentElement);
      return { clearance, coverWidth: r.width, columns: grid.gridTemplateColumns.split(' ').length, gap: parseFloat(grid.columnGap), slide: matrix.m41, rotation: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI, duration: style.transitionDuration, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    // Reserve another 8px for the neighboring sleeve during rapid hover transitions.
    if (geometry.clearance < 15.9) throw Error(`${width}px: insufficient clearance ${geometry.clearance}`);
    const gap = width < 640 ? 24 : width < 768 ? 28 : 32;
    const columns = width < 640 ? 2 : width < 768 ? 3 : width < 1024 ? 4 : 6;
    const outerPadding = width < 640 ? 16 : width < 768 ? 32 : 48;
    const leftPadding = width < 640 ? 141 : Math.min(230, Math.max(160, width * 0.17)) + 60;
    const rightPadding = width < 640 ? 16 : width < 768 ? 32 : 48;
    const originalWidth = (Math.min(1760, width - outerPadding) - leftPadding - rightPadding - (columns - 1) * gap) / columns;
    if (geometry.columns !== columns || geometry.gap !== gap || Math.abs(geometry.coverWidth - originalWidth) > 0.1) throw Error('Original cover size or grid changed');
    const slide = Math.min(geometry.coverWidth * 0.22, gap - 16);
    if (Math.abs(geometry.slide - slide) > 0.01 || Math.abs(geometry.rotation - 40) > 0.1 || geometry.duration !== '0.5s') throw Error('Unexpected vinyl animation');
    if (geometry.overflow) throw Error(`${width}px: horizontal overflow`);
    results.push({ width, clearance: Math.round(geometry.clearance * 10) / 10 });
  }
  await page.locator('.music-card').first().click();
  await page.waitForFunction(() => document.getElementById('music-modal-backdrop').classList.contains('opacity-100'));
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.getElementById('music-modal-backdrop').classList.contains('pointer-events-none'));
  if (await page.locator('#nav-cv').getAttribute('href')) throw Error('CV must remain disabled');
  return { results, coversAndColumns: 'original sizes preserved', animation: 'shorter slide, same rotation and timing', modal: 'passed', cv: 'disabled' };
}
