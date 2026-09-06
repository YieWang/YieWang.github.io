export interface MediaItem {
  id: string;
  title: string;                 // English display title
  originalTitle?: string;        // Original native title (e.g. "東京物語")
  type: 'film' | 'series';       // 'film' or 'series'
  director: string;              // Director or Showrunner
  originalDirector?: string;     // Native director name (e.g. "岩井俊二", "小津安二郎")
  year: number | string;         // Start year (e.g. 1953, 2015)
  span?: string;                 // Year span for series (e.g. "2015–2022")
  country: string;               // Country
  genre: string;                 // Genre
  runtime?: string;              // Runtime or seasons (e.g. "136 min", "6 Seasons")
  format?: string;               // Technical format (e.g. "35mm · B&W · 1.37:1")
  posterUrl: string;             // 2:3 vertical poster
  stillUrl?: string;             // 16:9 or widescreen still
  summary: string;               // Synopsis in English
  rating?: string;               // Personal rating e.g. "5.0 / 5.0" (available with or without full essay)
  firstWatched?: string;         // First watch date e.g. "2019.04"
  rewatched?: string;            // Rewatch dates e.g. "2021.04, 2024.04"
  externalLink: {
    platform: 'IMDb';
    url: string;
  };
  review?: {
    rating: string;              // e.g. "5.0 / 5.0"
    date?: string;               // e.g. "2026.02"
    quote?: string;              // Iconic quote in English
    excerpt?: string;            // Short teaser excerpt
    content: string;             // Full review in English
  };
}

