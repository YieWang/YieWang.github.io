import importedCinema from './cinema-import.json';

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
    platform: 'IMDb' | 'Douban';
    url: string;
  };
  tmdbId?: number;
  watchedEntries?: { doubanId: string; title: string; firstWatched: string; rating: string; comment: string }[];
  review?: {
    rating: string;              // e.g. "5.0 / 5.0"
    date?: string;               // e.g. "2026.02"
    quote?: string;              // Iconic quote in English
    excerpt?: string;            // Short teaser excerpt
    content: string;             // Full review in English
  };
}

const importedItems = importedCinema as MediaItem[];
export const cinemaFilms = importedItems.filter(item => item.type === 'film');
export const cinemaSeries = importedItems.filter(item => item.type === 'series');
export const allCinemaItems: MediaItem[] = [...cinemaFilms, ...cinemaSeries];
