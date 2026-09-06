export interface BookItem {
  id: string;
  title: string;                // Display title matching this specific copy (e.g. "局外人", "看不见的城市", "Gödel, Escher, Bach")
  originalTitle: string;        // Original title in original language (e.g. "L'Étranger", "Le città invisibili")
  author: string;               // Author name matching this copy (e.g. "阿尔贝·加缪", "Douglas R. Hofstadter")
  originalAuthor?: string;      // Original author name in original language (e.g. "Albert Camus")
  translator?: string;          // Translator (only if this copy is a translation)
  edition: string;              // Combined concise publisher & edition (e.g. "上海译文出版社 · 2010年版")
  year: number | string;        // Original publication year
  coverUrl: string;             // Local cover in public/images/literature/
  firstRead?: string;           // First read date e.g. "2019.04"
  reread?: string;              // Reread dates e.g. "2021.04, 2024.04"
  review?: {
    date: string;               // Review date
    content: string;            // In-depth review essay
  };
}

export interface EssayItem {
  id: string;
  title: string;                // Essay title
  author: string;               // Author e.g. "王怡"
  year: string;                 // Year e.g. "2025"
  date: string;                 // Date e.g. "2025.8.15"
  location: string;             // Location e.g. "Regensburg"
  content: string;              // Full formatted prose text
}