export const cinemaFilms: MediaItem[] = [
  {
    id: "april-story",
    title: "April Story",
    originalTitle: "四月物語",
    type: "film",
    director: "Shunji Iwai",
    originalDirector: "岩井俊二",
    year: 1998,
    country: "Japan",
    genre: "Romance / Coming-of-Age",
    runtime: "67 min",
    format: "35mm · Color · 1.85:1",
    posterUrl: "/images/cinema/april-story.jpg",
    stillUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85",
    summary: "A shy, reserved young woman from Hokkaido moves to Tokyo to attend university, carrying a secret, delicate longing for an older student from her high school.",
    rating: "5.0 / 5.0",
    firstWatched: "2019.04",
    rewatched: "2021.04, 2024.04",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt0146271/",
    },
    review: {
      rating: "5.0 / 5.0",
      date: "2024.04",
      quote: "“武藏野、武藏野”少女不断呢喃着好像是秘密的咒语，念出来便会实现。",
      excerpt: "四月的东京，樱花飘下如雨，新娘出嫁需要数人用伞以撑。少女在刚刚租下行李都还未运来的房间，缓缓躺下蜷缩着，嘴里低声呢喃着“武藏野、武藏野”。",
      content: `四月的东京，樱花飘下如雨，新娘出嫁需要数人用伞以撑。少女在刚刚租下行李都还未运来的房间，缓缓躺下蜷缩着，嘴里低声呢喃着“武藏野、武藏野”。

搬家的人来了，想要做些什么，但又差点帮了倒忙，却又开心的笑了起来，或许是因为第一次自己独立做了些什么。最后拿了一把小椅子，在春天里轻轻抖落卫衣，里面的樱花也随之落下。

第一次没有父母的陪伴来到新学校，同学间开始互相介绍自己，被同学们问为什么来这所大学，慌张的不敢说出真正的原因——去武藏野堂“偶遇”他，这个理由显得又天真又浪漫得可笑。在这穿毛衣的她显得格格不入——因为北海道这个时节还是要穿的，她只能脱下毛衣系到腰间。

刚认识的大学同学试着发起邀约，少女却轻轻摇摇头，说着星期天还要忙搬家的事情，下次再约。出门听到强烈的摇滚和温柔的歌声，凑过去看，原来这就是大学的样子。

星期天到了，买了辆自行车，看着刚放学的小学生们想着自己待会儿要做的事又微微笑了起来。试着向街边的店主询问那一家魂牵梦萦的书店：“请问武藏野堂在哪？”“左边一直走到底的转角就是了。”但到店里却发现好像想遇见的那个人不在这，随手买了本书想悄悄地问店员店内是否还有另一位店员呢，话到嘴边却又变成了另一句话。

喜欢钓鱼的同学拉你进了钓鱼社团，因为推荐新人会送钓鱼线——当社长这么和你说的时候，你偷偷的看了眼那个同学，同学也有点心虚的转过头去。

这天又来到了武藏野堂，在看着书的时候，他突然来到了身边，说是要找本书，无处可躲，像只受到惊吓的小鹿，偷偷的用余光看着。

结账的时候你暗暗祈祷着——又或许没有，他会不会认出你呢？但好像奇迹并没有发生。

晚上邀请了楼下的邻居一起吃咖喱，被拒绝了，自己回屋就着昏暗的灯光吃着饭，好像东京有点孤独啊，你这么想着的时候门突然响了起来，原来是楼下的邻居，她说刚才拒绝真不好意思，如果还有的话可以再一起吃。于是这个昏暗的灯光变成了温馨的。

又是钓鱼社团活动，在空中练习着钓鱼杆的时候，同学突然问：之前有交过的男朋友吗？你摇摇头，又笑了一下，说有单恋过。她又问：是怎样的人呢？你笑得更开心了，眼睛里发着光，回忆着、缓缓地说着：很杰出的人、头脑很好……

“去年的春天，学长考上了东京的大学，让我感到悲痛欲绝。
 东京的武藏野大学，朋友小野田夏子说是很有名的大学。但是，武藏野这个词，总让我想起学长。武藏野、武藏野。我看过国木田独步写的《武藏野》，内容很难看不太懂。但武藏野这个词，对我来说却是最重要的关键字。武藏野、武藏野。
 在辽阔原野弹着吉他的学长，那副像是壁画般的影像深深的印在了我的脑海。
 埋首于准备考试的夏季末，去东京玩的学妹真圣回来了。包在《武藏野》上的茶色书套，印有“武藏野堂”书局的名字。
 徘徊在武藏野的原野，我终于找到学长出现的地方。武藏野的武藏野堂。我将剩下半年的高中生活献给了武藏野。”

“武藏野、武藏野”少女不断呢喃着好像是秘密的咒语，将思念与心都倾注在这份话语中，念出来便会实现。而咒语成真是在学长认出少女之后——“你是北高的学生吧？”因此再大的雨淋在身上也难以掩饰少女的喜悦。就算是破破烂烂的伞、衣服上的水滴也变得这么可爱。

这便是，四月物语。`,
    },
  },
  {
    id: "tokyo-story",
    title: "Tokyo Story",
    originalTitle: "東京物語",
    type: "film",
    director: "Yasujirō Ozu",
    originalDirector: "小津安二郎",
    year: 1953,
    country: "Japan",
    genre: "Drama / Family",
    runtime: "136 min",
    format: "35mm · B&W · 1.37:1 Academy",
    posterUrl: "/images/cinema/tokyo-story.jpg",
    stillUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1600&q=85",
    summary: "An aging couple travel to post-war Tokyo to visit their grown children, who have little time for them amidst everyday life.",
    rating: "5.0 / 5.0",
    firstWatched: "2018.10",
    rewatched: "2021.03, 2026.02",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt0046438/",
    },
    review: {
      rating: "5.0 / 5.0",
      date: "2026.02",
      quote: "“Tokyo is so big. If we got separated, we might never find each other again.”",
      excerpt: "Through his signature 50mm tatami-level camera, Ozu freezes the quiet, unspoken ache of dissolving familial bonds in post-war Japan.",
      content: "Through his signature 50mm tatami-level camera, Yasujirō Ozu freezes the quiet, unspoken ache of dissolving familial bonds in post-war Japan. The film rejects melodramatic crescendos; instead, emotional weight gathers silently in everyday domestic pleasantries. The morning boat horns over Onomichi harbour, Noriko's trembling grip on her deceased husband's pocket watch inside the train car—these form the most patient and desolate sculptures of time in cinema history. It is an unsparing, tender gaze into impermanence and the subtle tragedy of generational drift.",
    },
  },
  {
    id: "stalker",
    title: "Stalker",
    originalTitle: "Сталкер",
    type: "film",
    director: "Andrei Tarkovsky",
    originalDirector: "Андрей Тарковский",
    year: 1979,
    country: "USSR",
    genre: "Sci-Fi / Philosophical Drama",
    runtime: "162 min",
    format: "35mm · Sepia & Color · 1.37:1",
    posterUrl: "/images/cinema/stalker.jpg",
    stillUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1600&q=85",
    summary: "A guide leads a writer and a professor into the heart of 'The Zone', a forbidden area where one's deepest inner desires might be granted.",
    rating: "5.0 / 5.0",
    firstWatched: "2020.02",
    rewatched: "2023.05, 2026.01",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt0079944/",
    },
    review: {
      rating: "5.0 / 5.0",
      date: "2026.01",
      quote: "“Let everything that's been planned come true. Let them believe. And let them have a laugh at their passions.”",
      excerpt: "Tarkovsky strips science fiction down to its metaphysical bones, crafting a pilgrimage through human vanity, faith, and spiritual exhaustion.",
      content: "Tarkovsky strips science fiction entirely of genre spectacle, elevating it into a profound metaphysical meditation on faith, human vanity, and existential exhaustion. Through excruciatingly long takes surveying decaying industrial ruins, trickling water, and moss-covered stones, time assumes palpable physical gravity. The Room does not grant conscious wishes; it exposes what one truly desires in the darkest subconscious recesses. In the final sequence, as the child nudges a glass across the wooden table to the rumble of a passing train, the fragile light of mystery and belief endures.",
    },
  },
  {
    id: "three-colors-blue",
    title: "Three Colors: Blue",
    originalTitle: "Trois couleurs: Bleu",
    type: "film",
    director: "Krzysztof Kieślowski",
    year: 1993,
    country: "France / Poland",
    genre: "Drama / Mystery",
    runtime: "98 min",
    format: "35mm · Technicolor · 1.85:1",
    posterUrl: "/images/cinema/three-colors-blue.jpg",
    stillUrl: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1600&q=85",
    summary: "A woman struggles to sever all emotional ties and commitments following the sudden deaths of her composer husband and young daughter.",
    rating: "4.8 / 5.0",
    firstWatched: "2021.07",
    rewatched: "2023.12, 2025.11",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt0108394/",
    },
    review: {
      rating: "4.8 / 5.0",
      date: "2025.11",
      quote: "“Now I have only one thing left to do: nothing. No memories, no sorrow, no hope.”",
      excerpt: "A devastating deconstruction of emotional liberty: absolute detachment from human memory proves impossible under the gravitational pull of love.",
      content: "Kieślowski dissects the paradox of liberty with surgical poetic precision: when Julie attempts to sever every attachment to past and present in pursuit of absolute freedom, she is inevitably dragged back to human existence by the unfinished European unity concerto and the inescapable pull of empathy. Juliette Binoche delivers a monumental performance of restrained grief, illuminated by Zbigniew Preisner’s majestic orchestral score and the suffocating lapis-blue reflections of the swimming pool.",
    },
  },
  {
    id: "yi-yi",
    title: "Yi Yi",
    originalTitle: "A One and a Two",
    type: "film",
    director: "Edward Yang",
    originalDirector: "杨德昌",
    year: 2000,
    country: "Taiwan",
    genre: "Drama",
    runtime: "173 min",
    format: "35mm · Color · 1.85:1",
    posterUrl: "/images/cinema/yi-yi.jpg",
    stillUrl: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1600&q=85",
    summary: "Each member of a middle-class Taipei family seeks personal reconciliation across an interconnected cycle of weddings, illnesses, and funerals.",
    rating: "5.0 / 5.0",
    firstWatched: "2019.08",
    rewatched: "2022.08, 2025.08",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt0244316/",
    },
    review: {
      rating: "5.0 / 5.0",
      date: "2025.08",
      quote: "“You can't see what's behind your own head, so I take pictures to show you.”",
      excerpt: "Edward Yang's sublime swan song frames Taipei's middle-class melancholy with pristine polyphonic clarity and timeless human empathy.",
      content: "Edward Yang’s swan song begins with a wedding and concludes with a funeral, orchestrating the anxieties, moral dilemmas, and quiet longings of contemporary urban life into a transcendent polyphonic symphony. Little Yang-Yang photographs the backs of people’s heads so they can witness the half of reality they miss, while NJ confronts his lost youth in Tokyo only to realize a second chance would yield the same fate. Cinema allows us to live three times longer, and Yi Yi represents the most deeply compassionate specimen of that extended life.",
    },
  },
  {
    id: "space-odyssey",
    title: "2001: A Space Odyssey",
    originalTitle: "2001: A Space Odyssey",
    type: "film",
    director: "Stanley Kubrick",
    year: 1968,
    country: "USA / UK",
    genre: "Sci-Fi / Adventure",
    runtime: "149 min",
    format: "Super Panavision 70 · 2.20:1",
    posterUrl: "/images/cinema/space-odyssey.jpg",
    stillUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=85",
    summary: "After uncovering a mysterious alien monolith buried beneath the lunar surface, mankind embarks on an enigmatic voyage toward Jupiter with HAL 9000.",
    rating: "5.0 / 5.0",
    firstWatched: "2018.06",
    rewatched: "2021.11, 2024.01",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt0062622/",
    },
  },
  {
    id: "drive-my-car",
    title: "Drive My Car",
    originalTitle: "ドライブ・マイ・カー",
    type: "film",
    director: "Ryusuke Hamaguchi",
    originalDirector: "濱口竜介",
    year: 2021,
    country: "Japan",
    genre: "Drama",
    runtime: "179 min",
    format: "Digital · Color · 1.85:1",
    posterUrl: "/images/cinema/drive-my-car.jpg",
    stillUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=85",
    summary: "An aging theatre director mourning his wife's sudden passing confronts unspoken grief through conversations with his taciturn young chauffeur.",
    rating: "4.7 / 5.0",
    firstWatched: "2021.12",
    rewatched: "2024.10",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt14039582/",
    },
    review: {
      rating: "4.7 / 5.0",
      date: "2024.10",
      quote: "“Those who survive must keep remembering the dead.”",
      excerpt: "Hamaguchi weaves Chekhov's Uncle Vanya into the acoustic interior of a red Saab 900 traversing coastal highways.",
      content: "Hamaguchi intertwines multi-lingual rehearsals of Chekhov’s Uncle Vanya with the rhythmic movement of a red Saab 900 along the coastal roads of Hiroshima. The automobile transforms into an acoustic confessional where language barriers gradually dissolve into sign language and shared silence against a snowy northern landscape. Patient, rigorous, and profoundly consoling, it is an extraordinary journey into grief and collective healing.",
    },
  },
  {
    id: "oppenheimer",
    title: "Oppenheimer",
    originalTitle: "Oppenheimer",
    type: "film",
    director: "Christopher Nolan",
    year: 2023,
    country: "USA",
    genre: "Biography / Drama / History",
    runtime: "180 min",
    format: "IMAX 70mm · 1.43:1 / 2.20:1",
    posterUrl: "/images/cinema/oppenheimer.jpg",
    stillUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=85",
    summary: "The story of American theoretical physicist J. Robert Oppenheimer and his role in the creation of the atomic bomb during the Manhattan Project.",
    rating: "4.5 / 5.0",
    firstWatched: "2023.08",
    rewatched: "2024.02",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt15398776/",
    },
  },
  {
    id: "perfect-days",
    title: "Perfect Days",
    originalTitle: "Perfect Days",
    type: "film",
    director: "Wim Wenders",
    year: 2023,
    country: "Japan / Germany",
    genre: "Drama",
    runtime: "124 min",
    format: "Digital · Color · 1.33:1 Academy",
    posterUrl: "/images/cinema/perfect-days.jpg",
    stillUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=85",
    summary: "Hirayama cleans public toilets in Tokyo, cultivating deep inner contentment through analog cassettes, paperback novels, and sunlight filtering through trees.",
    rating: "4.9 / 5.0",
    firstWatched: "2024.01",
    rewatched: "2024.03",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt27503384/",
    },
    review: {
      rating: "4.9 / 5.0",
      date: "2024.03",
      quote: "“Next time is next time. Now is now.”",
      excerpt: "Wenders and Kōji Yakusho restore an almost forgotten dignity to daily labor, finding sanctuary in light shimmering through Tokyo's leaves.",
      content: "Wim Wenders and Kōji Yakusho construct an unhurried tribute to quiet dignity in modern Tokyo. Cleaning architectural public toilets becomes a sacred ritual of respect toward civic space, while vintage audio cassettes and the shimmering patterns of sunlight through foliage (komorebi) erect a gentle refuge. The culminating unbroken close-up of Yakusho laughing through tears to Nina Simone’s ‘Feeling Good’ is one of the most sublime portraits of human grace in recent cinema.",
    },
  },
  {
    id: "anatomy-of-a-fall",
    title: "Anatomy of a Fall",
    originalTitle: "Anatomie d'une chute",
    type: "film",
    director: "Justine Triet",
    year: 2023,
    country: "France",
    genre: "Crime / Drama / Thriller",
    runtime: "151 min",
    format: "Digital · Color · 1.85:1",
    posterUrl: "/images/cinema/anatomy-of-a-fall.jpg",
    stillUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85",
    summary: "A German novelist is indicted for murder after her husband falls to his death from their secluded chalet in the French Alps.",
    rating: "4.6 / 5.0",
    firstWatched: "2023.11",
    rewatched: "2024.05",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt17009710/",
    },
  },
  {
    id: "dr-strangelove",
    title: "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb",
    originalTitle: "Dr. Strangelove",
    type: "film",
    director: "Stanley Kubrick",
    year: 1964,
    country: "UK / USA",
    genre: "Satire / War / Black Comedy",
    runtime: "95 min",
    format: "35mm · B&W · 1.66:1",
    posterUrl: "/images/cinema/dr-strangelove.jpg",
    stillUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85",
    summary: "An unhinged United States Air Force general orders a preemptive nuclear strike on the Soviet Union, triggering a desperate scramble inside the Pentagon War Room.",
    rating: "4.9 / 5.0",
    firstWatched: "2017.05",
    rewatched: "2021.09, 2025.02",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt0057012/",
    },
  },
  {
    id: "birdman",
    title: "Birdman or (The Unexpected Virtue of Ignorance)",
    originalTitle: "Birdman",
    type: "film",
    director: "Alejandro González Iñárritu",
    originalDirector: "Alejandro G. Iñárritu",
    year: 2014,
    country: "USA",
    genre: "Comedy / Drama",
    runtime: "119 min",
    format: "Arri Alexa · Color · 1.85:1",
    posterUrl: "/images/cinema/birdman.jpg",
    stillUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1600&q=85",
    summary: "A washed-up Hollywood actor who once played an iconic superhero battles his ego and personal turmoil while staging an ambitious Raymond Carver play on Broadway.",
    rating: "4.7 / 5.0",
    firstWatched: "2015.03",
    rewatched: "2020.10",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt2562232/",
    },
  },
];

