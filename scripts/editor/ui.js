import { fresh, matchesSearch } from '/__editor/schema.js';

const section = location.pathname.split('/')[2];
const docName = section === 'screen' ? 'cinema' : section === 'table-tennis' ? 'interest-text' : ['cinema', 'music', 'literature', 'photography', 'games'].includes(section) ? section : null;
const style = document.createElement('link');
style.rel = 'stylesheet'; style.href = '/__editor/style.css'; document.head.append(style);
const el = (tag, text, attrs = {}) => {
  const node = document.createElement(tag);
  if (text !== null) node.textContent = text;
  Object.assign(node, attrs); return node;
};
const button = (text, action) => {
  const node = el('button', text, { type: 'button' });
  node.addEventListener('click', () => Promise.resolve().then(action).catch(showError)); return node;
};
async function api(path, data, image = false) {
  const response = await fetch('/__editor/' + path, data === undefined ? { cache: 'no-store' } : {
    method: 'POST', headers: { 'Content-Type': image ? 'application/octet-stream' : 'application/json', 'X-Homepage-Editor': '1' },
    body: image ? data : JSON.stringify(data),
  });
  const result = await response.json();
  if (!response.ok) throw Error(result.error || '操作失败');
  return result;
}
let state, data, dirty = false, busy = false, editing = false, currentList, currentRecord, restoreFocus;
const get = path => path.reduce((value, key) => value[key], data);
const labelOf = item => item.title || item.displayName || item.name || item.location || String(item.year || '新条目');
const toolbar = el('div', null, { id: 'local-editor-toolbar' });
toolbar.setAttribute('aria-label', '本地主页编辑器');
const modeButton = button('编辑模式', () => setMode(!editing));
const manageButton = button('新增 / 管理', () => manage());
const saveButton = button('保存', save);
const status = el('span', '', { role: 'status' });
const navigation = el('select', null, { ariaLabel: '选择兴趣栏目' });
for (const [value, name] of [['', '选择栏目'], ['photography', '摄影'], ['screen', '影视'], ['music', '音乐'], ['literature', '文学'], ['games', '游戏'], ['table-tennis', '乒乓球']]) {
  navigation.append(el('option', name, { value, selected: value === section }));
}
navigation.addEventListener('change', () => { if (navigation.value) location.href = '/marginalia/' + navigation.value; });
const searchForm = el('form', null, { role: 'search' });
const quickSearch = el('input', null, { type: 'search', placeholder: '搜索当前栏目，按回车', ariaLabel: '搜索当前栏目', disabled: true });
searchForm.append(quickSearch);
searchForm.onsubmit = event => { event.preventDefault(); if (state && quickSearch.value.trim()) searchContent(); };
toolbar.append(navigation, searchForm, modeButton, manageButton, saveButton, status);
document.body.append(toolbar);
const dialog = el('dialog', null, { id: 'local-editor-panel', ariaLabel: '编辑内容' });
const header = el('header');
const heading = el('strong', '编辑内容');
header.append(heading, button('关闭', close));
const content = el('div', null, { className: 'le-content' });
const errorBox = el('p', '', { className: 'le-error', role: 'alert' });
const footer = el('footer');
footer.append(button('放弃本次修改', discard), button('保存', save));
dialog.append(header, errorBox, content, footer); document.body.append(dialog);
function showError(error) {
  errorBox.textContent = error.message || String(error);
  status.textContent = '未保存 · 请查看提示';
  if (!dialog.open) { content.replaceChildren(el('p', '操作没有完成，已填写的内容仍保留。')); open(); }
}
function changed() { dirty = true; status.textContent = '有未保存修改'; saveButton.disabled = false; }
function open() { if (!dialog.open) { restoreFocus = document.activeElement; dialog.showModal(); } }
function close() {
  if (busy) return;
  dialog.close(); restoreFocus?.focus?.();
  // Closing only hides the panel. Drafts remain in memory until saved or explicitly discarded.
  if (dirty) status.textContent = '有未保存修改';
}
function discard() {
  if (busy || (dirty && !confirm('放弃尚未保存的修改？已保存的内容不会受影响。'))) return;
  data = structuredClone(state.data); dirty = false;
  location.reload();
}
dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
const outsidePanel = event => {
  const rect = dialog.getBoundingClientRect();
  return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
};
let pressedOutside = false;
dialog.addEventListener('pointerdown', event => { pressedOutside = outsidePanel(event); });
dialog.addEventListener('click', event => {
  if (pressedOutside && outsidePanel(event)) close();
  pressedOutside = false;
});
dialog.addEventListener('keydown', event => event.stopPropagation());
window.addEventListener('beforeunload', event => { if (dirty || busy) { event.preventDefault(); event.returnValue = ''; } });
document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key === 's' && docName) {
    event.preventDefault(); save().catch(showError);
  }
}, true);
function setMode(on) {
  editing = on;
  document.body.classList.toggle('local-editing', on);
  sessionStorage.setItem('homepage-editing', on ? '1' : '0');
  modeButton.textContent = on ? '退出编辑' : '编辑模式';
  modeButton.setAttribute('aria-pressed', String(on));
  manageButton.hidden = !on || !docName;
  saveButton.hidden = !docName;
  saveButton.disabled = !dirty;
  if (!docName) status.textContent = '先选择一个兴趣栏目';
}