export const literatureBooks: BookItem[] = [
  {
    id: "hong-lou-meng",
    title: "红楼梦",
    originalTitle: "红楼梦",
    author: "曹雪芹",
    edition: "人民文学出版社 · 1982年第1版",
    year: 1982,
    coverUrl: "/images/literature/hong-lou-meng.jpg",
    firstRead: "2016.07",
    reread: "2020.08, 2024.01",
    review: {
      date: "2024.01",
      content: `重读《红楼梦》，最令人震撼的并非贾府奢华起居与儿女情长，而是曹雪芹在全书骨架中埋下的宏大对称与因果对偶。

从第一回甄士隐与贾雨村的互为镜像，到大荒山无稽崖青埂峰下的顽石与绛珠仙草的“还泪之约”，整部小说呈现出一种近乎严密代数系统般的因果闭环。每一首诗谶、每一支曲子、每一次抽签行令，都在漫不经心的嬉笑声中预先钉死了命运的终局。

宝玉的“痴”与“不通世务”，本质上是对功名利禄这一单一社会度量衡的彻底拒绝；而黛玉的眼泪，则是以纯粹的生命力对抗必将倾覆的秩序。当贾府大厦倾塌，宝玉在漫天飞雪的毗陵驿头向父亲四拜辞行，披一领大红猩猩毡斗篷随僧道飘然而去，世界终于退回到了最初那片白茫茫的空无之中。这不仅是一场家族悲剧，更是人类对执念、时间与虚无所作的最庄严的告别。`,
    },
  },
  {
    id: "geb",
    title: "Gödel, Escher, Bach: An Eternal Golden Braid",
    originalTitle: "Gödel, Escher, Bach: An Eternal Golden Braid",
    author: "Douglas R. Hofstadter",
    edition: "Basic Books · 1999 (20th Anniv. Ed.)",
    year: 1979,
    coverUrl: "/images/literature/geb.jpg",
    firstRead: "2020.03",
    reread: "2022.09, 2024.03",
    review: {
      date: "2024.03",
      content: `侯世达以巴赫的《音乐的奉献》六声部赋格起笔，借乌龟与阿基里斯的哲理机锋，将哥德尔不完备定理的冰冷严密化为了永恒的金色织锦。

阅读 GEB 的过程，宛如置身于一座由纯粹形式系统构筑的巴洛克大教堂。每一个章节前的对话不仅是对随之而来的数理逻辑的诗意隐喻，更是形式与内容互为镜像的精巧复调。阿基里斯在埃舍尔的相对性台阶上追逐乌龟，声部之间倒置、逆行、放大，正如哥德尔将形式命题的元语言编码嵌入自然数体系本身。

最令人震颤的，是作者对“意识与意义何以从无生命的符号流动中自发涌现”的追问。形式系统若具备足够的表达能力，便必然产生自指；自指带来了哥德尔语句的无法证实性，却也正是这种不可消除的裂隙，构成了意识和自我觉察得以诞生的母体。我们总是在寻求一个绝对封闭完备的真理宇宙，但数学本身的深渊却告诉我们：正是完备性的破产，赋予了系统向更高层级不断生长的自由。`,
    },
  },
  {
    id: "qing-liu",
    title: "Algebraic Geometry and Arithmetic Curves",
    originalTitle: "Algebraic Geometry and Arithmetic Curves",
    author: "Qing Liu",
    edition: "Oxford University Press · 2002",
    year: 2002,
    coverUrl: "/images/literature/qing-liu.jpg",
    firstRead: "2022.09",
    reread: "2024.02",
  },
  {
    id: "wei-cheng",
    title: "围城",
    originalTitle: "围城",
    author: "钱锺书",
    edition: "人民文学出版社 · 1991年第2版",
    year: 1991,
    coverUrl: "/images/literature/wei-cheng.jpg",
    firstRead: "2018.10",
    reread: "2021.05, 2023.11",
    review: {
      date: "2023.11",
      content: `钱锺书在《围城》中展现的不仅是令人拍案叫绝的修辞奇迹，更是一把精准而残酷的解剖刀。

方鸿渐并非传统意义上的恶人，而是一个“不讨厌但全无用处”的凡人。他在克莱登大学假文凭上的妥协、在苏文纨与唐晓芙之间的摇摆，以及在三闾大学人事倾轧中的懦弱，无一不是现代人在理想与现实间挣扎的真实写照。

小说的结尾是全书最冷峻的悲剧时刻：孙柔嘉愤而离家，方鸿渐在空荡冰冷的房间里沉沉睡去，祖传的慢了五个钟头的老摆钟在墙上单调地打着点。这只老摆钟就是生活的象征——它永远迟钝、永远错位，却又无情地将人推向不可挽回的枯竭。`,
    },
  },
  {
    id: "sound-and-fury",
    title: "The Sound and the Fury",
    originalTitle: "The Sound and the Fury",
    author: "William Faulkner",
    edition: "Vintage Books · 1990",
    year: 1929,
    coverUrl: "/images/literature/sound-and-fury.jpg",
    firstRead: "2021.06",
    reread: "2024.05",
  },
  {
    id: "invisible-cities",
    title: "看不见的城市",
    originalTitle: "Le città invisibili",
    author: "伊塔洛·卡尔维诺",
    originalAuthor: "Italo Calvino",
    translator: "张密",
    edition: "译林出版社 · 2012年第1版",
    year: 1972,
    coverUrl: "/images/literature/invisible-cities.jpg",
    firstRead: "2019.11",
    reread: "2022.04, 2024.08",
    review: {
      date: "2024.08",
      content: `卡尔维诺在这部极短的巨著中，用五十五座虚构之城搭建起了一座关于人类欲望、符号与记忆的晶体拓扑迷宫。

马可·波罗与忽必烈汗在帝国的后花园对弈，棋盘上的每一格既是抽象的虚空，也是整座帝国的缩影。卡尔维诺摒弃了传统叙事的因果锁链，转而采用数学组合学般的严格对称结构：十一组主题，五十五座以女性命名的城邦，如同在纯净空间中旋转的多面体。

在这座迷宫里，有由细绳悬挂的城市（埃尔西利亚），有死者地窖与生者建筑互为镜像的城市（欧德西亚），有在欲望与悔恨之间摇摆的城市（佐贝伊德）。马可·波罗每描述一座城市，其实都在述说同一座永恒无法返抵的威尼斯。阅读卡尔维诺就像在做一本地理学的手稿勘误，他在废墟的阴影下为轻盈（Lightness）辩护——不是羽毛般的漂浮，而是燕子掠过暴风雨海面时精确而敏捷的振翅。`,
    },
  },
  {
    id: "huo-zhe",
    title: "活着",
    originalTitle: "活着",
    author: "余华",
    edition: "作家出版社 · 2012年版",
    year: 2012,
    coverUrl: "/images/literature/huo-zhe.jpg",
    firstRead: "2017.04",
    reread: "2022.10",
  },
  {
    id: "the-stranger",
    title: "局外人",
    originalTitle: "L'Étranger",
    author: "阿尔贝·加缪",
    originalAuthor: "Albert Camus",
    translator: "柳鸣九",
    edition: "上海译文出版社 · 2010年版",
    year: 1942,
    coverUrl: "/images/literature/the-stranger.jpg",
    firstRead: "2019.05",
    reread: "2021.08, 2023.09",
    review: {
      date: "2023.09",
      content: `加缪用近乎几何式的冷冽笔触，撕开了人类以理性与道德叙事自我安慰的温情帷幕。

小说开篇的名句不仅是一种语调的确立，更是一种存在主义的判决：默尔索拒绝在母亲的葬礼上表演悲恸，拒绝在神父与法官面前编造忏悔的剧本。他在海滩上开枪击毙阿拉伯人，与其说是源于仇恨，不如说是灼烈日光、反射在刀刃上的刺目光芒与身体生理反应在某一刹那的致命重合。

法庭审判是全书最冷峻的讽刺。人们并非在审判一场过失杀人，而是在审判一个不肯向社会共谋的道德语法低头的“局外人”。当默尔索在牢房里卸下一应虚妄的希望，面对群星闪烁的夜空体会到“世界温柔的冷漠”，他才真正获得了不妥协的尊严。荒诞不是虚无，而是在认清世界荒谬本质后，依然决绝生活下去的热烈。`,
    },
  },
  {
    id: "ficciones",
    title: "虚构集",
    originalTitle: "Ficciones",
    author: "豪尔赫·路易斯·博尔赫斯",
    originalAuthor: "Jorge Luis Borges",
    translator: "王永年",
    edition: "上海译文出版社 · 2015年版",
    year: 1944,
    coverUrl: "/images/literature/ficciones.jpg",
    firstRead: "2020.01",
    reread: "2023.12",
  },
  {
    id: "arakelov",
    title: "Arakelov Geometry",
    originalTitle: "Arakelov Geometry",
    author: "Atsushi Moriwaki",
    edition: "American Mathematical Society · 2014",
    year: 2014,
    coverUrl: "/images/literature/arakelov.jpg",
    firstRead: "2023.09",
    reread: "2025.02",
  },
  {
    id: "prime-obsession",
    title: "Prime Obsession",
    originalTitle: "Prime Obsession",
    author: "John Derbyshire",
    edition: "Joseph Henry Press · 2003",
    year: 2003,
    coverUrl: "/images/literature/prime-obsession.jpg",
    firstRead: "2020.08",
    reread: "2022.11",
  },
];

