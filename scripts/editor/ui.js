import { fresh } from '/__editor/schema.js';

const section = location.pathname.split('/')[2];
const docName = section === 'table-tennis' ? 'interest-text' : ['cinema', 'music', 'literature', 'photography', 'games'].includes(section) ? section : null;
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
const saveButton = button('保存并预览', save);
const status = el('span', '仅本机', { role: 'status' });
const navigation = el('select', null, { ariaLabel: '选择兴趣栏目' });
for (const [value, name] of [['', '选择栏目'], ['photography', '摄影'], ['cinema', '影视'], ['music', '音乐'], ['literature', '文学'], ['games', '游戏'], ['table-tennis', '乒乓球']]) {
  navigation.append(el('option', name, { value, selected: value === section }));
}
navigation.addEventListener('change', () => { if (navigation.value) location.href = '/marginalia/' + navigation.value; });
toolbar.append(navigation, modeButton, manageButton, saveButton, status);
document.body.append(toolbar);
const dialog = el('dialog', null, { id: 'local-editor-panel', ariaLabel: '编辑内容' });
const header = el('header');
const heading = el('strong', '编辑内容');
header.append(heading, button('关闭', close));
const content = el('div', null, { className: 'le-content' });
const errorBox = el('p', '', { className: 'le-error', role: 'alert' });
const footer = el('footer');
footer.append(button('放弃本次修改', discard), button('保存并预览', save));
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
window.addEventListener('beforeunload', event => { if (dirty || busy) { event.preventDefault(); event.returnValue = ''; } });
document.addEventListener('keydown', event => {
  if (dialog.open) event.stopImmediatePropagation();
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
  const render = () => {
    rows.replaceChildren();
    currentList.items.forEach((item, index) => {
      if (!labelOf(item).toLowerCase().includes(search.value.toLowerCase())) return;
      const row = el('div', null, { className: 'le-row' });
      row.append(button(labelOf(item) + (item.hidden ? ' · 已隐藏' : ''), () => editRecord([...currentList.path, index], currentList.schema)));
      const move = delta => {
        const target = index + delta;
        if (target < 0 || target >= currentList.items.length) return;
        [currentList.items[index], currentList.items[target]] = [currentList.items[target], currentList.items[index]];
        changed(); render();
      };
      const up = button('↑', () => move(-1)); up.ariaLabel = '上移 ' + labelOf(item); up.disabled = index === 0;
      const down = button('↓', () => move(1)); down.ariaLabel = '下移 ' + labelOf(item); down.disabled = index === currentList.items.length - 1;
      row.append(up, down); rows.append(row);
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
  renderFields(form, item, schema, path);
  content.append(form);
  if (typeof path.at(-1) === 'number') {
    content.append(button('删除此条目', () => {
      if (!confirm(`删除“${labelOf(item)}”？${Object.values(item).some(v => Array.isArray(v) && v.length) ? '其中的子条目也会一并删除。' : ''}保存后生效。`)) return;
      get(path.slice(0, -1)).splice(path.at(-1), 1); changed(); manage();
    }));
  }
  content.append(button('返回内容列表', () => manage()));
  open();
  if (focusKey) form.querySelector(`[name="${focusKey}"]`)?.focus();
}
function renderFields(parent, item, schema, path, optional = false) {
  for (const [key, field] of Object.entries(schema.fields)) {
    if (field.type === 'array') {
      parent.append(button(`${field.label}（${item[key]?.length || 0}）· 管理`, () => {
        item[key] ||= [];
        manage({ path: [...path, key] });
      }));
      continue;
    }
    if (field.type === 'object') {
      const details = el('details'); details.append(el('summary', field.label));
      const nested = item[key] || {};
      const fields = el('div', null, { className: 'le-nested' });
      renderFields(fields, nested, field, [...path, key], true);
      fields.addEventListener('input', () => {
        if (Object.values(nested).some(v => v !== '' && v !== undefined)) item[key] = nested;
        else delete item[key];
      });
      details.append(fields, button('清空' + field.label, () => {
        for (const nestedKey of Object.keys(nested)) delete nested[nestedKey];
        delete item[key];
        fields.querySelectorAll('input, textarea, select').forEach(input => { input.value = ''; });
        changed();
      })); parent.append(details); continue;
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
    label.append(input); parent.append(label);
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
      label.append(preview, upload);
    }
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
    sessionStorage.setItem('homepage-preview', JSON.stringify({ path: location.pathname, scroll: window.scrollY, tab, essays }));
    sessionStorage.setItem('homepage-editing', '0');
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
  }
  setMode(sessionStorage.getItem('homepage-editing') === '1');
  const saved = JSON.parse(sessionStorage.getItem('homepage-preview') || 'null');
  if (saved?.path === location.pathname) {
    sessionStorage.removeItem('homepage-preview'); status.textContent = '已保存到本机 · 尚未发布';
    if (saved.tab) document.querySelector(`[data-cinema-tab="${saved.tab}"]`)?.click();
    if (saved.essays) document.getElementById('tab-btn-essays')?.click();
    requestAnimationFrame(() => window.scrollTo(0, saved.scroll));
  }
} catch (error) { showError(error); }
