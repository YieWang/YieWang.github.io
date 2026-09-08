// Open /marginalia/music/, then pass this function to playwright-cli run-code.
async (page) => {
  const results = [];
  for (const width of [320, 390, 479, 480, 639, 640, 767, 768, 1023, 1024, 1440, 1760, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.mouse.move(0, 0);
    await page.waitForTimeout(550);
    const contentWidth = await page.evaluate(() => document.documentElement.clientWidth);
    const grid = page.locator('section .grid').filter({ has: page.locator('.music-card:nth-child(6)') }).first();
    const cards = grid.locator('.music-card');
    const columns = width < 640 ? 2 : width < 768 ? 3 : width < 1024 ? 4 : 6;
    const gap = width < 640 ? 24 : width < 768 ? 28 : 32;
    const outerPadding = width < 640 ? 16 : width < 768 ? 32 : 48;
    const leftPadding = width < 640 ? 141 : Math.min(230, Math.max(160, width * 0.17)) + 60;
    const rightPadding = width < 640 ? 16 : width < 768 ? 32 : 48;
    const originalWidth = (Math.min(1760, contentWidth - outerPadding) - leftPadding - rightPadding - (columns - 1) * gap) / columns;
    let minimumGap = Infinity;
    for (let index = 0; index < columns; index++) {
      const card = cards.nth(index);
      await card.hover();
      await page.waitForTimeout(550);
      const geometry = await card.evaluate(el => {
        const r = el.getBoundingClientRect();
        const disc = el.querySelector('.vinyl-disc');
        const style = getComputedStyle(disc);
        const matrix = new DOMMatrix(style.transform);
        const row = [...el.parentElement.children].filter(card => card.offsetTop === el.offsetTop);
        const index = row.indexOf(el);
        const previous = row[index - 1]?.getBoundingClientRect();
        const next = row[index + 1]?.getBoundingClientRect();
        return {
          width: r.width,
          rightGap: next ? next.left - r.right - matrix.m41 : Infinity,
          leftGap: previous ? r.left - 8 - previous.right : Infinity,
          edge: r.right + matrix.m41,
          leftEdge: r.left - 8,
          slide: matrix.m41 / r.width,
          rotation: Math.atan2(matrix.b, matrix.a) * 180 / Math.PI,
          duration: style.transitionDuration,
          columns: getComputedStyle(el.parentElement).gridTemplateColumns.split(' ').length,
          gap: parseFloat(getComputedStyle(el.parentElement).columnGap),
          otherCardsMoved: row.some(card => card !== el && Math.abs(new DOMMatrix(getComputedStyle(card).transform).m41) > 0.1),
          railRight: document.getElementById('artist-wheel').getBoundingClientRect().right
        };
      });
      if (Math.abs(geometry.width - originalWidth) > 0.1 || geometry.columns !== columns) throw Error(`${width}px viewport (${contentWidth}px content): expected ${originalWidth}px / ${columns} columns; got ${geometry.width}px / ${geometry.columns} columns`);
      if (geometry.otherCardsMoved) throw Error('Another album moved');
      if (index === 0 && geometry.leftEdge < geometry.railRight + 7.9) throw Error('Album too close to artist rail');
      if (geometry.rightGap < 7.9 || geometry.leftGap < 7.9) throw Error(`${width}px card ${index}: collision ${JSON.stringify(geometry)}`);
      if (geometry.edge > width + 0.1 || geometry.leftEdge < 0) throw Error('Vinyl outside viewport');
      if (Math.abs(geometry.slide - 0.22) > 0.001 || Math.abs(geometry.rotation - 40) > 0.1 || geometry.duration !== '0.5s') throw Error('Original vinyl animation changed');
      minimumGap = Math.min(minimumGap, geometry.rightGap, geometry.leftGap);
    }
    await page.mouse.move(0, 0);
    await page.waitForTimeout(550);
    if (await cards.evaluateAll(cards => cards.some(card => Math.abs(new DOMMatrix(getComputedStyle(card).transform).m41) > 0.1))) throw Error('Cards did not return to their original positions');
    results.push({ width, minimumGap });
  }
  await page.locator('.music-card').first().click();
  await page.waitForFunction(() => document.getElementById('music-modal-backdrop').classList.contains('opacity-100'));
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.getElementById('music-modal-backdrop').classList.contains('pointer-events-none'));
  return { results, coversAndColumns: 'original', vinylSlideAndRotation: 'original', modal: 'passed' };
}
