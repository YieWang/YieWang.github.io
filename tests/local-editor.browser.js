// Prepare output/playwright/editor-check.png, open the local editor, then pass this function to playwright-cli run-code.
async page => {
  const origin = page.url().split('/').slice(0, 3).join('/');
  const read = async () => (await page.request.get(origin + '/__editor/data/literature')).json();
  const baseline = await read();
  const testTitle = '本地编辑检查 <文字> & 图片';
  let createdId, uploaded;
  const editMode = async () => {
    const on = page.getByRole('button', { name: '编辑模式', exact: true });
    if (await on.count()) await on.click();
  };
  const save = async () => {
    await page.locator('#local-editor-panel footer').getByRole('button', { name: '保存并预览', exact: true }).click();
    await page.waitForFunction(() => !document.getElementById('local-editor-panel').open && document.querySelector('#local-editor-toolbar [role=status]').textContent.includes('已保存'));
  };
  try {
    await page.goto(origin + '/marginalia/literature');
    await page.setViewportSize({ width: 1440, height: 960 });
    await editMode();
    await page.getByRole('button', { name: '新增 / 管理', exact: true }).click();
    await page.getByRole('button', { name: '+ 新增书籍', exact: true }).click();
    await page.getByLabel('标题 *', { exact: true }).fill(testTitle);
    await page.getByLabel('作者', { exact: true }).fill('本机测试');
    await page.getByLabel('年份', { exact: true }).fill('2026');
    await page.getByLabel('出版社与版本', { exact: true }).fill('测试版本');
    await page.getByLabel('上传封面', { exact: true }).setInputFiles('/Users/wangyi/Documents/Homepage/output/playwright/editor-check.png');
    await page.waitForFunction(() => !document.getElementById('local-editor-panel').inert && document.querySelector('input[name$=".coverUrl"]').value.startsWith('/local-uploads/'));
    uploaded = { url: await page.locator('input[name$=".coverUrl"]').inputValue() };
    if (!uploaded.url) throw Error('Image upload failed: ' + JSON.stringify(uploaded));
    await page.locator('#local-editor-panel summary').filter({ hasText: /^长评$/ }).click();
    await page.getByLabel('正文（空行分段） *', { exact: true }).fill('第一段 <em>应原样显示</em>。\n\n第二段：保存后仍然存在。');
    await page.screenshot({ path: 'output/playwright/local-editor-form.png' });
    await save();
    const saved = await read();
    const book = saved.data.books.find(b => b.title === testTitle);
    if (!book || saved.data.books.length !== baseline.data.books.length + 1) throw Error('New entry did not persist');
    createdId = book.id;
    if (book.coverUrl !== uploaded.url || !book.review.content.includes('第二段')) throw Error('Image or prose lost');
    await page.locator('.book-card').filter({ hasText: testTitle }).click();
    await page.waitForFunction(() => document.getElementById('book-modal-slot').textContent.includes('<em>应原样显示</em>'));
    if (await page.locator('#book-modal-slot em').count()) throw Error('Plain text was interpreted as HTML');
    await page.keyboard.press('Escape');
    await page.waitForFunction(() => document.getElementById('book-modal-backdrop').classList.contains('pointer-events-none'));
    await editMode();
    const title = page.locator('.book-card h3').filter({ hasText: testTitle });
    await title.click();
    await page.locator('[contenteditable]').fill(testTitle + ' · 改名');
    await page.keyboard.press('Enter');
    await page.locator('#local-editor-toolbar').getByRole('button', { name: '保存并预览' }).click();
    await page.waitForFunction(() => document.querySelector('#local-editor-toolbar [role=status]').textContent.includes('已保存'));
    if (!(await read()).data.books.find(b => b.id === createdId).title.endsWith('改名')) throw Error('Inline title did not persist');
    await editMode();
    await page.locator('.book-card img').first().click();
    await page.getByLabel('隐藏此条目（保留内容）', { exact: true }).check();
    await save();
    if (!(await read()).data.books.find(b => b.id === createdId).hidden) throw Error('Hide did not persist');
    if (await page.locator('.book-card').filter({ hasText: testTitle }).count()) throw Error('Hidden item still visible');
    await editMode();
    await page.getByRole('button', { name: '新增 / 管理', exact: true }).click();
    if (!await page.getByRole('button', { name: testTitle + ' · 改名 · 已隐藏', exact: true }).count()) throw Error('Hidden entry cannot be recovered in manager');
    await page.getByRole('button', { name: '关闭', exact: true }).click();
    return { result: 'passed', checks: ['add', 'upload', 'save and reload', 'plain text', 'inline rename', 'hide and find'], uploaded };
  } catch (error) {
    throw Error('Browser check: ' + error.message);
  } finally {
    const latest = await read();
    latest.data.books = latest.data.books.filter(b => b.id !== createdId && !b.title.startsWith(testTitle));
    const result = await page.request.post(origin + '/__editor/data/literature', {
      headers: { Origin: origin, 'X-Homepage-Editor': '1' }, data: { revision: latest.revision, data: latest.data },
    });
    if (!result.ok()) throw Error('Test entry cleanup failed: ' + await result.text());

  }
}