export const literatureEssays: EssayItem[] = [
  {
    id: "regensburg-hangzhou-geometry",
    title: "在多瑙河与西湖之间：空间几何与记忆的呼吸",
    author: "王怡",
    year: "2025",
    date: "2025.8.15",
    location: "Regensburg",
    content: `当我站在雷根斯堡石桥（Steinerne Brücke）中段，俯瞰多瑙河平缓而冰冷的漩涡时，我经常会产生一种奇异的错位感：空间在物理上被六千公里所隔绝，却在知觉的某种不变式下悄然合流。

雷根斯堡由致密的巴伐利亚石灰岩构成，哥特式大教堂的双塔以严苛的垂直角切开沉重的铅色低云；而杭州则由水、柳与漫漶的水气组成，山峦的轮廓在雨后呈现出一种几乎没有硬边缘的流体拓扑。然而，在日常的穿行中，这两种截然不同的地貌却常常被同一种思维的节律所同构。

学数学的人往往对“距离”有一种偏执的宽容。在代数数论的世界里，我们习惯于在阿基米德绝对值与无穷多个 p 进绝对值之间自如切换：在某一种度量下无限接近的两个点，在另一种尺度下可能相隔浩劫。生活在异乡的人，实际上就是在一套双重赋范空间中行走。你推开 Regensburg 研究所厚重的木门，走过石板路上的斑驳落叶，脑海里映出的却是西湖苏堤清晨薄雾中自行车的轻微链条声。

记忆从不是写在纸上的静态文本，而是一个在时间的连续流中不断被扰动与重整的动力系统。多瑙河的流速约莫每秒一米半，它不紧不慢地将阿尔卑斯山融化的雪水带向东方；而江南的水网则以一种更加隐匿的方式在地下缓慢渗流。我们在两座城市之间留下的脚印，最终并非物理坐标的连线，而是心智为了抵御遗忘而勾勒的一幅测地线地图。`,
  },
  {
    id: "hidden-symmetries-bach-abelian",
    title: "隐匿与显现的对称性：从阿贝尔簇到巴赫赋格",
    author: "王怡",
    year: "2025",
    date: "2025.4.18",
    location: "Hangzhou",
    content: `人们常说数学是抽象的，音乐是感性的。然而在最幽深的阶梯上，两者的界限往往会化为无形：真正的自由从来不是任性肆意的发散，而是从最严苛的对称与约束中破壁而出的奇迹。

在研究阿贝尔簇（Abelian Varieties）的几何结构时，最令人动容的概念之一是自对偶性（Self-duality）与极化（Polarization）。一个复环面如果要想拥有代数几何的胚体，就必须承受黎曼双线性关系的严峻审判——并非每一个光滑的环面都是代数簇，唯有那些具备特定辛形式内积的空间，才能将离散的算术点投射到射影空间中。

这种严酷的形式要求，几乎完全对应于约翰·塞巴斯蒂安·巴赫在写作《赋格的艺术》（Die Kunst der Fuge）时的精神状态。在严密如晶体的对位法规则下，主题必须在正向、逆行、倒影、扩充与缩减之间保持严格的音程守恒。任何一个平庸的听众初听赋格，或许只察觉到机械钟表般的冷漠转动；但当你跟随着格伦·古尔德的指尖穿透那些声部的重叠时，你会感到一种近乎宇宙创生般的庄严悲悯。

巴赫从未在规则之外寻求灵感，他是在规则的极度压榨下，让形式本身开出花来。正如数学家们在定义复杂的模空间与上同调群时，我们所做的一切，不是凭空捏造繁琐的符号体系，而是为了擦亮那面镜子，让隐藏在代数深处早已存在的不变量自然显现。

对称性之所以美丽，是因为它背后隐藏着某种守恒；而最高级别的对称，是当你在无穷无尽的变换之后回到原点，却发现整个世界已经因此获得了新生。`,
  },
  {
    id: "on-rereading-sculpture-of-time",
    title: "关于“重读”作为一种时间雕刻的可能",
    author: "王怡",
    year: "2024",
    date: "2024.12.30",
    location: "Regensburg",
    content: `年轻时读书往往贪多务得，热衷于情节的推进与结局的悬念；而随着岁月的推移，“重读”逐渐变成了一种更具仪式感的心灵练习。

博尔赫斯曾经写道，一个人真正读过的书，其实只有那么寥寥数卷；我们一生所做的，不过是在不同的年龄重新打量同一批字句。当你第二次、第三次翻开卡尔维诺的《看不见的城市》或普鲁斯特的《追寻逝去的时光》时，悬念已经死亡，小说的骨骼完全裸露，但语言本身的肌理却第一次真正向你敞开。

在初读时，读者是猎人，急促地追踪着叙事的狐狸；在重读时，读者变成了旅人，站在林间小径旁注视着树叶上的微光与清晨的霜气。你知道哪一个段落即将来临，知道哪一句对话会刺痛你的心脏，这种预知不仅没有削弱阅读的震颤，反而赋予了它一种宿命般的重力。

塔可夫斯基将电影定义为“在时间中雕刻”。事实上，一本好书的物理质感本身就是一具时间的容器。书页边缘泛黄的弧度，多年前随手夹入的一张火车票根，空白处用铅笔留下的幼稚批注，都成了层累的断层地貌。当你在十几年后同一张书桌前重读那行字，你所面对的不再仅仅是作者的幽灵，更是那个曾经读过这行字、却早已消逝在风中的过去的自己。

阅读是对抗死亡的手段，而重读，则是对这一手段的郑重确认。`,
  },
];
