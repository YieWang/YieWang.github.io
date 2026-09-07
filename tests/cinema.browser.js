// Open the cinema page, then pass this function to playwright-cli run-code.
async page => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload();
  if (await page.locator('.cinema-card[data-type="film"]').count() !== 364) throw Error('Film count');
  if (await page.locator('.cinema-card[data-type="series"]').count() !== 51) throw Error('Series count');
  const office = page.locator('.cinema-card[data-item-id="tv-2316"]');
  await office.click();
  await page.waitForFunction(() => getComputedStyle(document.getElementById('cinema-modal-container')).opacity === '1' && getComputedStyle(document.getElementById('cinema-modal-backdrop')).opacity === '1');
  if (await page.locator('.watched-entry').count() !== 9) throw Error('Office seasons must share one poster and retain nine watched entries');
  const dates = await page.locator('.watched-entry').allTextContents();
  if (!dates.every(s => s.includes('2026-09-07'))) throw Error('Watched dates changed');
  await page.waitForFunction(() => [...document.querySelectorAll('#modal-content-slot img')].every(i => i.complete && i.naturalWidth));
  await page.screenshot({ path: 'output/playwright/cinema-series-desktop.png' });
  await page.keyboard.press('Escape');
  await page.waitForFunction(() => document.getElementById('cinema-modal-backdrop').classList.contains('pointer-events-none'));
  await page.setViewportSize({ width: 390, height: 844 });
  await office.click();
  await page.waitForFunction(() => getComputedStyle(document.getElementById('cinema-modal-container')).opacity === '1' && getComputedStyle(document.getElementById('cinema-modal-backdrop')).opacity === '1');
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error('Horizontal overflow');
  await page.screenshot({ path: 'output/playwright/cinema-series-mobile.png' });
  await page.keyboard.press('Escape');
  return { films: 364, series: 51, officeWatchedEntries: 9, dates: 'passed', modal: 'passed', mobile: 'passed' };
}
