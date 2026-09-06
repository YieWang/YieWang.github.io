export interface MusicTrack {
  trackNo: number;
  title: string;
  duration: string;
  isFavorite?: boolean;
  note?: string; // 针对单曲的心情随笔 / 听歌时刻 / 歌词摘录
}

export interface MusicAlbum {
  id: string;
  title: string;
  artistId: string;
  artistName: string;
  artistDisplayName: string; // 严格原名
  year: number;
  genre?: string;
  label?: string;
  catalogNo?: string;
  format?: 'Vinyl' | 'CD' | 'Digital' | 'Cassette' | 'Live';
  coverUrl: string;
  tracks: MusicTrack[];
  rating?: string;
  listenedDate?: string;
  summary?: string;
}

export interface MusicArtist {
  id: string;
  name: string;
  displayName: string; // 严格原名呈现
  country?: string;
  yearsActive?: string;
  coverUrl?: string;
  albumIds: string[];
}

export const musicArtists: MusicArtist[] = [
  {
    id: "ryuichi-sakamoto",
    name: "Ryuichi Sakamoto",
    displayName: "坂本龍一",
    country: "Japan",
    yearsActive: "1952–2023",
    coverUrl: "/images/music/async.jpg",
    albumIds: ["async", "bttb"],
  },
  {
    id: "glenn-gould",
    name: "Glenn Gould",
    displayName: "Glenn Gould",
    country: "Canada",
    yearsActive: "1932–1982",
    coverUrl: "/images/music/goldberg-1981.jpg",
    albumIds: ["goldberg-1981"],
  },
  {
    id: "arvo-part",
    name: "Arvo Pärt",
    displayName: "Arvo Pärt",
    country: "Estonia",
    yearsActive: "1935–Present",
    coverUrl: "/images/music/tabula-rasa.jpg",
    albumIds: ["tabula-rasa"],
  },
  {
    id: "bill-evans",
    name: "Bill Evans",
    displayName: "Bill Evans Trio",
    country: "USA",
    yearsActive: "1929–1980",
    coverUrl: "/images/music/waltz-for-debby.jpg",
    albumIds: ["waltz-for-debby"],
  },
  {
    id: "radiohead",
    name: "Radiohead",
    displayName: "Radiohead",
    country: "UK",
    yearsActive: "1985–Present",
    coverUrl: "/images/music/in-rainbows.jpg",
    albumIds: ["in-rainbows"],
  },
  {
    id: "chet-baker",
    name: "Chet Baker",
    displayName: "Chet Baker",
    country: "USA",
    yearsActive: "1929–1988",
    coverUrl: "/images/music/chet-sings.jpg",
    albumIds: ["chet-sings"],
  },
  {
    id: "faye-wong",
    name: "Faye Wong",
    displayName: "王菲",
    country: "China",
    yearsActive: "1989–Present",
    coverUrl: "/images/music/fable.jpg",
    albumIds: ["fable"],
  }
];

