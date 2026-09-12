async (page) => {
  const origin = await page.evaluate(() => location.origin);
  const requested = new Set();
  let failedUrl;
  await page.route('https://**/*', async route => {
    const request = route.request();
    if (request.resourceType() !== 'image') return route.continue();
    requested.add(request.url());
    // Fail one image per page so a broken asset cannot stall the queue.
    if (!failedUrl) {
      failedUrl = request.url();
      return route.fulfill({ status: 404, body: '' });
    }
    return route.fulfill({
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><rect width="10" height="10" fill="gray"/></svg>',
    });
  });
  const results = [];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ['music', 'screen', 'literature', 'games', 'photography']) {
      requested.clear();
      failedUrl = undefined;
      await page.goto(`${origin}/marginalia/${path}/`);
      await page.waitForFunction(() => [...document.images]
        .filter(image => image.getAttribute('src'))
        .every(image => image.loading !== 'lazy' && image.complete));
      const images = await page.evaluate(() => [...document.images]
        .filter(image => image.getAttribute('src'))
        .map(image => ({ src: image.src, loaded: image.naturalWidth > 0 })));
      const unexpected = images.filter(image => !image.loaded && image.src !== failedUrl);
      if (unexpected.length) throw Error(`${path}: unloaded images ${JSON.stringify(unexpected)}`);
      if (path === 'photography') {
        const count = await page.locator('#photo-mobile-thumbnails button').count();
        const fullSizeRequests = () => [...requested].filter(url => url.includes('-large-')).length;
        if (!count) throw Error('No photos found');
        for (let attempt = 0; attempt < 100 && fullSizeRequests() < count; attempt++) {
          await page.waitForTimeout(50);
        }
        if (fullSizeRequests() !== count) throw Error('Full-size photos still require navigation');
      }
      if (await page.evaluate(() => scrollY !== 0)) throw Error('Test must not scroll');
      results.push({ width, path, images: images.length, requested: requested.size });
    }
  }
  return { withoutScrolling: results, brokenImage: 'queue continues' };
}