// Follow the actual content tree: lists of works, albums, tracks, years and photographs.
function lists(value = data, schema = state.schema, path = [], trail = '') {
  const found = [];
  if (schema.type === 'array') {
    found.push({ items: value, schema, path, label: trail + schema.label });
    value.forEach((item, index) => found.push(...lists(item, { ...schema, type: 'object' }, [...path, index], trail + labelOf(item) + ' / ')));
  } else if (schema.type === 'object') {
    for (const [key, field] of Object.entries(schema.fields)) {
      if (field.type === 'array' && value[key]) found.push(...lists(value[key], field, [...path, key], trail));
    }
  }
  return found;
}

function searchContent() {
  currentRecord = null; errorBox.textContent = '';
  heading.textContent = '搜索 · ' + state.label;
  const input = el('input', null, { type: 'search', value: quickSearch.value, ariaLabel: '搜索栏目内容', placeholder: '标题、作者、正文…' });
  const count = el('p', '', { role: 'status' });
  const rows = el('div', null, { className: 'le-list' });
  const collections = lists().filter(list => !list.schema.advanced);
  const records = collections.flatMap(list => list.items.map((item, index) => ({ item, schema: list.schema, path: [...list.path, index], list })));
  if (!collections.length) records.push({ item: data, schema: state.schema, path: [], list: null });
  const render = () => {
    quickSearch.value = input.value;
    rows.replaceChildren();
    const found = records.filter(record => matchesSearch(record.item, record.schema, input.value, record.list?.label || state.label));
    count.textContent = !input.value.trim() ? '输入要查找的文字' : found.length ? `找到 ${found.length} 项` : '没有找到匹配内容';
    for (const record of found) {
      const row = el('div', null, { className: 'le-row' });
      row.append(button((record.list ? labelOf(record.item) : state.label) + (record.item.hidden ? ' · 已隐藏' : '') + (record.list ? ' · ' + record.list.label : ''), () => locateRecord(record)));
      rows.append(row);
    }
  };
  input.oninput = render;
  content.replaceChildren(input, count, rows);
  render(); open(); input.focus();
}

