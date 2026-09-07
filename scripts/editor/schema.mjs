// The local editor and its save endpoint share these small, explicit content forms.
const text = (label, extra = {}) => ({ label, type: 'text', ...extra });
const area = label => ({ label, type: 'textarea' });
const image = label => ({ label, type: 'image' });
const number = (label, extra = {}) => ({ label, type: 'number', ...extra });
const object = (label, fields) => ({ label, type: 'object', fields });
const array = (label, fields) => ({ label, type: 'array', fields, required: true });
const title = text('标题', { required: true });
const hidden = { label: '隐藏此条目（保留内容）', type: 'checkbox' };
const rating = { label: '我的评分（满分 5）', type: 'rating' };
const year = text('年份');
const url = label => text(label, { type: 'url' });
const review = object('长评', { date: text('日期'), content: { ...area('正文（空行分段）'), required: true } });
const photo = {
  title, subtitle: text('中文副标题'), imageUrl: { ...image('照片'), required: true }, thumbnailUrl: { ...image('缩略图（上传照片时自动生成）'), required: true },
  location: text('地点（中文）'), locationEn: text('地点（英文）', { required: true }), year: number('年份', { required: true, min: 1 }),
  date: text('拍摄日期'), story: area('照片说明'), camera: text('相机'), lens: text('镜头'), film: text('胶片'),
  exif: object('拍摄参数', { focalLength: text('焦距'), aperture: text('光圈'), shutter: text('快门'), iso: text('ISO') }), hidden,
};
export const documents = {
  cinema: { file: 'cinema-import.json', label: '影视', schema: array('作品', {
    title, rating, posterUrl: image('海报'), originalTitle: text('原名'), chineseTitle: text('中文译名'), type: text('类型', { required: true, options: [['film', '电影'], ['series', '剧集']] }),
    director: text('导演／创作者'), originalDirector: text('创作者原名'), chineseDirector: text('创作者中文名'), creditRole: text('署名角色'), year,
    span: text('年份范围'), country: text('国家／地区'), genre: text('类型标签（动画请含 Animation，以英文逗号和空格分隔）', { required: true }),
    studio: text('动画制作公司', { options: ['', 'Pixar', 'Disney'] }), runtime: text('时长／季数'), format: text('规格'), stillUrl: image('剧照'),
    summary: area('简介'), firstWatched: text('首次观看日期'), rewatched: text('重看日期'),
    review: object('长评', { rating, date: text('日期'), quote: area('引文'), excerpt: area('摘要'), content: { ...area('正文（空行分段）'), required: true } }),
    seasons: { ...array('分季详情', { title, originalTitle: text('作品原名'), chineseTitle: text('中文译名'), partLabel: text('分季标记'), year, releaseDate: text('首播日期'), posterUrl: image('本季海报'), runtime: text('集数／时长'), firstWatched: text('观看日期'), rating, summary: area('简介'), review,
      externalLink: object('外部链接', { platform: text('平台', { options: ['IMDb', 'Douban', 'TMDb'] }), url: url('地址') }),
    }), required: false },
    watchedEntries: array('原始观看记录', { title, firstWatched: text('观看日期'), rating, comment: area('短评') }),
    externalLink: object('外部链接', { platform: text('平台', { options: ['IMDb', 'Douban'] }), url: url('地址') }), hidden,
  }) },
  music: { file: 'music-import.json', label: '音乐', schema: object('音乐', {
    albums: array('专辑', {
      title, rating, coverUrl: image('封面'), artistId: text('所属音乐人', { relation: 'artists' }), artistName: text('原始艺术家署名'), artistDisplayName: text('展示署名'),
      year, listenedDate: text('聆听日期'), summary: area('专辑随笔'),
      tracks: array('曲目', { trackNo: number('曲序', { min: 0 }), discNo: number('碟号', { min: 0 }), title,
        artistName: text('艺术家署名'), duration: text('时长'), note: area('单曲随笔'), isFavorite: { label: '喜欢', type: 'checkbox' } }), hidden,
    }),
    artists: array('音乐人', { name: text('名称', { required: true }), displayName: text('展示名称', { required: true }),
      avatarUrl: image('头像'), country: text('国家／地区'), yearsActive: text('活跃年份'), hidden }),
  }) },
  literature: { file: 'literature.json', label: '文学', schema: object('文学', {
    books: array('书籍', { title, originalTitle: text('原名'), author: text('作者'), originalAuthor: text('作者原名'),
      translator: text('译者'), edition: text('出版社与版本'), year, coverUrl: image('封面'), firstRead: text('初读日期'), reread: text('重读日期'), review, hidden }),
    essays: array('随笔', { title, author: text('作者'), year, date: text('日期'), location: text('地点'), content: area('正文（空行分段）'), hidden }),
  }) },
  photography: { file: 'photography.json', label: '摄影', schema: array('年份', {
    year: number('年份', { required: true, min: 1 }), cities: array('相册', {
      location: text('相册地点（中文）', { required: true }), locationEn: text('相册地点（英文）'), country: text('国家／地区'),
      year: number('年份', { required: true, min: 1 }), photos: array('照片', photo), hidden,
    }),
  }) },
  games: { file: 'games.json', label: '游戏', schema: array('游戏', { title, cover: image('封面'), url: url('游戏链接'), note: area('随笔'), hidden }) },
  'interest-text': { file: 'interest-text.json', label: '栏目文字', schema: object('栏目文字', {
    tableTennis: area('乒乓球介绍'), tableTennisInvitation: text('约球邀请文字'), gamesInvitation: text('游戏邀请文字'),
  }) },
};