export const cinemaSeries: MediaItem[] = [
  {
    id: "decalogue",
    title: "Dekalog",
    originalTitle: "Dekalog",
    type: "series",
    director: "Krzysztof Kieślowski",
    year: 1989,
    country: "Poland",
    genre: "Drama / Anthology",
    runtime: "Mini-series",
    format: "35mm · 1.33:1 TV",
    posterUrl: "/images/cinema/decalogue.jpg",
    stillUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=85",
    summary: "Ten one-hour films inspired by the Ten Commandments, set around a bleak concrete housing project in late-Communist Warsaw.",
    rating: "5.0 / 5.0",
    firstWatched: "2021.01",
    rewatched: "2023.09",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt0092337/",
    },
    review: {
      rating: "5.0 / 5.0",
      date: "2025.12",
      quote: "“If God does not exist, what about our children who freeze in the winter lake?”",
      excerpt: "Ten piercing moral tragedies set against the grey monolithic housing towers of Warsaw, meditating on human fragility and hubris.",
      content: "Set amidst the grim, monolithic pre-fab apartment blocks of Warsaw, Kieślowski crafted ten timeless moral chamber pieces exploring contemporary human dilemmas. The silent observer who appears at crucial junctures as a tramp, boatman, or medic watches without ever intervening in human tragedy. From the cracked ice of mathematical certitude in Part I to the voyeuristic torment of love in Part VI, Dekalog remains an unmatched sociological and ethical inquest into the vulnerability of the modern soul.",
    },
  },
  {
    id: "twin-peaks",
    title: "Twin Peaks",
    originalTitle: "Twin Peaks",
    type: "series",
    director: "David Lynch & Mark Frost",
    year: 1990,
    span: "1990–2017",
    country: "USA",
    genre: "Mystery / Surrealism / Drama",
    runtime: "3 Seasons",
    format: "35mm & Digital · 1.33:1 / 1.78:1",
    posterUrl: "/images/cinema/twin-peaks.jpg",
    stillUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1600&q=85",
    summary: "An idiosyncratic FBI Special Agent arrives in the Pacific Northwest town of Twin Peaks to investigate the murder of high school girl Laura Palmer.",
    rating: "5.0 / 5.0",
    firstWatched: "2019.11",
    rewatched: "2022.04, 2024.07",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt0098936/",
    },
    review: {
      rating: "5.0 / 5.0",
      date: "2025.04",
      quote: "“The owls are not what they seem.”",
      excerpt: "David Lynch revolutionized episodic television, replacing procedural reality with dream logic, red velvet curtains, and primordial mystery.",
      content: "David Lynch blew apart the conventions of television drama. The mist rising between the Douglas firs, the red drapes and chevron marble floor of the Black Lodge, the backwards-recorded whispers—all forged a brand-new audio-visual grammar. The Return in 2017, particularly the eighth episode depicting the birth of absolute evil from the Trinity nuclear test, remains an astonishing masterpiece of abstract cinematic terror.",
    },
  },
  {
    id: "better-call-saul",
    title: "Better Call Saul",
    originalTitle: "Better Call Saul",
    type: "series",
    director: "Vince Gilligan & Peter Gould",
    year: 2015,
    span: "2015–2022",
    country: "USA",
    genre: "Crime / Drama",
    runtime: "6 Seasons",
    format: "Digital 4K · 1.78:1",
    posterUrl: "/images/cinema/better-call-saul.jpg",
    stillUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=85",
    summary: "The moral trials and tribulations of criminal defense lawyer Jimmy McGill in the years prior to his fateful partnership with Walter White.",
    rating: "5.0 / 5.0",
    firstWatched: "2017.03",
    rewatched: "2022.09, 2024.09",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt3032476/",
    },
    review: {
      rating: "5.0 / 5.0",
      date: "2024.09",
      quote: "“If you had a time machine, where would you go?”",
      excerpt: "A Shakespearean drama disguised as a crime tragedy, charting Jimmy McGill's descent with unparalleled narrative and visual precision.",
      content: "In terms of narrative discipline and cinematic framing, Vince Gilligan and Peter Gould achieved the zenith of long-form television. Jimmy McGill’s gradual donning of the colorful Saul Goodman mask is less a crime escapade and more a tragic Shakespearean reckoning with family rejection and self-deception. The black-and-white prison conclusion, shrouded in cigarette smoke against a prison fence, stands as one of the most dignified farewells ever filmed.",
    },
  },
  {
    id: "chernobyl",
    title: "Chernobyl",
    originalTitle: "Chernobyl",
    type: "series",
    director: "Craig Mazin",
    year: 2019,
    country: "USA / UK",
    genre: "Drama / History / Thriller",
    runtime: "Mini-series",
    format: "Digital · 2.00:1",
    posterUrl: "/images/cinema/chernobyl.jpg",
    stillUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85",
    summary: "In April 1986, an explosion at the Chernobyl nuclear power plant triggers one of the worst human-made catastrophes in history.",
    rating: "4.8 / 5.0",
    firstWatched: "2019.05",
    rewatched: "2022.06",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt8087968/",
    },
  },
  {
    id: "succession",
    title: "Succession",
    originalTitle: "Succession",
    type: "series",
    director: "Jesse Armstrong",
    year: 2018,
    span: "2018–2023",
    country: "USA",
    genre: "Drama",
    runtime: "4 Seasons",
    format: "35mm Panavision · 1.78:1",
    posterUrl: "/images/cinema/succession.jpg",
    stillUrl: "https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1600&q=85",
    summary: "The Roy family is known for controlling the biggest media and entertainment company in the world. However, their world changes when their aging father steps down.",
    rating: "4.9 / 5.0",
    firstWatched: "2020.01",
    rewatched: "2023.06",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt7660850/",
    },
  },
  {
    id: "the-wire",
    title: "The Wire",
    originalTitle: "The Wire",
    type: "series",
    director: "David Simon",
    year: 2002,
    span: "2002–2008",
    country: "USA",
    genre: "Crime / Drama / Thriller",
    runtime: "5 Seasons",
    format: "35mm · 1.33:1 / 1.78:1",
    posterUrl: "/images/cinema/the-wire.jpg",
    stillUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=85",
    summary: "A sprawling sociological dissection of Baltimore through the eyes of drug dealers, port workers, politicians, teachers, and beat police officers.",
    rating: "5.0 / 5.0",
    firstWatched: "2020.08",
    rewatched: "2024.01",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt0306414/",
    },
    review: {
      rating: "5.0 / 5.0",
      date: "2024.01",
      quote: "“The game is the game. Always.”",
      excerpt: "War and Peace in the guise of modern urban drama. David Simon wields a sociological scalpel to dissect systemic American decay.",
      content: "War and Peace transplanted to an American post-industrial port. David Simon wields an unyielding sociological scalpel across five seasons, systematically examining street corners, dock unions, municipal politics, the public school apparatus, and print journalism. Without a trace of Hollywood heroic myth-making, the institutional machine crushes individuals on both sides of the law, yet human resilience and fragile dignity persist through the gloom.",
    },
  },
  {
    id: "severance",
    title: "Severance",
    originalTitle: "Severance",
    type: "series",
    director: "Dan Erickson",
    year: 2022,
    span: "2022–",
    country: "USA",
    genre: "Drama / Mystery / Sci-Fi",
    runtime: "Season 1",
    format: "Digital · 2.39:1 Cinemascope",
    posterUrl: "/images/cinema/severance.jpg",
    stillUrl: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1600&q=85",
    summary: "Mark leads a team of office workers whose memories have been surgically divided between their work and personal lives.",
    rating: "4.7 / 5.0",
    firstWatched: "2022.03",
    rewatched: "2024.08",
    externalLink: {
      platform: "IMDb",
      url: "https://www.imdb.com/title/tt11280740/",
    },
  },
];

export const allCinemaItems: MediaItem[] = [...cinemaFilms, ...cinemaSeries];
