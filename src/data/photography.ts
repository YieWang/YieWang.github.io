export interface Photo {
  cityId?: string;
  id: string;
  title: string;
  subtitle?: string;
  location: string;
  locationEn: string;
  year: number;
  date: string;
  imageUrl: string;
  thumbnailUrl: string;
  aspectRatio: '3/2' | '2/3' | '1/1' | '16/9';
  camera: string;
  lens?: string;
  film?: string;
  exif: {
    focalLength: string;
    aperture: string;
    shutter: string;
    iso: string;
  };
  story?: string;
}

export interface CityAlbum {
  id: string;
  year: number;
  location: string;
  locationEn: string;
  country: string;
  photos: Photo[];
}

export interface YearGroup {
  year: number;
  cities: CityAlbum[];
}

export const photographyYearGroups: YearGroup[] = [
  {
    year: 2026,
    cities: [
      {
        id: "regensburg-2026",
        year: 2026,
        location: "雷根斯堡",
        locationEn: "Regensburg",
        country: "Germany",
        photos: [
          {
            id: "regensburg-01",
            title: "St. Peter's Gothic Spires",
            subtitle: "主教座堂千载哥特双塔",
            location: "雷根斯堡",
            locationEn: "Regensburg",
            year: 2026,
            date: "2026.05",
            imageUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Kodak Tri-X 400",
            exif: {
              focalLength: "35mm",
              aperture: "f/5.6",
              shutter: "1/500s",
              iso: "400",
            },
            story: "清晨漫步过多瑙河畔，主教座堂千年的哥特式双尖塔在晨雾中若隐若现，飞扶壁与尖拱券在晨光下拉出修长肃穆的光影。"
          },
          {
            id: "regensburg-02",
            title: "Old Stone Bridge at Twilight",
            subtitle: "多瑙河石桥与老城暮色",
            location: "雷根斯堡",
            locationEn: "Regensburg",
            year: 2026,
            date: "2026.04",
            imageUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Elmarit 28mm f/2.8",
            film: "Kodak Portra 400",
            exif: {
              focalLength: "28mm",
              aperture: "f/5.6",
              shutter: "1/250s",
              iso: "400",
            },
            story: "十二世纪建成的中世纪石桥跨越急湍的多瑙河水，夕阳将老城五彩斑斓的砖石房屋染成金红，河面泛着碎金波光。"
          },
          {
            id: "regensburg-03",
            cityId: "regensburg-2026",
            title: "Porta Praetoria Roman Heritage",
            subtitle: "古罗马军营北门晨辉残垣",
            location: "雷根斯堡",
            locationEn: "Regensburg",
            year: 2026,
            date: "2026.03",
            imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Elmarit 28mm f/2.8",
            film: "Kodak Portra 160",
            exif: {
              focalLength: "28mm",
              aperture: "f/5.6",
              shutter: "1/125s",
              iso: "160"
            },
            story: "马可·奥勒留皇帝建立的卡斯特拉·雷金纳罗马军团要塞，这处两千年历史的石筑北拱门依然伫立在老城街巷深处。"
          }
        ]
      },
      {
        id: "munich-2026",
        year: 2026,
        location: "慕尼黑",
        locationEn: "Munich",
        country: "Germany",
        photos: [
          {
            id: "munich-01",
            title: "Marienplatz at Dawn",
            subtitle: "玛利亚广场晨曦",
            location: "慕尼黑",
            locationEn: "Munich",
            year: 2026,
            date: "2026.03",
            imageUrl: "https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1595867818082-083862f3d630?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Kodak Tri-X 400",
            exif: {
              focalLength: "35mm",
              aperture: "f/8",
              shutter: "1/250s",
              iso: "400",
            },
            story: "清晨登上老彼得教堂钟楼顶端俯瞰老城，新市政厅与圣母教堂的双塔在破晓朝霞中舒展，石板路拉出修长的行人剪影。"
          },
          {
            id: "munich-02",
            title: "Morning Sun in the Woods",
            subtitle: "英国公园晨光静道",
            location: "慕尼黑",
            locationEn: "Munich",
            year: 2026,
            date: "2026.02",
            imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 50mm f/2",
            film: "Kodak Portra 160",
            exif: {
              focalLength: "50mm",
              aperture: "f/4",
              shutter: "1/125s",
              iso: "160",
            },
            story: "清晨阳光穿透高耸茂密的冷杉树冠，光斑轻柔地洒在泥土与青苔小径上，整座森林弥漫着湿润纯净的松木芳香。"
          },
          {
            id: "munich-03",
            cityId: "munich-2026",
            title: "Nymphenburg Canal Waters",
            subtitle: "宁芬堡天鹅池与巴洛克运河",
            location: "慕尼黑",
            locationEn: "Munich",
            year: 2026,
            date: "2026.01",
            imageUrl: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1588714477688-cf28a50e94f7?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 50mm f/2",
            film: "Kodak Portra 160",
            exif: {
              focalLength: "50mm",
              aperture: "f/4",
              shutter: "1/250s",
              iso: "160"
            },
            story: "巴洛克风格的维特尔斯巴赫夏宫前，冰晶在运河两岸凝结，优雅的天鹅在冬日薄雾倒影中静静划过澄澈水面。"
          }
        ]
      }
    ]
  },
  {
    year: 2025,
    cities: [
      {
        id: "berlin-2025",
        year: 2025,
        location: "柏林",
        locationEn: "Berlin",
        country: "Germany",
        photos: [
          {
            id: "berlin-01",
            title: "Spree River & TV Tower",
            subtitle: "电视塔与施普雷河夜色",
            location: "柏林",
            locationEn: "Berlin",
            year: 2025,
            date: "2025.11",
            imageUrl: "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Elmarit 28mm f/2.8",
            film: "Cinestill 800T",
            exif: {
              focalLength: "28mm",
              aperture: "f/2.8",
              shutter: "1/30s",
              iso: "800",
            },
            story: "入夜后的亚历山大广场与施普雷河畔，车流拉出道道橙红色光轨，电视塔尖在深蓝夜幕中静穆矗立。"
          },
          {
            id: "berlin-02",
            title: "Museum Island Colonnades",
            subtitle: "博物馆岛列柱廊暮光",
            location: "柏林",
            locationEn: "Berlin",
            year: 2025,
            date: "2025.09",
            imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Kodak Ektar 100",
            exif: {
              focalLength: "35mm",
              aperture: "f/8",
              shutter: "1/250s",
              iso: "100",
            },
            story: "佩加蒙与老国家画廊之间的爱奥尼柱廊，黄昏斜阳将巨大圆柱的阴影投射在斑驳花岗岩地面，庄严静美。"
          },
          {
            id: "berlin-03",
            cityId: "berlin-2025",
            title: "Museum Island Colonnade",
            subtitle: "博物馆岛科林斯柱廊晨曦",
            location: "柏林",
            locationEn: "Berlin",
            year: 2025,
            date: "2025.07",
            imageUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Ilford HP5 Plus",
            exif: {
              focalLength: "35mm",
              aperture: "f/5.6",
              shutter: "1/500s",
              iso: "400"
            },
            story: "施普雷河环绕的博物馆岛清晨极度宁静，长长的古典科林斯石柱列投射出黑白分明的规整阴影，诉说着普鲁士时期的启蒙理想。"
          }
        ]
      },
      {
        id: "hangzhou-2025",
        year: 2025,
        location: "杭州",
        locationEn: "Hangzhou",
        country: "China",
        photos: [
          {
            id: "hangzhou-01",
            title: "West Lake Morning Mist",
            subtitle: "西湖苏堤晨雾与残荷",
            location: "杭州",
            locationEn: "Hangzhou",
            year: 2025,
            date: "2025.06",
            imageUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Kodak Portra 160",
            exif: {
              focalLength: "35mm",
              aperture: "f/5.6",
              shutter: "1/125s",
              iso: "160",
            },
            story: "清晨微雨初歇，苏堤六桥隐入水墨般的轻岚烟雨之中，近处残荷轻摇，远处保俶塔影空蒙如画。"
          },
          {
            id: "hangzhou-02",
            title: "Cloud & Bamboo Trail",
            subtitle: "云栖竹径深山青翠",
            location: "杭州",
            locationEn: "Hangzhou",
            year: 2025,
            date: "2025.04",
            imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Fuji Pro 400H",
            exif: {
              focalLength: "35mm",
              aperture: "f/4",
              shutter: "1/125s",
              iso: "400",
            },
            story: "盛夏午后行于云栖石阶之上，两侧万竿修竹直耸入云，翠色欲流，偶有山泉叮咚与鸣蝉之声穿林而过。"
          },
          {
            id: "hangzhou-03",
            cityId: "hangzhou-2025",
            title: "Longjing Mist Terraces",
            subtitle: "狮峰龙井茶山雨后青翠",
            location: "杭州",
            locationEn: "Hangzhou",
            year: 2025,
            date: "2025.04",
            imageUrl: "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1528164344705-475426879c0d?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 50mm f/2",
            film: "Kodak Portra 160",
            exif: {
              focalLength: "50mm",
              aperture: "f/2.8",
              shutter: "1/125s",
              iso: "160"
            },
            story: "清明时节江南微雨初霁，西湖群山深处的层叠茶园散发着草木清香，竹篱小径延伸入苍茫云雾之中。"
          }
        ]
      }
    ]
  },
  {
    year: 2024,
    cities: [
      {
        id: "kyoto-2024",
        year: 2024,
        location: "京都",
        locationEn: "Kyoto",
        country: "Japan",
        photos: [
          {
            id: "kyoto-01",
            title: "Kamogawa & Yasaka",
            subtitle: "八坂之塔与晨曦幽巷",
            location: "京都",
            locationEn: "Kyoto",
            year: 2024,
            date: "2024.11",
            imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Fujicolor Superia 400",
            exif: {
              focalLength: "35mm",
              aperture: "f/4",
              shutter: "1/125s",
              iso: "400",
            },
            story: "破晓前的二年坂尚无游人，石板坡道在微雨后泛着温润的青光，尽头的八坂塔五重飞檐在灰蓝色的晨空下静默伫立。"
          },
          {
            id: "kyoto-02",
            cityId: "kyoto-2024",
            title: "Fushimi Inari Torii Passage",
            subtitle: "伏见稻荷千本鸟居深红回廊",
            location: "京都",
            locationEn: "Kyoto",
            year: 2024,
            date: "2024.10",
            imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Kodak Portra 400",
            exif: {
              focalLength: "35mm",
              aperture: "f/2.8",
              shutter: "1/125s",
              iso: "400"
            },
            story: "数千座朱红色的木质鸟居沿着稻荷山蜿蜒而上，午后斜阳穿透缝隙洒下交错光斑，仿佛通向神秘幽邃的异界结界。"
          },
          {
            id: "kyoto-03",
            cityId: "kyoto-2024",
            title: "Arashiyama Bamboo Grove Walk",
            subtitle: "岚山嵯峨野竹林风吟",
            location: "京都",
            locationEn: "Kyoto",
            year: 2024,
            date: "2024.09",
            imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Elmarit 28mm f/2.8",
            film: "Kodak Tri-X 400",
            exif: {
              focalLength: "28mm",
              aperture: "f/4",
              shutter: "1/250s",
              iso: "400"
            },
            story: "修长挺拔的青竹直插云霄，清风掠过竹叶沙沙作响，在清幽湿润的林荫古道间流淌出平安京时代的禅意。"
          }
        ]
      },
      {
        id: "tokyo-2024",
        year: 2024,
        location: "东京",
        locationEn: "Tokyo",
        country: "Japan",
        photos: [
          {
            id: "tokyo-01",
            title: "Tokyo Tower in Twilight",
            subtitle: "暮色蓝调中的东京铁塔",
            location: "东京",
            locationEn: "Tokyo",
            year: 2024,
            date: "2024.06",
            imageUrl: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1513407030348-c983a97b98d8?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Cinestill 800T",
            exif: {
              focalLength: "35mm",
              aperture: "f/4",
              shutter: "1/60s",
              iso: "800",
            },
            story: "六本木高处远眺，日落后的蓝调时刻将整座城市的楼群浸润于深蓝之中，橙红色的东京铁塔亮起暖光，格外耀眼。"
          },
          {
            id: "tokyo-02",
            title: "Spring Pagoda & Blossoms",
            subtitle: "浅草寺春樱古塔",
            location: "东京",
            locationEn: "Tokyo",
            year: 2024,
            date: "2024.04",
            imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 50mm f/2",
            film: "Kodak Portra 400",
            exif: {
              focalLength: "50mm",
              aperture: "f/4",
              shutter: "1/500s",
              iso: "400",
            },
            story: "春日浅草寺，粉白色的染井吉野樱在朱红色的五重塔前如云般盛开，微风拂过，花瓣轻落于青石参道之上。"
          },
          {
            id: "tokyo-03",
            title: "Shinjuku Twilight Neon",
            subtitle: "新宿雨夜微光",
            location: "东京",
            locationEn: "Tokyo",
            year: 2024,
            date: "2024.03",
            imageUrl: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Cinestill 800T",
            exif: {
              focalLength: "35mm",
              aperture: "f/2",
              shutter: "1/60s",
              iso: "800",
            },
            story: "湿漉的柏油街道倒映着居酒屋的红灯笼与招牌霓虹，打着透明雨伞的行人在雨幕中穿行而过。"
          },
          {
            id: "tokyo-04",
            title: "Ginza Geometric Facade",
            subtitle: "银座建筑切面",
            location: "东京",
            locationEn: "Tokyo",
            year: 2024,
            date: "2024.01",
            imageUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Elmarit 28mm f/2.8",
            film: "Kodak Tri-X 400",
            exif: {
              focalLength: "28mm",
              aperture: "f/8",
              shutter: "1/250s",
              iso: "400",
            },
            story: "银座街头现代主义商业建筑外立面的精细格栅，午后阳光斜射投下如同琴键般严谨的明暗阴影。"
          }
        ]
      }
    ]
  },
  {
    year: 2023,
    cities: [
      {
        id: "paris-2023",
        year: 2023,
        location: "巴黎",
        locationEn: "Paris",
        country: "France",
        photos: [
          {
            id: "paris-01",
            title: "Eiffel Tower from Trocadéro",
            subtitle: "夏乐宫远眺铁塔",
            location: "巴黎",
            locationEn: "Paris",
            year: 2023,
            date: "2023.10",
            imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Kodak Portra 400",
            exif: {
              focalLength: "35mm",
              aperture: "f/5.6",
              shutter: "1/500s",
              iso: "400",
            },
            story: "秋日清晨的夏乐宫露台，薄雾轻笼战神广场，埃菲尔铁塔的钢铁蕾丝结构在晨光中显得修长而轻盈。"
          },
          {
            id: "paris-02",
            title: "Pont Alexandre III & Seine",
            subtitle: "亚历山大三世桥晨景",
            location: "巴黎",
            locationEn: "Paris",
            year: 2023,
            date: "2023.09",
            imageUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Elmarit 28mm f/2.8",
            film: "Ilford HP5 Plus",
            exif: {
              focalLength: "28mm",
              aperture: "f/8",
              shutter: "1/250s",
              iso: "400",
            },
            story: "塞纳河上最华丽的单跨拱桥，镀金青铜雕塑在晨曦中熠熠生辉，游船在平静的河面上划出泛着微光的尾波。"
          },
          {
            id: "paris-03",
            cityId: "paris-2023",
            title: "Seine River Bank Bookstalls",
            subtitle: "塞纳河畔绿皮旧书摊",
            location: "巴黎",
            locationEn: "Paris",
            year: 2023,
            date: "2023.08",
            imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Kodak Portra 160",
            exif: {
              focalLength: "35mm",
              aperture: "f/5.6",
              shutter: "1/250s",
              iso: "160"
            },
            story: "左岸的深绿铁皮箱书摊排列在花岗岩护栏上，泛黄的哲学古籍与版画散发着油墨香气，不远处圣母院尖塔在波光中倒映。"
          }
        ]
      },
      {
        id: "rome-2023",
        year: 2023,
        location: "罗马",
        locationEn: "Rome",
        country: "Italy",
        photos: [
          {
            id: "rome-01",
            title: "The Roman Colosseum",
            subtitle: "暮色中的罗马斗兽场",
            location: "罗马",
            locationEn: "Rome",
            year: 2023,
            date: "2023.06",
            imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Kodak Portra 160",
            exif: {
              focalLength: "35mm",
              aperture: "f/5.6",
              shutter: "1/250s",
              iso: "160",
            },
            story: "黄昏时分的弗拉维安半圆形剧场，两千年的石灰华石拱券在夕阳斜照下染上焦糖般的金黄，见证着永恒之城的岁月轮转。"
          },
          {
            id: "rome-02",
            title: "Trastevere Alleyways",
            subtitle: "特拉斯提弗列古巷",
            location: "罗马",
            locationEn: "Rome",
            year: 2023,
            date: "2023.05",
            imageUrl: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Kodak Tri-X 400",
            exif: {
              focalLength: "35mm",
              aperture: "f/4",
              shutter: "1/125s",
              iso: "400",
            },
            story: "台伯河西岸的老城区，鹅卵石街巷两侧是风化剥落的赭石色墙面，藤蔓从木窗台垂下，空气中弥漫着意式老城的闲适。"
          },
          {
            id: "rome-03",
            cityId: "rome-2023",
            title: "Pantheon Oculus Divine Light",
            subtitle: "万神殿天顶圆洞圣光束",
            location: "罗马",
            locationEn: "Rome",
            year: 2023,
            date: "2023.03",
            imageUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Super-Elmar 21mm f/3.4",
            film: "Kodak Tri-X 400",
            exif: {
              focalLength: "21mm",
              aperture: "f/4",
              shutter: "1/60s",
              iso: "400"
            },
            story: "两千年前未加钢筋的混凝土巨大穹顶正中央，开阔的圆洞投射下一道神圣而清晰的太阳光束，在大理石地坪上缓慢移位。"
          }
        ]
      }
    ]
  },
  {
    year: 2022,
    cities: [
      {
        id: "london-2022",
        year: 2022,
        location: "伦敦",
        locationEn: "London",
        country: "UK",
        photos: [
          {
            id: "london-01",
            title: "Westminster & Big Ben",
            subtitle: "威斯敏斯特与大本钟",
            location: "伦敦",
            locationEn: "London",
            year: 2022,
            date: "2022.11",
            imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Ilford HP5 Plus",
            exif: {
              focalLength: "35mm",
              aperture: "f/5.6",
              shutter: "1/250s",
              iso: "400",
            },
            story: "薄雾弥漫的泰晤士河畔，红色的双层巴士缓缓驶过威斯敏斯特桥，伊丽莎白塔的钟面在雾气中透出沉稳暖光。"
          },
          {
            id: "london-02",
            title: "Classic Red Phone Box",
            subtitle: "圣保罗旁的红色电话亭",
            location: "伦敦",
            locationEn: "London",
            year: 2022,
            date: "2022.09",
            imageUrl: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1533929736458-ca588d08c8be?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Summicron 50mm f/2",
            film: "Kodak Portra 400",
            exif: {
              focalLength: "50mm",
              aperture: "f/4",
              shutter: "1/125s",
              iso: "400",
            },
            story: "伦敦金融城的一场骤雨过后，经典的K6红色电话亭立在湿润的石砖地面上，远处圣保罗大教堂宏伟的圆顶在云层间若隐若现。"
          },
          {
            id: "london-03",
            cityId: "london-2022",
            title: "St. Pauls from Millennium Bridge",
            subtitle: "千禧桥与圣保罗大教堂穹顶",
            location: "伦敦",
            locationEn: "London",
            year: 2022,
            date: "2022.08",
            imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Ilford HP5 Plus",
            exif: {
              focalLength: "35mm",
              aperture: "f/8",
              shutter: "1/500s",
              iso: "400"
            },
            story: "泰晤士河上的悬索步行桥将视线精准导向克里斯托弗·雷恩爵士设计的宏伟穹顶，现代钢构与十七世纪巴洛克在阴天交汇。"
          }
        ]
      },
      {
        id: "edinburgh-2022",
        year: 2022,
        location: "爱丁堡",
        locationEn: "Edinburgh",
        country: "UK",
        photos: [
          {
            id: "edinburgh-01",
            title: "Calton Hill Sunset Silhouette",
            subtitle: "卡尔顿山日暮远眺",
            location: "爱丁堡",
            locationEn: "Edinburgh",
            year: 2022,
            date: "2022.06",
            imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Elmarit 28mm f/2.8",
            film: "Kodak Portra 160",
            exif: {
              focalLength: "28mm",
              aperture: "f/8",
              shutter: "1/250s",
              iso: "160",
            },
            story: "傍晚登上卡尔顿山，国家纪念碑的希腊多立克廊柱与远处爱丁堡城堡的黑色岩壁剪影在紫粉色的落日霞光中连成一线。"
          },
          {
            id: "edinburgh-02",
            title: "Victoria Street Historic Curve",
            subtitle: "维多利亚街历史弧线",
            location: "爱丁堡",
            locationEn: "Edinburgh",
            year: 2022,
            date: "2022.05",
            imageUrl: "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Kodak Tri-X 400",
            exif: {
              focalLength: "35mm",
              aperture: "f/5.6",
              shutter: "1/125s",
              iso: "400",
            },
            story: "老城中心呈优美弧线倾斜而下的维多利亚街，中世纪石砌拱廊与色彩缤纷的书店店铺在细雨中显得格外温厚典雅。"
          },
          {
            id: "edinburgh-03",
            cityId: "edinburgh-2022",
            title: "Calton Hill Twilight Columns",
            subtitle: "卡尔顿山国家纪念堂暮色",
            location: "爱丁堡",
            locationEn: "Edinburgh",
            year: 2022,
            date: "2022.06",
            imageUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 50mm f/2",
            film: "Kodak Portra 400",
            exif: {
              focalLength: "50mm",
              aperture: "f/4",
              shutter: "1/125s",
              iso: "400"
            },
            story: "未竟的苏格兰国家纪念碑巨型多立克柱在暮光中矗立，从山巅向西眺望，整座古老石城与远方福斯湾在紫灰色暮色中沉睡。"
          }
        ]
      },
      {
        id: "vienna-2022",
        year: 2022,
        location: "维也纳",
        locationEn: "Vienna",
        country: "Austria",
        photos: [
          {
            id: "vienna-01",
            title: "Hofburg Imperial Facade",
            subtitle: "霍夫堡皇宫古典立面",
            location: "维也纳",
            locationEn: "Vienna",
            year: 2022,
            date: "2022.10",
            imageUrl: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Elmarit 28mm f/2.8",
            film: "Kodak Ektar 100",
            exif: {
              focalLength: "28mm",
              aperture: "f/8",
              shutter: "1/250s",
              iso: "100",
            },
            story: "英雄广场上的霍夫堡新皇宫半月形立面，宏大的新巴洛克柱廊在傍晚蓝调时刻被投光灯点亮，气度庄严尊贵。"
          },
          {
            id: "vienna-02",
            title: "Karlskirche Reflections",
            subtitle: "查理教堂水景倒影",
            location: "维也纳",
            locationEn: "Vienna",
            year: 2022,
            date: "2022.08",
            imageUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Kodak Portra 160",
            exif: {
              focalLength: "35mm",
              aperture: "f/5.6",
              shutter: "1/125s",
              iso: "160",
            },
            story: "查理广场水池前，巴洛克双凯旋柱与椭圆穹顶倒映在微波粼粼的池塘中，落日将浮雕染成一层淡金。"
          },
          {
            id: "vienna-03",
            cityId: "vienna-2022",
            title: "Belvedere Baroque Upper Palace",
            subtitle: "美景宫上宫镜湖巴洛克倒影",
            location: "维也纳",
            locationEn: "Vienna",
            year: 2022,
            date: "2022.09",
            imageUrl: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1516550893923-42d28e5677af?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Kodak Portra 160",
            exif: {
              focalLength: "35mm",
              aperture: "f/5.6",
              shutter: "1/250s",
              iso: "160"
            },
            story: "希尔德布兰特构筑的巴洛克巅峰殿宇倒映在澄净的镜湖之中，阶梯式花园与精美斯芬克斯雕像诉说着哈布斯堡王朝的黄金年代。"
          }
        ]
      }
    ]
  },
  {
    year: 2021,
    cities: [
      {
        id: "prague-2021",
        year: 2021,
        location: "布拉格",
        locationEn: "Prague",
        country: "Czech Republic",
        photos: [
          {
            id: "prague-01",
            title: "Charles Bridge Morning Fog",
            subtitle: "查理大桥晨雾与雕像",
            location: "布拉格",
            locationEn: "Prague",
            year: 2021,
            date: "2021.05",
            imageUrl: "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Ilford HP5 Plus",
            exif: {
              focalLength: "35mm",
              aperture: "f/5.6",
              shutter: "1/250s",
              iso: "400",
            },
            story: "清晨伏尔塔瓦河上升起浓重白雾，查理大桥上三十座巴洛克圣者雕像在晨雾中若隐若现，哥特式桥塔宛如时空之门。"
          },
          {
            id: "prague-02",
            title: "Old Town Astronomical Clock",
            subtitle: "老城广场中世纪天文钟",
            location: "布拉格",
            locationEn: "Prague",
            year: 2021,
            date: "2021.04",
            imageUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Summicron 50mm f/2",
            film: "Kodak Portra 400",
            exif: {
              focalLength: "50mm",
              aperture: "f/4",
              shutter: "1/125s",
              iso: "400",
            },
            story: "建于十五世纪的精巧天文钟指针在暮色中缓缓挪移，深蓝色与金箔描摹的黄道十二宫盘面，凝固着中世纪天文学的诗意想象。"
          },
          {
            id: "prague-03",
            cityId: "prague-2021",
            title: "St. Vitus Cathedral Flying Buttresses",
            subtitle: "圣维特主教座堂飞扶壁与浮雕",
            location: "布拉格",
            locationEn: "Prague",
            year: 2021,
            date: "2021.05",
            imageUrl: "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1541849546-216549ae216d?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Summicron 50mm f/2",
            film: "Kodak Tri-X 400",
            exif: {
              focalLength: "50mm",
              aperture: "f/5.6",
              shutter: "1/250s",
              iso: "400"
            },
            story: "布拉格城堡巍峨的哥特式主教座堂历经六百年营建，复杂的飞扶壁与雨漏石雕在阴沉天色下宛如石质交响乐般激昂凝固。"
          }
        ]
      }
    ]
  },
  {
    year: 2020,
    cities: [
      {
        id: "shanghai-2020",
        year: 2020,
        location: "上海",
        locationEn: "Shanghai",
        country: "China",
        photos: [
          {
            id: "shanghai-01",
            title: "The Bund Heritage & Skyline",
            subtitle: "外滩万国建筑与陆家嘴",
            location: "上海",
            locationEn: "Shanghai",
            year: 2020,
            date: "2020.11",
            imageUrl: "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1538428494232-9c0d8a3ab403?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Elmarit 28mm f/2.8",
            film: "Kodak Ektar 100",
            exif: {
              focalLength: "28mm",
              aperture: "f/8",
              shutter: "1/250s",
              iso: "100",
            },
            story: "黄浦江畔，海关大楼大钟整点报时，百年新古典主义花岗岩立面与江对岸流光溢彩的现代超高层天际线隔江对话。"
          },
          {
            id: "shanghai-02",
            title: "Yu Garden Roof Ridges",
            subtitle: "豫园飞檐与老城光影",
            location: "上海",
            locationEn: "Shanghai",
            year: 2020,
            date: "2020.08",
            imageUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "2/3",
            camera: "Leica M6",
            lens: "Summicron 35mm f/2",
            film: "Kodak Portra 160",
            exif: {
              focalLength: "35mm",
              aperture: "f/4",
              shutter: "1/125s",
              iso: "160",
            },
            story: "江南古典园林的歇山顶飞檐凌空起翘，古银杏的金黄落叶洒在青瓦与镂空雕花漏窗之上，在午后光影中凝固时光。"
          },
          {
            id: "shanghai-03",
            cityId: "shanghai-2020",
            title: "Lujiazui Modern Towers in Mist",
            subtitle: "陆家嘴云雾摩天建筑群",
            location: "上海",
            locationEn: "Shanghai",
            year: 2020,
            date: "2020.06",
            imageUrl: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=1800&q=85",
            thumbnailUrl: "https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&w=600&q=80",
            aspectRatio: "3/2",
            camera: "Leica M6",
            lens: "Elmarit 28mm f/2.8",
            film: "Kodak Portra 400",
            exif: {
              focalLength: "28mm",
              aperture: "f/8",
              shutter: "1/500s",
              iso: "400"
            },
            story: "黄浦江对岸的超高层玻璃幕墙在低沉梅雨云层中拔地而起，冷色调现代主义线条与波光粼粼的江水构成充满未来感的魔都图景。"
          }
        ]
      }
    ]
  }
];

export const allCityAlbums: CityAlbum[] = photographyYearGroups.flatMap(group =>
  group.cities.map(album => ({
    ...album,
    photos: album.photos.map(p => ({ ...p, cityId: album.id }))
  }))
);
export const photographyChapters = allCityAlbums;
export const allPhotos: Photo[] = allCityAlbums.flatMap(album => album.photos);