export function fresh(schema) {
  const value = {};
  for (const [key, field] of Object.entries(schema.fields)) {
    if (field.type === 'array') value[key] = [];
    else if (field.type === 'checkbox') continue;
    else if (field.type === 'number') value[key] = key === 'year' ? new Date().getFullYear() : 0;
    else if (field.type !== 'object') value[key] = field.options ? (Array.isArray(field.options[0]) ? field.options[0][0] : field.options[0]) : '';
  }
  return value;
}

export function validate(value, schema, label = schema.label) {
  if (schema.type === 'array') {
    if (!Array.isArray(value)) throw Error(`${label}必须是列表`);
    for (const item of value) validate(item, { ...schema, type: 'object' }, label);
  } else if (schema.type === 'object') {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw Error(`${label}格式错误`);
    for (const [key, field] of Object.entries(schema.fields)) {
      const entry = value[key];
      if (entry === undefined || entry === null || entry === '') {
        if (field.required) throw Error(`请填写${field.label}`);
      } else validate(entry, field, field.label);
    }
  } else if (schema.type === 'checkbox') {
    if (typeof value !== 'boolean') throw Error(`${label}格式错误`);
  } else if (schema.type === 'number') {
    if (!Number.isFinite(value) || (schema.min !== undefined && value < schema.min)) throw Error(`${label}数值无效`);
  } else {
    if (!['string', 'number'].includes(typeof value) || String(value).length > 200000) throw Error(`${label}内容无效或过长`);
    if (schema.required && !String(value).trim()) throw Error(`请填写${label}`);
    if (schema.options && !schema.options.some(x => (Array.isArray(x) ? x[0] : x) === value)) throw Error(`${label}选项无效`);
    if (schema.type === 'rating' && !/^(?:[0-4](?:\.\d+)?|5(?:\.0+)?)\s*\/\s*5(?:\.0+)?$/.test(String(value))) throw Error('评分应在 0 到 5 之间');
    if (['url', 'image'].includes(schema.type) && !/^(https?:\/\/[^\s]+|\/(?!\/)[^\s]*)$/.test(String(value))) throw Error(`${label}请使用 http(s) 链接或站内路径`);
  }
}
