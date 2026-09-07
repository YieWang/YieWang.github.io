// Open /marginalia, then pass this function to playwright-cli run-code.
async (page) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  const prints = page.locator('.photo-print');
  if (await prints.count() !== 4) throw new Error('Expected four prints');
  await page.locator('.photo-container img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  const checkLayout = async () => {
    const valid = await prints.evaluateAll(cards => cards.every(card => {
      const image = card.querySelector('img');
      const box = card.getBoundingClientRect();
      return box.left >= 0 && box.right <= innerWidth
        && Math.abs(image.clientWidth / image.clientHeight - image.naturalWidth / image.naturalHeight) < 0.03;
    }));
    if (!valid) throw new Error('Print clipped or image stretched');
    const captionsClear = await prints.evaluateAll(cards => cards.every(card => {
      const caption = card.querySelector('span');
      if (caption.scrollWidth > caption.clientWidth) return false;
      const text = caption.getBoundingClientRect();
      return cards.every(other => {
        if (other === card) return true;
        const box = other.getBoundingClientRect();
        return text.right <= box.left || text.left >= box.right || text.bottom <= box.top || text.top >= box.bottom;
      });
    }));
    if (!captionsClear) throw new Error('Photo overlaps a caption');
  };
  await page.waitForTimeout(1400);
  await checkLayout();
  const widths = await prints.evaluateAll(cards => cards.map(card => card.offsetWidth));
  if (new Set(widths).size !== 4) throw new Error('Print sizes should differ');
  const delays = await prints.evaluateAll(cards => cards.map(card => getComputedStyle(card).animationDelay));
  if (new Set(delays).size !== 4) throw new Error('Entrance should be staggered');
  await page.getByRole('link', { name: 'Explore Photography', exact: true }).hover();
  await page.waitForTimeout(650);
  await checkLayout();
  if (await prints.first().evaluate(card => getComputedStyle(card).translate) !== '-8px -5px') throw new Error('Hover did not spread prints');
  await page.getByRole('link', { name: 'Screen', exact: true }).hover();
  await page.getByRole('link', { name: 'Photography', exact: true }).hover();
  if (await prints.first().evaluate(card => card.getAnimations().length) === 0) throw new Error('Entrance did not replay');
  await page.waitForTimeout(1400);
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await checkLayout();
    if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw new Error('Horizontal overflow');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  if (await prints.first().evaluate(card => getComputedStyle(card).animationName) !== 'none') throw new Error('Reduced motion ignored');
  await checkLayout();
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  return 'Four original-ratio prints, staggered entrance, hover, replay, mobile and reduced motion: passed';
}