function locateRecord(record) {
  const ancestors = record.path.map((_, index) => get(record.path.slice(0, index + 1))).filter(value => value && !Array.isArray(value) && typeof value === 'object');
  if (ancestors.some(item => item.hidden)) {
    errorBox.textContent = '此条目或所属内容已隐藏，请在“新增 / 管理”中取消隐藏后再定位。';
    return;
  }
  const ids = new Set(ancestors.map(item => item.id).filter(Boolean));
  const includesId = item => ids.has(item.id) || item.installments?.some(includesId);
  let target;
  if (docName === 'cinema' || docName === 'literature' || docName === 'music') {
    target = [...document.querySelectorAll('.cinema-card, .book-card, .essay-item, .music-card')].find(card =>
      includesId(JSON.parse(card.dataset.itemJson || card.dataset.bookJson || card.dataset.essayJson || card.dataset.albumJson)));
    if (docName === 'music' && record.path[0] === 'artists') target = document.getElementById('section-' + record.item.id);
  } else if (docName === 'games') {
    target = [...document.querySelectorAll('.interest-page article')].find(card => card.querySelector('a')?.getAttribute('href') === record.item.url);
  } else if (docName === 'interest-text') target = document.querySelector('.interest-page');
  else if (docName === 'photography') {
    const photos = record.item.imageUrl ? [record.item] : (record.item.photos || record.item.cities?.filter(city => !city.hidden).flatMap(city => city.photos) || []);
    const photo = photos.find(item => !item.hidden && document.getElementById('photo-option-' + item.id));
    if (photo) {
      window.dispatchEvent(new CustomEvent('photography:photo-selected', { detail: photo }));
      window.dispatchEvent(new CustomEvent('photography:external-photo-selected', { detail: photo }));
      target = document.getElementById('right-showcase-stage');
    }
  }
  if (!target) {
    errorBox.textContent = '当前页面没有这个条目的可见位置；新增或修改的内容请先保存后再定位。';
    return;
  }
  const category = target.closest('section[id^="section-"]');
  if (docName === 'cinema' && category) document.querySelector(`[data-cinema-tab="${category.id.slice(8)}"]`)?.click();
  if (docName === 'literature') document.getElementById(target.classList.contains('essay-item') ? 'tab-btn-essays' : 'tab-btn-books')?.click();
  close();
  target.scrollIntoView({ block: 'center', behavior: 'instant' });
  const oldTabIndex = target.getAttribute('tabindex');
  target.tabIndex = -1; target.focus({ preventScroll: true });
  target.classList.add('le-search-target');
  target.addEventListener('blur', () => {
    if (oldTabIndex === null) target.removeAttribute('tabindex'); else target.setAttribute('tabindex', oldTabIndex);
  }, { once: true });
  setTimeout(() => target.classList.remove('le-search-target'), 1800);
}
function manage(selected = currentList) {
  if (!docName) return;
  errorBox.textContent = ''; currentRecord = null;
  const collections = lists();
  if (!collections.length) return editRecord([], state.schema);
  currentList = selected && collections.find(list => JSON.stringify(list.path) === JSON.stringify(selected.path)) || collections[0];
  heading.textContent = '新增 / 管理';
  content.replaceChildren();
  const select = el('select', null, { ariaLabel: '内容列表' });
  collections.forEach((list, i) => select.append(el('option', list.label, { value: String(i), selected: list === currentList })));
  select.onchange = () => manage(collections[Number(select.value)]);
  const search = el('input', null, { type: 'search', placeholder: '搜索标题，也能找到隐藏条目', ariaLabel: '搜索内容' });
  const rows = el('div', null, { className: 'le-list' });
  let dragIndex = null;
  const move = (from, to) => {
    if (from === to || to < 0 || to >= currentList.items.length) return;
    currentList.items.splice(to, 0, currentList.items.splice(from, 1)[0]);
    changed(); render();
  };
  const render = () => {
    rows.replaceChildren();
    currentList.items.forEach((item, index) => {
      if (!labelOf(item).toLowerCase().includes(search.value.toLowerCase())) return;
      const row = el('div', null, { className: 'le-row' });
      row.append(button(labelOf(item) + (item.hidden ? ' · 已隐藏' : ''), () => editRecord([...currentList.path, index], currentList.schema)));
      if (currentList.schema.reorder !== false) {
        const handle = el('button', '⠿', { type: 'button', draggable: true, className: 'le-drag', ariaLabel: '排序 ' + labelOf(item), title: '拖动排序，也可聚焦后按上下方向键' });
        handle.addEventListener('dragstart', event => {
          dragIndex = index;
          event.dataTransfer.effectAllowed = 'move';
          event.dataTransfer.setData('text/plain', String(index));
        });
        const clearDrop = () => rows.querySelectorAll('[data-drop]').forEach(node => node.removeAttribute('data-drop'));
        handle.addEventListener('dragend', () => { dragIndex = null; clearDrop(); });
        row.addEventListener('dragover', event => {
          if (dragIndex === null) return;
          event.preventDefault(); clearDrop();
          row.dataset.drop = event.clientY < row.getBoundingClientRect().top + row.offsetHeight / 2 ? 'before' : 'after';
        });
        row.addEventListener('drop', event => {
          if (dragIndex === null) return;
          event.preventDefault();
          const slot = index + (row.dataset.drop === 'after' ? 1 : 0);
          const from = dragIndex; dragIndex = null; clearDrop();
          move(from, slot - (from < slot ? 1 : 0));
        });
        handle.addEventListener('keydown', event => {
          if (!['ArrowUp', 'ArrowDown'].includes(event.key)) return;
          event.preventDefault();
          const to = index + (event.key === 'ArrowUp' ? -1 : 1);
          move(index, to);
          rows.querySelector(`[data-index="${Math.max(0, Math.min(currentList.items.length - 1, to))}"] .le-drag`)?.focus({ preventScroll: true });
        });
        row.dataset.index = String(index);
        row.append(handle);
      }
      rows.append(row);
    });
    if (!rows.childElementCount) rows.append(el('p', '暂无条目。点击“新增”开始。'));
  };
  search.oninput = render;
  content.append(select, search, button('+ 新增' + currentList.schema.label, () => {
    const item = fresh(currentList.schema);
    item.id = 'local-' + crypto.randomUUID();
    const parent = currentList.path.length > 1 ? get(currentList.path.slice(0, -1)) : null;
    if (parent && !Array.isArray(parent)) {
      for (const key of ['year', 'location', 'locationEn']) if (key in item && key in parent) item[key] = parent[key];
    }
    if ('artistId' in item) item.artistId = data.artists?.[0]?.id || '';
    if ('author' in item && 'content' in item) item.author = '王怡';
    currentList.items.push(item); changed();
    editRecord([...currentList.path, currentList.items.length - 1], currentList.schema);
  }), rows);
  if (docName === 'games') content.append(button('编辑约玩文字', () => { location.href = '/marginalia/table-tennis'; }));
  render(); open();
}
function editRecord(path, schema, focusKey) {
  errorBox.textContent = ''; currentRecord = { path, schema };
  const item = get(path);
  heading.textContent = '编辑 · ' + labelOf(item);
  content.replaceChildren();
  const form = el('form'); form.onsubmit = event => { event.preventDefault(); save().catch(showError); };
  form.addEventListener('invalid', event => revealField(event.target), true);
  renderFields(form, item, schema, path);
  content.append(form);
  if (typeof path.at(-1) === 'number') {
    const actions = el('details'); actions.append(el('summary', '更多操作'));
    actions.append(button('删除此条目', () => {
      if (!confirm(`删除“${labelOf(item)}”？${Object.values(item).some(v => Array.isArray(v) && v.length) ? '其中的子条目也会一并删除。' : ''}保存后生效。`)) return;
      get(path.slice(0, -1)).splice(path.at(-1), 1); changed(); manage();
    }));
    content.append(actions);
  }
  content.append(button('返回内容列表', () => manage()));
  open();
  if (focusKey) {
    const input = form.querySelector(`[name="${focusKey}"]`);
    const focus = input?.closest('.le-field')?.querySelector('input[type=file]') || input;
    if (focus) { revealField(focus); focus.focus(); }
  }
}
function revealField(input) {
  for (let parent = input.parentElement; parent; parent = parent.parentElement) {
    if (parent.tagName === 'DETAILS') parent.open = true;
  }
}
function renderFields(parent, item, schema, path, optional = false) {
  const secondary = {};
  for (const [key, field] of Object.entries(schema.fields)) {
    if (field.advanced || (schema.primary && !schema.primary.includes(key))) {
      secondary[key] = { ...field, advanced: false };
      continue;
    }
    if (field.type === 'array') {
      parent.append(button(`${field.label}（${item[key]?.length || 0}）· 管理`, () => {
        item[key] ||= [];
        manage({ path: [...path, key] });
      }));
      continue;
    }
    if (field.type === 'object') {
      const details = el('details'); details.append(el('summary', field.label));
      details.open = key === 'review';
      const nested = item[key] || {};
      const fields = el('div', null, { className: 'le-nested' });
      renderFields(fields, nested, field, [...path, key], true);
      fields.addEventListener('input', () => {
        if (Object.values(nested).some(v => v !== '' && v !== undefined)) item[key] = nested;
        else delete item[key];
      });
      const actions = el('details'); actions.append(el('summary', '更多操作'));
      actions.append(button('清空' + field.label, () => {
        for (const nestedKey of Object.keys(nested)) delete nested[nestedKey];
        delete item[key];
        fields.querySelectorAll('input, textarea, select').forEach(input => { input.value = ''; });
        changed();
      })); details.append(fields, actions); parent.append(details); continue;
    }
    const label = el('label', null, { className: 'le-field' });
    label.append(el('span', field.label + (field.required ? ' *' : '')));
    let input;
    if (field.type === 'rating' || field.options || field.relation) {
      input = el('select');
      let options = field.options || (field.relation ? (data[field.relation] || []).map(a => [a.id, labelOf(a)]) : Array.from({ length: 11 }, (_, i) => [`${i / 2} / 5`, `${i / 2} / 5`]));
      options = [['', '未填写'], ...options.map(o => Array.isArray(o) ? o : [o, o])];
      if (item[key] && !options.some(o => o[0] === item[key])) options.push([item[key], item[key]]);
      for (const [value, title] of options) input.append(el('option', title, { value }));
    } else input = el(field.type === 'textarea' ? 'textarea' : 'input', null, field.type === 'textarea' ? { rows: 6 } : { type: ['number', 'checkbox'].includes(field.type) ? field.type : 'text' });
    input.ariaLabel = field.label + (field.required ? ' *' : '');
    input.name = [...path, key].join('.');
    if (field.type === 'checkbox') input.checked = Boolean(item[key]); else input.value = item[key] ?? '';
    input.required = Boolean(field.required) && !optional;
    if (field.min !== undefined) input.min = field.min;
    input.oninput = () => {
      item[key] = field.type === 'checkbox' ? input.checked : field.type === 'number' ? (input.value === '' ? undefined : Number(input.value)) : input.value;
      if (currentRecord) heading.textContent = '编辑 · ' + labelOf(get(currentRecord.path));
      changed();
    };
    if (field.type !== 'image') label.append(input);
    parent.append(label);
    if (field.type === 'image') {
      const preview = el('img', null, { className: 'le-image', alt: field.label, hidden: !item[key] });
      if (item[key]) preview.src = item[key];
      input.addEventListener('input', () => { preview.hidden = !input.value; if (input.value) preview.src = input.value; });
      const upload = el('input', null, { type: 'file', accept: 'image/jpeg,image/png,image/webp,image/avif,image/gif,image/tiff', ariaLabel: '上传' + field.label });
      upload.onchange = async () => {
        const file = upload.files[0]; if (!file) return;
        busy = true; status.textContent = '正在处理图片…'; dialog.inert = true;
        try {
          const result = await api('image', file, true);
          item[key] = result.url; input.value = result.url; preview.src = result.url; preview.hidden = false;
          if (key === 'imageUrl') {
            Object.assign(item, { thumbnailUrl: result.thumbnailUrl, width: result.width, height: result.height });
            const thumb = parent.querySelector(`[name="${[...path, 'thumbnailUrl'].join('.')}"]`);
            if (thumb) { thumb.value = result.thumbnailUrl; thumb.dispatchEvent(new Event('input', { bubbles: true })); }
          }
          input.dispatchEvent(new Event('input', { bubbles: true })); changed();
        } catch (error) { showError(error); }
        finally { busy = false; dialog.inert = false; }
      };
      const address = el('details'); address.append(el('summary', '图片地址'), input);
      label.append(preview, upload, address);
    }
  }
  if (Object.keys(secondary).length) {
    const details = el('details'); details.append(el('summary', '其他信息'));
    renderFields(details, item, { fields: secondary }, path, optional);
    parent.append(details);
  }
}
async function save() {
  if (busy || !dirty) return;
  const form = content.querySelector('form');
  if (dialog.open && form && !form.reportValidity()) return;
  busy = true; dialog.inert = true; toolbar.inert = true; status.textContent = '正在保存…';
  try {
    await api('data/' + docName, { revision: state.revision, data });
    const tab = document.querySelector('[data-cinema-tab][aria-pressed="true"]')?.dataset.cinemaTab;
    const essays = document.getElementById('view-essays') && !document.getElementById('view-essays').classList.contains('hidden');
    sessionStorage.setItem('homepage-preview', JSON.stringify({ path: location.pathname, tab, essays }));
    dirty = false; busy = false; location.reload();
  } catch (error) { showError(error); }
  finally { busy = false; dialog.inert = false; toolbar.inert = false; }
}

