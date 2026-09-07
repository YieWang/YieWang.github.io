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
  width: number;
  height: number;
  camera?: string;
  lens?: string;
  film?: string;
  exif?: { focalLength: string; aperture: string; shutter: string; iso: string };
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

export interface YearGroup { year: number; cities: CityAlbum[] }

export const photoOptics = (photo: Photo): string => photo.exif
  ? `${photo.exif.aperture} · ${photo.exif.shutter} · ISO ${photo.exif.iso}`
  : '';

export const photoLocation = (photo: Photo): string =>
  `${photo.year}・ ${photo.locationEn.toUpperCase()} （${photo.location}）${photo.subtitle ? `・${photo.subtitle}` : ''}`;

// Albums follow the supplied folders; dates and optics come from original EXIF.
export const photographyYearGroups: YearGroup[] = [
  {
    "year": 2026,
    "cities": [
      {
        "id": "202605-shantou",
        "year": 2026,
        "location": "汕头",
        "locationEn": "Shantou",
        "country": "China",
        "photos": [
          {
            "id": "202605-shantou-01",
            "title": "Pink Blossoms at Night",
            "location": "汕头",
            "locationEn": "Shantou",
            "year": 2026,
            "date": "2026-05-07",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202605-shantou/202605-shantou-01-large-91f3ded7f8.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202605-shantou/202605-shantou-01-thumb-4abd189501.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/125s",
              "iso": "6400"
            },
            "subtitle": "夜里的粉色花枝"
          },
          {
            "id": "202605-shantou-07",
            "title": "Green Trees and Old Windows",
            "location": "汕头",
            "locationEn": "Shantou",
            "year": 2026,
            "date": "2026-05-08",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202605-shantou/202605-shantou-07-large-15a1902742.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202605-shantou/202605-shantou-07-thumb-4c5d90b6f5.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/5",
              "shutter": "1/2000s",
              "iso": "640"
            },
            "subtitle": "绿树旧窗"
          }
        ]
      }
    ]
  },
  {
    "year": 2025,
    "cities": [
      {
        "id": "202512-hong-kong",
        "year": 2025,
        "location": "香港",
        "locationEn": "Hong Kong",
        "country": "China",
        "photos": [
          {
            "id": "202512-hong-kong-10",
            "title": "Old Television Reflections",
            "location": "香港",
            "locationEn": "Hong Kong",
            "year": 2025,
            "date": "2025-12",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-10-large-fbc27ae628.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-10-thumb-e2bca74e07.webp",
            "width": 4096,
            "height": 4600,
            "story": "",
            "subtitle": "旧电视与倒影"
          },
          {
            "id": "202512-hong-kong-01",
            "title": "Red Taxi",
            "location": "香港",
            "locationEn": "Hong Kong",
            "year": 2025,
            "date": "2025-12-27",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-01-large-732ba44d1b.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-01-thumb-c232aac687.webp",
            "width": 5483,
            "height": 3078,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/100s",
              "iso": "160"
            },
            "subtitle": "红色的士"
          },
          {
            "id": "202512-hong-kong-02",
            "title": "Afternoon on the Street",
            "location": "香港",
            "locationEn": "Hong Kong",
            "year": 2025,
            "date": "2025-12-27",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-02-large-07f95242cf.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-02-thumb-dfc5250b2e.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "200mm",
              "aperture": "f/6.3",
              "shutter": "1/100s",
              "iso": "160"
            },
            "subtitle": "街头午后"
          },
          {
            "id": "202512-hong-kong-03",
            "title": "Chungking Mansions",
            "location": "香港",
            "locationEn": "Hong Kong",
            "year": 2025,
            "date": "2025-12-27",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-03-large-cef8ed469c.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-03-thumb-7e592a2745.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/640s",
              "iso": "160"
            },
            "subtitle": "重庆大厦"
          },
          {
            "id": "202512-hong-kong-04",
            "title": "Notes on the Stairs",
            "location": "香港",
            "locationEn": "Hong Kong",
            "year": 2025,
            "date": "2025-12-27",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-04-large-e8dad3a7c0.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-04-thumb-8f31f24f68.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/25s",
              "iso": "160"
            },
            "subtitle": "楼梯留言"
          },
          {
            "id": "202512-hong-kong-05",
            "title": "Snowmen at the Door",
            "location": "香港",
            "locationEn": "Hong Kong",
            "year": 2025,
            "date": "2025-12-27",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-05-large-2629ce58e2.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-05-thumb-3024c0a6f8.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "63mm",
              "aperture": "f/5",
              "shutter": "1/500s",
              "iso": "160"
            },
            "subtitle": "门前的雪人"
          },
          {
            "id": "202512-hong-kong-06",
            "title": "Traffic between the Towers",
            "location": "香港",
            "locationEn": "Hong Kong",
            "year": 2025,
            "date": "2025-12-27",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-06-large-55a82fcc37.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-06-thumb-919716e517.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "78mm",
              "aperture": "f/5",
              "shutter": "1/500s",
              "iso": "160"
            },
            "subtitle": "街谷车流"
          },
          {
            "id": "202512-hong-kong-07",
            "title": "Crowds at the Crossing",
            "location": "香港",
            "locationEn": "Hong Kong",
            "year": 2025,
            "date": "2025-12-27",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-07-large-7220afc502.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-07-thumb-79cec4d606.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "189mm",
              "aperture": "f/6.3",
              "shutter": "1/500s",
              "iso": "160"
            },
            "subtitle": "路口人群"
          },
          {
            "id": "202512-hong-kong-08",
            "title": "Holding up the Light",
            "location": "香港",
            "locationEn": "Hong Kong",
            "year": 2025,
            "date": "2025-12-27",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-08-large-d4e8674349.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-08-thumb-bb6ebbe436.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "70mm",
              "aperture": "f/5",
              "shutter": "1/1250s",
              "iso": "125"
            },
            "subtitle": "托起光球"
          },
          {
            "id": "202512-hong-kong-09",
            "title": "Across the Harbour",
            "location": "香港",
            "locationEn": "Hong Kong",
            "year": 2025,
            "date": "2025-12-27",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-09-large-9c4f274751.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202512-hong-kong/202512-hong-kong-09-thumb-7aa28cd6d8.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/1250s",
              "iso": "125"
            },
            "subtitle": "隔海留影"
          }
        ]
      }
    ]
  },
  {
    "year": 2024,
    "cities": [
      {
        "id": "202412-hangzhou-west-lake",
        "year": 2024,
        "location": "杭州",
        "locationEn": "Hangzhou",
        "country": "China",
        "photos": [
          {
            "id": "202412-hangzhou-west-lake-01",
            "title": "Escalator beneath the Ginkgo",
            "location": "杭州",
            "locationEn": "Hangzhou",
            "year": 2024,
            "date": "2024-12-22",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-01-large-c82d9b55c6.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-01-thumb-6f05bfef83.webp",
            "width": 6000,
            "height": 2553,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "200mm",
              "aperture": "f/6.3",
              "shutter": "1/160s",
              "iso": "100"
            },
            "subtitle": "银杏下的扶梯"
          },
          {
            "id": "202412-hangzhou-west-lake-02",
            "title": "A Canopy of Gold",
            "location": "杭州",
            "locationEn": "Hangzhou",
            "year": 2024,
            "date": "2024-12-22",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-02-large-cb4f831847.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-02-thumb-f59ca8af78.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/6.3",
              "shutter": "1/160s",
              "iso": "100"
            },
            "subtitle": "满树金黄"
          },
          {
            "id": "202412-hangzhou-west-lake-03",
            "title": "Street Corner in Monochrome",
            "location": "杭州",
            "locationEn": "Hangzhou",
            "year": 2024,
            "date": "2024-12-22",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-03-large-591e13795e.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-03-thumb-7df3cead32.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "70mm",
              "aperture": "f/9",
              "shutter": "1/200s",
              "iso": "250"
            },
            "subtitle": "黑白街角"
          },
          {
            "id": "202412-hangzhou-west-lake-04",
            "title": "Boat beneath the Willows",
            "location": "杭州",
            "locationEn": "Hangzhou",
            "year": 2024,
            "date": "2024-12-22",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-04-large-6c23f6d385.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-04-thumb-f418acbb85.webp",
            "width": 6000,
            "height": 2553,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "200mm",
              "aperture": "f/6.3",
              "shutter": "1/500s",
              "iso": "250"
            },
            "subtitle": "柳下游船"
          },
          {
            "id": "202412-hangzhou-west-lake-05",
            "title": "Figures by the Lake",
            "location": "杭州",
            "locationEn": "Hangzhou",
            "year": 2024,
            "date": "2024-12-22",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-05-large-7c6a13a213.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-05-thumb-396f61699b.webp",
            "width": 6000,
            "height": 2553,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "200mm",
              "aperture": "f/6.3",
              "shutter": "1/500s",
              "iso": "250"
            },
            "subtitle": "湖畔人影"
          },
          {
            "id": "202412-hangzhou-west-lake-06",
            "title": "Golden Water",
            "location": "杭州",
            "locationEn": "Hangzhou",
            "year": 2024,
            "date": "2024-12-22",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-06-large-9f8125501e.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-06-thumb-56b9f3dac8.webp",
            "width": 3712,
            "height": 3712,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "200mm",
              "aperture": "f/6.3",
              "shutter": "1/320s",
              "iso": "250"
            },
            "subtitle": "金色水面"
          },
          {
            "id": "202412-hangzhou-west-lake-07",
            "title": "Waterbirds at Dusk",
            "location": "杭州",
            "locationEn": "Hangzhou",
            "year": 2024,
            "date": "2024-12-22",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-07-large-e44c51244b.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-07-thumb-02de7bd7bf.webp",
            "width": 6000,
            "height": 2553,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "200mm",
              "aperture": "f/6.3",
              "shutter": "1/320s",
              "iso": "250"
            },
            "subtitle": "暮光里的水鸟"
          },
          {
            "id": "202412-hangzhou-west-lake-08",
            "title": "Crowds on the Bridge",
            "location": "杭州",
            "locationEn": "Hangzhou",
            "year": 2024,
            "date": "2024-12-22",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-08-large-c6c8659ba4.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-08-thumb-2cd44e709c.webp",
            "width": 6000,
            "height": 2553,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "88mm",
              "aperture": "f/6.3",
              "shutter": "1/320s",
              "iso": "250"
            },
            "subtitle": "桥上人潮"
          },
          {
            "id": "202412-hangzhou-west-lake-09",
            "title": "Christmas Lights",
            "location": "杭州",
            "locationEn": "Hangzhou",
            "year": 2024,
            "date": "2024-12-22",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-09-large-a796ca0b1f.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202412-hangzhou-west-lake/202412-hangzhou-west-lake-09-thumb-0f92c40eac.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "184mm",
              "aperture": "f/6.3",
              "shutter": "1/30s",
              "iso": "250"
            },
            "subtitle": "圣诞灯字"
          }
        ]
      },
      {
        "id": "202409-haining",
        "year": 2024,
        "location": "海宁",
        "locationEn": "Haining",
        "country": "China",
        "photos": [
          {
            "id": "202409-haining-01",
            "title": "Moon in the Blue Hour",
            "location": "海宁",
            "locationEn": "Haining",
            "year": 2024,
            "date": "2024-09-13",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202409-haining/202409-haining-01-large-b668d8a0b6.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202409-haining/202409-haining-01-thumb-62b917f78d.webp",
            "width": 6000,
            "height": 2510,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "78mm",
              "aperture": "f/8",
              "shutter": "1/1600s",
              "iso": "320"
            },
            "subtitle": "蓝调月升"
          },
          {
            "id": "202409-haining-02",
            "title": "Moon at Dusk",
            "location": "海宁",
            "locationEn": "Haining",
            "year": 2024,
            "date": "2024-09-13",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202409-haining/202409-haining-02-large-cca346fcb4.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202409-haining/202409-haining-02-thumb-9e88a05882.webp",
            "width": 6000,
            "height": 2510,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "78mm",
              "aperture": "f/8",
              "shutter": "1/1600s",
              "iso": "320"
            },
            "subtitle": "暮色月升"
          },
          {
            "id": "202409-haining-03",
            "title": "Long Shadows at the Crossing",
            "location": "海宁",
            "locationEn": "Haining",
            "year": 2024,
            "date": "2024-12-16",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202409-haining/202409-haining-03-large-6e9d7d1d05.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202409-haining/202409-haining-03-thumb-854cf1b689.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "173mm",
              "aperture": "f/10",
              "shutter": "1/200s",
              "iso": "100"
            },
            "subtitle": "路口长影"
          },
          {
            "id": "202409-haining-04",
            "title": "Leaves against the Blue",
            "location": "海宁",
            "locationEn": "Haining",
            "year": 2024,
            "date": "2024-12-20",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202409-haining/202409-haining-04-large-940c7f5356.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202409-haining/202409-haining-04-thumb-825c9391c6.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "70mm",
              "aperture": "f/9",
              "shutter": "1/400s",
              "iso": "100"
            },
            "subtitle": "秋叶与蓝天"
          }
        ]
      },
      {
        "id": "202408-tokyo",
        "year": 2024,
        "location": "东京",
        "locationEn": "Tokyo",
        "country": "Japan",
        "photos": [
          {
            "id": "202408-tokyo-01",
            "title": "Platform Clock",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-22",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-01-large-2d7f5b1dd6.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-01-thumb-418214855f.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "83mm",
              "aperture": "f/5",
              "shutter": "1/20s",
              "iso": "100"
            },
            "subtitle": "站台时钟"
          },
          {
            "id": "202408-tokyo-02",
            "title": "Power Lines in the Clouds",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-23",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-02-large-349b5f6680.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-02-thumb-cfff329f2f.webp",
            "width": 6000,
            "height": 2510,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/500s",
              "iso": "100"
            },
            "subtitle": "云间电线"
          },
          {
            "id": "202408-tokyo-03",
            "title": "Beneath the Skytree",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-23",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-03-large-26bba9697a.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-03-thumb-d53bc3a7db.webp",
            "width": 3315,
            "height": 5906,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/640s",
              "iso": "100"
            },
            "subtitle": "晴空塔下"
          },
          {
            "id": "202408-tokyo-04",
            "title": "Rickshaw on the Street",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-23",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-04-large-f43f532348.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-04-thumb-680a959a1a.webp",
            "width": 6000,
            "height": 2510,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/640s",
              "iso": "100"
            },
            "subtitle": "街头人力车"
          },
          {
            "id": "202408-tokyo-05",
            "title": "Into the Sunlight",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-23",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-05-large-8f94bf2196.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-05-thumb-bb1f926184.webp",
            "width": 6000,
            "height": 2510,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/640s",
              "iso": "100"
            },
            "subtitle": "逆光同行"
          },
          {
            "id": "202408-tokyo-06",
            "title": "Passing the Temple",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-23",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-06-large-d413ddbf34.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-06-thumb-5ff07e58aa.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/200s",
              "iso": "100"
            },
            "subtitle": "寺前掠影"
          },
          {
            "id": "202408-tokyo-07",
            "title": "Asakusa Temple Eaves",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-23",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-07-large-66efb36067.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-07-thumb-c98b94b0ca.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/200s",
              "iso": "100"
            },
            "subtitle": "浅草寺檐"
          },
          {
            "id": "202408-tokyo-22",
            "title": "Red Building on the Corner",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-23",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-22-large-432851fea9.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-22-thumb-efadd057df.webp",
            "width": 3368,
            "height": 6000,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/640s",
              "iso": "100"
            },
            "subtitle": "街角红楼"
          },
          {
            "id": "202408-tokyo-23",
            "title": "Afternoon Backlight",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-23",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-23-large-f9dea6dfce.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-23-thumb-0fb3b5d048.webp",
            "width": 3164,
            "height": 5636,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/200s",
              "iso": "100"
            },
            "subtitle": "午后逆光"
          },
          {
            "id": "202408-tokyo-24",
            "title": "A Street Gathering",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-23",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-24-large-a665337cf4.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-24-thumb-f642ccc8ae.webp",
            "width": 3995,
            "height": 3995,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "106mm",
              "aperture": "f/5.6",
              "shutter": "1/200s",
              "iso": "100"
            },
            "subtitle": "街头相聚"
          },
          {
            "id": "202408-tokyo-25",
            "title": "Pigeon on a Sign",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-23",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-25-large-6140fde786.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-25-thumb-be4d95d421.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/6.3",
              "shutter": "1/640s",
              "iso": "2000"
            },
            "subtitle": "招牌上的鸽子"
          },
          {
            "id": "202408-tokyo-08",
            "title": "Flowers in the Carriage",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-24",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-08-large-2aa4523574.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-08-thumb-5291967c66.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/250s",
              "iso": "2000"
            },
            "subtitle": "车厢里的花饰"
          },
          {
            "id": "202408-tokyo-09",
            "title": "Fireworks beyond the Fence",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-24",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-09-large-0eba8a41c4.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-09-thumb-8139681edc.webp",
            "width": 6000,
            "height": 2510,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "94mm",
              "aperture": "f/5",
              "shutter": "1/100s",
              "iso": "2000"
            },
            "subtitle": "围栏外的烟火"
          },
          {
            "id": "202408-tokyo-10",
            "title": "Fireworks in Bloom",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-24",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-10-large-b08209216a.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-10-thumb-d7d80333b6.webp",
            "width": 6000,
            "height": 2510,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/60s",
              "iso": "2000"
            },
            "subtitle": "夜空盛放"
          },
          {
            "id": "202408-tokyo-11",
            "title": "A Heart in the Crowd",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-24",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-11-large-034d9d89e7.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-11-thumb-055f53f31e.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/60s",
              "iso": "12800"
            },
            "subtitle": "比心的背影"
          },
          {
            "id": "202408-tokyo-12",
            "title": "Yukata Patterns",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-24",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-12-large-839b1d0933.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-12-thumb-d3bf1751b8.webp",
            "width": 3368,
            "height": 6000,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/60s",
              "iso": "16000"
            },
            "subtitle": "浴衣花纹"
          },
          {
            "id": "202408-tokyo-13",
            "title": "The Street through Glass",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-25",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-13-large-514922764b.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-13-thumb-ec0cb37ca8.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/8",
              "shutter": "1/200s",
              "iso": "160"
            },
            "subtitle": "玻璃后的街景"
          },
          {
            "id": "202408-tokyo-14",
            "title": "Record Shop Faces",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-25",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-14-large-5e8a235497.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-14-thumb-a944ae8b5c.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "63mm",
              "aperture": "f/8",
              "shutter": "1/200s",
              "iso": "160"
            },
            "subtitle": "唱片店一角"
          },
          {
            "id": "202408-tokyo-15",
            "title": "Across the Clouds",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-25",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-15-large-17d6938c5c.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-15-thumb-9f14e5a65b.webp",
            "width": 6000,
            "height": 2510,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/8",
              "shutter": "1/200s",
              "iso": "160"
            },
            "subtitle": "飞机穿过云间"
          },
          {
            "id": "202408-tokyo-16",
            "title": "Passing a Poster",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-25",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-16-large-6fdbfab638.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-16-thumb-93b7146b84.webp",
            "width": 4747,
            "height": 2665,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/6.3",
              "shutter": "1/200s",
              "iso": "100"
            },
            "subtitle": "海报前的行人"
          },
          {
            "id": "202408-tokyo-17",
            "title": "A Sea of City Lights",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-25",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-17-large-7d6cd241af.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-17-thumb-d7ec50e43b.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2",
              "shutter": "1/60s",
              "iso": "500"
            },
            "subtitle": "城市灯海"
          },
          {
            "id": "202408-tokyo-18",
            "title": "Between Light and Shadow",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-25",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-18-large-e79baf12e7.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-18-thumb-f0cfe0f978.webp",
            "width": 6000,
            "height": 2510,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/60s",
              "iso": "6400"
            },
            "subtitle": "灯影之间"
          },
          {
            "id": "202408-tokyo-19",
            "title": "Silhouettes at Night",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-25",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-19-large-cf16e19c94.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-19-thumb-19fb325c2e.webp",
            "width": 6000,
            "height": 2510,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/60s",
              "iso": "6400"
            },
            "subtitle": "夜行剪影"
          },
          {
            "id": "202408-tokyo-20",
            "title": "Playing beside the Tracks",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-25",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-20-large-e245e64642.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-20-thumb-8db3f16537.webp",
            "width": 2366,
            "height": 1328,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/6.3",
              "shutter": "1/200s",
              "iso": "100"
            },
            "subtitle": "铁道旁的球场"
          },
          {
            "id": "202408-tokyo-21",
            "title": "Crossing Wires",
            "location": "东京",
            "locationEn": "Tokyo",
            "year": 2024,
            "date": "2024-08-25",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-21-large-b7e1162ee0.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202408-tokyo/202408-tokyo-21-thumb-975c5f6ebc.webp",
            "width": 2366,
            "height": 1328,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M55-200mm f/4.5-6.3 IS STM",
            "exif": {
              "focalLength": "55mm",
              "aperture": "f/4.5",
              "shutter": "1/100s",
              "iso": "100"
            },
            "subtitle": "交织的电线"
          }
        ]
      }
    ]
  },
  {
    "year": 2023,
    "cities": [
      {
        "id": "202309-chongqing",
        "year": 2023,
        "location": "重庆",
        "locationEn": "Chongqing",
        "country": "China",
        "photos": [
          {
            "id": "202309-chongqing-01",
            "title": "Crowds after Dark",
            "location": "重庆",
            "locationEn": "Chongqing",
            "year": 2023,
            "date": "2023-09-29",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-01-large-26b7479f84.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-01-thumb-6c3fbc2272.webp",
            "width": 1644,
            "height": 2928,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2",
              "shutter": "1/200s",
              "iso": "125"
            },
            "subtitle": "夜色人潮"
          },
          {
            "id": "202309-chongqing-02",
            "title": "Red Light at the Corner",
            "location": "重庆",
            "locationEn": "Chongqing",
            "year": 2023,
            "date": "2023-09-29",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-02-large-5750c280ff.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-02-thumb-e4da52d6e8.webp",
            "width": 5981,
            "height": 3357,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2",
              "shutter": "1/200s",
              "iso": "125"
            },
            "subtitle": "红灯路口"
          },
          {
            "id": "202309-chongqing-03",
            "title": "City of Lights",
            "location": "重庆",
            "locationEn": "Chongqing",
            "year": 2023,
            "date": "2023-09-29",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-03-large-5ba80ed98b.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-03-thumb-52545eb9e9.webp",
            "width": 3368,
            "height": 6000,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2",
              "shutter": "1/60s",
              "iso": "125"
            },
            "subtitle": "灯火山城"
          },
          {
            "id": "202309-chongqing-04",
            "title": "A Canopy of Red",
            "location": "重庆",
            "locationEn": "Chongqing",
            "year": 2023,
            "date": "2023-09-29",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-04-large-0aaf020f70.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-04-thumb-2c4acfb140.webp",
            "width": 3776,
            "height": 3066,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2",
              "shutter": "1/60s",
              "iso": "125"
            },
            "subtitle": "红色夜幕"
          },
          {
            "id": "202309-chongqing-05",
            "title": "Woodland Steps",
            "location": "重庆",
            "locationEn": "Chongqing",
            "year": 2023,
            "date": "2023-09-30",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-05-large-8027010085.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-05-thumb-83fe0db1fe.webp",
            "width": 3368,
            "height": 6000,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2.5",
              "shutter": "1/400s",
              "iso": "125"
            },
            "subtitle": "林间石阶"
          },
          {
            "id": "202309-chongqing-06",
            "title": "A Path through the Green",
            "location": "重庆",
            "locationEn": "Chongqing",
            "year": 2023,
            "date": "2023-09-30",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-06-large-f9de7bf05e.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-06-thumb-ed2ae09393.webp",
            "width": 3341,
            "height": 5951,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/4.5",
              "shutter": "1/320s",
              "iso": "125"
            },
            "subtitle": "绿荫小径"
          },
          {
            "id": "202309-chongqing-07",
            "title": "Flowers on the Street",
            "location": "重庆",
            "locationEn": "Chongqing",
            "year": 2023,
            "date": "2023-09-30",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-07-large-6b106c484b.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chongqing/202309-chongqing-07-thumb-e9ece6fbb8.webp",
            "width": 2969,
            "height": 3199,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2.8",
              "shutter": "1/1000s",
              "iso": "125"
            },
            "subtitle": "街边花摊"
          }
        ]
      },
      {
        "id": "202309-chengdu",
        "year": 2023,
        "location": "成都",
        "locationEn": "Chengdu",
        "country": "China",
        "photos": [
          {
            "id": "202309-chengdu-01",
            "title": "Beyond the Window",
            "location": "成都",
            "locationEn": "Chengdu",
            "year": 2023,
            "date": "2023-09-25",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chengdu/202309-chengdu-01-large-5157c6b0d7.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chengdu/202309-chengdu-01-thumb-70c269756e.webp",
            "width": 3368,
            "height": 6000,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/4.5",
              "shutter": "1/1600s",
              "iso": "125"
            },
            "subtitle": "舷窗之外"
          },
          {
            "id": "202309-chengdu-02",
            "title": "Panda Shop",
            "location": "成都",
            "locationEn": "Chengdu",
            "year": 2023,
            "date": "2023-09-26",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chengdu/202309-chengdu-02-large-0d8ccb51b6.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chengdu/202309-chengdu-02-thumb-094f5be6f9.webp",
            "width": 3267,
            "height": 3048,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2.2",
              "shutter": "1/1600s",
              "iso": "125"
            },
            "subtitle": "熊猫小铺"
          },
          {
            "id": "202309-chengdu-03",
            "title": "Bicycles on the Wall",
            "location": "成都",
            "locationEn": "Chengdu",
            "year": 2023,
            "date": "2023-09-26",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chengdu/202309-chengdu-03-large-81d1f8ba50.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chengdu/202309-chengdu-03-thumb-20d956d8b1.webp",
            "width": 6000,
            "height": 3767,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2.2",
              "shutter": "1/1600s",
              "iso": "125"
            },
            "subtitle": "墙上的单车"
          },
          {
            "id": "202309-chengdu-04",
            "title": "Street Corner Blackboard",
            "location": "成都",
            "locationEn": "Chengdu",
            "year": 2023,
            "date": "2023-09-26",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chengdu/202309-chengdu-04-large-af8bac4146.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chengdu/202309-chengdu-04-thumb-289d2ddf57.webp",
            "width": 6000,
            "height": 3368,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2.5",
              "shutter": "1/2000s",
              "iso": "125"
            },
            "subtitle": "街角留言板"
          },
          {
            "id": "202309-chengdu-05",
            "title": "A Stroll through Chengdu",
            "location": "成都",
            "locationEn": "Chengdu",
            "year": 2023,
            "date": "2023-09-28",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chengdu/202309-chengdu-05-large-b96e6ee940.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202309-chengdu/202309-chengdu-05-thumb-3d156ee0b8.webp",
            "width": 3257,
            "height": 5803,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2",
              "shutter": "1/160s",
              "iso": "125"
            },
            "subtitle": "漫步到成都"
          }
        ]
      },
      {
        "id": "202303-hangzhou-west-lake",
        "year": 2023,
        "location": "杭州",
        "locationEn": "Hangzhou",
        "country": "China",
        "photos": [
          {
            "id": "202303-hangzhou-west-lake-01",
            "title": "Mist over the Lake",
            "location": "杭州",
            "locationEn": "Hangzhou",
            "year": 2023,
            "date": "2023-03-04",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202303-hangzhou-west-lake/202303-hangzhou-west-lake-01-large-637cff2e52.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202303-hangzhou-west-lake/202303-hangzhou-west-lake-01-thumb-97ba7dff0a.webp",
            "width": 5446,
            "height": 2279,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2",
              "shutter": "1/100s",
              "iso": "160"
            },
            "subtitle": "湖上薄雾"
          },
          {
            "id": "202303-hangzhou-west-lake-02",
            "title": "Boats in the Morning Mist",
            "location": "杭州",
            "locationEn": "Hangzhou",
            "year": 2023,
            "date": "2023-03-04",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202303-hangzhou-west-lake/202303-hangzhou-west-lake-02-large-12d747097e.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202303-hangzhou-west-lake/202303-hangzhou-west-lake-02-thumb-12dd733e89.webp",
            "width": 5925,
            "height": 2479,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2",
              "shutter": "1/320s",
              "iso": "100"
            },
            "subtitle": "晨雾中的小舟"
          },
          {
            "id": "202303-hangzhou-west-lake-03",
            "title": "Ripples by the Shore",
            "location": "杭州",
            "locationEn": "Hangzhou",
            "year": 2023,
            "date": "2023-03-04",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202303-hangzhou-west-lake/202303-hangzhou-west-lake-03-large-905affdd42.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202303-hangzhou-west-lake/202303-hangzhou-west-lake-03-thumb-a02a148cb1.webp",
            "width": 6000,
            "height": 2510,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/2",
              "shutter": "1/200s",
              "iso": "100"
            },
            "subtitle": "湖岸微澜"
          },
          {
            "id": "202303-hangzhou-west-lake-04",
            "title": "Lakeside Pavilion",
            "location": "杭州",
            "locationEn": "Hangzhou",
            "year": 2023,
            "date": "2023-09-24",
            "imageUrl": "https://homepage-assets.mathtranslations.org/photography/202303-hangzhou-west-lake/202303-hangzhou-west-lake-04-large-69ecbc70f3.webp",
            "thumbnailUrl": "https://homepage-assets.mathtranslations.org/photography/202303-hangzhou-west-lake/202303-hangzhou-west-lake-04-thumb-7c0f1a799a.webp",
            "width": 2198,
            "height": 2198,
            "story": "",
            "camera": "Canon EOS M6",
            "lens": "EF-M22mm f/2 STM",
            "exif": {
              "focalLength": "22mm",
              "aperture": "f/4",
              "shutter": "1/200s",
              "iso": "125"
            },
            "subtitle": "临水楼阁"
          }
        ]
      }
    ]
  }
];

export const allCityAlbums: CityAlbum[] = photographyYearGroups.flatMap(group =>
  group.cities.map(album => ({
    ...album,
    photos: album.photos.map(photo => ({ ...photo, cityId: album.id }))
  }))
);
export const allPhotos: Photo[] = allCityAlbums.flatMap(album => album.photos);
