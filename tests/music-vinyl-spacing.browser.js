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
      return { clearance, slide: matrix.m41 / r.width, rotation: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI, duration: style.transitionDuration, overflow: document.documentElement.scrollWidth > innerWidth };
    });
    // Reserve another 8px for the neighboring sleeve during rapid hover transitions.
    if (geometry.clearance < 16) throw Error(`${width}px: insufficient clearance ${geometry.clearance}`);
    if (Math.abs(geometry.slide - 0.22) > 0.001 || Math.abs(geometry.rotation - 40) > 0.1 || geometry.duration !== '0.5s') throw Error('Vinyl animation changed');
    if (geometry.overflow) throw Error(`${width}px: horizontal overflow`);
    results.push({ width, clearance: Math.round(geometry.clearance * 10) / 10 });
  }
  await page.locator('.music-card').first().click();
  await page.waitForFunction(() => document.getElementById('music-modal-backdrop').classList.contains('opacity-100'));
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.getElementById('music-modal-backdrop').classList.contains('pointer-events-none'));
  if (await page.locator('#nav-cv').getAttribute('href')) throw Error('CV must remain disabled');
  return { results, animation: 'unchanged', modal: 'passed', cv: 'disabled' };
}