function findRecord(match) {
  for (const list of lists()) {
    const index = list.items.findIndex(match);
    if (index !== -1) return { path: [...list.path, index], schema: list.schema };
  }
}
let activePhotoId;
window.addEventListener('photography:photo-selected', event => { activePhotoId = event.detail.id; });
window.addEventListener('photography:external-photo-selected', event => { activePhotoId = event.detail.id; });
function selectedRecord(target) {
  const card = target.closest('.cinema-card, .music-card, .book-card, .essay-item');
  if (card) {
    const json = card.dataset.itemJson || card.dataset.albumJson || card.dataset.bookJson || card.dataset.essayJson;
    const id = JSON.parse(json).id;
    return findRecord(item => item.id === id);
  }
  if (docName === 'games' && target.closest('.interest-page article')) {
    const cards = [...document.querySelectorAll('.interest-page article')];
    const visible = data.map((item, index) => ({ item, index })).filter(x => !x.item.hidden);
    return { path: [visible[cards.indexOf(target.closest('article'))].index], schema: state.schema };
  }
  if (docName === 'photography' && target.closest('#right-showcase-stage')) {
    return findRecord(item => item.imageUrl && (activePhotoId ? item.id === activePhotoId : item.title === document.getElementById('meta-title').textContent.trim()));
  }
  if (docName === 'music' && target.closest('section[id^="section-"] h2')) {
    return findRecord(item => item.id === target.closest('section').id.slice(8));
  }
  if (docName === 'interest-text' && target.closest('.interest-page')) return { path: [], schema: state.schema };
}
document.addEventListener('click', event => {
  if (!editing || !state || busy || event.target.closest('#local-editor-toolbar, #local-editor-panel')) return;
  const selected = selectedRecord(event.target); if (!selected) return;
  event.preventDefault(); event.stopImmediatePropagation();
  const title = event.target.closest('h3, #meta-title');
  const item = get(selected.path);
  if (title && 'title' in item) {
    if (title.isContentEditable) return;
    const before = item.title;
    title.contentEditable = 'plaintext-only'; title.setAttribute('aria-label', '编辑标题'); title.focus();
    const range = document.createRange(); range.selectNodeContents(title);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    title.oninput = () => { item.title = title.textContent; changed(); };
    title.onkeydown = event => {
      if (event.key === 'Enter') { event.preventDefault(); title.blur(); }
      if (event.key === 'Escape') { title.textContent = before; item.title = before; title.blur(); }
      event.stopPropagation();
    };
    title.onblur = () => { title.removeAttribute('contenteditable'); title.removeAttribute('aria-label'); };
  } else {
    const imageKey = event.target.tagName === 'IMG' && Object.keys(item).find(key => item[key] === event.target.getAttribute('src'));
    editRecord(selected.path, selected.schema, imageKey ? [...selected.path, imageKey].join('.') : undefined);
  }
}, true);

try {
  if (docName) {
    state = await api('data/' + docName); data = structuredClone(state.data);
    quickSearch.disabled = false;
  }
  setMode(sessionStorage.getItem('homepage-editing') === '1');
  const saved = JSON.parse(sessionStorage.getItem('homepage-preview') || 'null');
  if (saved?.path === location.pathname) {
    sessionStorage.removeItem('homepage-preview'); status.textContent = '已保存到本机 · 尚未发布';
    if (saved.tab) document.querySelector(`[data-cinema-tab="${saved.tab}"]`)?.click();
    if (saved.essays) document.getElementById('tab-btn-essays')?.click();
  }
} catch (error) { showError(error); }