export const musicAlbums: MusicAlbum[] = [
  {
    id: "async",
    title: "async",
    artistId: "ryuichi-sakamoto",
    artistName: "Ryuichi Sakamoto",
    artistDisplayName: "坂本龍一",
    year: 2017,
    coverUrl: "/images/music/async.jpg",
    tracks: [
      { trackNo: 1, title: "Andata", duration: "04:39", isFavorite: true, note: "沉缓的管风琴与钢琴交替下行，像是向着无底深海缓步沉降。海啸钢琴微弱的泛音在虚空中久久振荡。" },
      { trackNo: 2, title: "Disintegration", duration: "05:46", isFavorite: false },
      { trackNo: 3, title: "Solitude", duration: "04:57", isFavorite: true, note: "深夜书房里唯一的陪伴。大提琴的冷冽长音，如同一根细丝在清冽的夜空里颤抖。" },
      { trackNo: 4, title: "Life, Life", duration: "04:04", isFavorite: false },
      { trackNo: 5, title: "ZURE", duration: "05:11", isFavorite: true, note: "微妙的时值错位（Zure），两轨合成器在时间维度上的追逐与交叠，生命的非同步呼吸。" },
      { trackNo: 6, title: "walker", duration: "04:20", isFavorite: false },
      { trackNo: 7, title: "async", duration: "03:49", isFavorite: true, note: "同名曲目，没有任何预设节拍的束缚，万物之声在此自由呼吸。" },
      { trackNo: 8, title: "fullmoon", duration: "06:18", isFavorite: false }
    ]
  },
  {
    id: "bttb",
    title: "BTTB",
    artistId: "ryuichi-sakamoto",
    artistName: "Ryuichi Sakamoto",
    artistDisplayName: "坂本龍一",
    year: 1999,
    coverUrl: "/images/music/bttb.jpg",
    tracks: [
      { trackNo: 1, title: "Opus", duration: "04:26", isFavorite: true, note: "清冷晨光中独自奏响的素描序曲，萨蒂式的纯净留白意味深长。" },
      { trackNo: 2, title: "Sonatine", duration: "03:39", isFavorite: false },
      { trackNo: 3, title: "Intermezzo", duration: "03:45", isFavorite: false },
      { trackNo: 4, title: "Lorenz and Watson", duration: "03:57", isFavorite: false },
      { trackNo: 5, title: "Energy Flow", duration: "04:33", isFavorite: true, note: "治愈整整一代人的世纪末名曲，原声钢琴的触键温润如清泉流淌。" },
      { trackNo: 6, title: "Aqua", duration: "04:29", isFavorite: true, note: "为女儿坂本美雨写下的温柔摇篮曲，世间最纯净透明的琴音之一。" }
    ]
  },
  {
    id: "goldberg-1981",
    title: "Bach: The Goldberg Variations (1981)",
    artistId: "glenn-gould",
    artistName: "Glenn Gould",
    artistDisplayName: "Glenn Gould",
    year: 1981,
    coverUrl: "/images/music/goldberg-1981.jpg",
    tracks: [
      { trackNo: 1, title: "Aria", duration: "03:05", isFavorite: true, note: "慢得出奇的速度，音与音之间的空气密度前所未有。每一个装饰音都如同晨露从岩壁滴落。" },
      { trackNo: 2, title: "Variatio 1 a 1 Clav.", duration: "01:10", isFavorite: false },
      { trackNo: 3, title: "Variatio 5 a 1 ovvero 2 Clav.", duration: "00:38", isFavorite: false },
      { trackNo: 4, title: "Variatio 15 a 1 Clav. Canone alla Quinta", duration: "05:01", isFavorite: true, note: "G小调卡农，整部变奏中最悲悯幽暗的篇章，向死而生的安魂沉思。" },
      { trackNo: 5, title: "Variatio 25 a 2 Clav. (The Black Pearl)", duration: "06:03", isFavorite: true, note: "“黑珍珠”，深不见底的情感波澜，古尔德在此处达到了形而上的极致高度。" },
      { trackNo: 6, title: "Aria da Capo", duration: "03:45", isFavorite: true, note: "历经沧海桑田后的回归，同样的音符，听来已恍若隔世。" }
    ]
  },
  {
    id: "tabula-rasa",
    title: "Tabula Rasa",
    artistId: "arvo-part",
    artistName: "Arvo Pärt",
    artistDisplayName: "Arvo Pärt",
    year: 1984,
    coverUrl: "/images/music/tabula-rasa.jpg",
    tracks: [
      { trackNo: 1, title: "Fratres (for Violin and Piano)", duration: "11:27", isFavorite: true, note: "克莱默的小提琴如火炬跃动，贾勒特的钢琴点染出荒原晨曦。" },
      { trackNo: 2, title: "Cantus in Memory of Benjamin Britten", duration: "06:25", isFavorite: true, note: "单一管钟的永恒鸣响，弦乐在不断向下的级进中构筑起高贵的深渊。" },
      { trackNo: 3, title: "Tabula Rasa: I. Ludus", duration: "09:59", isFavorite: false },
      { trackNo: 4, title: "Tabula Rasa: II. Silentium", duration: "16:21", isFavorite: true, note: "白纸一张，雕塑寂静本身。每一个音符都如同冬夜的星辰在虚空中静默燃烧。" }
    ]
  },
  {
    id: "waltz-for-debby",
    title: "Waltz for Debby",
    artistId: "bill-evans",
    artistName: "Bill Evans Trio",
    artistDisplayName: "Bill Evans Trio",
    year: 1961,
    coverUrl: "/images/music/waltz-for-debby.jpg",
    tracks: [
      { trackNo: 1, title: "My Foolish Heart", duration: "04:58", isFavorite: true, note: "最深情的慢板演绎，德彪西式的印象派和声在先锋村地下室散开。" },
      { trackNo: 2, title: "Waltz for Debby (Take 2)", duration: "07:00", isFavorite: true, note: "写给小侄女的圆舞曲，童真与诗意在斯科特·拉法罗惊艳的贝斯拨奏中绽放。" },
      { trackNo: 3, title: "Detour Ahead", duration: "07:37", isFavorite: false },
      { trackNo: 4, title: "My Romance", duration: "07:11", isFavorite: true, note: "浪漫主义爵士的巅峰，琴声如微风拂过水面，伴随着客人们微弱的酒杯轻碰声。" },
      { trackNo: 5, title: "Some Other Time", duration: "05:11", isFavorite: false }
    ]
  },
  {
    id: "in-rainbows",
    title: "In Rainbows",
    artistId: "radiohead",
    artistName: "Radiohead",
    artistDisplayName: "Radiohead",
    year: 2007,
    coverUrl: "/images/music/in-rainbows.jpg",
    tracks: [
      { trackNo: 1, title: "15 Step", duration: "03:57", isFavorite: false },
      { trackNo: 2, title: "Bodysnatchers", duration: "04:02", isFavorite: false },
      { trackNo: 3, title: "Nude", duration: "04:15", isFavorite: true, note: "“Don't get any big ideas.” 纯净如梦的假声叹息，在数字虚无中触摸肉身心跳。" },
      { trackNo: 4, title: "Weird Fishes/Arpeggi", duration: "05:18", isFavorite: true, note: "三把吉他交织的琶音雨，在深海中下潜，直到被发光的游鱼吞噬。" },
      { trackNo: 5, title: "All I Need", duration: "03:48", isFavorite: true, note: "合成器低音如心跳搏动，尾段管弦乐与木琴铺天盖地的轰鸣极其动人。" },
      { trackNo: 6, title: "Faust Arp", duration: "02:09", isFavorite: false },
      { trackNo: 7, title: "Reckoner", duration: "04:50", isFavorite: true, note: "整张专辑的灵魂，镲片如细雪落下，弦乐升起时让人屏住呼吸。" },
      { trackNo: 8, title: "House of Cards", duration: "05:28", isFavorite: false },
      { trackNo: 9, title: "Jigsaw Falling Into Place", duration: "04:09", isFavorite: false },
      { trackNo: 10, title: "Videotape", duration: "04:41", isFavorite: true, note: "走向生命终点时最平静从容的录像带回放。" }
    ]
  },
  {
    id: "chet-sings",
    title: "Chet Baker Sings",
    artistId: "chet-baker",
    artistName: "Chet Baker",
    artistDisplayName: "Chet Baker",
    year: 1954,
    coverUrl: "/images/music/chet-sings.jpg",
    tracks: [
      { trackNo: 1, title: "That Old Feeling", duration: "03:03", isFavorite: false },
      { trackNo: 2, title: "It's Always You", duration: "03:35", isFavorite: false },
      { trackNo: 3, title: "Like Someone in Love", duration: "02:26", isFavorite: false },
      { trackNo: 4, title: "My Funny Valentine", duration: "02:21", isFavorite: true, note: "爵士历史上最不可逾越的人声叹息，脆弱而纯净，每一口呼吸都是心碎的印记。" },
      { trackNo: 5, title: "I Fall in Love Too Easily", duration: "03:21", isFavorite: true, note: "在深夜的电话亭里对着无人接听的盲音倾诉，“我太容易坠入爱河”。" }
    ]
  },
  {
    id: "fable",
    title: "寓言",
    artistId: "faye-wong",
    artistName: "Faye Wong",
    artistDisplayName: "王菲",
    year: 2000,
    coverUrl: "/images/music/fable.jpg",
    tracks: [
      { trackNo: 1, title: "寒武纪", duration: "05:27", isFavorite: true, note: "张亚东引入英国爱乐乐团的庞大编制，宏大管弦乐撕开太古洪荒，生命破土而出。" },
      { trackNo: 2, title: "新房客", duration: "05:12", isFavorite: true, note: "迷离跳动的 Trip-Hop 鼓点，林夕写出“一切很好，不缺烦恼”的超然情致。" },
      { trackNo: 3, title: "香奈儿", duration: "04:52", isFavorite: false },
      { trackNo: 4, title: "阿修罗", duration: "04:57", isFavorite: false },
      { trackNo: 5, title: "彼岸花", duration: "05:07", isFavorite: true, note: "迷幻编曲与空灵吟唱直通彼岸，寓言五部曲终极的超脱与圆满。" }
    ]
  }
];
