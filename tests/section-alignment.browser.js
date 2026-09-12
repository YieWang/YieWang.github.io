// npm run build && npm run test:browser -- section-alignment
async page => {
  const origin = await page.evaluate(() => location.origin);
  const context = await page.context().browser().newContext({ isMobile: true, hasTouch: true });
  const check = (valid, message) => { if (!valid) throw Error(message); };
  try {
    const mobile = await context.newPage();
    for (const [width, height] of [[320, 568], [390, 844], [430, 932], [667, 375], [844, 390]]) {
      await mobile.setViewportSize({ width, height });
      let baseline;
      for (const section of ['mathematics', 'marginalia', 'mathematics']) {
        if (!baseline || section === 'marginalia') await mobile.goto(`${origin}/${section}/`);
        else await mobile.locator('#nav-mathematics').tap();
        await mobile.evaluate(() => document.fonts.ready);
        await mobile.waitForFunction(id => document.querySelector('.active-section')?.id === `${id}-section`, section);
        await mobile.waitForTimeout(300);
        const geometry = await mobile.evaluate(() => {
          const section = document.querySelector('.active-section');
          const position = element => {
            const box = element.getBoundingClientRect();
            return [box.x + scrollX, box.y + scrollY];
          };
          return {
            anchors: [...section.querySelectorAll('h3')].slice(0, 2).map(position).concat([position(document.querySelector('#footer p'))]),
            footerClear: document.querySelector('#footer').getBoundingClientRect().top >= section.getBoundingClientRect().bottom,
            overflow: document.documentElement.scrollWidth > innerWidth,
            hidden: [...document.querySelectorAll('.section-pair > .hidden a')].every(link => getComputedStyle(link).visibility === 'hidden'),
          };
        });
        baseline ??= geometry.anchors;
        check(geometry.anchors.every((point, i) => point.every((value, j) => Math.abs(value - baseline[i][j]) < 0.5)), `${width} ${section}: misaligned ${JSON.stringify(geometry)}`);
        check(geometry.footerClear && !geometry.overflow && geometry.hidden, `${width} ${section}: overlap, overflow or hidden links`);
        if (width === 390) await mobile.screenshot({ path: `output/playwright/${section}-aligned.png`, fullPage: true });
      }
      await mobile.locator('#nav-home').tap();
      await mobile.waitForFunction(() => document.querySelector('#home-section').classList.contains('active-section'));
      check(await mobile.locator('.section-pair').isHidden(), `${width}: section pair visible on Home`);
    }
    const cv = mobile.locator('#nav-cv');
    check(await cv.getAttribute('href') === '/CV_full_academic.pdf' && await cv.getAttribute('target') === '_blank', 'CV must open the supplied PDF in a new tab');
    const pdf = await context.request.get(origin + await cv.getAttribute('href'));
    check(pdf.ok() && (await pdf.body()).subarray(0, 5).toString() === '%PDF-', 'CV must serve a PDF');
    check(await mobile.locator('link[rel="apple-touch-icon"]').getAttribute('href') === '/apple-touch-icon.png?v=2', 'Apple icon missing');
  } finally {
    await context.close();
  }
  return 'Mobile heading/footer alignment, direct loads, navigation, hidden links, CV and Apple icon passed';
}
