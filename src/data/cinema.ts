import importedCinema from './cinema-import.json';
import { cinemaGroups } from './media-curation.json';

export interface MediaItem {
  installments?: MediaItem[];   // Films or seasons sharing one collection card
  seasons?: (Partial<MediaItem> & { id: string; title: string; year: number | string; posterUrl: string; releaseDate?: string })[];
  hidden?: boolean;
  id: string;
  title: string;                 // English display title
  chineseTitle?: string;
  partLabel?: string;
  originalTitle?: string;        // Original native title (e.g. "東京物語")
  type: 'film' | 'series';       // 'film' or 'series'
  director: string;              // Director or Showrunner
  creditRole?: string;          // Actual role of the displayed credit
  chineseDirector?: string;
  originalDirector?: string;     // Native director name (e.g. "岩井俊二", "小津安二郎")
  year: number | string;         // Start year (e.g. 1953, 2015)
  span?: string;                 // Year span for series (e.g. "2015–2022")
  country: string;               // Country
  genre: string;                 // Genre
  studio?: 'Pixar' | 'Disney';
  runtime?: string;              // Runtime or seasons (e.g. "136 min", "6 Seasons")
  format?: string;               // Technical format (e.g. "35mm · B&W · 1.37:1")
  posterUrl: string;             // 2:3 vertical poster
  stillUrl?: string;             // 16:9 or widescreen still
  summary: string;               // Synopsis in English
  rating?: string;               // Personal rating e.g. "5.0 / 5.0" (available with or without full essay)
  firstWatched?: string;         // First watch date e.g. "2019.04"
  rewatched?: string;            // Rewatch dates e.g. "2021.04, 2024.04"
  externalLink?: {
    platform: 'IMDb' | 'Douban' | 'TMDb';
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

const importedItems = (importedCinema as MediaItem[]).filter(item => !item.hidden);
const isAnimation = (item: MediaItem) => item.genre.split(', ').includes('Animation');
const seriesById = new Map(cinemaGroups.flatMap((ids, group) => ids.map(id => [id, group] as const)));

function relatedOrder(items: MediaItem[]): MediaItem[] {
  const groups = new Map<string, MediaItem[]>();
  for (const item of items) {
    const series = seriesById.get(item.id);
    const key = series === undefined ? `director:${item.director}` : `series:${series}`;
    const group = groups.get(key) ?? [];
    group.push(item);
    groups.set(key, group);
  }
  return [...groups.values()]
    .sort((a, b) => Number(b.some(item => item.review)) - Number(a.some(item => item.review)))
    .flatMap(group => group.sort((a, b) => Number(a.year) - Number(b.year)
      || Number(b.type === 'series') - Number(a.type === 'series')));
}

export const cinemaAnimation = relatedOrder(importedItems.filter(isAnimation));
export const cinemaFilms = relatedOrder(importedItems.filter(item => item.type === 'film' && !isAnimation(item)));
export const cinemaSeries = importedItems.filter(item => item.type === 'series' && !isAnimation(item));
export const allCinemaItems: MediaItem[] = importedItems;

// Explicit franchise groups only; sharing a director does not make a collection.
const collectionTitles: Record<string, string> = {
  'film-37311135': 'Pegasus', 'film-25808075': 'Planet of the Apes',
  'film-1474189': 'Saw', 'film-30209818': 'Happy Death Day',
  'film-6532822': 'Resident Evil', 'film-1418189': 'Spider-Man',
  'film-25728006': 'Fast & Furious', 'film-11624706': 'Despicable Me',
  'film-27074316': "A Dog’s Purpose", 'film-25887288': 'Frozen',
  'film-25726614': 'Wizarding World', 'film-10574622': 'Lost on Journey',
  'film-26311973': 'Detective Chinatown', 'film-26817136': 'Zootopia',
  'film-26282448': 'Naruto', 'film-1305053': 'Hannibal Lecter',
  'film-36680624': 'Demon Slayer', 'film-1291584': 'Kill Bill',
  'film-10467125': 'One Piece', 'film-26715496': 'Kung Fu Panda',
  'film-36090457': 'Inside Out', 'film-34780991': 'Ne Zha',
  'film-10808442': 'Before Trilogy', 'film-26588308': 'Deadpool',
  'film-20438964': 'Wreck-It Ralph', 'film-4914468': 'Ice Age',
  'film-3789848': 'Monsters, Inc.', 'film-3642835': 'Men in Black',
  'film-24773958': 'The Avengers', 'film-3231742': 'Iron Man',
  'film-26374197': 'Spider-Verse', 'film-1299398': 'A Chinese Odyssey',
};

export function groupFilmCollections(items: MediaItem[]): MediaItem[] {
  const emitted = new Set<number>();
  return items.flatMap(item => {
    const group = seriesById.get(item.id);
    if (item.type !== 'film' || group === undefined) return [item];
    if (emitted.has(group)) return [];
    emitted.add(group);
    const installments = items.filter(film => film.type === 'film' && seriesById.get(film.id) === group)
      .sort((a, b) => Number(a.year) - Number(b.year) || cinemaGroups[group].indexOf(a.id) - cinemaGroups[group].indexOf(b.id));
    if (installments.length < 2) return installments;
    const first = installments[0];
    return [{ ...first, title: collectionTitles[cinemaGroups[group][0]] || first.title,
      director: [...new Set(installments.map(film => film.director))].join(', '), installments }];
  });
}

// Seasons reuse the same detail switcher as film collections.
export function withSeasonDetails(item: MediaItem): MediaItem {
  if (!item.seasons?.length) return item;
  const { seasons, ...series } = item;
  const installments = [...seasons].sort((a, b) => String(a.releaseDate || a.year).localeCompare(String(b.releaseDate || b.year))).map(season => ({
    ...series, ...season, span: undefined, summary: season.summary || '', review: season.review,
    rating: season.rating || '', firstWatched: season.firstWatched || '', rewatched: season.rewatched || '',
    watchedEntries: season.watchedEntries || [],
  }));
  return { ...series, year: installments[0].year, posterUrl: installments[0].posterUrl, installments };
}

const animationCards = groupFilmCollections(cinemaAnimation).map(withSeasonDetails)
  .sort((a, b) => Number(b.type === 'series') - Number(a.type === 'series')
    || Number((b.installments?.length || 0) > 1) - Number((a.installments?.length || 0) > 1));

// Gather Disney/Pixar at their first position within each existing sorting tier.
const studioGroups = new Map<string, MediaItem[]>();
for (const item of animationCards) {
  const key = item.type === 'film' && item.studio ? `disney-pixar:${(item.installments?.length || 0) > 1}` : item.id;
  const group = studioGroups.get(key) || [];
  group.push(item);
  studioGroups.set(key, group);
}
export const cinemaAnimationCards = [...studioGroups.values()].flat();
