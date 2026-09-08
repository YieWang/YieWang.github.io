// node tests/cinema-credits.mjs
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { loadData } from './load-data.mjs';

const { creatorNames } = loadData('../lib/html.ts');
assert.equal(creatorNames('ONE, Yusuke Murata', 'ONE, 村田雄介', ', 村田雄介'), 'ONE · 村田雄介');
assert.equal(creatorNames('Kinoko Nasu / TYPE-MOON', '奈須きのこ, TYPE-MOON', '奈须蘑菇, '), '奈須きのこ · 奈须蘑菇 · TYPE-MOON');
for (const separator of [', ', ',', '，', '、', ' / ', '; ', '；']) {
  assert.equal(creatorNames('Tatsuya Ishihara, Naoko Yamada', '石原立也, 山田尚子', ['石原立也', '山田尚子'].join(separator)), '石原立也 · 山田尚子');
}
assert.equal(creatorNames('Christopher Nolan', 'Christopher Nolan', '克里斯托弗·诺兰'), '克里斯托弗·诺兰');
assert.equal(creatorNames('ONE', 'ONE', 'ONE'), '');
assert.equal(creatorNames('ONE, TYPE-MOON', 'ONE, TYPE-MOON'), '');
assert.equal(creatorNames('Stephen Chow, Lee Lik-Chi', '周星馳, 李力持', '周星驰、李力持'), '周星驰 · 李力持');

// Verified localized credits: official anime/publisher credits and Chinese film catalogues.
// https://onepunchman-anime.net/staff/ | https://www.fate-sn.com/ubw/sp/staff/
// https://www.1905.com/mdb/film/2212951/ | https://www.1905.com/mdb/film/2208752/
// https://www.le.com/movie/10009954.html | https://i.maoyan.com/asgard/celebrity/1393319
// https://www.tongli.com.tw/BooksDetail.aspx?Bd=KD15636
// https://zh.wikipedia.org/wiki/異世界歸來的舅舅
const creditItems = JSON.parse(readFileSync(new URL('../src/data/cinema-import.json', import.meta.url)));
for (const [id, expected] of Object.entries({
  'tv-63926': 'ONE, 村田雄介', 'tv-61415': '奈须蘑菇, TYPE-MOON',
  'film-11589036': '吕寅荣, 亚历山德罗·卡罗尼',
  'film-4739952': '华森·波克彭, 普特鹏·普罗萨卡·那·萨克那卡林',
  'film-1296697': '富兰克林·沙夫纳', 'film-34961898': '托马斯·凯尔',
  'tv-46261': '真岛浩', 'tv-127714': '快死透了',
})) assert.equal(creditItems.find(item => item.id === id)?.chineseDirector, expected);
console.log('Complete localized credits, name separators and spelling deduplication passed');
